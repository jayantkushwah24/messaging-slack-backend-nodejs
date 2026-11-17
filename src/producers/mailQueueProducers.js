import mailQueues from "../queues/mailQueues.js";
import "../processors/mailProcessor.js"


export const addEmailToMailQueue = async (emailData) => {
  try {
    await mailQueues.add(emailData);
    console.log("Email added to mail queue");
  } catch (error) {
    console.log("add email to mail queue error: ", error);
  }
};
