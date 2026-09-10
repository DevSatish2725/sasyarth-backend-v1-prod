import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { vegetableService } from "./vegetable.service";

class VegetableController {
  create = catchAsync(async (req, res) => {
    const vegetable = await vegetableService.create(req.body);

    sendResponse(res, {
      statusCode: 201,
      message: "Vegetable created successfully.",
      data: vegetable,
    });
  });

  getAdminList = catchAsync(async (_req, res) => {
    const vegetables = await vegetableService.getAdminList();

    sendResponse(res, {
      statusCode: 200,
      message: "Vegetables fetched successfully.",
      data: vegetables,
    });
  });

  getActiveList = catchAsync(async (_req, res) => {
    const vegetables = await vegetableService.getActiveList();

    sendResponse(res, {
      statusCode: 200,
      message: "Vegetables fetched successfully.",
      data: vegetables,
    });
  });

  getById = catchAsync(async (req, res) => {
    const vegetable = await vegetableService.getById(
      req.params.vegetableId as string,
    );

    sendResponse(res, {
      statusCode: 200,
      message: "Vegetable fetched successfully.",
      data: vegetable,
    });
  });

  update = catchAsync(async (req, res) => {
    const vegetable = await vegetableService.update(
      req.params.vegetableId as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      message: "Vegetable updated successfully.",
      data: vegetable,
    });
  });

  activate = catchAsync(async (req, res) => {
    const vegetable = await vegetableService.activate(req.params.vegetableId as string);

    sendResponse(res, {
      statusCode: 200,
      message: "Vegetable activated successfully.",
      data: vegetable,
    });
  });

  deactivate = catchAsync(async (req, res) => {
    const vegetable = await vegetableService.deactivate(req.params.vegetableId as string);

    sendResponse(res, {
      statusCode: 200,
      message: "Vegetable deactivated successfully.",
      data: vegetable,
    });
  });
}

export const vegetableController = new VegetableController();
