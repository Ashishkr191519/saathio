import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude currentUser
        { _id: { $nin: currentUser.friends } }, //exclude currentUser friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller ", error.messege);
    res.status(500).json({ messege: "Internal Server Error" });
  }
}

export async function getMyFrineds(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFrineds controller", error);
    res.status(500).json({ messege: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
    //prevent sending friend request to ourselves
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ messege: "You can't send friend request to yourself" });
    }
    //check whom we sending the request is valid or not
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ messege: "User not Found" });
    }
    //check if both are already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ messege: "You both are already friends" });
    }
    //check if a request already sent or not

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Frind request already sent" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    return res.status(201).json({ message: "friendRequest" });
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ messege: "Internal server error" });
  }
}
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    //check is there request or not
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend Request not found" });
    }
    //verify the currentUser is the recipent
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        messege: "You are not authorized to accept the friendRequest",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each user to other's friends array

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: " Friend Request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: " Internal Server Error" });
  }
}

export async function getFriendRequest(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingRequest controller", error.message);
    res.status(500).json({ message: " Internal Server Error" });
  }
}
export async function getOutgoingRequest(req, res) {
  try {
    const outgoingRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json({ outgoingRequest });
  } catch (error) {
    console.log("Error in getOutgoingRequest controller", error.message);
    res.status(500).json({ message: " Internal Server Error" });
  }
}
