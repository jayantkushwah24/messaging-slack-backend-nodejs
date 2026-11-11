import express from "express";
import { validate } from "../../validators/zodValidator.js";
import {
  userSignInSchema,
  userSignUpSchema
} from "../../validators/userSchema.js";
import { signIn, signUp } from "../../controllers/userController.js";

const router = express.Router();

router.post("/signup", validate(userSignUpSchema), signUp);

router.post("/signin", validate(userSignInSchema), signIn);

export default router;
