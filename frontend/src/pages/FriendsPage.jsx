import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const navigate = useNavigate();

  const handleMessageClick = (friendId) => {
    // Go to chat page, later you can change to `/chat/${friendId}`
    navigate(`/chat/${friendId}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Friends</h1>
        <p className="text-gray-400 mt-1 italic">
          “Good friends are like stars — you don’t always see them, but you know
          they’re always there.”
        </p>
      </div>

      {/* Friends List */}
      {isLoading ? (
        <p className="text-gray-400">Loading friends...</p>
      ) : friends.length === 0 ? (
        <p className="text-gray-400">You have no friends yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="bg-base-200 rounded-xl p-4 flex items-center justify-between shadow-md hover:shadow-lg transition"
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-center gap-4">
                <img
                  src={friend.profilePic || "/default-avatar.png"}
                  alt={friend.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                />
                <div>
                  <h3 className="font-semibold text-lg">{friend.fullName}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-green-800 text-xs">
                      Native: {friend.nativeLanguage}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-800 text-xs">
                      Learning: {friend.learningLanguage}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Message Button */}
              <button
                onClick={() => handleMessageClick(friend._id)}
                className="border px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 transition"
              >
                <MessageCircle size={16} /> Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
