import ChannelModel from "../schema/channelSchema.js";
import crudRepository from "./crudRepository.js";

const channelRepository = {
  ...crudRepository(ChannelModel),

  deleteMany: async function (modelIds) {
    const response = ChannelModel.deleteMany({ _id: { $in: modelIds } });
    return response;
  }
};

export default channelRepository;
