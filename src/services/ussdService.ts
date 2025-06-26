import axios from "axios";
import { supabase } from "@/integrations/supabase/client";

interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  currentMenu: string;
  userData: Record<string, any>;
  timestamp: string;
  language: "en" | "sw" | "luo";
}

interface USSDMenuItem {
  id: string;
  title: string;
  titleSw?: string; // Swahili translation
  titleLuo?: string; // Dholuo translation
  type: "menu" | "input" | "action";
  children?: USSDMenuItem[];
  action?: string;
  validation?: string;
}

interface SMSNotification {
  phoneNumber: string;
  message: string;
  type:
    | "order_confirmation"
    | "stock_alert"
    | "delivery_update"
    | "payment_reminder";
  orderId?: string;
  language: "en" | "sw" | "luo";
}

class USSDService {
  private static instance: USSDService;
  private sessions = new Map<string, USSDSession>();
  private apiKey = process.env.VITE_AFRICAS_TALKING_API_KEY;
  private username = process.env.VITE_AFRICAS_TALKING_USERNAME;
  private shortcode = "*384*7#"; // Savanna Marketplace USSD code

  static getInstance(): USSDService {
    if (!USSDService.instance) {
      USSDService.instance = new USSDService();
    }
    return USSDService.instance;
  }

  // Main USSD menu structure
  private getMenuStructure(): USSDMenuItem {
    return {
      id: "main",
      title: "🌾 Welcome to Savanna Marketplace",
      titleSw: "🌾 Karibu Savanna Marketplace",
      titleLuo: "🌾 Oyore Savanna Marketplace",
      type: "menu",
      children: [
        {
          id: "browse",
          title: "1. Browse Products",
          titleSw: "1. Tazama Bidhaa",
          titleLuo: "1. Rang Gik",
          type: "menu",
          children: [
            {
              id: "grains",
              title: "1. Grains & Cereals",
              titleSw: "1. Nafaka na Mihogo",
              titleLuo: "1. Cham gi Bel",
              type: "action",
              action: "list_products",
            },
            {
              id: "vegetables",
              title: "2. Vegetables",
              titleSw: "2. Mboga",
              titleLuo: "2. Alot",
              type: "action",
              action: "list_products",
            },
            {
              id: "fruits",
              title: "3. Fruits",
              titleSw: "3. Matunda",
              titleLuo: "3. Olemb",
              type: "action",
              action: "list_products",
            },
            {
              id: "dairy",
              title: "4. Dairy Products",
              titleSw: "4. Bidhaa za Maziwa",
              titleLuo: "4. Gik chak",
              type: "action",
              action: "list_products",
            },
          ],
        },
        {
          id: "order",
          title: "2. Place Order",
          titleSw: "2. Weka Oda",
          titleLuo: "2. Ket Gima",
          type: "input",
          action: "start_order",
        },
        {
          id: "track",
          title: "3. Track Order",
          titleSw: "3. Fuatilia Oda",
          titleLuo: "3. Luwo Gima",
          type: "input",
          action: "track_order",
        },
        {
          id: "account",
          title: "4. My Account",
          titleSw: "4. Akaunti Yangu",
          titleLuo: "4. Akonta mara",
          type: "menu",
          children: [
            {
              id: "register",
              title: "1. Register Shop",
              titleSw: "1. Sajili Duka",
              titleLuo: "1. Ndik Ohala",
              type: "action",
              action: "register_shop",
            },
            {
              id: "balance",
              title: "2. Check Balance",
              titleSw: "2. Angalia Salio",
              titleLuo: "2. Ne pesa",
              type: "action",
              action: "check_balance",
            },
            {
              id: "history",
              title: "3. Order History",
              titleSw: "3. Historia ya Oda",
              titleLuo: "3. Gik ma osebet",
              type: "action",
              action: "order_history",
            },
          ],
        },
        {
          id: "support",
          title: "5. Customer Support",
          titleSw: "5. Msaada kwa Wateja",
          titleLuo: "5. Kony ne jokat",
          type: "action",
          action: "customer_support",
        },
        {
          id: "language",
          title: "9. Change Language",
          titleSw: "9. Badilisha Lugha",
          titleLuo: "9. Lok dhok",
          type: "menu",
          children: [
            {
              id: "lang_en",
              title: "1. English",
              type: "action",
              action: "set_language",
            },
            {
              id: "lang_sw",
              title: "2. Kiswahili",
              type: "action",
              action: "set_language",
            },
            {
              id: "lang_luo",
              title: "3. Dholuo",
              type: "action",
              action: "set_language",
            },
          ],
        },
      ],
    };
  }

