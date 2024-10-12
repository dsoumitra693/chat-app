import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

// Higher-order function that wraps asynchronous Express route handlers
// to automatically catch and handle errors
export const asyncErrorHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  // Returns a new function that wraps the original async function
  return (req: Request, res: Response, next: NextFunction) =>
    // Execute the original function and catch any errors
    func(req, res, next).catch((err) => {
      // Default status code for internal server errors
      let statusCode = 500;

      // Extract error message from the error object if available
      let message = err instanceof Error ? err.message : "Server Error";

      // Pass the error to the Express error-handling middleware
      next(createHttpError(statusCode, message));
    });
};
