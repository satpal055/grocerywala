import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {},
    { strict: false }
);

export default mongoose.model("Category", categorySchema);
