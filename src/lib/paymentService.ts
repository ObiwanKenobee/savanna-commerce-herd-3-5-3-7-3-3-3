export interface PaymentProvider {
  id: string;
  name: string;
  displayName: string;
  description: string;
  fees: {
    percentage: number;
    fixed?: number;
    currency: string;
  };
  supportedCountries: string[];
  supportedCurrencies: string[];
  isActive: boolean;
  minimumAmount: number;
  maximumAmount: number;
  processingTime: string;
  icon?: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerId: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: "mpesa",
    name: "M-Pesa",
    displayName: "M-Pesa",
    description: "Kenya's leading mobile money service",
    fees: {
      percentage: 1.5,
      fixed: 0,
      currency: "KES",
    },
    supportedCountries: ["Kenya", "Tanzania", "Uganda"],
    supportedCurrencies: ["KES", "TZS", "UGX"],
    isActive: true,
    minimumAmount: 10,
    maximumAmount: 1000000,
    processingTime: "Instant",
    icon: "smartphone",
  },
  {
    id: "stripe",
    name: "Stripe",
    displayName: "Credit/Debit Card",
    description: "International card payments via Stripe",
    fees: {
      percentage: 2.9,
      fixed: 30,
      currency: "KES",
    },
    supportedCountries: [
      "Kenya",
      "Uganda",
      "Tanzania",
      "Rwanda",
      "Ethiopia",
      "Global",
    ],
    supportedCurrencies: ["KES", "USD", "EUR", "GBP", "TZS", "UGX"],
    isActive: true,
    minimumAmount: 50,
    maximumAmount: 5000000,
    processingTime: "2-3 business days",
    icon: "credit-card",
  },
  {
    id: "paypal",
    name: "PayPal",
    displayName: "PayPal",
    description: "Global digital payments platform",
    fees: {
      percentage: 3.4,
      fixed: 15,
      currency: "USD",
    },
    supportedCountries: ["Global"],
    supportedCurrencies: ["USD", "EUR", "GBP", "KES"],
    isActive: true,
    minimumAmount: 1,
    maximumAmount: 10000,
    processingTime: "1-3 business days",
    icon: "globe",
  },
  {
    id: "paystack",
    name: "Paystack",
    displayName: "Paystack",
    description: "African payment gateway",
    fees: {
      percentage: 1.95,
      fixed: 0,
      currency: "KES",
    },
    supportedCountries: ["Kenya", "Nigeria", "Ghana", "South Africa"],
    supportedCurrencies: ["KES", "NGN", "GHS", "ZAR"],
    isActive: true,
    minimumAmount: 100,
    maximumAmount: 2000000,
    processingTime: "1-2 business days",
    icon: "building-2",
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    displayName: "Flutterwave",
    description: "Pan-African payment infrastructure",
    fees: {
      percentage: 1.4,
      fixed: 0,
      currency: "KES",
    },
    supportedCountries: ["Kenya", "Nigeria", "Uganda", "Tanzania", "Rwanda"],
    supportedCurrencies: ["KES", "NGN", "UGX", "TZS", "RWF"],
    isActive: true,
    minimumAmount: 50,
    maximumAmount: 1500000,
    processingTime: "1-2 business days",
    icon: "zap",
  },
];

class PaymentService {
  private providers: PaymentProvider[] = PAYMENT_PROVIDERS;

  /**
   * Get available payment providers for a specific country and currency
   */
  getAvailableProviders(
    country: string,
    currency: string = "KES",
  ): PaymentProvider[] {
    return this.providers
      .filter(
        (provider) =>
          provider.isActive &&
          (provider.supportedCountries.includes(country) ||
            provider.supportedCountries.includes("Global")) &&
          provider.supportedCurrencies.includes(currency),
      )
      .sort((a, b) => {
        // Prioritize M-Pesa for Kenyan users
        if (country === "Kenya") {
          if (a.id === "mpesa") return -1;
          if (b.id === "mpesa") return 1;
        }

        // Sort by fees (lower fees first)
        return a.fees.percentage - b.fees.percentage;
      });
  }

  /**
   * Get a specific payment provider by ID
   */
  getProvider(providerId: string): PaymentProvider | null {
    return (
      this.providers.find((provider) => provider.id === providerId) || null
    );
  }

  /**
   * Calculate processing fees for a payment
   */
  calculateFees(amount: number, provider: PaymentProvider): number {
    const percentageFee = (amount * provider.fees.percentage) / 100;
    const fixedFee = provider.fees.fixed || 0;
    return Math.round(percentageFee + fixedFee);
  }

