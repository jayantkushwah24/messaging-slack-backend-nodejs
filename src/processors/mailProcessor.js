import transporter from "../config/mailConfig.js";
import mailQueues from "../queues/mailQueues.js";

mailQueues.process(async (job) => {
  try {
    const emailData = job.data;
    console.log("Processing email: ", emailData);
    const response = await transporter.sendMail(emailData);
    console.log("Email sent: ", response);
  } catch (error) {
    console.log("error processing error: ", error);
  }
});
