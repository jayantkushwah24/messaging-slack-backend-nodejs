import { ExpressAdapter } from "@bull-board/express";
import mailQueue from "../queues/mailQueues.js";
import testQueue from "../queues/testQueue.js";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { createBullBoard } from "@bull-board/api";

const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath("/ui");

createBullBoard({
  queues: [new BullAdapter(mailQueue), new BullAdapter(testQueue)],
  serverAdapter: bullServerAdapter
});

export default bullServerAdapter;
