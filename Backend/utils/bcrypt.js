import bcrypt, { hash } from "bcrypt";

const hashPassword = async (password, intensity = 10) => {
  if (!password) {
    throw new Error("requirements to hash pass are not completed⚠️");
  }
  return await bcrypt.hash(password, intensity);
};

const comparePassword = async (userPassword, serverPass) => {
  if (!userPassword || !serverPass) {
    throw new Error("requirments to compare pass are not complete");
  }
  return await bcrypt.compare(userPassword, serverPass);
};

export { hashPassword, comparePassword };
