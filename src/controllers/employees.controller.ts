import { Request, Response } from "express";
import { Employee } from "~/models";

const getAllEmployees = async (req: Request, res: Response) => {
  const employees = await Employee.find();

  if (!employees)
    return res.status(204).json({ message: "No employees found" });
  res.json(employees);
};

const createNewEmployee = async (req: Request, res: Response) => {
  if (!req.body?.firstname || !req.body?.lastname)
    return res
      .status(400)
      .json({ message: "First and last names are required" });

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateEmployee = async (req: Request, res: Response) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required" });

  const employee = await Employee.findOneAndUpdate(
    { _id: req.body.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }
  res.json(employee);
};

const deleteEmployee = async (req: Request, res: Response) => {
  if (!req.body?.id)
    return res.status(400).json({ message: "Employee ID required" });

  const employee = await Employee.findOneAndDelete({ _id: req.body.id });
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }

  res.json(employee);
};

const getEmployee = async (req: Request, res: Response) => {
  if (!req.params?.id)
    return res.status(400).json({ message: "Employee ID required" });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}` });
  }
  res.json(employee);
};

export {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
1;
