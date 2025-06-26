import {
  Horizon,
  Networks,
  Keypair,
  Asset,
  Operation,
  TransactionBuilder,
  Memo,
} from "stellar-sdk";
import { config } from "../config/environment";
import { logger, logBlockchainTransaction } from "../utils/logger";
import db from "../config/database";

interface NFTCertificateData {
  userId: string;
  purchaseId?: string;
  habitatProtected?: number;
  carbonOffset?: number;
  purchaseAmount?: number;
  conservationProject?: string;
  animalId?: string;
  treeSpecies?: string;
  wisdomInsightId?: string;
}

interface BlockchainTransaction {
  txHash: string;
  success: boolean;
  ledger?: number;
  error?: string;
}

interface CarbonCreditToken {
  creditId: string;
  farmerId: string;
  carbonOffset: number;
  treeCount: number;
  location: string;
}

class BlockchainService {
  private server: Horizon.Server;
  private network: Networks;
  private issuingKeypair: Keypair;

  constructor() {
    // Initialize Stellar network
    this.network =
      config.blockchain.stellar.network === "mainnet"
        ? Networks.PUBLIC
        : Networks.TESTNET;
    this.server = new Horizon.Server(config.blockchain.stellar.horizonUrl);

    // Create issuing keypair (in production, use secure key management)
    if (config.blockchain.stellar.secretKey) {
      this.issuingKeypair = Keypair.fromSecret(
        config.blockchain.stellar.secretKey,
      );
    } else {
      // Generate random keypair for development
      this.issuingKeypair = Keypair.random();
      logger.warn("Using random Stellar keypair - for development only");
    }
  }

  // Generate NFT certificate for conservation impact
  async generateNFTCertificate(data: NFTCertificateData): Promise<{
    nftId: string;
    txHash: string;
    success: boolean;
    error?: string;
  }> {
    try {
      if (!config.app.debug) {
        // Using app.debug as a fallback since FEATURES doesn't exist in config
        // Return mock data when blockchain is disabled
        const mockNftId = `NFT-MOCK-${Date.now()}`;
        const mockTxHash = `0x${Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")}`;

        logger.info("Blockchain disabled, generating mock NFT certificate", {
          userId: data.userId,
          nftId: mockNftId,
        });

        return {
          nftId: mockNftId,
          txHash: mockTxHash,
          success: true,
        };
      }

      // Generate unique NFT ID
      const nftId = `SAVANNAH-${data.purchaseId || data.animalId || data.wisdomInsightId || Date.now()}`;

      // Create NFT metadata
      const metadata = {
        type: "Conservation Certificate",
        issuer: "Savannah Ecosystem",
        holder: data.userId,
        issuedAt: new Date().toISOString(),
        ...data,
      };

      // Create Stellar asset for NFT
      const nftAsset = new Asset(nftId, this.issuingKeypair.publicKey());

      // Get user's account to send NFT to
      const userAccount = await this.getOrCreateUserAccount(data.userId);

      // Build transaction
      const account = await this.server.loadAccount(
        this.issuingKeypair.publicKey(),
      );
      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: this.network,
      })
        .addOperation(
          Operation.changeTrust({
            asset: nftAsset,
            source: userAccount.publicKey(),
          }),
        )
        .addOperation(
          Operation.payment({
            destination: userAccount.publicKey(),
            asset: nftAsset,
            amount: "1",
          }),
        )
        .addOperation(
          Operation.setOptions({
            setFlags: 4, // AUTH_IMMUTABLE_FLAG
            source: this.issuingKeypair.publicKey(),
          }),
        )
        .setTimeout(180)
        .build();

      // Sign and submit transaction
      transaction.sign(this.issuingKeypair);
      if (userAccount !== this.issuingKeypair) {
        transaction.sign(userAccount);
      }

      const result = await this.server.submitTransaction(transaction);

      // Log successful transaction
      logBlockchainTransaction("NFT_CERTIFICATE", result.hash, data.userId, 1, {
        nftId,
        metadata,
      });

      logger.info("NFT certificate generated successfully", {
        userId: data.userId,
        nftId,
        txHash: result.hash,
      });