  // Handle incoming USSD request from Africa's Talking
  async handleUSSDRequest(data: {
    sessionId: string;
    serviceCode: string;
    phoneNumber: string;
    text: string;
  }): Promise<string> {
    try {
      const { sessionId, phoneNumber, text } = data;

      // Get or create session
      let session = this.sessions.get(sessionId);
      if (!session) {
        session = {
          sessionId,
          phoneNumber,
          currentMenu: "main",
          userData: {},
          timestamp: new Date().toISOString(),
          language: "en", // Default language
        };
        this.sessions.set(sessionId, session);
      }

      // Parse user input
      const inputs = text.split("*").filter((input) => input.trim());
      const currentInput = inputs[inputs.length - 1] || "";

      // Get user's preferred language
      const userLang = await this.getUserLanguage(phoneNumber);
      if (userLang) session.language = userLang;

      // Process the menu navigation
      return await this.processMenuNavigation(session, inputs, currentInput);
    } catch (error) {
      console.error("USSD request processing failed:", error);
      return "END Sorry, service temporarily unavailable. Please try again later.";
    }
  }

  // Process menu navigation based on user input
  private async processMenuNavigation(
    session: USSDSession,
    inputs: string[],
    currentInput: string,
  ): Promise<string> {
    const menuStructure = this.getMenuStructure();

    if (inputs.length === 0) {
      // Show main menu
      return this.buildMenuResponse(menuStructure, session.language);
    }

    // Navigate to selected menu item
    let currentMenu = menuStructure;
    let breadcrumb = [];

    for (let i = 0; i < inputs.length; i++) {
      const choice = parseInt(inputs[i]) - 1;

      if (
        currentMenu.children &&
        choice >= 0 &&
        choice < currentMenu.children.length
      ) {
        currentMenu = currentMenu.children[choice];
        breadcrumb.push(currentMenu.id);
      } else {
        return `END ${this.getLocalizedText("Invalid choice. Please try again.", session.language)}`;
      }

      // Execute action if reached
      if (currentMenu.type === "action") {
        return await this.executeAction(currentMenu.action!, session, inputs);
      }
    }

    // Show submenu if available
    if (currentMenu.children) {
      return this.buildMenuResponse(currentMenu, session.language);
    }

    return `END ${this.getLocalizedText("Invalid option selected.", session.language)}`;
  }

  // Build menu response text
  private buildMenuResponse(
    menu: USSDMenuItem,
    language: "en" | "sw" | "luo",
  ): string {
    let response = "CON ";

    // Add title
    response += this.getLocalizedTitle(menu, language) + "\n\n";

    // Add menu options
    if (menu.children) {
      menu.children.forEach((child, index) => {
        response += `${index + 1}. ${this.getLocalizedTitle(child, language)}\n`;
      });
    }

    // Add back option for non-main menus
    if (menu.id !== "main") {
      response += "\n0. Back\n#. Main Menu";
    }

    return response;
  }

  // Get localized title based on language
  private getLocalizedTitle(
    menu: USSDMenuItem,
    language: "en" | "sw" | "luo",
  ): string {
    switch (language) {
      case "sw":
        return menu.titleSw || menu.title;
      case "luo":
        return menu.titleLuo || menu.title;
      default:
        return menu.title;
    }
  }

  // Execute specific actions
  private async executeAction(
    action: string,
    session: USSDSession,
    inputs: string[],
  ): Promise<string> {
    switch (action) {
      case "list_products":
        return await this.listProducts(session, inputs);

      case "start_order":
        return await this.startOrder(session);

      case "track_order":
        return await this.trackOrder(session);

      case "register_shop":
        return await this.registerShop(session);

      case "check_balance":
        return await this.checkBalance(session);

      case "order_history":
        return await this.getOrderHistory(session);

      case "customer_support":
        return await this.customerSupport(session);

      case "set_language":
        return await this.setLanguage(session, inputs);

      default:
        return `END ${this.getLocalizedText("Feature coming soon!", session.language)}`;
    }
  }

