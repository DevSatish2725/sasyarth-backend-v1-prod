import { logger } from "../config/logger";
import {
  VEGETABLE_CATEGORIES,
  VEGETABLE_UNITS,
} from "../modules/vegetable/vegetable.constants";
import { CreateVegetableDto } from "../modules/vegetable/vegetable.dto";
import { Vegetable } from "../modules/vegetable/vegetable.model";

export const vegetableSeeds: CreateVegetableDto[] = [
  {
    name: "Tomato",

    displayNames: {
      en: "Tomato",
      hi: "टमाटर",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

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

    defaultUnit: VEGETABLE_UNITS.KG,

    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Onion",

    displayNames: {
      en: "Onion",
      hi: "प्याज़",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

    defaultUnit: VEGETABLE_UNITS.KG,

    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Cabbage",

    displayNames: {
      en: "Cabbage",
      hi: "पत्तागोभी",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

    defaultUnit: VEGETABLE_UNITS.KG,

    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Cauliflower",

    displayNames: {
      en: "Cauliflower",
      hi: "फूलगोभी",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

    defaultUnit: VEGETABLE_UNITS.KG,

    allowedUnits: [VEGETABLE_UNITS.KG, VEGETABLE_UNITS.PIECE],
  },

  {
    name: "Carrot",

    displayNames: {
      en: "Carrot",
      hi: "गाजर",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

    defaultUnit: VEGETABLE_UNITS.KG,

    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Brinjal",

    displayNames: {
      en: "Brinjal",
      hi: "बैंगन",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

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

    defaultUnit: VEGETABLE_UNITS.KG,

    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Peas",

    displayNames: {
      en: "Peas",
      hi: "मटर",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

    defaultUnit: VEGETABLE_UNITS.KG,

    allowedUnits: [VEGETABLE_UNITS.KG],
  },

  {
    name: "Spinach",

    displayNames: {
      en: "Spinach",
      hi: "पालक",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

    defaultUnit: VEGETABLE_UNITS.BUNDLE,

    allowedUnits: [VEGETABLE_UNITS.BUNDLE, VEGETABLE_UNITS.KG],
  },

  {
    name: "Coriander",

    displayNames: {
      en: "Coriander",
      hi: "धनिया",
    },

    category: VEGETABLE_CATEGORIES.VEGETABLE,

    defaultUnit: VEGETABLE_UNITS.BUNDLE,

    allowedUnits: [VEGETABLE_UNITS.BUNDLE, VEGETABLE_UNITS.KG],
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
