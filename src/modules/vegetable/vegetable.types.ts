import { VEGETABLE_CATEGORIES, VEGETABLE_UNITS } from "./vegetable.constants";

export type VegetableUnit =
  (typeof VEGETABLE_UNITS)[keyof typeof VEGETABLE_UNITS];

  export type VegetableCategory =
    (typeof VEGETABLE_CATEGORIES)[keyof typeof VEGETABLE_CATEGORIES];
  
import { HydratedDocument, InferSchemaType } from "mongoose";
import { VegetableSchema } from "./vegetable.model";
    
export type VegetableEntity = InferSchemaType<typeof VegetableSchema>;


// export interface VegetableEntity {
//   name: string;

//   displayNames: {
//     en: string;
//     hi: string;
//   };

//   category: VegetableCategory;

//   defaultUnit: VegetableUnit;

//   allowedUnits: VegetableUnit[];

//   image?: string;

//   isActive: boolean;
// }

export type VegetableDocument = HydratedDocument<VegetableEntity>;  