  // List products for a category
  private async listProducts(
    session: USSDSession,
    inputs: string[],
  ): Promise<string> {
    try {
      const category = this.getCategoryFromInput(inputs);

      const { data: products, error } = await supabase
        .from("products")
        .select(
          "name, unit_price, unit_of_measure, supplier:organizations(name)",
        )
        .eq("category", category)
        .eq("status", "active")
        .limit(5);

      if (error || !products || products.length === 0) {
        return `END ${this.getLocalizedText("No products available in this category.", session.language)}`;
      }

      let response = `END ${this.getLocalizedText("Available Products:", session.language)}\n\n`;
      products.forEach((product, index) => {
        response += `${index + 1}. ${product.name}\n`;
        response += `   KSH ${product.unit_price}/${product.unit_of_measure}\n`;
        response += `   Supplier: ${product.supplier?.name}\n\n`;
      });

      response += this.getLocalizedText(
        'To order, dial *384*7# and select "Place Order"',
        session.language,
      );

      return response;
    } catch (error) {
      console.error("List products failed:", error);
      return `END ${this.getLocalizedText("Sorry, unable to fetch products. Try again.", session.language)}`;
    }
  }

  // Start order process
  private async startOrder(session: USSDSession): Promise<string> {
    // In a full implementation, this would guide through order creation
    const message = this.getLocalizedText(
      "To place an order:\n1. Send SMS to 21455\n2. Format: ORDER [PRODUCT] [QUANTITY]\n3. Example: ORDER MAIZE 10\n\nOr visit our website for full catalog.",
      session.language,
    );

    return `END ${message}`;
  }

  // Track order status
  private async trackOrder(session: USSDSession): Promise<string> {
    const message = this.getLocalizedText(
      "To track your order:\n1. Send SMS: TRACK [ORDER_NUMBER]\n2. To 21455\n3. You will receive status update\n\nExample: TRACK ORD12345",
      session.language,
    );

    return `END ${message}`;
  }

  // Register new shop
  private async registerShop(session: USSDSession): Promise<string> {
    try {
      // Check if user already registered
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("phone", session.phoneNumber)
        .single();

      if (existingUser) {
        return `END ${this.getLocalizedText("You are already registered! Use other menu options to browse and order.", session.language)}`;
      }

      // Send registration SMS
      await this.sendSMS({
        phoneNumber: session.phoneNumber,
        message: this.getLocalizedText(
          "Welcome to Savanna! Reply with: REGISTER [SHOP_NAME] [LOCATION] to complete registration. Example: REGISTER Mama Shop Kibera",
          session.language,
        ),
        type: "order_confirmation",
        language: session.language,
      });

      return `END ${this.getLocalizedText("Registration SMS sent! Check your messages and reply to complete.", session.language)}`;
    } catch (error) {
      console.error("Registration failed:", error);
      return `END ${this.getLocalizedText("Registration failed. Please try again later.", session.language)}`;
    }
  }

  // Check account balance
  private async checkBalance(session: USSDSession): Promise<string> {
    try {
      // Get user's balance (mock implementation)
      const balance = Math.floor(Math.random() * 10000) + 500; // Mock balance

      return `END ${this.getLocalizedText("Your Account Balance:", session.language)}\nKSH ${balance.toLocaleString()}\n\n${this.getLocalizedText("Thank you for using Savanna Marketplace!", session.language)}`;
    } catch (error) {
      return `END ${this.getLocalizedText("Unable to fetch balance. Try again later.", session.language)}`;
    }
  }

