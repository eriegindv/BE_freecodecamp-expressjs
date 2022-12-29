import express from "express";
import { handleNewUser } from "~/controllers/register.controller";

const router = express.Router();

router.route("/").post(handleNewUser);

export default router;
