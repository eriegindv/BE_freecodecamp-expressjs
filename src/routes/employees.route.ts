import express from "express";
import { ROLES_LIST } from "~/config";
import {
  createNewEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
} from "~/controllers/employees.controller";
import { verifyRoles } from "~/middlewares";

const router = express.Router();

router
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);
router.route("/:id").get(getEmployee);

export default router;
