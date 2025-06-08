// import User from "../models/User.js";
// import FriendRequest from "../models/FriendRequest.js";
// export async function getRecommendedUsers(req, res) {
//     try{
//         const currentUserId = req.user._id;
//         const currentUser = await User.findById(currentUserId);

//         if (!currentUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
        
//         const recommendedUsers = await User.find({
//             $and:[
//                 { _id: { $ne: currentUserId } }, // Exclude current user
//                 { _id: { $nin: currentUser.friends } }, // Exclude friends
//                 // { _id: { $nin: currentUser.sentRequests } }, // Exclude sent requests
//                 // { _id: { $nin: currentUser.receivedRequests } }, // Exclude received requests
//                 { isOnboarded: true } // Only include onboarded users
//             ]
//         })
//         res.status(200).json({
//             message: "Recommended users fetched successfully",
//             recommendedUsers,
//         });
//     } catch (error) {
//         console.error("Error fetching recommended users:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

// export async function getMyFriends(req, res) {

//     try{
//         const currentUserId = req.user._id;
//         const currentUser = await User.findById(currentUserId).populate("friends","fullName profilePicture collegeName");

//         if (!currentUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json(
//             currentUser.friends,
//         );
//     } catch (error) {
//         console.error("Error fetching friends:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }


// //TODO: Implement search functionality
// export async function searchUsers(req, res) {

// }

// export async function sendFriendRequest(req, res) {
//     try{
//         const myId = req.user._id;
//         const {id: recieptId} = req.params;
//         if(myId === recieptId){
//             return res.status(400).json({ message: "You cannot send a friend request to yourself" });
//         }

//         const recipientUser = await User.findById(recieptId);
//         if (!recipientUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         if(recipientUser.friends.includes(myId)){
//             return res.status(400).json({ message: "You are already friends" });
//         }
//         const existingRequest = await FriendRequest.findOne({
//             $or: [
//                 { sender: myId, receiver: recieptId },
//                 { sender: recieptId, receiver: myId }
//             ]
//         });

//         if(existingRequest) {
//             return res.status(400).json({ message: "Friend request already exists" });
//         }

//         const friendRequest = await FriendRequest.create({
//             sender: myId,
//             receiver: recieptId,
//         });
//     }
//     catch (error) {
//         console.error("Error sending friend request:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

// export async function acceptFriendRequest(req,res){
//     try{
//         const {id: requestId} = req.params;
//         const friendRequest = await FriendRequest.findById(requestId);
//         if (!friendRequest) {
//             return res.status(404).json({ message: "Friend request not found" });
//         }
//         if(friendRequest.recipient.toString() !== req.user.id){
//             return res.status(403).json({ message: "You are not authorized to accept this friend request" });
//         }
//         friendRequest.status = "accepted";
//         await friendRequest.save();
//         await User.findByIdAndUpdate(friendRequest.sender, {
//             $addToSet: { friends: friendRequest.recipient }
//         });
//         await User.findByIdAndUpdate(req.user._id, {
//             $addToSet: { friends: friendRequest.sender }
//         });

//         res.status(200).json({
//             message: "Friend request accepted successfully",
//             friendRequest,
//         });
//     }
//     catch (error) {
//         console.error("Error accepting friend request:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }
// // this function will return all the friend requests that the user has received and sent
// export async function getFriendRequests(req,res){
//     try{
//         const incomingRequests = await FriendRequest.find({
//             recipient: req.user._id,
//             status: "pending"
//         }).populate("sender", "fullName profilePicture collegeName");

//         const acceptedRequests = await FriendRequest.find({
//             sender: req.user._id,
//             status: "accepted"  
//         }).populate("recipient", "fullName profilePicture collegeName");
//         return res.status(200).json({
//             incomingRequests,
//             acceptedRequests,
//         });
//     }
//     catch (error) {
//         console.error("Error fetching friend requests:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

// export async function getSentRequests(req,res){
//     try{
//         const sentRequests = await FriendRequest.find({
//             sender: req.user._id,
//             status: "pending"
//         }).populate("receiver", "fullName profilePicture collegeName");

//         return res.status(200).json({
//             sentRequests,
//         });
//     }
//     catch (error){
//         console.error("Error fetching sent requests:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }
// // implement function of deny request
// export async function denyFriendRequest(req,res){
//     try{
//         const {id: requestId} = req.params;
//         const friendRequest = await FriendRequest.findById(requestId);
//         if (!friendRequest) {
//             return res.status(404).json({ message: "Friend request not found" });
//         }
//         if(friendRequest.sender.toString() !== req.user.id){
//             return res.status(403).json({ message: "You are not authorized to deny this friend request" });
//         }
//         friendRequest.status = "declined";
//         await friendRequest.save();

//         res.status(200).json({
//             message: "Friend request denied successfully",
//             friendRequest,
//         });
//     }
//     catch (error) {
//         console.error("Error denying friend request:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}