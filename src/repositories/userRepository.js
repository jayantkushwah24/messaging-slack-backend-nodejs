import UserModel from "../schema/userSchema.js";
import crudRepository from "./crudRepository.js";

const userRepository = {
  ...crudRepository(UserModel),

  getByEmail: async function (email) {
    const user = await User.findOne({ email });
    return user;
  },

  getByUsername: async function (username) {
    const user = await User.findOne({ username }).select("-password"); // exclude password
    return user;
  }
};

export default userRepository;
