// import { get } from "mongoose";
// import { generateStreamToken } from "../db/stream.js";

// export async function getStreamToken(req, res) {
//   try {
//     const token = await generateStreamToken(req.user.id);
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error("Error generating stream token:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

import { generateStreamToken } from "../db/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}