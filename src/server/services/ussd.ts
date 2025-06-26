import axios from "axios";
import { config } from "../config/environment";
import db from "../config/database";
import { logger } from "../utils/logger";

interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  serviceCode: string;
  text: string;
  userId?: string;
}

interface USSDResponse {
  message: string;
  endSession: boolean;
  nextMenu?: string;
  data?: any;
}

class USSDService {
  private gatewayUrl: string;
  private apiKey: string;
  private username: string;

  constructor() {
    this.gatewayUrl =
      config.app.env === "production"
        ? "https://api.africastalking.com/version1/messaging"
        : "https://api.sandbox.africastalking.com/version1/messaging";
    this.apiKey = config.sms.apiKey;
    this.username = config.sms.username;
  }

  // Main USSD handler
  async handleUSSDRequest(sessionData: USSDSession): Promise<USSDResponse> {
    try {
      // Get or create session
      const session = await this.getOrCreateSession(sessionData);

      // Parse user input
      const inputArray = sessionData.text.split("*");
      const currentInput = inputArray[inputArray.length - 1];

      // Route to appropriate service
      switch (sessionData.serviceCode) {
        case "*384*WILD#":
        case "*384*":
          return await this.handleWildlifeTracking(
            session,
            currentInput,
            inputArray,
          );

        case "*456#":
          return await this.handleChiefServices(
            session,
            currentInput,
            inputArray,
          );

        case "*789*CARBON#":
        case "*789*":
          return await this.handleCarbonCredit(
            session,
            currentInput,
            inputArray,
          );

        case "*123*SCHOOL#":
        case "*123*":
          return await this.handleCodeSchool(session, currentInput, inputArray);

        case "*567*REFUGEE#":
        case "*567*":
          return await this.handleRefugeeMarketplace(
            session,
            currentInput,
            inputArray,
          );

        default:
          return await this.handleMainMenu(session, currentInput, inputArray);
      }
    } catch (error) {
      logger.error("USSD handling error:", error);
      return {
        message:
          "SERVICE TEMPORARILY UNAVAILABLE\n\nPlease try again later.\n\nFor support: +254-XXX-XXXX",
        endSession: true,
      };
    }
  }

  // Wildlife tracking USSD flow (*384*WILD#)
  private async handleWildlifeTracking(
    session: any,
    input: string,
    inputArray: string[],
  ): Promise<USSDResponse> {
    if (inputArray.length === 1) {
      // Initial request
      const user = await this.findUserByPhone(session.phone_number);

      if (!user) {
        return {
          message: `🦁 SAVANNAH WILDLIFE TRACKING\n\nWelcome to conservation impact tracking!\n\nNo account found.\n\n1. Register account\n2. Track as guest\n3. Learn more\n0. Exit`,
          endSession: false,
          nextMenu: "wildlife_no_user",
        };
      }

      // Get user's conservation impact
      const impact = await this.getUserConservationImpact(user.id);

      return {
        message: `🦁 WILDLIFE IMPACT - ${user.first_name}\n\n🌍 CONSERVATION STATS:\n• ${impact.habitatProtected}m² protected\n• ${impact.lionsSupported} lions supported\n• ${impact.rangersFunded} rangers funded\n• ${impact.carbonOffset}kg CO² offset\n\n1. Real-time tracking\n2. Adopt animal\n3. View certificates\n4. Latest updates\n0. Exit`,
        endSession: false,
        nextMenu: "wildlife_main",
      };
    }

    switch (session.current_menu) {
      case "wildlife_main":
        switch (input) {
          case "1":
            return await this.getRealTimeTracking(session);
          case "2":
            return await this.getAdoptionOptions(session);
          case "3":
            return await this.getUserCertificates(session);
          case "4":
            return await this.getLatestUpdates(session);
          case "0":
            return {
              message: "Thank you for caring about wildlife! 🦁",
              endSession: true,
            };
          default:
            return {
              message:
                "Invalid choice. Please try again.\n\n1. Real-time tracking\n2. Adopt animal\n3. View certificates\n4. Latest updates\n0. Exit",
              endSession: false,
            };
        }

      case "wildlife_no_user":
        switch (input) {
          case "1":
            return {
              message:
                "ACCOUNT REGISTRATION\n\nVisit savannah.org/register or download our app to create an account.\n\nWith an account you can:\n• Track your impact\n• Adopt wildlife\n• Get certificates\n• Earn pride points\n\nPress 0 to exit",
              endSession: false,
            };
          case "2":
            return await this.getGuestTracking(session);
          case "3":
            return {
              message:
                "ABOUT WILDLIFE TRACKING\n\nEvery purchase protects 10m² of habitat!\n\n🦁 Track lion movements\n🐘 Support elephant corridors\n🌳 Protect forest areas\n📱 Get real-time updates\n\nJoin at savannah.org\n\nPress 0 to exit",
              endSession: false,
            };
          default:
            return {
              message: "Invalid choice. Press 0 to exit.",
              endSession: false,
            };
        }

      default:
        return await this.handleWildlifeTracking(session, input, ["*384*"]);
    }
  }

