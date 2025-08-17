import axios from "axios";
import { TEAMS_WEBHOOK_URL } from "../config/config.js";

export const sendToTeams = async ({ articleId, title, errors }) => {
  const message = {
    title: `Article Validation Failed: ${articleId}`,
    text: `**Title:** ${title}\n**Errors:**\n${errors.join("\n")}`,
  };

  try {
    // await axios.post(TEAMS_WEBHOOK_URL, message);
  } catch (err) {
    console.error("Failed to send message to Teams:", err.message);
  }
};
