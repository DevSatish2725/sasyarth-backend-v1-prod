import { ApiError } from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { USER_MESSAGES } from "./user.constants";
import { userService } from "./user.service";

class UserController {
  updateProfile = catchAsync(async (req, res) => {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: USER_MESSAGES.PROFILE_UPDATED,
      data: user,
    });
  });
}

export const userController = new UserController();