      return {
        nftId,
        txHash: result.hash,
        success: true,
      };
    } catch (error) {
      logger.error("NFT certificate generation failed:", error);

      return {
        nftId: "",
        txHash: "",
        success: false,
        error: error.message,
      };
    }
  }

  // Issue carbon credit tokens
  async issueCarbonCredits(
    data: CarbonCreditToken,
  ): Promise<BlockchainTransaction> {
    try {
      if (!config.app.debug) {
        // Using app.debug as a fallback since FEATURES doesn't exist in config
        const mockTxHash = `0x${Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")}`;

        logger.info(
          "Blockchain disabled, generating mock carbon credit transaction",
          {
            farmerId: data.farmerId,
            carbonOffset: data.carbonOffset,
          },
        );

        return {
          txHash: mockTxHash,
          success: true,
        };
      }

      // Create carbon credit asset
      const carbonAsset = new Asset("CARBON", this.issuingKeypair.publicKey());

      // Get farmer's account
      const farmerAccount = await this.getOrCreateUserAccount(data.farmerId);

      // Build transaction
      const account = await this.server.loadAccount(
        this.issuingKeypair.publicKey(),
      );
      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: this.network,
      })
        .addOperation(
          Operation.payment({
            destination: farmerAccount.publicKey(),
            asset: carbonAsset,
            amount: data.carbonOffset.toString(),
          }),
        )
        .setTimeout(180)
        .build();

      transaction.sign(this.issuingKeypair);
      const result = await this.server.submitTransaction(transaction);

      // Log transaction
      logBlockchainTransaction(
        "CARBON_CREDIT",
        result.hash,
        data.farmerId,
        data.carbonOffset,
        { creditId: data.creditId, treeCount: data.treeCount },
      );

      return {
        txHash: result.hash,
        success: true,
        ledger: result.ledger,
      };
    } catch (error) {
      logger.error("Carbon credit issuance failed:", error);

      return {
        txHash: "",
        success: false,
        error: error.message,
      };
    }
  }

  // Transfer tokens between users
  async transferTokens(
    fromUserId: string,
    toUserId: string,
    assetCode: string,
    amount: number,
    memo?: string,
  ): Promise<BlockchainTransaction> {
    try {
      const fromAccount = await this.getUserAccount(fromUserId);
      const toAccount = await this.getOrCreateUserAccount(toUserId);

      if (!fromAccount) {
        throw new Error("Sender account not found");
      }

      const asset = new Asset(assetCode, this.issuingKeypair.publicKey());

      const account = await this.server.loadAccount(fromAccount.publicKey());
      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: this.network,
      }).addOperation(
        Operation.payment({
          destination: toAccount.publicKey(),
          asset: asset,
          amount: amount.toString(),
        }),
      );

      if (memo) {
        transaction.addMemo(Memo.text(memo));
      }

      const builtTransaction = transaction.setTimeout(180).build();
      builtTransaction.sign(fromAccount);

      const result = await this.server.submitTransaction(builtTransaction);

      logBlockchainTransaction(
        "TOKEN_TRANSFER",
        result.hash,
        fromUserId,
        amount,
        { toUserId, assetCode, memo },
      );

      return {
        txHash: result.hash,
        success: true,
        ledger: result.ledger,
      };
    } catch (error) {
      logger.error("Token transfer failed:", error);

      return {
        txHash: "",
        success: false,
        error: error.message,
      };
    }
  }

  // Create smart contract for drought insurance
  async createDroughtInsuranceContract(
    farmerId: string,
    premiumAmount: number,
    coverageAmount: number,
    rainfallThreshold: number,
  ): Promise<{
    contractAddress: string;
    txHash: string;
    success: boolean;
  }> {
    try {
      // In a real implementation, this would deploy a smart contract
      // For now, we'll create a simple escrow account

      const contractKeypair = Keypair.random();
      const farmerAccount = await this.getOrCreateUserAccount(farmerId);

      // Create contract account
      const account = await this.server.loadAccount(
        this.issuingKeypair.publicKey(),
      );
      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: this.network,
      })
        .addOperation(
          Operation.createAccount({
            destination: contractKeypair.publicKey(),
            startingBalance: "10", // Minimum balance
          }),
        )
        .addOperation(
          Operation.payment({
            source: farmerAccount.publicKey(),
            destination: contractKeypair.publicKey(),
            asset: Asset.native(),
            amount: premiumAmount.toString(),
          }),
        )
        .setTimeout(180)
        .build();

      transaction.sign(this.issuingKeypair);
      transaction.sign(farmerAccount);

      const result = await this.server.submitTransaction(transaction);

      // Store contract details in database
      await this.storeContractDetails(contractKeypair.publicKey(), {
        farmerId,
        premiumAmount,
        coverageAmount,
        rainfallThreshold,
        txHash: result.hash,
      });

      logger.info("Drought insurance contract created", {
        farmerId,
        contractAddress: contractKeypair.publicKey(),
        txHash: result.hash,
      });

      return {
        contractAddress: contractKeypair.publicKey(),
        txHash: result.hash,
        success: true,
      };
    } catch (error) {
      logger.error("Contract creation failed:", error);

      return {
        contractAddress: "",
        txHash: "",
        success: false,
      };
    }
  }

  // Execute payout from insurance contract
  async executeInsurancePayout(
    contractAddress: string,
    farmerId: string,
    actualRainfall: number,
  ): Promise<BlockchainTransaction> {
    try {
      // Get contract details
      const contractDetails = await this.getContractDetails(contractAddress);

      if (!contractDetails) {
        throw new Error("Contract not found");
      }

      // Check if payout is due
      if (actualRainfall >= contractDetails.rainfallThreshold) {
        throw new Error("Rainfall threshold not met - no payout due");
      }

      const farmerAccount = await this.getUserAccount(farmerId);
      const contractAccount = await this.server.loadAccount(contractAddress);

      // Execute payout
      const transaction = new TransactionBuilder(contractAccount, {
        fee: "100",
        networkPassphrase: this.network,
      })
        .addOperation(
          Operation.payment({
            destination: farmerAccount.publicKey(),
            asset: Asset.native(),
            amount: contractDetails.coverageAmount.toString(),
          }),
        )
        .setTimeout(180)
        .build();

      // Sign with contract key (stored securely)
      // transaction.sign(contractKeypair);

      // For demo, we'll simulate the transaction
      const mockResult = {
        hash: `INS_PAYOUT_${Date.now()}`,
        ledger: Math.floor(Math.random() * 1000000),
      };

      logBlockchainTransaction(
        "INSURANCE_PAYOUT",
        mockResult.hash,
        farmerId,
        contractDetails.coverageAmount,
        { actualRainfall, contractAddress },
      );

      return {
        txHash: mockResult.hash,
        success: true,
        ledger: mockResult.ledger,
      };
    } catch (error) {
      logger.error("Insurance payout failed:", error);

      return {
        txHash: "",
        success: false,
        error: error.message,
      };
    }
  }

  // Get user's blockchain account or create one
  private async getOrCreateUserAccount(userId: string): Promise<Keypair> {
    try {
      // Check if user has an existing account
      const existingAccount = await this.getUserAccount(userId);
      if (existingAccount) {
        return existingAccount;
      }

      // Create new account for user
      const userKeypair = Keypair.random();

      // Fund the account (in production, user would fund their own account)
      const account = await this.server.loadAccount(
        this.issuingKeypair.publicKey(),
      );
      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: this.network,
      })
        .addOperation(
          Operation.createAccount({
            destination: userKeypair.publicKey(),
            startingBalance: "10", // Minimum balance
          }),
        )
        .setTimeout(180)
        .build();

      transaction.sign(this.issuingKeypair);
      await this.server.submitTransaction(transaction);

      // Store user account details
      await this.storeUserAccount(userId, userKeypair);

      logger.info("Blockchain account created for user", {
        userId,
        publicKey: userKeypair.publicKey(),
      });

      return userKeypair;
    } catch (error) {
      logger.error("Failed to create user account:", error);
      throw error;
    }
  }

  // Get existing user account
  private async getUserAccount(userId: string): Promise<Keypair | null> {
    try {
      const result = await db.query(
        `
        SELECT blockchain_wallet_address, private_key_encrypted
        FROM users
        WHERE id = $1 AND blockchain_wallet_address IS NOT NULL
      `,
        [userId],
      );

      if (result.rows.length === 0) {
        return null;
      }

      // In production, decrypt the private key securely
      // For demo, we'll generate a keypair from the stored address
      const userData = result.rows[0];

      // This is a simplified approach - in production, use proper key management
      return Keypair.random(); // Placeholder
    } catch (error) {
      logger.error("Failed to get user account:", error);
      return null;
    }
  }

  // Store user account details securely
  private async storeUserAccount(
    userId: string,
    keypair: Keypair,
  ): Promise<void> {
    try {
      // In production, encrypt the private key before storing
      await db.query(
        `
        UPDATE users
        SET blockchain_wallet_address = $1, metadata = metadata || $2
        WHERE id = $3
      `,
        [
          keypair.publicKey(),
          JSON.stringify({
            blockchainNetwork: config.blockchain.stellar.network,
            accountCreatedAt: new Date().toISOString(),
          }),
          userId,
        ],
      );
    } catch (error) {
      logger.error("Failed to store user account:", error);
      throw error;
    }
  }

  // Store contract details
  private async storeContractDetails(
    contractAddress: string,
    details: any,
  ): Promise<void> {
    try {
      await db.query(
        `
        INSERT INTO job_queue (job_type, job_data, status)
        VALUES ('store_contract', $1, 'completed')
      `,
        [JSON.stringify({ contractAddress, ...details })],
      );
    } catch (error) {
      logger.error("Failed to store contract details:", error);
    }
  }

  // Get contract details
  private async getContractDetails(contractAddress: string): Promise<any> {
    try {
      const result = await db.query(
        `
        SELECT job_data
        FROM job_queue
        WHERE job_type = 'store_contract'
          AND job_data->>'contractAddress' = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
        [contractAddress],
      );

      if (result.rows.length > 0) {
        return JSON.parse(result.rows[0].job_data);
      }

      return null;
    } catch (error) {
      logger.error("Failed to get contract details:", error);
      return null;
    }
  }

  // Get account balance
  async getAccountBalance(
    userId: string,
    assetCode?: string,
  ): Promise<{
    balances: Array<{
      asset: string;
      balance: string;
    }>;
  }> {
    try {
      const userAccount = await this.getUserAccount(userId);

      if (!userAccount) {
        return { balances: [] };
      }

      const account = await this.server.loadAccount(userAccount.publicKey());

  //    const balances = account.balances.map((balance) => ({
   //     asset:
    //      balance.asset_type === "native"
     //       ? "XLM"
     //       : `${balance.asset_code}:${balance.asset_issuer}`,
    //    balance: balance.balance,
  //    }));

 //     return { balances };
    } catch (error) {
      logger.error("Failed to get account balance:", error);
      return { balances: [] };
    }
  }

  // Get transaction history
  async getTransactionHistory(
    userId: string,
    limit: number = 10,
  ): Promise<any[]> {
    try {
      const userAccount = await this.getUserAccount(userId);

      if (!userAccount) {
        return [];
      }

      const transactions = await this.server
        .transactions()
        .forAccount(userAccount.publicKey())
        .limit(limit)
        .order("desc")
        .call();

      return transactions.records.map((tx) => ({
        id: tx.id,
        hash: tx.hash,
        ledger: tx.ledger_attr,
        created_at: tx.created_at,
        operation_count: tx.operation_count,
        memo: tx.memo,
      }));
    } catch (error) {
      logger.error("Failed to get transaction history:", error);
      return [];
    }
  }
}

// Create singleton instance
export const blockchainService = new BlockchainService();

// Export convenience functions
export const generateNFTCertificate = async (data: NFTCertificateData) => {
  return await blockchainService.generateNFTCertificate(data);
};

export const issueCarbonCredits = async (data: CarbonCreditToken) => {
  return await blockchainService.issueCarbonCredits(data);
};

export const createDroughtInsuranceContract = async (
  farmerId: string,
  premiumAmount: number,
  coverageAmount: number,
  rainfallThreshold: number,
) => {
  return await blockchainService.createDroughtInsuranceContract(
    farmerId,
    premiumAmount,
    coverageAmount,
    rainfallThreshold,
  );
};

export default blockchainService;
