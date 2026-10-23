import express from "express";
import { validate } from "../../validators/zodValidator.js";
import { userSignUpSchema } from "../../validators/userSchema.js";
import { signUp } from "../../controllers/userController.js";

const router = express.Router();

router.post("/signup", validate(userSignUpSchema), signUp);

export default router;
