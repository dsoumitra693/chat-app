import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { createUser } from "../db";
import { createJWT } from "../utils/jwt";

// Controller function for handling user sign-up
// Wrapped in asyncErrorHandler to catch and handle async errors
export const signUp = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone and password from the request body
    let { phone, password, name } = req.body;

    // Return a 400 Bad Request status if phone or password is missing
    if (!phone || !password)
      return res
        .status(400)
        .send({ message: "Invaid data recived from users." });

    // Attempt to create a new user with the provided phone and password
    let { response, error } = await createUser(phone, password, name);

    // If user creation fails (e.g., phone already exists), return a 409 Conflict status
    if (!response || error)
      return res.status(409).send({ error: error?.message });

    const jwt = createJWT(response.json());
    return res.status(200).send({ jwt });
  },
);

export default signUp;
