// // src/db/stream.js
// import pkg from 'stream-chat'; // Correct import for CommonJS module in ESM
// import "dotenv/config";

// const { StreamChat } = pkg;

// const apiKey = process.env.STREAM_API_KEY;
// const apiSecret = process.env.STREAM_API_SECRET;

// if (!apiKey || !apiSecret) {
//     throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set");
// }

// const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// //  Upsert or create a user
// export const upsertStreamUser = async (userData) => {
//     try {
//         await streamClient.upsertUser(userData); // userData must be a single user object
//         return userData;
//     } catch (error) {
//         console.error("Error creating Stream user:", error);
//         throw new Error("Failed to create Stream user");
//     }
// };

// //  Generate a token for a user
// export const generateStreamToken = (userId) => {
//   try {
//     // ensure userId is a string
//     const userIdStr = userId.toString();
//     return streamClient.createToken(userIdStr);
//   } catch (error) {
//     console.error("Error generating Stream token:", error);
//   }
// };

// //  Delete a user from Stream
// export const deleteStreamUser = async (userId) => {
//     // try {
//     //     await streamClient.deleteUser(userId, {
//     //         hard_delete: true // deletes user and all their messages
//     //     });
//     //     console.log(`Stream user ${userId} deleted`);
//     // } catch (error) {
//     //     console.error(`Error deleting user ${userId}:`, error);
//     //     throw new Error("Failed to delete Stream user");
//     // }
// };

// export default streamClient;


import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};

// export default streamClient;