  // Chief services USSD flow (*456#)
  private async handleChiefServices(
    session: any,
    input: string,
    inputArray: string[],
  ): Promise<USSDResponse> {
    if (inputArray.length === 1) {
      return {
        message: `📱 DIGITAL CHIEF SYSTEM\n\nWelcome to community governance platform\n\n🏛️ Main Menu:\n1. Report conflict/issue\n2. Check grazing forecasts\n3. Community meetings\n4. Contact chief directly\n5. Dispute resolution status\n6. Traditional law guidance\n0. Exit`,
        endSession: false,
        nextMenu: "chief_main",
      };
    }

    switch (session.current_menu) {
      case "chief_main":
        switch (input) {
          case "1":
            return await this.reportIssue(session);
          case "2":
            return await this.getGrazingForecast(session);
          case "3":
            return await this.getCommunityMeetings(session);
          case "4":
            return await this.contactChief(session);
          case "5":
            return await this.getDisputeStatus(session);
          case "6":
            return await this.getTraditionalGuidance(session);
          case "0":
            return {
              message: "Asante! Community governance made accessible. 🏛️",
              endSession: true,
            };
          default:
            return {
              message: "Invalid choice. Please select 1-6 or 0 to exit.",
              endSession: false,
            };
        }

      default:
        return await this.handleChiefServices(session, input, ["*456*"]);
    }
  }

  // Carbon credit USSD flow (*789*CARBON#)
  private async handleCarbonCredit(
    session: any,
    input: string,
    inputArray: string[],
  ): Promise<USSDResponse> {
    if (inputArray.length === 1) {
      const user = await this.findUserByPhone(session.phone_number);

      if (!user) {
        return {
          message: `🌳 CARBON CREDIT FARMING\n\nRegister at savannah.org to:\n• Plant verified trees\n• Earn $0.50 per surviving tree\n• Get satellite monitoring\n• Trade carbon credits\n\nPress 0 to exit`,
          endSession: true,
        };
      }

      const plantings = await this.getUserTreePlantings(user.id);

      return {
        message: `🌳 CARBON FARMING - ${user.first_name}\n\n📊 YOUR TREES:\n• ${plantings.totalTrees} trees planted\n• ${plantings.survivalRate}% survival rate\n• $${plantings.totalEarned} earned\n• ${plantings.creditsAvailable} credits available\n\n1. Plant more trees\n2. Check verification\n3. Sell credits\n4. Market prices\n0. Exit`,
        endSession: false,
        nextMenu: "carbon_main",
      };
    }

    // Handle carbon credit menu navigation
    return await this.handleCarbonCreditMenu(session, input);
  }

