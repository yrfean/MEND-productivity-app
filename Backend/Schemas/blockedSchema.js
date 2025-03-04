import mongoose from "mongoose";

const blockedSchema = new mongoose.Schema({
  email: {
    type: String,
  },
});

const Blocked = mongoose.model("Blocked", blockedSchema);
export default Blocked;
