import Channel from "../schema/channelSchema.js";
import crudRepository from "./crudRepository.js";

const channelRepository = {
  ...crudRepository(Channel),

  deleteMany: async function async(modelIds) {
    const response = await ChannelModel.deleteMany({ _id: { $in: modelIds } });
    return response;
  },

  getChannelWithWorkspaceDetails: async function (channelId) {
    const channel = await Channel.findById(channelId).populate("workspaceId");
    return channel;
  }
};

export default channelRepository;
