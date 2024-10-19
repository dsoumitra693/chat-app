"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorHandler = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * Higher-order function that wraps asynchronous Express route handlers
 * to automatically catch and handle errors.
 *
 * @param {Function} func - The asynchronous function to wrap. It should
 * take (req: Request, res: Response, next: NextFunction) as parameters
 * and return a Promise.
 * @returns {Function} A new function that wraps the original async function,
 *                     providing automatic error handling.
 */
const asyncErrorHandler = (func) => {
    // Returns a new function that wraps the original async function
    return (req, res, next) => 
    // Execute the original function and catch any errors
    func(req, res, next).catch((err) => {
        // Default status code for internal server errors
        let statusCode = 500;
        // Extract error message from the error object if available
        let message = err instanceof Error ? err.message : 'Server Error';
        // Pass the error to the Express error-handling middleware
        next((0, http_errors_1.default)(statusCode, message));
    });
};
exports.asyncErrorHandler = asyncErrorHandler;
