import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

export const forgetPass = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export default forgetPass;