  /**
   * Validate payment data before processing
   */
  private validatePaymentData(
    amount: number,
    provider: PaymentProvider,
    paymentData: PaymentData,
  ): { isValid: boolean; error?: string } {
    if (amount < provider.minimumAmount) {
      return {
        isValid: false,
        error: `Amount must be at least ${provider.minimumAmount} ${provider.fees.currency}`,
      };
    }

    if (amount > provider.maximumAmount) {
      return {
        isValid: false,
        error: `Amount cannot exceed ${provider.maximumAmount} ${provider.fees.currency}`,
      };
    }

    if (!provider.supportedCurrencies.includes(paymentData.currency)) {
      return {
        isValid: false,
        error: `Currency ${paymentData.currency} is not supported by ${provider.name}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Process M-Pesa payment
   */
  private async processMpesaPayment(
    paymentData: PaymentData,
    paymentMethod: any,
  ): Promise<PaymentResult> {
    try {
      // In a real implementation, this would integrate with M-Pesa API
      // For now, simulate the payment process

      const { phoneNumber } = paymentMethod;

      if (!phoneNumber || !phoneNumber.match(/^254\d{9}$/)) {
        return {
          success: false,
          error: "Invalid M-Pesa phone number format. Use 254XXXXXXXXX",
        };
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        return {
          success: true,
          transactionId: `MP${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          metadata: {
            phoneNumber,
            provider: "mpesa",
            processingTime: "instant",
          },
        };
      } else {
        return {
          success: false,
          error:
            "M-Pesa payment failed. Please try again or use a different payment method.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "M-Pesa service temporarily unavailable",
      };
    }
  }

  /**
   * Process Stripe payment
   */
  private async processStripePayment(
    paymentData: PaymentData,
    paymentMethod: any,
  ): Promise<PaymentResult> {
    try {
      // In a real implementation, this would integrate with Stripe API
      // For now, simulate the payment process

      if (!paymentMethod || !paymentMethod.id) {
        return {
          success: false,
          error: "Invalid payment method",
        };
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate success/failure (95% success rate)
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        return {
          success: true,
          transactionId: `pi_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          metadata: {
            paymentMethodId: paymentMethod.id,
            provider: "stripe",
            processingTime: "2-3 business days",
          },
        };
      } else {
        return {
          success: false,
          error:
            "Card payment failed. Please check your card details and try again.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Payment processing failed",
      };
    }
  }

  /**
   * Process PayPal payment
   */
  private async processPayPalPayment(
    paymentData: PaymentData,
    paymentMethod: any,
  ): Promise<PaymentResult> {
    try {
      // In a real implementation, this would integrate with PayPal API
      // For now, simulate the payment process

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Simulate success/failure (93% success rate)
      const isSuccess = Math.random() > 0.07;

      if (isSuccess) {
        return {
          success: true,
          transactionId: `PAYPAL${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          metadata: {
            provider: "paypal",
            processingTime: "1-3 business days",
          },
        };
      } else {
        return {
          success: false,
          error: "PayPal payment failed. Please try again.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "PayPal service temporarily unavailable",
      };
    }
  }

  /**
   * Process Paystack payment
   */
  private async processPaystackPayment(
    paymentData: PaymentData,
    paymentMethod: any,
  ): Promise<PaymentResult> {
    try {
      // In a real implementation, this would integrate with Paystack API
      // For now, simulate the payment process

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success/failure (92% success rate)
      const isSuccess = Math.random() > 0.08;

      if (isSuccess) {
        return {
          success: true,
          transactionId: `PS${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          metadata: {
            provider: "paystack",
            processingTime: "1-2 business days",
          },
        };
      } else {
        return {
          success: false,
          error: "Paystack payment failed. Please try again.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Paystack service temporarily unavailable",
      };
    }
  }

  /**
   * Process a payment using the specified provider
   */
  async processPayment(
    provider: PaymentProvider,
    paymentData: PaymentData,
    paymentMethod: any,
  ): Promise<PaymentResult> {
    // Validate payment data
    const validation = this.validatePaymentData(
      paymentData.amount,
      provider,
      paymentData,
    );

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Route to appropriate payment processor based on provider
    switch (provider.id) {
      case "mpesa":
        return this.processMpesaPayment(paymentData, paymentMethod);

      case "stripe":
        return this.processStripePayment(paymentData, paymentMethod);

      case "paypal":
        return this.processPayPalPayment(paymentData, paymentMethod);

      case "paystack":
        return this.processPaystackPayment(paymentData, paymentMethod);

      case "flutterwave":
        // Similar implementation for Flutterwave
        return {
          success: false,
          error: "Flutterwave integration coming soon",
        };

      default:
        return {
          success: false,
          error: `Payment provider ${provider.id} is not supported`,
        };
    }
  }

  /**
   * Get payment status by transaction ID
   */
  async getPaymentStatus(transactionId: string): Promise<{
    status: "pending" | "completed" | "failed" | "cancelled";
    amount?: number;
    currency?: string;
    timestamp?: Date;
  }> {
    // In a real implementation, this would query the payment provider's API
    // For now, simulate status check

    if (
      transactionId.startsWith("MP") ||
      transactionId.startsWith("pi_") ||
      transactionId.startsWith("PAYPAL") ||
      transactionId.startsWith("PS")
    ) {
      return {
        status: "completed",
        timestamp: new Date(),
      };
    }

    return {
      status: "failed",
    };
  }

  /**
   * Get supported countries for all providers
   */
  getSupportedCountries(): string[] {
    const countries = new Set<string>();
    this.providers.forEach((provider) => {
      provider.supportedCountries.forEach((country) => {
        if (country !== "Global") {
          countries.add(country);
        }
      });
    });
    return Array.from(countries).sort();
  }

  /**
   * Get supported currencies for all providers
   */
  getSupportedCurrencies(): string[] {
    const currencies = new Set<string>();
    this.providers.forEach((provider) => {
      provider.supportedCurrencies.forEach((currency) => {
        currencies.add(currency);
      });
    });
    return Array.from(currencies).sort();
  }

  /**
   * Convert amount between currencies (simplified conversion)
   */
  convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): number {
    // Simplified conversion rates - in production, use a real exchange rate API
    const rates: Record<string, number> = {
      KES: 1,
      USD: 0.0067,
      EUR: 0.0063,
      GBP: 0.0054,
      TZS: 2.4,
      UGX: 24.8,
      NGN: 10.4,
      GHS: 0.081,
      ZAR: 0.12,
      RWF: 8.7,
    };

    if (fromCurrency === toCurrency) return amount;

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;

    return Math.round((amount / fromRate) * toRate * 100) / 100;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Export types and constants
export type { PaymentData, PaymentResult };
