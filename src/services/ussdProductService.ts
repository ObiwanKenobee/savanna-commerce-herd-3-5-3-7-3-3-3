import { supabase } from "../integrations/supabase/client";
import { productUploadService } from "./productUploadService";

export interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  step: string;
  data: Record<string, any>;
  expiresAt: Date;
}

export interface USSDResponse {
  message: string;
  action: "continue" | "end";
  nextStep?: string;
}

export interface CulturalCaptcha {
  question: string;
  options: string[];
  correctAnswer: number;
  category: "wildlife" | "culture" | "geography" | "language";
}

class USSDProductService {
  private readonly SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;

  private readonly MENU_STRUCTURE = {
    main: {
      text: "Karibu Savannah!\n1. Add Product\n2. My Products\n3. Help\n4. Profile",
      options: ["1", "2", "3", "4"],
    },
    add_product: {
      text: "Add Product:\n1. New Product\n2. Bulk via WhatsApp\n3. Copy Existing\n0. Back",
      options: ["1", "2", "3", "0"],
    },
  };

  private readonly CULTURAL_CAPTCHAS: CulturalCaptcha[] = [
    {
      question:
        "Miguu mingapi ina dik-dik?\n1. Minne\n2. Mitatu\n3. Miwili\n4. Moja",
      options: ["Minne", "Mitatu", "Miwili", "Moja"],
      correctAnswer: 0, // Minne (Four)
      category: "wildlife",
    },
    {
      question:
        "Mti gani ni muhimu sana kwa Wamaasai?\n1. Mti wa Nazi\n2. Mti wa Baobab\n3. Mti wa Acacia\n4. Mti wa Mango",
      options: [
        "Mti wa Nazi",
        "Mti wa Baobab",
        "Mti wa Acacia",
        "Mti wa Mango",
      ],
      correctAnswer: 2, // Acacia
      category: "culture",
    },
    {
      question:
        "Mlima mrefu zaidi Kenya ni upi?\n1. Mt. Elgon\n2. Mt. Kenya\n3. Aberdare\n4. Kilimanjaro",
      options: ["Mt. Elgon", "Mt. Kenya", "Aberdare", "Kilimanjaro"],
      correctAnswer: 1, // Mt. Kenya
      category: "geography",
    },
    {
      question:
        "Neno 'Asante' ni lugha gani?\n1. Kikuyu\n2. Luo\n3. Kiswahili\n4. Kalenjin",
      options: ["Kikuyu", "Luo", "Kiswahili", "Kalenjin"],
      correctAnswer: 2, // Kiswahili
      category: "language",
    },
    {
      question:
        "Wanyamapori gani ni 'Big Five'?\n1. Simba, Nyati, Tembo, Faru, Chui\n2. Simba, Kiboko, Tembo, Faru, Chui\n3. Simba, Nyati, Twiga, Faru, Chui\n4. Simba, Nyati, Tembo, Faru, Swala",
      options: [
        "Simba, Nyati, Tembo, Faru, Chui",
        "Simba, Kiboko, Tembo, Faru, Chui",
        "Simba, Nyati, Twiga, Faru, Chui",
        "Simba, Nyati, Tembo, Faru, Swala",
      ],
      correctAnswer: 0, // Big Five
      category: "wildlife",
    },
  ];

  async handleUSSDRequest(
    phoneNumber: string,
    input: string,
    sessionId?: string,
  ): Promise<USSDResponse> {
    try {
      // Get or create session
      let session = sessionId ? await this.getSession(sessionId) : null;

      if (!session || this.isSessionExpired(session)) {
        session = await this.createSession(phoneNumber);
        return this.handleMainMenu(session, input);
      }

      // Route to appropriate handler based on current step
      switch (session.step) {
        case "main_menu":
          return this.handleMainMenu(session, input);
        case "add_product_menu":
          return this.handleAddProductMenu(session, input);
        case "new_product_name":
          return this.handleProductName(session, input);
        case "new_product_price":
          return this.handleProductPrice(session, input);
        case "new_product_unit":
          return this.handleProductUnit(session, input);
        case "new_product_photo":
          return this.handleProductPhoto(session, input);
        case "captcha":
          return this.handleCaptcha(session, input);
        case "confirm_product":
          return this.handleProductConfirmation(session, input);
        case "my_products":
          return this.handleMyProducts(session, input);
        case "help":
          return this.handleHelp(session, input);
        case "profile":
          return this.handleProfile(session, input);
        default:
          return this.handleMainMenu(session, input);
      }
    } catch (error) {
      console.error("USSD request handling failed:", error);
      return {
        message: "Samahani, kuna hitilafu. Jaribu tena.\n0. Rudi",
        action: "continue",
      };
    }
  }

