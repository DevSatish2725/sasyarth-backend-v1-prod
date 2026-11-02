// src/scripts/seedLocations.ts

import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";

import { State } from "../modules/location/models/state.model";
import { District } from "../modules/location/models/district.model";
import { Village } from "../modules/location/models/village.model";
import { Block } from "../modules/location/models/block.model";
import { Mauja } from "../modules/location/models/mauja.model";
import { Habitation } from "../modules/location/models/habitation.model";

interface DistrictExcelRow {
  "State Code": number;
  "State Name (English)": string;
  "State Name (Hindi)": string;
  "District LGD Code": number;
  "District Name (English)": string;
  "District Name (Hindi)": string;
}

interface BlockExcelRow {
  "District LGD Code": number;
  "LGD Code": number;
  "English Name": string;
  "Hindi Name": string;
}

interface MaujaExcelRow {
  "Village LGD Code": number;
  "English Name": string;
  "Hindi Name": string;
}

interface VillageExcelRow {
  "State Code": number;
  "State Name (English)": string;
  "State Name (Hindi)": string;

  "District LGD Code": number;
  "District Name (English)": string;
  "District Name (Hindi)": string;

  "Village LGD Code": number;
  "Village Name (English)": string;
  "Village Name (Hindi)": string;

  "Village Status": string;
}

interface HabitationExcelRow {
  "Mauja Name": string;
  "English Name": string;
  "Hindi Name": string;
}