  // Get order history
  private async getOrderHistory(session: USSDSession): Promise<string> {
    try {
      const { data: orders } = await supabase
        .from("orders")
        .select("order_number, total_amount, status, created_at")
        .eq("buyer_phone", session.phoneNumber)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!orders || orders.length === 0) {
        return `END ${this.getLocalizedText("No previous orders found.", session.language)}`;
      }

      let response = `END ${this.getLocalizedText("Recent Orders:", session.language)}\n\n`;
      orders.forEach((order, index) => {
        response += `${index + 1}. ${order.order_number}\n`;
        response += `   KSH ${order.total_amount}\n`;
        response += `   Status: ${order.status}\n\n`;
      });

      return response;
    } catch (error) {
      return `END ${this.getLocalizedText("Unable to fetch order history.", session.language)}`;
    }
  }

  // Customer support
  private async customerSupport(session: USSDSession): Promise<string> {
    const message = this.getLocalizedText(
      "Customer Support:\n📞 Call: 0700-SAVANNA\n📱 WhatsApp: 0700-123-456\n📧 Email: help@savanna.co.ke\n\nOr SMS HELP to 21455",
      session.language,
    );

    return `END ${message}`;
  }

  // Set user language preference
  private async setLanguage(
    session: USSDSession,
    inputs: string[],
  ): Promise<string> {
    const languageChoice = inputs[inputs.length - 1];
    let newLanguage: "en" | "sw" | "luo" = "en";

    switch (languageChoice) {
      case "1":
        newLanguage = "en";
        break;
      case "2":
        newLanguage = "sw";
        break;
      case "3":
        newLanguage = "luo";
        break;
      default:
        return `END ${this.getLocalizedText("Invalid language selection.", session.language)}`;
    }

    // Update user preference
    await this.saveUserLanguage(session.phoneNumber, newLanguage);
    session.language = newLanguage;

    return `END ${this.getLocalizedText("Language updated successfully!", newLanguage)}`;
  }

  // Send SMS notification
  async sendSMS(notification: SMSNotification): Promise<boolean> {
    try {
      const response = await axios.post(
        "https://api.africastalking.com/version1/messaging",
        {
          username: this.username,
          to: notification.phoneNumber,
          message: notification.message,
          from: "SAVANNA",
        },
        {
          headers: {
            ApiKey: this.apiKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      // Log SMS for audit
      await supabase.from("sms_logs").insert({
        phone_number: notification.phoneNumber,
        message: notification.message,
        type: notification.type,
        order_id: notification.orderId,
        language: notification.language,
        status: "sent",
        sent_at: new Date().toISOString(),
      });

      console.log("SMS sent successfully:", response.data);
      return true;
    } catch (error) {
      console.error("SMS sending failed:", error);
      return false;
    }
  }

  // Handle incoming SMS
  async handleIncomingSMS(data: {
    from: string;
    to: string;
    text: string;
    date: string;
  }): Promise<void> {
    try {
      const { from: phoneNumber, text } = data;
      const upperText = text.toUpperCase().trim();

      if (upperText.startsWith("REGISTER ")) {
        await this.handleRegistrationSMS(phoneNumber, text);
      } else if (upperText.startsWith("ORDER ")) {
        await this.handleOrderSMS(phoneNumber, text);
      } else if (upperText.startsWith("TRACK ")) {
        await this.handleTrackSMS(phoneNumber, text);
      } else if (upperText === "HELP") {
        await this.handleHelpSMS(phoneNumber);
      } else {
        // Unknown command
        await this.sendSMS({
          phoneNumber,
          message: "Unknown command. Send HELP for available commands.",
          type: "order_confirmation",
          language: "en",
        });
      }
    } catch (error) {
      console.error("SMS handling failed:", error);
    }
  }

  // Handle registration via SMS
  private async handleRegistrationSMS(phoneNumber: string, text: string) {
    const parts = text.split(" ");
    if (parts.length < 3) {
      await this.sendSMS({
        phoneNumber,
        message: "Invalid format. Use: REGISTER [SHOP_NAME] [LOCATION]",
        type: "order_confirmation",
        language: "en",
      });
      return;
    }

    const shopName = parts[1];
    const location = parts.slice(2).join(" ");

    // Create user profile
    try {
      const { error } = await supabase.from("user_profiles").insert({
        phone: phoneNumber,
        full_name: shopName,
        role: "retailer",
        created_via: "sms",
        location: location,
      });

      if (error) throw error;

      await this.sendSMS({
        phoneNumber,
        message: `Welcome ${shopName}! Your shop is registered. Dial *384*7# to start ordering. Your shop ID: ${phoneNumber.slice(-4)}`,
        type: "order_confirmation",
        language: "en",
      });
    } catch (error) {
      await this.sendSMS({
        phoneNumber,
        message: "Registration failed. Please try again or call support.",
        type: "order_confirmation",
        language: "en",
      });
    }
  }

  // Handle order via SMS
  private async handleOrderSMS(phoneNumber: string, text: string) {
    const parts = text.split(" ");
    if (parts.length < 3) {
      await this.sendSMS({
        phoneNumber,
        message: "Invalid format. Use: ORDER [PRODUCT] [QUANTITY]",
        type: "order_confirmation",
        language: "en",
      });
      return;
    }

    const productName = parts[1];
    const quantity = parseInt(parts[2]);

    if (isNaN(quantity)) {
      await this.sendSMS({
        phoneNumber,
        message: "Invalid quantity. Please enter a number.",
        type: "order_confirmation",
        language: "en",
      });
      return;
    }

    // Find product and create order (simplified)
    await this.sendSMS({
      phoneNumber,
      message: `Order received: ${quantity}x ${productName}. We'll confirm availability and pricing via call within 1 hour.`,
      type: "order_confirmation",
      language: "en",
    });
  }

  // Handle order tracking via SMS
  private async handleTrackSMS(phoneNumber: string, text: string) {
    const parts = text.split(" ");
    if (parts.length < 2) {
      await this.sendSMS({
        phoneNumber,
        message: "Invalid format. Use: TRACK [ORDER_NUMBER]",
        type: "delivery_update",
        language: "en",
      });
      return;
    }

    const orderNumber = parts[1];

    try {
      const { data: order } = await supabase
        .from("orders")
        .select("status, total_amount, created_at")
        .eq("order_number", orderNumber)
        .single();

      if (order) {
        await this.sendSMS({
          phoneNumber,
          message: `Order ${orderNumber}: Status: ${order.status}, Amount: KSH ${order.total_amount}. Created: ${new Date(order.created_at).toLocaleDateString()}`,
          type: "delivery_update",
          language: "en",
        });
      } else {
        await this.sendSMS({
          phoneNumber,
          message: `Order ${orderNumber} not found. Please check the order number.`,
          type: "delivery_update",
          language: "en",
        });
      }
    } catch (error) {
      await this.sendSMS({
        phoneNumber,
        message: "Unable to track order. Please try again later.",
        type: "delivery_update",
        language: "en",
      });
    }
  }

  // Handle help SMS
  private async handleHelpSMS(phoneNumber: string) {
    await this.sendSMS({
      phoneNumber,
      message:
        "Savanna Marketplace Commands:\nREGISTER [shop] [location]\nORDER [product] [qty]\nTRACK [order_no]\nOr dial *384*7#",
      type: "order_confirmation",
      language: "en",
    });
  }

  // Utility functions
  private getCategoryFromInput(inputs: string[]): string {
    const categoryMap: Record<string, string> = {
      "1": "Grains & Cereals",
      "2": "Vegetables",
      "3": "Fruits",
      "4": "Dairy Products",
    };

    return categoryMap[inputs[inputs.length - 1]] || "Grains & Cereals";
  }

  private async getUserLanguage(
    phoneNumber: string,
  ): Promise<"en" | "sw" | "luo" | null> {
    try {
      const { data } = await supabase
        .from("user_preferences")
        .select("language")
        .eq("phone", phoneNumber)
        .single();

      return data?.language || null;
    } catch {
      return null;
    }
  }

  private async saveUserLanguage(
    phoneNumber: string,
    language: "en" | "sw" | "luo",
  ) {
    await supabase.from("user_preferences").upsert({
      phone: phoneNumber,
      language,
      updated_at: new Date().toISOString(),
    });
  }

  private getLocalizedText(
    text: string,
    language: "en" | "sw" | "luo",
  ): string {
    // Simple translation map - in production, use proper i18n
    const translations: Record<string, Record<string, string>> = {
      "Invalid choice. Please try again.": {
        sw: "Chaguo batili. Jaribu tena.",
        luo: "Yiero marach. Tem kendo.",
      },
      "Feature coming soon!": {
        sw: "Huduma hii inakuja hivi karibuni!",
        luo: "Tijni biro machiegni!",
      },
      // Add more translations as needed
    };

    return translations[text]?.[language] || text;
  }
}

export const ussdService = USSDService.getInstance();
export type { USSDSession, SMSNotification };
