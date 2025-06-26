export const WILDLIFE_METAPHORS = {
  users: {
    retailer: {
      animal: "🦌", // Gazelle
      name: "Gazelle",
      description: "Agile retailers who survive on volume and quick moves",
      traits: ["Speed", "Agility", "Volume-focused"],
      sound: "/sounds/gazelle.mp3",
    },
    supplier: {
      animal: "🐘", // Elephant
      name: "Elephant",
      description: "Powerhouse suppliers with long memory and strong networks",
      traits: ["Memory", "Strength", "Reliability"],
      sound: "/sounds/elephant.mp3",
    },
    driver: {
      animal: "🐆", // Cheetah
      name: "Cheetah",
      description: "Lightning-fast delivery specialists",
      traits: ["Speed", "Precision", "Efficiency"],
      sound: "/sounds/cheetah.mp3",
    },
    admin: {
      animal: "🦁", // Lion
      name: "Lion",
      description: "Pride leaders who oversee the entire ecosystem",
      traits: ["Leadership", "Wisdom", "Authority"],
      sound: "/sounds/lion.mp3",
    },
  },

  systems: {
    fraud_detection: {
      name: "Vulture Watch",
      icon: "🦅",
      description:
        "AI-powered fraud detection that never misses suspicious activity",
    },
    database: {
      name: "Baobab Roots",
      icon: "🌳",
      description: "Deep, stable, interconnected data infrastructure",
    },
    routing: {
      name: "Antelope Paths",
      icon: "🛤️",
      description: "Optimized delivery routes through the digital savanna",
    },
    payments: {
      name: "Rhino Charge",
      icon: "🦏",
      description:
        "Unstoppable M-Pesa payment processing with brute-force resilience",
    },
  },

  gamification: {
    points: "Pride Points",
    challenges: {
      seasonal: "Great Migration Challenge",
      referral: "Build Your Herd",
      sales: "Watering Hole Visits",
    },
    badges: {
      supplier_top: "Lion Partner",
      driver_elite: "Cheetah Elite",
      retailer_volume: "Herd Leader",
      newcomer: "Young Cub",
    },
  },
};

export const SWAHILI_PROVERBS = {
  patience: {
    swahili: "Haraka haraka haina baraka",
    english: "Hurry hurry has no blessings",
    usage: "BNPL repayment reminders, processing delays",
  },
  cooperation: {
    swahili: "Mkono moja haulei mwana",
    english: "One hand can't raise a child",
    usage: "Group buying CTAs, partnership invitations",
  },
  perseverance: {
    swahili: "Mti ukigwa, watu wanapasuka kuni",
    english: "When a tree falls, people rush to cut firewood",
    usage: "Opportunity alerts, flash sales",
  },
  unity: {
    swahili: "Umoja ni nguvu, utengano ni udhaifu",
    english: "Unity is strength, division is weakness",
    usage: "Community features, group buying",
  },
};

export const SAVANNAH_ANIMATIONS = {
  loading: {
    migration: "Wildebeest migration progress bars",
    waterhole: "Waterhole filling animation",
    hunt: "Predator stalking progress",
  },
  success: {
    roar: "Lion roar with paw print trail",
    flight: "Eagle soaring celebration",
    watering: "Animals gathering at waterhole",
  },
  error: {
    hyena: "Hyena stole your page",
    drought: "Drought mode activation",
    stampede: "Network congestion",
  },
};

export const AUDIO_LIBRARY = {
  interactions: {
    success_order: "/sounds/lion-roar.mp3",
    button_click: "/sounds/soft-click.mp3",
    notification: "/sounds/bird-call.mp3",
    error: "/sounds/hyena-laugh.mp3",
    payment_success: "/sounds/water-drop.mp3",
  },
  ambient: {
    savanna_breeze: "/sounds/savanna-wind.mp3",
    distant_thunder: "/sounds/thunder-far.mp3",
  },
};

export const SAVANNAH_COLORS = {
  dawn: {
    primary: "#FF6B35", // Sunrise orange
    secondary: "#F7B801", // Golden hour
    accent: "#4ECDC4", // Morning sky
  },
  midday: {
    primary: "#2E8B57", // Deep savanna green
    secondary: "#E2725B", // Terracotta earth
    accent: "#FFD700", // Bright sun
  },
  dusk: {
    primary: "#8B4513", // Rich earth brown
    secondary: "#CD853F", // Sandy brown
    accent: "#FF4500", // Sunset red
  },
  night: {
    primary: "#2F4F4F", // Dark slate
    secondary: "#696969", // Dim gray
    accent: "#F0E68C", // Moonlight khaki
  },
};

export const CRISIS_MODE = {
  drought: {
    trigger: "Poor connectivity detected",
    actions: [
      "Enable USSD fallback",
      "Reduce image quality",
      "Cache critical data",
    ],
    ui: "Minimal UI with earth tones",
  },
  stampede: {
    trigger: "High traffic/server load",
    actions: ["Queue management", "Load balancing", "Priority routing"],
    ui: "Calm users with steady progress indicators",
  },
  predator: {
    trigger: "Security threat detected",
    actions: [
      "Enhanced authentication",
      "Transaction monitoring",
      "IP blocking",
    ],
    ui: "Subtle security warnings without panic",
  },
};

export type UserRole = keyof typeof WILDLIFE_METAPHORS.users;
export type SystemType = keyof typeof WILDLIFE_METAPHORS.systems;
