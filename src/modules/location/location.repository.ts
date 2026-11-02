import { State } from "./models/state.model";
import { District } from "./models/district.model";
import { Village } from "./models/village.model";
import { Block } from "./models/block.model";
import { Mauja } from "./models/mauja.model";
import { Habitation } from "./models/habitation.model";
import { Types } from "mongoose";
import { escapeRegex } from "../../utils/escapeRegext";
import {
  HabitationSuggestion,
  SearchDistrictParams,
  SearchVillageParams,
} from "./location.types";

class LocationRepository {
  findAllStates() {
    return State.find().select("_id name displayNames").lean().exec();
  }
  findStateById(id: Types.ObjectId) {
    return State.findById(id).select("_id name displayNames").lean().exec();
  }
  findStateByName(name: string) {
    return State.findOne({ name })
      .select("_id name displayNames")
      .lean()
      .exec();
  }

  findDistrictById(id: Types.ObjectId) {
    return District.findById(id).select("_id name displayNames").lean().exec();
  }
  findDistrictByIdAndStateId(
    districtId: Types.ObjectId,
    stateId: Types.ObjectId,
  ) {
    return District.findOne({
      districtId,
      stateId,
    })
      .select("_id name displayNames")
      .lean()
      .exec();
  }

  findDistrictByStateId(stateId: Types.ObjectId) {
    return District.find({
      stateId,
    })
      .select("_id name displayNames")
      .lean()
      .exec();
  }

  findVillageById(id: Types.ObjectId) {
    return Village.findById(id).select("_id name displayNames").lean().exec();
  }

  findHabitationById(id: Types.ObjectId) {
    return Habitation.findById(id)
      .select("_id name displayNames")
      .lean()
      .exec();
  }

  findMaujaById(id: Types.ObjectId) {
    return Mauja.findById(id).select("_id name displayNames").lean().exec();
  }

  findBlockById(id: Types.ObjectId) {
    return Block.findById(id).select("_id name displayNames").lean().exec();
  }
  findBlockByIdAndDistrictId(
    blockId: Types.ObjectId,
    districtId: Types.ObjectId,
  ) {
    return Village.findOne({
      blockId,
      districtId,
    })
      .select("_id name displayNames")
      .lean()
      .exec();
  }

  findVillageByIdAndBlockId(
    villageId: Types.ObjectId,
    blockId: Types.ObjectId,
  ) {
    return Block.findOne({
      villageId,
      blockId,
    })
      .select("_id name displayNames")
      .lean()
      .exec();
  }

  findMaujaByIdAndVillageId(
    maujaId: Types.ObjectId,
    villageId: Types.ObjectId,
  ) {
    return Mauja.findOne({
      maujaId,
      villageId,
    })
      .select("_id name displayNames")
      .lean()
      .exec();
  }

  findHabitationByIdAndMaujaId(
    habitationId: Types.ObjectId,
    maujaId: Types.ObjectId,
  ) {
    return Mauja.findOne({
      habitationId,
      maujaId,
    })
      .select("_id name displayNames")
      .lean()
      .exec();
  }

  searchDistricts({ stateId, search, limit = 20 }: SearchDistrictParams) {
    const filter: Record<string, unknown> = {
      stateId: new Types.ObjectId(stateId),
    };

    if (search?.trim()) {
      const normalizedSearch = search.trim();

      const safeSearch = escapeRegex(normalizedSearch);

      filter.$or = [
        {
          "displayNames.en": {
            $regex: `^${safeSearch}`,
            $options: "i",
          },
        },

        {
          "displayNames.hi": {
            $regex: `^${safeSearch}`,
          },
        },
      ];
    }

    return District.find(filter)
      .select({
        _id: 1,
        name: 1,
        displayNames: 1,
      })
      .sort({
        "displayNames.en": 1,
      })
      .limit(limit)
      .lean()
      .exec();
  }
  searchVillages({ districtId, search, limit = 20 }: SearchVillageParams) {
    const filter: Record<string, unknown> = {
      districtId: new Types.ObjectId(districtId),
    };

    if (search?.trim()) {
      const normalizedSearch = search.trim().toLowerCase();

      const safeSearch = escapeRegex(normalizedSearch);

      filter.$or = [
        {
          "displayNames.en": {
            $regex: `^${safeSearch}`,
            $options: "i",
          },
        },

        {
          "displayNames.hi": {
            $regex: `^${safeSearch}`,
          },
        },
      ];
    }

    return Village.find(filter)
      .select({
        _id: 1,
        name: 1,
        displayNames: 1,
      })
      .sort({
        "displayNames.en": 1,
      })
      .limit(limit)
      .select("_id name")
      .lean()
      .exec();
  }

  findLocations(searchRegex: RegExp, limit: number) {
    return Habitation.aggregate<HabitationSuggestion>([
      {
        $match: {
          isActive: true,
          $or: [
            { name: searchRegex },
            { "displayNames.en": searchRegex },
            { "displayNames.hi": searchRegex },
          ],
        },
      },

      {
        $lookup: {
          from: Mauja.collection.name,
          localField: "maujaId",
          foreignField: "_id",
          as: "mauja",
        },
      },
      { $unwind: "$mauja" },
      { $match: { "mauja.isActive": true } },

      {
        $lookup: {
          from: Village.collection.name,
          localField: "mauja.villageId",
          foreignField: "_id",
          as: "village",
        },
      },
      { $unwind: "$village" },
      { $match: { "village.isActive": true } },

      {
        $lookup: {
          from: Block.collection.name,
          localField: "village.blockId",
          foreignField: "_id",
          as: "block",
        },
      },
      { $unwind: "$block" },
      { $match: { "block.isActive": true } },

      {
        $lookup: {
          from: District.collection.name,
          localField: "block.districtId",
          foreignField: "_id",
          as: "district",
        },
      },
      { $unwind: "$district" },
      { $match: { "district.isActive": true } },

      {
        $lookup: {
          from: State.collection.name,
          localField: "district.stateId",
          foreignField: "_id",
          as: "state",
        },
      },
      { $unwind: "$state" },
      { $match: { "state.isActive": true } },

      // Stable ordering when multiple names match.
      { $sort: { "displayNames.en": 1, _id: 1 } },
      { $limit: limit },

      {
        $project: {
          _id: 0,

          habitationId: { $toString: "$_id" },
          habitation: "$displayNames",

          maujaId: { $toString: "$mauja._id" },
          mauja: "$mauja.displayNames",

          villageId: { $toString: "$village._id" },
          village: "$village.displayNames",

          blockId: { $toString: "$block._id" },
          block: "$block.displayNames",

          districtId: { $toString: "$district._id" },
          district: "$district.displayNames",

          stateId: { $toString: "$state._id" },
          state: "$state.displayNames",
        },
      },
    ]);
  }
}

export const locationRepository = new LocationRepository();
