import ChannelModel from "../schema/channelSchema.js";
import crudRepository from "./crudRepository.js";

const channelRepository = {
  ...crudRepository(ChannelModel)
};

export default channelRepository;
