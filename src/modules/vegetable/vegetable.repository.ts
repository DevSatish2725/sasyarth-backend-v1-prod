import { Vegetable } from "./vegetable.model";
import { CreateVegetableDto, UpdateVegetableDto } from "./vegetable.dto";
import { Types } from "mongoose";

class VegetableRepository {
  create(payload: CreateVegetableDto) {
    return Vegetable.create(payload);
  }

  findById(vegetableId: string) {
    return Vegetable.findById(vegetableId);
  }

  findByName(name: string) {
    return Vegetable.findOne({ name });
  }

  findAll(filter: Record<string, unknown> = {}) {
    return Vegetable.find(filter).sort({
      name: 1,
    });
  }
  updateById(vegetableId: string, payload: Partial<UpdateVegetableDto>) {
    return Vegetable.findByIdAndUpdate(vegetableId, payload, {
      new: true,
      runValidators: true,
    });
  }

  updateStatus(vegetableId: string, isActive: boolean) {
    return Vegetable.findByIdAndUpdate(
      vegetableId,
      { isActive },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  findByIds(ids: Array<string | Types.ObjectId>) {
    return Vegetable.find({
      _id: { $in: ids },
    });
  }
}

export const vegetableRepository = new VegetableRepository();
