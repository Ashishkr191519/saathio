import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.Gapsap_API_KEY;
const apiSecret = process.env.Gapsap_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream apiKey or apiSecret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    if (!userData.id) {
      throw new Error("User ID is required for Stream user");
    }
    await streamClient.upsertUser(userData); // Pass the user object directly
    return userData;
  } catch (error) {
    console.error("Error Upser Stream Client", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    //ensure userId is a String
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.log("Error generating stream token")
  }
};
