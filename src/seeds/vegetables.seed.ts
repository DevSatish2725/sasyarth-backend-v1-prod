import { logger } from "../config/logger";
import {
  VEGETABLE_CATEGORIES,
  VEGETABLE_UNITS,
} from "../modules/vegetable/vegetable.constants";
import { CreateVegetableDto } from "../modules/vegetable/vegetable.dto";
import { Vegetable } from "../modules/vegetable/vegetable.model";

export const vegetableSeeds: CreateVegetableDto[] = [
  // ============================================================
  // COMMON VEGETABLES
  // ============================================================

  {
    name: "Tomato",
    displayNames: {
      en: "Tomato",
      hi: "टमाटर",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["tamatar"],
    imageUrl: "/images/vegetables/tomato.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Potato",
    displayNames: {
      en: "Potato",
      hi: "आलू",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["aloo", "alu"],
    imageUrl: "/images/vegetables/potato.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Onion",
    displayNames: {
      en: "Onion",
      hi: "प्याज",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["pyaz", "pyaaz", "piyaz"],
    imageUrl: "/images/vegetables/onion.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Garlic",
    displayNames: {
      en: "Garlic",
      hi: "लहसुन",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["lahsun", "lehsun", "lasun"],
    imageUrl: "/images/vegetables/garlic.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Ginger",
    displayNames: {
      en: "Ginger",
      hi: "अदरक",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["adrak", "adarak"],
    imageUrl: "/images/vegetables/ginger.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Green Chilli",
    displayNames: {
      en: "Green Chilli",
      hi: "हरी मिर्च",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: [
      "hari mirch",
      "hari mirchi",
      "mirch",
      "mirchi",
      "green chili",
    ],
    imageUrl: "/images/vegetables/green-chilli.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Lemon",
    displayNames: {
      en: "Lemon",
      hi: "नींबू",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["nimbu", "neembu", "nimboo"],
    imageUrl: "/images/vegetables/lemon.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  // ============================================================
  // ROOT VEGETABLES
  // ============================================================

  {
    name: "Carrot",
    displayNames: {
      en: "Carrot",
      hi: "गाजर",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["gajar", "gaajar"],
    imageUrl: "/images/vegetables/carrot.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Radish",
    displayNames: {
      en: "Radish",
      hi: "मूली",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["mooli", "muli"],
    imageUrl: "/images/vegetables/radish.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Beetroot",
    displayNames: {
      en: "Beetroot",
      hi: "चुकंदर",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["chukandar", "chakundar", "beet"],
    imageUrl: "/images/vegetables/beetroot.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Turnip",
    displayNames: {
      en: "Turnip",
      hi: "शलजम",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["shalgam", "shaljam"],
    imageUrl: "/images/vegetables/turnip.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Taro Root",
    displayNames: {
      en: "Taro Root",
      hi: "अरबी",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["arbi", "arvi", "arabi", "taro", "colocasia"],
    imageUrl: "/images/vegetables/taro-root.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Sweet Potato",
    displayNames: {
      en: "Sweet Potato",
      hi: "शकरकंद",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["shakarkand", "shakarkandi", "sweetpotato"],
    imageUrl: "/images/vegetables/sweet-potato.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Yam",
    displayNames: {
      en: "Yam",
      hi: "जिमीकंद",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["jimikand", "jim kand", "suran", "sooran"],
    imageUrl: "/images/vegetables/yam.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  // ============================================================
  // GOURDS
  // ============================================================

  {
    name: "Bottle Gourd",
    displayNames: {
      en: "Bottle Gourd",
      hi: "लौकी",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["lauki", "loki", "ghiya", "ghia", "dudhi"],
    imageUrl: "/images/vegetables/bottle-gourd.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Ridge Gourd",
    displayNames: {
      en: "Ridge Gourd",
      hi: "तोरई",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["tori", "torai", "turai", "torei"],
    imageUrl: "/images/vegetables/ridge-gourd.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Sponge Gourd",
    displayNames: {
      en: "Sponge Gourd",
      hi: "घीया तोरई",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["ghiya tori", "ghiya torai", "gilki", "gिलकी"],
    imageUrl: "/images/vegetables/sponge-gourd.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Bitter Gourd",
    displayNames: {
      en: "Bitter Gourd",
      hi: "करेला",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["karela", "bitter melon"],
    imageUrl: "/images/vegetables/bitter-gourd.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Pointed Gourd",
    displayNames: {
      en: "Pointed Gourd",
      hi: "परवल",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["parwal", "parval", "parbal"],
    imageUrl: "/images/vegetables/pointed-gourd.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Ivy Gourd",
    displayNames: {
      en: "Ivy Gourd",
      hi: "कुंदरू",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["kundru", "kundroo", "kunduri", "tindora"],
    imageUrl: "/images/vegetables/ivy-gourd.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Pumpkin",
    displayNames: {
      en: "Pumpkin",
      hi: "कद्दू",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["kaddu", "kaddoo"],
    imageUrl: "/images/vegetables/pumpkin.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  // ============================================================
  // LEAFY VEGETABLES
  // ============================================================

  {
    name: "Spinach",
    displayNames: {
      en: "Spinach",
      hi: "पालक",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["palak"],
    imageUrl: "/images/vegetables/spinach.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Fenugreek Leaves",
    displayNames: {
      en: "Fenugreek Leaves",
      hi: "मेथी",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["methi", "methi leaves", "fenugreek"],
    imageUrl: "/images/vegetables/fenugreek-leaves.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Coriander",
    displayNames: {
      en: "Coriander",
      hi: "धनिया",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["dhaniya", "dhania", "coriander leaves", "cilantro"],
    imageUrl: "/images/vegetables/coriander.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Mint",
    displayNames: {
      en: "Mint",
      hi: "पुदीना",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["pudina", "podina", "mint leaves"],
    imageUrl: "/images/vegetables/mint.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Dill",
    displayNames: {
      en: "Dill",
      hi: "सोया",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["soya", "soa", "sowa", "dill leaves"],
    imageUrl: "/images/vegetables/dill.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Mustard Greens",
    displayNames: {
      en: "Mustard Greens",
      hi: "सरसों का साग",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["sarson", "sarson ka saag", "sarson saag", "sarso"],
    imageUrl: "/images/vegetables/mustard-greens.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Bathua",
    displayNames: {
      en: "Bathua",
      hi: "बथुआ",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["bathuwa", "bathua saag", "chenopodium"],
    imageUrl: "/images/vegetables/bathua.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Curry Leaves",
    displayNames: {
      en: "Curry Leaves",
      hi: "करी पत्ता",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["curry patta", "kari patta", "kadi patta"],
    imageUrl: "/images/vegetables/curry-leaves.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  // ============================================================
  // BEANS / PODS
  // ============================================================

  {
    name: "Peas",
    displayNames: {
      en: "Peas",
      hi: "मटर",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["matar", "matter", "green peas"],
    imageUrl: "/images/vegetables/peas.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Green Beans",
    displayNames: {
      en: "Green Beans",
      hi: "फ्रेंच बीन्स",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["beans", "bean", "french beans", "green bean"],
    imageUrl: "/images/vegetables/green-beans.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Hyacinth Beans",
    displayNames: {
      en: "Hyacinth Beans",
      hi: "सेम",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["sem", "sem ki phali", "sem phali", "flat beans"],
    imageUrl: "/images/vegetables/hyacinth-beans.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Cluster Beans",
    displayNames: {
      en: "Cluster Beans",
      hi: "ग्वार फली",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["guar", "gwar", "guar phali", "gwar phali"],
    imageUrl: "/images/vegetables/cluster-beans.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Broad Beans",
    displayNames: {
      en: "Broad Beans",
      hi: "बाकला",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["bakla", "fava beans", "faba beans"],
    imageUrl: "/images/vegetables/broad-beans.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  // ============================================================
  // OTHER COMMON VEGETABLES
  // ============================================================

  {
    name: "Brinjal",
    displayNames: {
      en: "Brinjal",
      hi: "बैंगन",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["baingan", "baigan", "eggplant", "aubergine"],
    imageUrl: "/images/vegetables/brinjal.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Lady Finger",
    displayNames: {
      en: "Lady Finger",
      hi: "भिंडी",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["bhindi", "bhendi", "okra", "ladyfinger"],
    imageUrl: "/images/vegetables/lady-finger.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Cucumber",
    displayNames: {
      en: "Cucumber",
      hi: "खीरा",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["kheera", "khira", "kheera kakdi"],
    imageUrl: "/images/vegetables/cucumber.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Capsicum",
    displayNames: {
      en: "Capsicum",
      hi: "शिमला मिर्च",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["shimla mirch", "bell pepper", "green capsicum"],
    imageUrl: "/images/vegetables/capsicum.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Cabbage",
    displayNames: {
      en: "Cabbage",
      hi: "पत्ता गोभी",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["patta gobhi", "patta gobi", "band gobhi", "band gobi"],
    imageUrl: "/images/vegetables/cabbage.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Cauliflower",
    displayNames: {
      en: "Cauliflower",
      hi: "फूल गोभी",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: [
      "phool gobhi",
      "phool gobi",
      "phoolgobhi",
      "ful gobhi",
      "gobhi",
      "gobi",
    ],
    imageUrl: "/images/vegetables/cauliflower.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Broccoli",
    displayNames: {
      en: "Broccoli",
      hi: "ब्रोकली",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["brokli", "brocoli", "brokoli"],
    imageUrl: "/images/vegetables/broccoli.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Mushroom",
    displayNames: {
      en: "Mushroom",
      hi: "मशरूम",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["mashroom", "mushrooms"],
    imageUrl: "/images/vegetables/mushroom.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Spring Onion",
    displayNames: {
      en: "Spring Onion",
      hi: "हरा प्याज",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: [
      "hara pyaz",
      "hara pyaaz",
      "green onion",
      "onion leaves",
      "spring onions",
    ],
    imageUrl: "/images/vegetables/spring-onion.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.BUNDLE],
  },

  {
    name: "Corn",
    displayNames: {
      en: "Corn",
      hi: "मक्का",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["makka", "bhutta", "bhutta", "sweet corn", "maize"],
    imageUrl: "/images/vegetables/corn.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Drumstick",
    displayNames: {
      en: "Drumstick",
      hi: "सहजन",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: [
      "sahjan",
      "sehjan",
      "sahajan",
      "moringa",
      "drumstick vegetable",
    ],
    imageUrl: "/images/vegetables/drumstick.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Raw Banana",
    displayNames: {
      en: "Raw Banana",
      hi: "कच्चा केला",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: [
      "kaccha kela",
      "kachha kela",
      "kacha kela",
      "green banana",
      "raw plantain",
    ],
    imageUrl: "/images/vegetables/raw-banana.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Raw Papaya",
    displayNames: {
      en: "Raw Papaya",
      hi: "कच्चा पपीता",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: [
      "kaccha papita",
      "kachha papita",
      "kacha papita",
      "kaccha papaya",
      "green papaya",
      "papita",
    ],
    imageUrl: "/images/vegetables/raw-papaya.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Jackfruit",
    displayNames: {
      en: "Jackfruit",
      hi: "कटहल",
    },
    category: VEGETABLE_CATEGORIES.VEGETABLE,
    searchAliases: ["kathal", "katal", "jack fruit", "raw jackfruit"],
    imageUrl: "/images/vegetables/jackfruit.webp",
    defaultUnit: VEGETABLE_UNITS.KG,
    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },
];

export const seedVegetables = async () => {
  for (const vegetable of vegetableSeeds) {
    const existingVegetable = await Vegetable.findOne({
      name: vegetable.name,
    });

    if (existingVegetable) {
      logger.info(`Vegetable already exists: ${vegetable.name}`);
      continue;
    }

    await Vegetable.create(vegetable);
    logger.info(`Vegetable created: ${vegetable.name}`);
  }
};