  // Helper methods for USSD flows
  private async getOrCreateSession(sessionData: USSDSession): Promise<any> {
    const existingSession = await db.query(
      `
      SELECT * FROM ussd_sessions
      WHERE session_id = $1 AND phone_number = $2 AND is_active = true
    `,
      [sessionData.sessionId, sessionData.phoneNumber],
    );

    if (existingSession.rows.length > 0) {
      return existingSession.rows[0];
    }

    // Create new session
    const newSession = await db.query(
      `
      INSERT INTO ussd_sessions (
        session_id, phone_number, service_code, current_menu,
        menu_stack, session_data, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        sessionData.sessionId,
        sessionData.phoneNumber,
        sessionData.serviceCode,
        "main",
        JSON.stringify([]),
        JSON.stringify({}),
        new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      ],
    );

    return newSession.rows[0];
  }

  private async findUserByPhone(phoneNumber: string): Promise<any> {
    const result = await db.query(
      `
      SELECT id, first_name, last_name, email, role
      FROM users
      WHERE phone_number = $1 AND is_active = true
    `,
      [phoneNumber],
    );

    return result.rows[0] || null;
  }

  private async getUserConservationImpact(userId: string): Promise<any> {
    const result = await db.query(
      `
      SELECT
        SUM(habitat_area_protected) as habitat_protected,
        SUM(carbon_offset) as carbon_offset,
        COUNT(*) as total_purchases
      FROM lion_loyalty_purchases
      WHERE user_id = $1
    `,
      [userId],
    );

    const impact = result.rows[0];
    return {
      habitatProtected: Math.round(impact.habitat_protected || 0),
      carbonOffset: Math.round(impact.carbon_offset || 0),
      lionsSupported: Math.ceil((impact.habitat_protected || 0) / 10000),
      rangersFunded: Math.ceil((impact.habitat_protected || 0) / 1000),
      totalPurchases: parseInt(impact.total_purchases || 0),
    };
  }

  private async getRealTimeTracking(session: any): Promise<USSDResponse> {
    // Mock real-time data (integrate with actual satellite/GPS APIs)
    const trackingData = {
      lastUpdate: new Date().toLocaleString(),
      animalsSighted: Math.floor(Math.random() * 20) + 5,
      location: "Amboseli Sector 7",
      activity: "Peaceful grazing",
      weather: "Sunny, 28°C",
    };

    return {
      message: `📡 REAL-TIME TRACKING\n\n🦁 AMBOSELI LIONS:\n• Last seen: ${trackingData.lastUpdate}\n• Animals: ${trackingData.animalsSighted} in pride\n• Location: ${trackingData.location}\n• Activity: ${trackingData.activity}\n• Weather: ${trackingData.weather}\n\n📱 Updated every 6 hours\n\nPress 0 to return`,
      endSession: false,
    };
  }

  private async getGrazingForecast(session: any): Promise<USSDResponse> {
    // Get weather forecast for user's area
    const forecast = await db.query(`
      SELECT forecast_date, rainfall_mm, conditions, grazing_recommendation, risk_level
      FROM weather_forecasts
      WHERE location ILIKE '%kajiado%'
      ORDER BY forecast_date ASC
      LIMIT 3
    `);

    if (forecast.rows.length === 0) {
      return {
        message:
          "🌦️ GRAZING FORECAST\n\nNo forecast data available for your area.\n\nContact your local chief for updates.\n\nPress 0 to return",
        endSession: false,
      };
    }

    const today = forecast.rows[0];
    const tomorrow = forecast.rows[1] || today;

    return {
      message: `🌦️ GRAZING FORECAST - Kajiado\n\nTODAY: ${today.conditions}\n💧 Rain: ${today.rainfall_mm}mm\n📍 ${today.grazing_recommendation}\n⚠️ Risk: ${today.risk_level}\n\nTOMORROW: ${tomorrow.conditions}\n💧 Rain: ${tomorrow.rainfall_mm}mm\n\n1. 7-day forecast\n2. Report livestock issue\n0. Back`,
      endSession: false,
      nextMenu: "grazing_forecast",
    };
  }

  // Send USSD message
  async sendUSSDUpdate(phoneNumber: string, message: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        logger.info("USSD disabled, logging message:", {
          phoneNumber,
          message,
        });
        return true;
      }

      const response = await axios.post(
        `${this.gatewayUrl}/ussd/send`,
        {
          username: this.username,
          to: phoneNumber,
          message: message,
        },
        {
          headers: {
            apikey: this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      logger.info("USSD message sent successfully", {
        phoneNumber,
        messageLength: message.length,
      });
      return response.status === 200;
    } catch (error) {
      logger.error("USSD send error:", error);
      return false;
    }
  }

  // Clean up expired sessions
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const result = await db.query(`
        DELETE FROM ussd_sessions
        WHERE expires_at < NOW() OR (created_at < NOW() - INTERVAL '1 hour' AND is_active = false)
      `);

      logger.info("Cleaned up expired USSD sessions", {
        deletedCount: result.rowCount,
      });
    } catch (error) {
      logger.error("USSD session cleanup error:", error);
    }
  }

  // Additional helper methods would go here...
  private async getUserTreePlantings(userId: string): Promise<any> {
    const result = await db.query(
      `
      SELECT
        SUM(trees_planted) as total_trees,
        AVG(survival_rate) as survival_rate,
        SUM(payout_earned) as total_earned,
        SUM(estimated_carbon_credits) as credits_available
      FROM tree_plantings
      WHERE farmer_id = $1
    `,
      [userId],
    );

    const data = result.rows[0];
    return {
      totalTrees: parseInt(data.total_trees || 0),
      survivalRate: Math.round(data.survival_rate || 0),
      totalEarned: parseFloat(data.total_earned || 0),
      creditsAvailable: Math.round(data.credits_available || 0),
    };
  }

  private async handleCarbonCreditMenu(
    session: any,
    input: string,
  ): Promise<USSDResponse> {
    // Implement carbon credit menu handling
    switch (input) {
      case "1":
        return {
          message:
            "🌳 PLANT MORE TREES\n\nVisit savannah.org or call +254-XXX-XXXX to register new tree planting.\n\nRequirements:\n• GPS coordinates\n• Tree species\n• Land ownership proof\n\nPress 0 to return",
          endSession: false,
        };
      case "0":
        return {
          message: "Keep planting for the future! 🌳",
          endSession: true,
        };
      default:
        return {
          message: "Invalid choice. Press 1-4 or 0 to exit.",
          endSession: false,
        };
    }
  }

  private async getAdoptionOptions(session: any): Promise<USSDResponse> {
    return {
      message:
        "🐘 VIRTUAL ADOPTION\n\nAvailable for adoption:\n\n1. Tembo - Elephant ($45/month)\n2. Simba - Lion ($55/month)\n3. Twiga - Giraffe ($35/month)\n4. Nyumbu - Wildebeest ($25/month)\n\nVisit savannah.org to adopt\n\nPress 0 to return",
      endSession: false,
    };
  }

  private async getUserCertificates(session: any): Promise<USSDResponse> {
    return {
      message:
        "📜 YOUR CERTIFICATES\n\n✅ Conservation Champion\n✅ Wildlife Guardian\n✅ Habitat Protector\n\nDownload at:\nsavannah.org/certificates\n\nOr scan QR codes in app\n\nPress 0 to return",
      endSession: false,
    };
  }

  private async getLatestUpdates(session: any): Promise<USSDResponse> {
    return {
      message:
        "📢 LATEST UPDATES\n\n🦁 Lion pride spotted with 3 new cubs in Amboseli\n🐘 Elephant herd safely crossed highway using new corridor\n🌳 1,247 trees verified this month\n🏆 You're in top 10% of conservationists!\n\nPress 0 to return",
      endSession: false,
    };
  }

  private async getGuestTracking(session: any): Promise<USSDResponse> {
    return {
      message:
        "🌍 GUEST TRACKING\n\n📊 LIVE CONSERVATION DATA:\n• 156,789m² protected today\n• 247 lions monitored\n• 89 ranger patrols active\n• 1,456 trees verified\n\nJoin the impact at savannah.org\n\nPress 0 to exit",
      endSession: true,
    };
  }

  private async reportIssue(session: any): Promise<USSDResponse> {
    return {
      message:
        "📞 REPORT ISSUE\n\n1. Land dispute\n2. Family conflict\n3. Resource issue\n4. Environmental concern\n5. Other\n\nSelect issue type or call chief directly: +254-XXX-XXXX\n\n0. Back",
      endSession: false,
      nextMenu: "report_issue",
    };
  }

  private async getCommunityMeetings(session: any): Promise<USSDResponse> {
    return {
      message:
        "📅 COMMUNITY MEETING\n\n📍 Location: Kajiado Community Hall\n🕐 Time: Saturday 2PM\n👥 Agenda:\n• Water point maintenance\n• Grazing rotation\n• School fees\n\nRSVP:\n1. Will attend\n2. Cannot attend\n0. Back",
      endSession: false,
      nextMenu: "community_meeting",
    };
  }

  private async contactChief(session: any): Promise<USSDResponse> {
    return {
      message:
        "👨‍⚖️ CONTACT CHIEF\n\nChief Mzee Kimutai\nKajiado Central\n\n📞 Direct: +254-XXX-XXXX\n📱 WhatsApp: Available\n🏛️ Office Hours: 8AM-5PM\n📍 Location: Community Center\n\nPress 0 to return",
      endSession: false,
    };
  }

  private async getDisputeStatus(session: any): Promise<USSDResponse> {
    return {
      message:
        "⚖️ DISPUTE STATUS\n\nNo active disputes for your household.\n\nTo check specific case:\nText case number to +254-XXX-XXXX\n\nPrevious cases: 2 resolved\nAverage resolution: 5 days\n\nPress 0 to return",
      endSession: false,
    };
  }

  private async getTraditionalGuidance(session: any): Promise<USSDResponse> {
    return {
      message:
        '🏛️ TRADITIONAL LAW\n\n"Harambee spirit guides our decisions"\n\nFor guidance on:\n• Marriage customs\n• Land inheritance\n• Community disputes\n• Traditional ceremonies\n\nConsult elders at community meetings\n\nPress 0 to return',
      endSession: false,
    };
  }

  // Main menu handler
  private async handleMainMenu(
    session: any,
    input: string,
    inputArray: string[],
  ): Promise<USSDResponse> {
    if (inputArray.length === 1) {
      return {
        message:
          "🌍 SAVANNAH DIGITAL\n\nWelcome to the digital savannah!\n\n1. Wildlife Tracker\n2. Carbon Credits\n3. Chief Services\n4. Code School\n5. Marketplace\n0. Exit",
        endSession: false,
      };
    }

    switch (input) {
      case "1":
        return this.handleWildlifeTracking(session, "", []);
      case "2":
        return this.handleCarbonCredit(session, "", []);
      case "3":
        return this.handleChiefServices(session, "", []);
      case "4":
        return this.handleCodeSchool(session, "", []);
      case "5":
        return this.handleRefugeeMarketplace(session, "", []);
      case "0":
        return {
          message: "Thank you for using Savannah Digital! 🌍",
          endSession: true,
        };
      default:
        return {
          message: "Invalid choice. Please select 1-5 or 0 to exit.",
          endSession: false,
        };
    }
  }

  // Code school USSD handler
  private async handleCodeSchool(
    session: any,
    input: string,
    inputArray: string[],
  ): Promise<USSDResponse> {
    if (inputArray.length === 1) {
      return {
        message:
          "💻 CODE SCHOOL\n\nLearn coding in Swahili!\n\n1. Python Basics\n2. JavaScript\n3. HTML/CSS\n4. My Progress\n5. Join Class\n0. Back",
        endSession: false,
      };
    }

    switch (input) {
      case "1":
        return {
          message:
            "🐍 PYTHON BASICS\n\nNext class: Monday 6PM\nTopic: Variables & Functions\nLocation: Community Center\n\nRegister: savannah.org/school\nOr SMS PYTHON to 40404\n\n0. Back",
          endSession: false,
        };
      case "2":
        return {
          message:
            "⚡ JAVASCRIPT\n\nNext class: Wednesday 7PM\nTopic: DOM Manipulation\nLocation: Online/Community Center\n\nPrereq: HTML/CSS basics\nRegister: savannah.org/js\n\n0. Back",
          endSession: false,
        };
      case "3":
        return {
          message:
            "🎨 HTML/CSS\n\nBeginners welcome!\nNext: Friday 6PM\nTopic: Building websites\n\nNo experience needed\nRegister: savannah.org/web\n\n0. Back",
          endSession: false,
        };
      case "4":
        return {
          message:
            "📊 YOUR PROGRESS\n\n✅ Python: 60% complete\n⏳ JavaScript: 20% complete\n🎯 Next milestone: Build a game\n\nCertificates earned: 2\nView at: savannah.org/certs\n\n0. Back",
          endSession: false,
        };
      case "5":
        return {
          message:
            "🏫 JOIN LIVE CLASS\n\nCurrent session: Python Variables\nRoom code: PYTHON123\n\nJoin online: zoom.us/j/123456\nOr visit Community Center\n\n1. Send reminder\n0. Back",
          endSession: false,
        };
      case "0":
        return this.handleMainMenu(session, "", []);
      default:
        return {
          message: "Invalid choice. Please select 1-5 or 0 to go back.",
          endSession: false,
        };
    }
  }

  // Refugee marketplace USSD handler
  private async handleRefugeeMarketplace(
    session: any,
    input: string,
    inputArray: string[],
  ): Promise<USSDResponse> {
    if (inputArray.length === 1) {
      return {
        message:
          "🛒 REFUGEE MARKETPLACE\n\nSupport displaced communities\n\n1. Browse Products\n2. Skill Services\n3. Donate/Support\n4. My Orders\n5. Become Seller\n0. Back",
        endSession: false,
      };
    }

    switch (input) {
      case "1":
        return {
          message:
            "🛍️ BROWSE PRODUCTS\n\nPopular items:\n• Handmade crafts\n• Fresh vegetables\n• Tailoring services\n• Food items\n\nVisit: savannah.org/marketplace\nOr call: +254-XXX-XXXX\n\n0. Back",
          endSession: false,
        };
      case "2":
        return {
          message:
            "🔧 SKILL SERVICES\n\nAvailable services:\n• Tailoring/Alterations\n• Phone repairs\n• Tutoring\n• Translation\n• Computer skills\n\nBook service: savannah.org/skills\n\n0. Back",
          endSession: false,
        };
      case "3":
        return {
          message:
            "❤️ DONATE/SUPPORT\n\nWays to help:\n• Buy products\n• Sponsor education\n• Provide equipment\n• Offer mentorship\n\nDonate: M-Pesa 247247\nAcc: REFUGEE2024\n\n0. Back",
          endSession: false,
        };
      case "4":
        return {
          message:
            "📦 MY ORDERS\n\nNo recent orders.\n\nTo place order:\nVisit savannah.org/marketplace\nOr call: +254-XXX-XXXX\n\nSupport builds communities!\n\n0. Back",
          endSession: false,
        };
      case "5":
        return {
          message:
            "🏪 BECOME SELLER\n\nStart selling today!\n\nRequirements:\n• Valid ID\n• Product photos\n• M-Pesa account\n\nApply: savannah.org/sell\nOr visit nearest center\n\n0. Back",
          endSession: false,
        };
      case "0":
        return this.handleMainMenu(session, "", []);
      default:
        return {
          message: "Invalid choice. Please select 1-5 or 0 to go back.",
          endSession: false,
        };
    }
  }
}

export const ussdService = new USSDService();

// Helper function for easy access - re-export from SMS service
export const sendUSSDUpdate = async (
  phoneNumber: string,
  message: string,
): Promise<boolean> => {
  return await ussdService.sendUSSDUpdate(phoneNumber, message);
};