function readExcel<T>(filePath: string): T[] {
  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error(`No sheet found in ${filePath}`);
  }

  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Worksheet not found: ${sheetName}`);
  }

  return XLSX.utils.sheet_to_json<T>(worksheet, {
    defval: "",
  });
}

async function seedDistricts() {
  const filePath = path.resolve(
    process.cwd(),
    "data/UP_Districts_English_Hindi.xlsx",
  );

  const rows = readExcel<DistrictExcelRow>(filePath);

  const upState = await State.findOne({
    lgdCode: 9,
  }).lean();

  if (!upState) {
    throw new Error("Uttar Pradesh state not found");
  }

  const operations = rows
    .filter((row) => row["District LGD Code"] && row["District Name (English)"])
    .map((row) => {
      const englishName = row["District Name (English)"].trim();

      const hindiName = row["District Name (Hindi)"]?.trim();

      return {
        updateOne: {
          filter: {
            lgdCode: Number(row["District LGD Code"]),
          },

          update: {
            $set: {
              stateId: upState._id,

              name: englishName,

              displayNames: {
                en: englishName,
                hi: hindiName,
              },

              isActive: true,
            },
          },

          upsert: true,
        },
      };
    });

  if (!operations.length) {
    return;
  }

  const result = await District.bulkWrite(operations, {
    ordered: false,
  });
}

async function seedBlocks() {
  const filePath = path.resolve(process.cwd(), "data/UP_Ayodhya_Block.xlsx");

  const rows = readExcel<BlockExcelRow>(filePath);

  const districts = await District.find({
    isActive: true,
  })
    .select("_id lgdCode")
    .lean();

  const districtMap = new Map<number, mongoose.Types.ObjectId>();

  for (const district of districts) {
    districtMap.set(district.lgdCode, district._id);
  }

  const BATCH_SIZE = 1000;

  let operations: any[] = [];

  let processed = 0;
  let skipped = 0;

  for (const row of rows) {
    const blockLgdCode = Number(row["LGD Code"]);

    const districtLgdCode = Number(row["District LGD Code"]);

    const englishName = row["English Name"]?.trim();

    const hindiName = row["Hindi Name"]?.trim();

    if (!blockLgdCode || !districtLgdCode || !englishName) {
      skipped++;
      continue;
    }

    const districtId = districtMap.get(districtLgdCode);

    if (!districtId) {
      console.warn(`Block not found: ${districtLgdCode}`);

      skipped++;
      continue;
    }

    operations.push({
      updateOne: {
        filter: {
          lgdCode: blockLgdCode,
        },

        update: {
          $set: {
            districtId,

            name: englishName,

            displayNames: {
              en: englishName,
              hi: hindiName || englishName,
            },

            isActive: true,
          },
        },

        upsert: true,
      },
    });

    if (operations.length >= BATCH_SIZE) {
      await Block.bulkWrite(operations, {
        ordered: false,
      });

      processed += operations.length;

      operations = [];
    }
  }

  // remaining rows

  if (operations.length) {
    await Block.bulkWrite(operations, {
      ordered: false,
    });

    processed += operations.length;
  }
}

async function seedVillages() {
  const filePath = path.resolve(
    process.cwd(),
    "data/UP_Villages_English_Hindi.xls",
  );

  const rows = readExcel<VillageExcelRow>(filePath);

  const districts = await District.find({
    isActive: true,
  })
    .select("_id lgdCode")
    .lean();

  const districtMap = new Map<number, mongoose.Types.ObjectId>();

  for (const district of districts) {
    districtMap.set(district.lgdCode, district._id);
  }

  const BATCH_SIZE = 1000;

  let operations: any[] = [];

  let processed = 0;
  let skipped = 0;

  for (const row of rows) {
    const villageLgdCode = Number(row["Village LGD Code"]);

    const districtLgdCode = Number(row["District LGD Code"]);

    const englishName = row["Village Name (English)"]?.trim();

    const hindiName = row["Village Name (Hindi)"]?.trim();

    if (!villageLgdCode || !districtLgdCode || !englishName) {
      skipped++;
      continue;
    }

    const districtId = districtMap.get(districtLgdCode);

    if (!districtId) {
      console.warn(`Village not found: ${districtLgdCode}`);

      skipped++;
      continue;
    }

    operations.push({
      updateOne: {
        filter: {
          lgdCode: villageLgdCode,
        },

        update: {
          $set: {
            districtId,

            name: englishName,

            displayNames: {
              en: englishName,
              hi: hindiName || englishName,
            },

            isActive: row["Village Status"] !== "Inactive",
          },
        },

        upsert: true,
      },
    });

    if (operations.length >= BATCH_SIZE) {
      await Village.bulkWrite(operations, {
        ordered: false,
      });

      processed += operations.length;

      operations = [];
    }
  }

  // remaining rows

  if (operations.length) {
    await Village.bulkWrite(operations, {
      ordered: false,
    });

    processed += operations.length;
  }
}

async function seedMauja() {
  const filePath = path.resolve(
    process.cwd(),
    "data/UP_Ayodhay_Block_Villages_Mauja.xlsx",
  );

  const rows = readExcel<MaujaExcelRow>(filePath);

  const villages = await Village.find({
    isActive: true,
  })
    .select("_id lgdCode")
    .lean();

  const villageMap = new Map<number, mongoose.Types.ObjectId>();

  for (const village of villages) {
    villageMap.set(village.lgdCode, village._id);
  }

  const BATCH_SIZE = 1000;

  let operations: any[] = [];

  let processed = 0;
  let skipped = 0;

  for (const row of rows) {
    const villageLgdCode = Number(row["Village LGD Code"]);

    const englishName = row["English Name"]?.trim();

    const hindiName = row["Hindi Name"]?.trim();

    if (!villageLgdCode || !englishName) {
      skipped++;
      continue;
    }

    const villageId = villageMap.get(villageLgdCode);

    if (!villageId) {
      console.warn(`Mauja not found: ${villageLgdCode}`);

      skipped++;
      continue;
    }

    operations.push({
      updateOne: {
        filter: {
          name: englishName,
        },

        update: {
          $set: {
            villageId,

            name: englishName,

            displayNames: {
              en: englishName,
              hi: hindiName || englishName,
            },

            isActive: true,
          },
        },

        upsert: true,
      },
    });

    if (operations.length >= BATCH_SIZE) {
      await Mauja.bulkWrite(operations, {
        ordered: false,
      });

      processed += operations.length;

      operations = [];
    }
  }

  // remaining rows

  if (operations.length) {
    await Mauja.bulkWrite(operations, {
      ordered: false,
    });

    processed += operations.length;
  }
}

async function seedHabitation() {
  const filePath = path.resolve(
    process.cwd(),
    "data/UP_Ayodhya_Block_Villages_Mauja_Habitation.xlsx",
  );

  const rows = readExcel<HabitationExcelRow>(filePath);

  const maujas = await Mauja.find({
    isActive: true,
  })
    .select("_id name")
    .lean();

  const maujaMap = new Map<string, mongoose.Types.ObjectId>();

  for (const mauja of maujas) {
    maujaMap.set(mauja.name, mauja._id);
  }

  const BATCH_SIZE = 1000;

  let operations: any[] = [];

  let processed = 0;
  let skipped = 0;

  for (const row of rows) {
    const maujaName = row["Mauja Name"];

    const englishName = row["English Name"]?.trim();

    const hindiName = row["Hindi Name"]?.trim();

    if (!maujaName || !englishName) {
      skipped++;
      continue;
    }

    const maujaId = maujaMap.get(maujaName);

    if (!maujaId) {
      console.warn(`Habitation not found: ${maujaName}`);

      skipped++;
      continue;
    }

    operations.push({
      updateOne: {
        filter: {
          name: englishName,
        },

        update: {
          $set: {
            maujaId,

            name: englishName,

            displayNames: {
              en: englishName,
              hi: hindiName || englishName,
            },

            isActive: true,
          },
        },

        upsert: true,
      },
    });

    if (operations.length >= BATCH_SIZE) {
      await Habitation.bulkWrite(operations, {
        ordered: false,
      });

      processed += operations.length;

      operations = [];
    }
  }

  // remaining rows

  if (operations.length) {
    await Habitation.bulkWrite(operations, {
      ordered: false,
    });

    processed += operations.length;
  }
}

export async function seedLocations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // await seedDistricts();

    // await seedBlocks();

    // await seedVillages();

    // await seedMauja();

    await seedHabitation();
  } catch (error) {
    console.error("Location import failed:", error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
