import UserModel from "../schema/userSchema.js";
import crudRepository from "./crudRepository.js";

const userRepository = {
  ...crudRepository(UserModel),

  getById: async function (id) {
    return UserModel.findById(id).select(
      "-password -verificationToken -verificationTokenExpiry"
    );
  },

  getByEmail: async function (email) {
    const user = await UserModel.findOne({ email });
    return user;
  },

  getByUsername: async function (username) {
    const user = await UserModel.findOne({ username }).select("-password");
    return user;
  }
};

export default userRepository;
