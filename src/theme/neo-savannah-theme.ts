export const NEO_SAVANNAH_THEME = {
  colors: {
    // Cyber-Savannah Color Palette
    earthy: {
      primary: "#CD853F", // Sunburnt orange
      secondary: "#A0522D", // Deep terracotta
      tertiary: "#8B7355", // Khaki
    },
    neon: {
      amber: "#FFB000", // Electric amber
      green: "#00FF9F", // Holographic green
      blue: "#00D4FF", // Glowing blue
      purple: "#B048FF", // Digital purple
      pink: "#FF0080", // Hot pink accent
    },
    metallic: {
      brass: "#B5651D",
      copper: "#B87333",
      chrome: "#C0C0C0",
      black: "#0D0D0D",
    },
    cyberpunk: {
      grid: "#00FF9F33", // Transparent green for grids
      glow: "#00D4FF80", // Blue glow overlay
      scan: "#FFB00050", // Amber scanlines
      error: "#FF0080", // Hot pink errors
    },
  },

  typography: {
    futuristic: {
      heading: "Orbitron, 'Space Grotesk', monospace",
      body: "Inter, 'Space Grotesk', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
  },

  effects: {
    glitch: {
      duration: "0.3s",
      intensity: "2px",
    },
    hologram: {
      shimmer: "0 0 20px currentColor",
      pulse: "0 0 40px currentColor",
    },
    scanlines: {
      speed: "2s",
      opacity: "0.1",
    },
    cyborgrid: {
      size: "20px",
      opacity: "0.05",
    },
  },

  // AI Market Guide - Virtual Shaman
  aiGuide: {
    name: "Mzee Cyber",
    avatar: "🦾🧙🏿‍♂️",
    personality: "Futuristic Maasai elder",
    voice: {
      greeting: "Jambo, digital warrior! Welcome to Neo-Savannah.",
      search: "Show me what your digital eyes seek...",
      purchase: "Initiating quantum exchange protocols...",
      error: "The digital spirits are restless. Please try again.",
    },
  },

  // Crypto Economy
  currency: {
    mbogaCoin: {
      symbol: "🌽⚡",
      name: "Mboga Coin",
      decimals: 8,
      color: "#00FF9F",
    },
    pridePoints: {
      symbol: "🦁✨",
      name: "Pride Points",
      multiplier: 100,
      color: "#FFB000",
    },
  },

  // Gamification Elements
  gamification: {
    badges: {
      "cyber-hunter": {
        icon: "🎯🦾",
        name: "Cyber Hunter",
        description: "Found 10 rare digital artifacts",
        glow: "#00FF9F",
      },
      "quantum-trader": {
        icon: "⚛️💎",
        name: "Quantum Trader",
        description: "Completed 100 smart contract trades",
        glow: "#00D4FF",
      },
      "neo-chief": {
        icon: "👑🖥️",
        name: "Neo Chief",
        description: "Built a thriving digital tribe",
        glow: "#B048FF",
      },
    },
    achievements: {
      "first-ar-scan": "Activated your cyber-eyes",
      "crypto-payment": "Embraced the digital currency",
      "ai-conversation": "Spoke with the digital ancestors",
    },
  },

  // AR/VR Elements
  ar: {
    markers: {
      product: "📦🔮",
      shop: "🏪✨",
      vendor: "👤💫",
    },
    effects: {
      materialize: "fade-in + particle-burst",
      dematerialize: "glitch-out + fade",
      hover: "hologram-glow + float",
    },
  },

  // 3D Environment Settings
  environment: {
    savanna: {
      lowPoly: true,
      wireframe: false,
      particles: true,
      fog: {
        color: "#1a1a2e",
        density: 0.1,
      },
    },
    lighting: {
      ambient: "#001122",
      directional: "#FFB000",
      neon: "#00FF9F",
    },
    timeOfDay: {
      cyberdawn: "linear-gradient(135deg, #FF6B35, #00FF9F, #00D4FF)",
      digitalmidday: "linear-gradient(135deg, #00D4FF, #B048FF, #FFB000)",
      neondusk: "linear-gradient(135deg, #B048FF, #FF0080, #FFB000)",
      quantumnight: "linear-gradient(135deg, #0D0D0D, #1a1a2e, #00FF9F)",
    },
  },

  // Audio Library
  audio: {
    cyberpunk: {
      ambient: [
        "/sounds/neo-savannah-ambient.mp3",
        "/sounds/digital-wind.mp3",
        "/sounds/cyber-crickets.mp3",
      ],
      interactions: {
        button_hover: "/sounds/cyber-beep.mp3",
        button_click: "/sounds/digital-click.mp3",
        purchase: "/sounds/quantum-transaction.mp3",
        notification: "/sounds/hologram-ping.mp3",
        error: "/sounds/glitch-static.mp3",
      },
      wildlife: {
        cyber_lion: "/sounds/digital-roar.mp3",
        robo_elephant: "/sounds/mech-trumpet.mp3",
        quantum_gazelle: "/sounds/synthetic-hop.mp3",
      },
    },
  },

  // Smart Contract Visualizations
  blockchain: {
    visualization: {
      transaction: "particle-stream",
      block: "crystalline-cube",
      network: "neural-web",
      mining: "energy-surge",
    },
    colors: {
      confirmed: "#00FF9F",
      pending: "#FFB000",
      failed: "#FF0080",
      mining: "#00D4FF",
    },
  },

  // Wildlife NFT Metaphors
  nftWildlife: {
    lions: {
      traits: ["Leadership", "Strength", "Digital Wisdom"],
      rarity: "Legendary",
      abilities: ["Pack Formation", "Territory Control", "Roar Broadcast"],
    },
    elephants: {
      traits: ["Memory", "Blockchain Storage", "Network Stability"],
      rarity: "Epic",
      abilities: ["Data Archival", "Trunk Transactions", "Herd Protection"],
    },
    cheetahs: {
      traits: ["Speed", "Lightning Transactions", "Quick Delivery"],
      rarity: "Rare",
      abilities: ["Instant Transfer", "Sprint Mode", "Precision Hunting"],
    },
    rhinos: {
      traits: ["Security", "Unstoppable Force", "Defense Protocols"],
      rarity: "Epic",
      abilities: ["Charge Attack", "Armor Plating", "Fortress Mode"],
    },
  },
};

// CSS-in-JS styles for Neo-Savannah
export const NEO_SAVANNAH_STYLES = {
  glitchText: `
    @keyframes glitch {
      0% { transform: translateX(0); }
      20% { transform: translateX(-2px); }
      40% { transform: translateX(2px); }
      60% { transform: translateX(-2px); }
      80% { transform: translateX(2px); }
      100% { transform: translateX(0); }
    }
    
    .glitch-text {
      animation: glitch 0.3s ease-in-out infinite;
      text-shadow: 
        2px 0 #00FF9F,
        -2px 0 #FF0080,
        0 2px #FFB000;
    }
  `,

  hologramEffect: `
    @keyframes hologram {
      0%, 100% { 
        opacity: 0.8; 
        transform: translateY(0px);
        filter: hue-rotate(0deg);
      }
      50% { 
        opacity: 1; 
        transform: translateY(-2px);
        filter: hue-rotate(90deg);
      }
    }
    
    .hologram {
      animation: hologram 2s ease-in-out infinite;
      background: linear-gradient(45deg, transparent 30%, rgba(0, 255, 159, 0.1) 50%, transparent 70%);
      box-shadow: 
        0 0 20px rgba(0, 255, 159, 0.3),
        inset 0 0 20px rgba(0, 255, 159, 0.1);
    }
  `,

  scanlines: `
    @keyframes scanlines {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    
    .scanlines::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00FF9F, transparent);
      animation: scanlines 2s linear infinite;
      z-index: 1000;
      pointer-events: none;
    }
  `,

  cyberGrid: `
    .cyber-grid {
      background-image: 
        linear-gradient(rgba(0, 255, 159, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 159, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
      position: relative;
    }
    
    .cyber-grid::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, transparent 0%, rgba(13, 13, 13, 0.8) 100%);
      pointer-events: none;
    }
  `,

  neonButton: `
    .neon-button {
      background: linear-gradient(45deg, #00FF9F, #00D4FF);
      border: 2px solid #00FF9F;
      color: #0D0D0D;
      text-shadow: 0 0 10px currentColor;
      box-shadow: 
        0 0 20px rgba(0, 255, 159, 0.5),
        inset 0 0 20px rgba(0, 212, 255, 0.2);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .neon-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
    
    .neon-button:hover::before {
      left: 100%;
    }
    
    .neon-button:hover {
      box-shadow: 
        0 0 30px rgba(0, 255, 159, 0.8),
        inset 0 0 30px rgba(0, 212, 255, 0.3);
      transform: translateY(-2px);
    }
  `,
};

export type NeoSavannahTheme = typeof NEO_SAVANNAH_THEME;
export type ThemeMode =
  | "cyberdawn"
  | "digitalmidday"
  | "neondusk"
  | "quantumnight";
