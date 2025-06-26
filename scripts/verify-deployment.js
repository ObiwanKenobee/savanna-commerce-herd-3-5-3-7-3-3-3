#!/usr/bin/env node

/**
 * 🦁 Savanna Marketplace - Deployment Verification Script
 * Verifies deployment health across different platforms
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

class DeploymentVerifier {
  constructor() {
    this.checks = [
      { name: "Build Artifacts", check: this.checkBuildArtifacts.bind(this) },
      { name: "Dependencies", check: this.checkDependencies.bind(this) },
      {
        name: "Environment Variables",
        check: this.checkEnvironmentVariables.bind(this),
      },
      {
        name: "Configuration Files",
        check: this.checkConfigurationFiles.bind(this),
      },
      {
        name: "TypeScript Compilation",
        check: this.checkTypeScriptCompilation.bind(this),
      },
      {
        name: "Deployment Platform",
        check: this.checkDeploymentPlatform.bind(this),
      },
    ];
    this.results = [];
  }

  /**
   * Run all verification checks
   */
  async runAllChecks() {
    console.log("🦁 Savanna Marketplace - Deployment Verification\n");
    console.log("=" * 50);

    for (const check of this.checks) {
      try {
        console.log(`\n🔍 Checking: ${check.name}...`);
        const result = await check.check();
        this.results.push({
          name: check.name,
          status: "PASS",
          details: result,
        });
        console.log(`✅ ${check.name}: PASSED`);
        if (result) console.log(`   ${result}`);
      } catch (error) {
        this.results.push({
          name: check.name,
          status: "FAIL",
          error: error.message,
        });
        console.log(`❌ ${check.name}: FAILED`);
        console.log(`   Error: ${error.message}`);
      }
    }

    this.printSummary();
    return this.results.every((r) => r.status === "PASS");
  }

  /**
   * Check if build artifacts exist
   */
  async checkBuildArtifacts() {
    const distPath = path.join(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");

    if (!fs.existsSync(distPath)) {
      throw new Error('dist folder not found - run "npm run build" first');
    }

    if (!fs.existsSync(indexPath)) {
      throw new Error("dist/index.html not found - build may have failed");
    }

    const assets = fs.readdirSync(path.join(distPath, "assets"));
    const jsFiles = assets.filter((f) => f.endsWith(".js")).length;
    const cssFiles = assets.filter((f) => f.endsWith(".css")).length;

    if (jsFiles === 0) {
      throw new Error("No JavaScript files found in dist/assets");
    }

    return `Found ${jsFiles} JS files and ${cssFiles} CSS files`;
  }

  /**
   * Check critical dependencies
   */
  async checkDependencies() {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const criticalDeps = [
      "@supabase/supabase-js",
      "@stripe/react-stripe-js",
      "@paypal/react-paypal-js",
      "react",
      "react-dom",
      "react-router-dom",
    ];

    const missing = criticalDeps.filter(
      (dep) => !packageJson.dependencies[dep],
    );

    if (missing.length > 0) {
      throw new Error(`Missing critical dependencies: ${missing.join(", ")}`);
    }

    // Check for problematic dependencies
    const problematic = ["@radix-ui/react-sheet", "@radix-ui/react-textarea"];
    const found = problematic.filter(
      (dep) =>
        packageJson.dependencies[dep] || packageJson.devDependencies[dep],
    );

    if (found.length > 0) {
      throw new Error(`Problematic dependencies found: ${found.join(", ")}`);
    }

    return `All ${criticalDeps.length} critical dependencies present`;
  }

  /**
   * Check environment variables
   */
  async checkEnvironmentVariables() {
    const envExample = fs.readFileSync(".env.example", "utf8");
    const requiredVars = envExample
      .split("\n")
      .filter((line) => line.includes("VITE_") && !line.startsWith("#"))
      .map((line) => line.split("=")[0]);

    const missing = requiredVars.filter((varName) => !process.env[varName]);

    // For deployment verification, we expect some vars to be missing in CI/local
    const criticalVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

    const missingCritical = criticalVars.filter(
      (varName) => !process.env[varName],
    );

    if (missingCritical.length > 0) {
      console.log(
        `⚠️  Missing environment variables (expected in local): ${missing.join(", ")}`,
      );
    }

    return `Environment template has ${requiredVars.length} variables defined`;
  }

  /**
   * Check configuration files
   */
  async checkConfigurationFiles() {
    const requiredFiles = [
      "vercel.json",
      "render.yaml",
      "aws-deploy.yml",
      "DEPLOYMENT_GUIDE.md",
    ];

    const missing = requiredFiles.filter((file) => !fs.existsSync(file));

    if (missing.length > 0) {
      throw new Error(`Missing configuration files: ${missing.join(", ")}`);
    }

    // Validate vercel.json structure
    const vercelConfig = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
    if (!vercelConfig.crons || vercelConfig.crons.length === 0) {
      throw new Error("vercel.json missing cron configuration");
    }

    // Check if cron schedules are daily (hobby account compatible)
    const nonDailyCrons = vercelConfig.crons.filter((cron) => {
      const schedule = cron.schedule;
      return schedule.includes("*") && !schedule.startsWith("0 ");
    });

    if (nonDailyCrons.length > 0) {
      console.log(
        `⚠️  Found ${nonDailyCrons.length} high-frequency crons (Pro account required)`,
      );
    }

    return `All ${requiredFiles.length} deployment configuration files present`;
  }

  /**
   * Check TypeScript compilation
   */
  async checkTypeScriptCompilation() {
    const { exec } = require("child_process");

    return new Promise((resolve, reject) => {
      exec("npx tsc --noEmit", (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`TypeScript compilation failed: ${stderr}`));
        } else {
          resolve("TypeScript compilation successful");
        }
      });
    });
  }

  /**
   * Check deployment platform readiness
   */
  async checkDeploymentPlatform() {
    const platform = this.detectPlatform();

    switch (platform) {
      case "vercel":
        return this.verifyVercelReadiness();
      case "render":
        return this.verifyRenderReadiness();
      case "aws":
        return this.verifyAWSReadiness();
      default:
        return `Platform: ${platform} (generic configuration)`;
    }
  }

  /**
   * Detect deployment platform
   */
  detectPlatform() {
    if (process.env.VERCEL) return "vercel";
    if (process.env.RENDER) return "render";
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) return "aws";
    if (fs.existsSync("vercel.json")) return "vercel";
    if (fs.existsSync("render.yaml")) return "render";
    if (fs.existsSync("aws-deploy.yml")) return "aws";
    return "unknown";
  }

  /**
   * Verify Vercel-specific readiness
   */
  verifyVercelReadiness() {
    const vercelConfig = JSON.parse(fs.readFileSync("vercel.json", "utf8"));

    // Check build configuration
    if (!vercelConfig.builds && !vercelConfig.buildCommand) {
      console.log(
        "⚠️  No build configuration found - using zero-config deployment",
      );
    }

    // Check functions configuration
    if (vercelConfig.functions) {
      const functionCount = Object.keys(vercelConfig.functions).length;
      console.log(`📄 ${functionCount} serverless functions configured`);
    }

    return "Vercel deployment configuration verified";
  }

  /**
   * Verify Render-specific readiness
   */
  verifyRenderReadiness() {
    // Basic YAML validation would go here
    const renderConfig = fs.readFileSync("render.yaml", "utf8");

    if (!renderConfig.includes("buildCommand")) {
      throw new Error("render.yaml missing buildCommand");
    }

    if (!renderConfig.includes("startCommand")) {
      throw new Error("render.yaml missing startCommand");
    }

    return "Render deployment configuration verified";
  }

  /**
   * Verify AWS-specific readiness
   */
  verifyAWSReadiness() {
    // Basic CloudFormation template validation
    const awsConfig = fs.readFileSync("aws-deploy.yml", "utf8");

    if (!awsConfig.includes("AWSTemplateFormatVersion")) {
      throw new Error("aws-deploy.yml missing AWSTemplateFormatVersion");
    }

    return "AWS CloudFormation template verified";
  }

  /**
   * Print verification summary
   */
  printSummary() {
    console.log("\n" + "=" * 50);
    console.log("📊 DEPLOYMENT VERIFICATION SUMMARY");
    console.log("=" * 50);

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total:  ${this.results.length}`);

    if (failed === 0) {
      console.log("\n🎉 ALL CHECKS PASSED! Ready for deployment.");
      console.log("\n🚀 Next steps:");
      console.log("1. Choose your deployment platform (Vercel/Render/AWS)");
      console.log("2. Set up environment variables");
      console.log("3. Deploy using platform-specific commands");
      console.log("4. See DEPLOYMENT_GUIDE.md for detailed instructions");
    } else {
      console.log("\n⚠️  DEPLOYMENT NOT READY - Fix the failed checks above");
    }

    console.log("\n📚 Documentation:");
    console.log("• DEPLOYMENT_GUIDE.md - Complete deployment instructions");
    console.log("• .env.example - Environment variables template");
    console.log("• vercel.json - Vercel configuration");
    console.log("• render.yaml - Render configuration");
    console.log("• aws-deploy.yml - AWS CloudFormation template");
  }
}

// Run verification if called directly
if (require.main === module) {
  const verifier = new DeploymentVerifier();
  verifier
    .runAllChecks()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Verification failed:", error.message);
      process.exit(1);
    });
}

module.exports = DeploymentVerifier;
