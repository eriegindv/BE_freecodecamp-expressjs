import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstname: { type: String, required: [true, "must have firstname"] },
  lastname: { type: String, required: true },
});

export default mongoose.model("Employee", employeeSchema);
