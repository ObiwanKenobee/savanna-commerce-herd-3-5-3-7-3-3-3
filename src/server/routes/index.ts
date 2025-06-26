import { Application } from "express";
import { authRoutes } from "./auth";
// import { userRoutes } from "./users";
import { lionLoyaltyRoutes } from "./lionLoyalty";
// import { ecoDigitalTwinsRoutes } from "./ecoDigitalTwins";
// import { codeSchoolRoutes } from "./codeSchool";
// import { indigenousKnowledgeRoutes } from "./indigenousKnowledge";
// import { chiefSystemRoutes } from "./chiefSystem";
// import { carbonCreditRoutes } from "./carbonCredit";
// import { wildlifeWalletRoutes } from "./wildlifeWallet";
// import { crisisOpportunityRoutes } from "./crisisOpportunity";
// import { ussdRoutes } from "./ussd";
// import { blockchainRoutes } from "./blockchain";
// import { notificationRoutes } from "./notifications";
// import { analyticsRoutes } from "./analytics";
// import { fileUploadRoutes } from "./fileUpload";

export const setupRoutes = (app: Application): void => {
  // API base path
  const apiBase = "/api/v1";

  // Core system routes
  app.use(`${apiBase}/auth`, authRoutes);
 // app.use(`${apiBase}/users`, userRoutes);
  // app.use(`${apiBase}/notifications`, notificationRoutes);
  // app.use(`${apiBase}/analytics`, analyticsRoutes);
  // app.use(`${apiBase}/files`, fileUploadRoutes);

  // Consumer-to-Ecosystem (C2E) routes
  app.use(`${apiBase}/lion-loyalty`, lionLoyaltyRoutes);
  // app.use(`${apiBase}/eco-digital-twins`, ecoDigitalTwinsRoutes);

  // Education-to-Enterprise (E2E) routes
  // app.use(`${apiBase}/code-school`, codeSchoolRoutes);
  // app.use(`${apiBase}/indigenous-knowledge`, indigenousKnowledgeRoutes);

  // Government-to-Grassroots (G2G) routes
  // app.use(`${apiBase}/chief-system`, chiefSystemRoutes);
  // app.use(`${apiBase}/carbon-credit`, carbonCreditRoutes);

  // Wildlife-to-Wallet (W2W) routes
  // app.use(`${apiBase}/wildlife-wallet`, wildlifeWalletRoutes);

  // Crisis-to-Opportunity (C2O) routes
  // app.use(`${apiBase}/crisis-opportunity`, crisisOpportunityRoutes);

  // Integration routes
  // app.use(`${apiBase}/ussd`, ussdRoutes);
  // app.use(`${apiBase}/blockchain`, blockchainRoutes);
};
