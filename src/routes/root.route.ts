import express from "express";
import { getRoot } from "~/controllers/root.controller";

const router = express.Router();

router.route("/").get(getRoot);

export default router;
