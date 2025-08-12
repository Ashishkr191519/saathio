import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheck, UserCheckIcon } from "lucide-react";
import NoNotificationFound from "../components/NoNotificationFound";
const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
        queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide mb-6">
          Notifications
        </h1>
        {isLoading ? (
          <div className="justify-center py-12 flex">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                  Friends Request
                </h2>
                <div className="space-y-3 ">
                  {incomingRequests.map((requset) => (
                    <div
                      key={requset._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4 ">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={requset.sender.profilePic}
                                alt={requset.sender.fullName}
                              />
                            </div>
                            <h3 className="font-semibold">
                              {requset.sender.fullName}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className="badge badge-secondary badge-sm">
                                Native : {requset.sender.nativeLanguage}
                              </span>
                              <span className="badge badge-secondary badge-sm">
                                Learning : {requset.sender.learningLanguage}
                              </span>
                            </div>
                          </div>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequestMutation(requset._id)}
                            disabled={isPending}
                          >
                            {" "}
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* ACCEPTED REQ NOTIFICATIONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>
                <div className="space-y-3 bg-base-200 rounded-lg">
                  {acceptedRequests.map((notifications) => (
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className="avatar mt-1 size-10 rounded-full">
                          <img
                            src={notifications.recipient.profilePic}
                            alt={notifications.recipient.fullName}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {notifications.recipient.fullName}
                          </h3>
                          <p className="text-sm my-1">
                            accepted your friend request
                          </p>
                          <p className="text-sm flex items-center opacity-70">
                            <ClockIcon className="size-3 mr-1" />
                            Recently
                          </p>
                        </div>
                        <div className="badge badge-success">
                          <MessageSquareIcon className="size-3 mr-1"/>
                          New Friends</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationFound/>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
