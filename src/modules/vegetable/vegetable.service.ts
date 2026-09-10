import { Types } from "mongoose";
import { ApiError } from "../../utils/ApiError";
import { CreateVegetableDto, UpdateVegetableDto } from "./vegetable.dto";
import { vegetableRepository } from "./vegetable.repository";

class VegetableService {
  async create(payload: CreateVegetableDto) {
    const existingVegetable = await vegetableRepository.findByName(
      payload.name,
    );

    if (existingVegetable) {
      throw new ApiError(409, "Vegetable already exists.");
    }

    return vegetableRepository.create(payload);
  }

  async getById(vegetableId: string) {
    if (!Types.ObjectId.isValid(vegetableId)) {
      throw new ApiError(400, "Invalid vegetable ID.");
    }

    const vegetable = await vegetableRepository.findById(vegetableId);

    if (!vegetable) {
      throw new ApiError(404, "Vegetable not found.");
    }

    return vegetable;
  }

  async getAdminList() {
    return vegetableRepository.findAll();
  }

  async getActiveList() {
    return vegetableRepository.findAll({
      isActive: true,
    });
  }

  async update(vegetableId: string, payload: UpdateVegetableDto) {
    if (!Types.ObjectId.isValid(vegetableId)) {
      throw new ApiError(400, "Invalid vegetable ID.");
    }

    const vegetable = await vegetableRepository.findById(vegetableId);

    if (!vegetable) {
      throw new ApiError(404, "Vegetable not found.");
    }

    // Check duplicate name only if name is changing
    if (payload.name && payload.name !== vegetable.name) {
      const existingVegetable = await vegetableRepository.findByName(
        payload.name,
      );

      if (existingVegetable) {
        throw new ApiError(409, "Vegetable already exists.");
      }
    }

    const finalDefaultUnit = payload.defaultUnit ?? vegetable.defaultUnit;

    const finalAllowedUnits = payload.allowedUnits ?? vegetable.allowedUnits;

    if (!finalAllowedUnits.includes(finalDefaultUnit)) {
      throw new ApiError(400, "Default unit must be one of the allowed units.");
    }

    const updatedVegetable = await vegetableRepository.updateById(
      vegetableId,
      payload,
    );

    if (!updatedVegetable) {
      throw new ApiError(404, "Vegetable not found.");
    }

    return updatedVegetable;
  }

  async activate(vegetableId: string) {
    if (!Types.ObjectId.isValid(vegetableId)) {
      throw new ApiError(400, "Invalid vegetable ID.");
    }

    const vegetable = await vegetableRepository.findById(vegetableId);

    if (!vegetable) {
      throw new ApiError(404, "Vegetable not found.");
    }

    if (vegetable.isActive) {
      throw new ApiError(409, "Vegetable is already active.");
    }

    const updatedVegetable = await vegetableRepository.updateStatus(
      vegetableId,
      true,
    );

    return updatedVegetable;
  }

  async deactivate(vegetableId: string) {
    if (!Types.ObjectId.isValid(vegetableId)) {
      throw new ApiError(400, "Invalid vegetable ID.");
    }

    const vegetable = await vegetableRepository.findById(vegetableId);

    if (!vegetable) {
      throw new ApiError(404, "Vegetable not found.");
    }

    if (!vegetable.isActive) {
      throw new ApiError(409, "Vegetable is already inactive.");
    }

    const updatedVegetable = await vegetableRepository.updateStatus(
      vegetableId,
      false,
    );

    return updatedVegetable;
  }
}

export const vegetableService = new VegetableService();
