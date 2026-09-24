import { VegetableCategory, VegetableUnit } from "./vegetable.types";

export interface CreateVegetableDto {
  name: string;
  displayNames: {
    en: string;
    hi: string;
  };
  searchAliases: string[];
  imageUrl: string;
  category: VegetableCategory;
  defaultUnit: VegetableUnit;
  allowedUnits: VegetableUnit[];
  image?: string;
}

export interface UpdateVegetableDto {
  name?: string;

  displayNames?: {
    en?: string;
    hi?: string;
  };

  category?: VegetableCategory;

  defaultUnit?: VegetableUnit;

  allowedUnits?: VegetableUnit[];

  image?: string;
}