  private async createSession(phoneNumber: string): Promise<USSDSession> {
    const session: USSDSession = {
      sessionId: this.generateSessionId(),
      phoneNumber,
      step: "main_menu",
      data: {},
      expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT),
    };

    await this.storeSession(session);
    return session;
  }

  private async handleMainMenu(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    switch (input) {
      case "1": // Add Product
        await this.updateSession(session.sessionId, "add_product_menu", {});
        return {
          message: this.MENU_STRUCTURE.add_product.text,
          action: "continue",
          nextStep: "add_product_menu",
        };

      case "2": // My Products
        await this.updateSession(session.sessionId, "my_products", {});
        return this.showMyProducts(session);

      case "3": // Help
        await this.updateSession(session.sessionId, "help", {});
        return this.showHelp(session);

      case "4": // Profile
        await this.updateSession(session.sessionId, "profile", {});
        return this.showProfile(session);

      default:
        return {
          message: this.MENU_STRUCTURE.main.text,
          action: "continue",
        };
    }
  }

  private async handleAddProductMenu(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    switch (input) {
      case "1": // New Product
        await this.updateSession(session.sessionId, "new_product_name", {});
        return {
          message: "Jina la bidhaa (mfano: UNGA PEMBE):",
          action: "continue",
          nextStep: "new_product_name",
        };

      case "2": // WhatsApp Bulk
        return {
          message:
            "Tuma picha za bidhaa kwa WhatsApp +254700SAVANNAH na ujumbe wa sauti ukieleza bidhaa.\n0. Rudi",
          action: "continue",
        };

      case "3": // Copy Existing
        return this.showExistingProducts(session);

      case "0": // Back
        await this.updateSession(session.sessionId, "main_menu", {});
        return {
          message: this.MENU_STRUCTURE.main.text,
          action: "continue",
        };

      default:
        return {
          message: this.MENU_STRUCTURE.add_product.text,
          action: "continue",
        };
    }
  }

  private async handleProductName(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    if (!input || input.length < 2) {
      return {
        message: "Jina halifai. Andika jina la bidhaa (angalau herufi 2):",
        action: "continue",
      };
    }

    await this.updateSession(session.sessionId, "new_product_price", {
      name: input.toUpperCase(),
    });
    return {
      message: "Bei ya bidhaa (KSh, mfano: 120):",
      action: "continue",
      nextStep: "new_product_price",
    };
  }

  private async handleProductPrice(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    const price = parseFloat(input);
    if (isNaN(price) || price <= 0) {
      return {
        message: "Bei si sahihi. Andika bei kwa KSh (mfano: 120):",
        action: "continue",
      };
    }

    if (price > 100000) {
      // 100k KSh limit for basic users
      return {
        message: "Bei ni kubwa mno. Kiwango cha juu ni 100,000 KSh:",
        action: "continue",
      };
    }

    const data = { ...session.data, price };
    await this.updateSession(session.sessionId, "new_product_unit", data);

    return {
      message: "Kipimo:\n1. Kilo (kg)\n2. Lita (L)\n3. Kipande\n4. Kingine",
      action: "continue",
      nextStep: "new_product_unit",
    };
  }

  private async handleProductUnit(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    const units = ["kg", "ltr", "piece", "custom"];
    const unitNames = ["Kilo", "Lita", "Kipande", "Kingine"];

    const unitIndex = parseInt(input) - 1;
    if (unitIndex < 0 || unitIndex >= units.length) {
      return {
        message:
          "Chaguo si sahihi. Chagua kipimo:\n1. Kilo\n2. Lita\n3. Kipande\n4. Kingine",
        action: "continue",
      };
    }

    let unit = units[unitIndex];
    if (unit === "custom") {
      return {
        message: "Andika kipimo chako (mfano: mzigo, sanduku):",
        action: "continue",
      };
    }

    const data = { ...session.data, unit };
    await this.updateSession(session.sessionId, "new_product_photo", data);

    return {
      message:
        "Picha ya bidhaa:\n1. Piga picha sasa\n2. Bila picha\n3. Tuma baadaye\n0. Rudi",
      action: "continue",
      nextStep: "new_product_photo",
    };
  }

  private async handleProductPhoto(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    const data = { ...session.data };

    switch (input) {
      case "1": // Take photo
        data.hasPhoto = true;
        data.photoMethod = "camera";
        break;
      case "2": // No photo
        data.hasPhoto = false;
        break;
      case "3": // Send later
        data.hasPhoto = false;
        data.photoLater = true;
        break;
      case "0": // Back
        await this.updateSession(session.sessionId, "new_product_unit", data);
        return {
          message: "Kipimo:\n1. Kilo\n2. Lita\n3. Kipande\n4. Kingine",
          action: "continue",
        };
      default:
        return {
          message:
            "Chaguo si sahihi. Picha:\n1. Piga sasa\n2. Bila picha\n3. Tuma baadaye\n0. Rudi",
          action: "continue",
        };
    }

    // Show cultural captcha before confirming
    const captcha = this.getRandomCaptcha();
    data.captcha = captcha;
    await this.updateSession(session.sessionId, "captcha", data);

    return {
      message: `Jibu swali hili:\n\n${captcha.question}\n\nChagua jibu:`,
      action: "continue",
      nextStep: "captcha",
    };
  }

  private async handleCaptcha(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    const captcha = session.data.captcha;
    const answer = parseInt(input) - 1;

    if (answer !== captcha.correctAnswer) {
      const retries = (session.data.captchaRetries || 0) + 1;

      if (retries >= this.MAX_RETRIES) {
        return {
          message:
            "Samahani, majibu si sahihi. Jaribu tena baadaye.\n\n0. Rudi mwanzo",
          action: "end",
        };
      }

      await this.updateSession(session.sessionId, "captcha", {
        ...session.data,
        captchaRetries: retries,
      });

      return {
        message: `Jibu si sahihi. Jaribu tena (${retries}/${this.MAX_RETRIES}):\n\n${captcha.question}`,
        action: "continue",
      };
    }

    // Captcha passed, show confirmation
    await this.updateSession(
      session.sessionId,
      "confirm_product",
      session.data,
    );
    return this.showProductConfirmation(session);
  }

  private async handleProductConfirmation(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    switch (input) {
      case "1": // Confirm
        try {
          const result = await productUploadService.uploadViaUSSD({
            name: session.data.name,
            price: session.data.price.toString(),
            unit: session.data.unit,
            phoneNumber: session.phoneNumber,
            imageBase64: session.data.imageBase64,
          });

          await this.endSession(session.sessionId);

          return {
            message: `✅ Bidhaa imepokewa!\n\n${session.data.name} - ${session.data.price} KSh/${session.data.unit}\n\nHali: Inasubiri uhakiki\nKumbuka: ${this.generateReferenceNumber()}`,
            action: "end",
          };
        } catch (error) {
          return {
            message:
              "Samahani, kuongeza bidhaa kumeshindikana. Jaribu tena.\n0. Rudi",
            action: "continue",
          };
        }

      case "2": // Edit
        await this.updateSession(session.sessionId, "new_product_name", {});
        return {
          message: "Jina la bidhaa (mfano: UNGA PEMBE):",
          action: "continue",
        };

      case "3": // Cancel
        await this.endSession(session.sessionId);
        return {
          message: "Bidhaa imeghairiwa.\n\nAsante kwa kutumia Savannah!",
          action: "end",
        };

      default:
        return this.showProductConfirmation(session);
    }
  }

  private async handleMyProducts(
    session: USSDSession,
    input: string,
  ): Promise<USSDResponse> {
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("name, price, status")
        .eq("supplier_id", session.phoneNumber) // Using phone as identifier
        .order("created_at", { ascending: false })
        .limit(5);

      if (error || !products || products.length === 0) {
        return {
          message: "Huna bidhaa zozote bado.\n\n1. Ongeza bidhaa\n0. Rudi",
          action: "continue",
        };
      }

      let message = "Bidhaa zako za hivi karibuni:\n\n";
      products.forEach((product, index) => {
        const status =
          product.status === "approved"
            ? "✅"
            : product.status === "pending"
              ? "⏳"
              : "❌";
        message += `${index + 1}. ${product.name} - ${product.price} KSh ${status}\n`;
      });

      message += "\n1. Ongeza bidhaa\n0. Rudi";

      if (input === "1") {
        await this.updateSession(session.sessionId, "add_product_menu", {});
        return {
          message: this.MENU_STRUCTURE.add_product.text,
          action: "continue",
        };
      }

      if (input === "0") {
        await this.updateSession(session.sessionId, "main_menu", {});
        return {
          message: this.MENU_STRUCTURE.main.text,
          action: "continue",
        };
      }

      return {
        message,
        action: "continue",
      };
    } catch (error) {
      return {
        message: "Samahani, data haiwezi kupatikana.\n0. Rudi",
        action: "continue",
      };
    }
  }

  private async showMyProducts(session: USSDSession): Promise<USSDResponse> {
    return this.handleMyProducts(session, "");
  }

  private async showHelp(session: USSDSession): Promise<USSDResponse> {
    const helpText = `Msaada wa Savannah:

1. Kuongeza bidhaa: *384*1#
2. Angalia bidhaa: *384*2#
3. Bei za soko: *384*MARKET#
4. Huduma kwa mteja: 0700-SAVANNAH

Vipimo:
- Kilo (kg) - mazao
- Lita (L) - majimaji
- Kipande - vitu vingine

0. Rudi mwanzo`;

    if (session.data.input === "0") {
      await this.updateSession(session.sessionId, "main_menu", {});
      return {
        message: this.MENU_STRUCTURE.main.text,
        action: "continue",
      };
    }

    return {
      message: helpText,
      action: "continue",
    };
  }

  private async showProfile(session: USSDSession): Promise<USSDResponse> {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select(
          `
          *,
          user_roles(role_name, verification_level)
        `,
        )
        .eq("phone", session.phoneNumber)
        .single();

      if (error || !user) {
        return {
          message: "Samahani, profaili haiwezi kupatikana.\n0. Rudi",
          action: "continue",
        };
      }

      const role = user.user_roles?.[0];
      const roleText = role
        ? role.role_name === "verified_supplier"
          ? "Muuzaji Mhakika"
          : role.role_name === "basic_supplier"
            ? "Muuzaji wa Kawaida"
            : role.role_name === "aggregator"
              ? "Mkusanyaji"
              : "Mtumiaji"
        : "Mtumiaji";

      const profileText = `Profaili yako:

Simu: ${user.phone}
Hadhi: ${roleText}
Kiwango: ${role?.verification_level || "basic"}

Bidhaa leo: ${await this.getTodayUploadCount(user.id)}
Jumla: ${await this.getTotalProductCount(user.id)}

0. Rudi mwanzo`;

      if (session.data.input === "0") {
        await this.updateSession(session.sessionId, "main_menu", {});
        return {
          message: this.MENU_STRUCTURE.main.text,
          action: "continue",
        };
      }

      return {
        message: profileText,
        action: "continue",
      };
    } catch (error) {
      return {
        message: "Samahani, profaili haiwezi kupatikana.\n0. Rudi",
        action: "continue",
      };
    }
  }

  private showProductConfirmation(session: USSDSession): USSDResponse {
    const data = session.data;
    const photoText = data.hasPhoto ? "Ina picha" : "Bila picha";

    const confirmation = `Hakiki bidhaa:

Jina: ${data.name}
Bei: ${data.price} KSh
Kipimo: ${data.unit}
Picha: ${photoText}

1. Thibitisha
2. Hariri
3. Ghairi`;

    return {
      message: confirmation,
      action: "continue",
    };
  }

  private async showExistingProducts(
    session: USSDSession,
  ): Promise<USSDResponse> {
    // Mock showing popular products for copying
    const popularProducts = [
      "1. UNGA PEMBE - 120 KSh/kg",
      "2. SUKARI NYEUPE - 150 KSh/kg",
      "3. MCHELE WA INDIA - 180 KSh/kg",
      "4. MAHARAGWE - 200 KSh/kg",
    ];

    const message = `Bidhaa maarufu za kunakili:\n\n${popularProducts.join("\n")}\n\n5. Nyingine\n0. Rudi`;

    return {
      message,
      action: "continue",
    };
  }

  private getRandomCaptcha(): CulturalCaptcha {
    return this.CULTURAL_CAPTCHAS[
      Math.floor(Math.random() * this.CULTURAL_CAPTCHAS.length)
    ];
  }

  private generateSessionId(): string {
    return `ussd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReferenceNumber(): string {
    return `SAV${Date.now().toString().slice(-6)}`;
  }

  private isSessionExpired(session: USSDSession): boolean {
    return new Date() > session.expiresAt;
  }

  private async storeSession(session: USSDSession): Promise<void> {
    await supabase.from("ussd_sessions").upsert({
      session_id: session.sessionId,
      phone_number: session.phoneNumber,
      current_step: session.step,
      session_data: session.data,
      expires_at: session.expiresAt.toISOString(),
    });
  }

  private async getSession(sessionId: string): Promise<USSDSession | null> {
    const { data, error } = await supabase
      .from("ussd_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error || !data) return null;

    return {
      sessionId: data.session_id,
      phoneNumber: data.phone_number,
      step: data.current_step,
      data: data.session_data || {},
      expiresAt: new Date(data.expires_at),
    };
  }

  private async updateSession(
    sessionId: string,
    step: string,
    data: Record<string, any>,
  ): Promise<void> {
    await supabase
      .from("ussd_sessions")
      .update({
        current_step: step,
        session_data: data,
        expires_at: new Date(Date.now() + this.SESSION_TIMEOUT).toISOString(),
      })
      .eq("session_id", sessionId);
  }

  private async endSession(sessionId: string): Promise<void> {
    await supabase.from("ussd_sessions").delete().eq("session_id", sessionId);
  }

  private async getTodayUploadCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("supplier_id", userId)
      .gte("created_at", today.toISOString());

    return data?.length || 0;
  }

  private async getTotalProductCount(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("supplier_id", userId);

    return data?.length || 0;
  }
}

export const ussdProductService = new USSDProductService();
