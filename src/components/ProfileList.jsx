import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useChat from "../hooks/useChat";
import moment from "moment";
import useSocket from "../hooks/useSocket";

export default function ProfileList({
  index,
  hideSecondaryText,
  conversation = {},
  selectedConversation,
  handleConversationChange,
}) {
  const { auth } = useAuth();
  const { membersStatus } = useChat();
  const { socket } = useSocket();
  const getlastMessage = (messages) => {
    if (messages?.length > 0) {
      const msg = messages[messages.length - 1].body;
      return msg?.length > 10 ? msg.substring(0, 20) + "..." : msg;
    }
    return "";
  };

  const members = conversation?.members;

  if (members?.length) {
    const index = members.indexOf(auth?.user?.email);
    if (index > -1) {
      // only splice array when item is found
      members.splice(index, 1); // 2nd parameter means remove one item only
    }
  }
  const memberDetails = membersStatus?.find(
    (member) => member?.email === members[0]
  );
  const status = memberDetails?.status;
  const lastSeen = memberDetails?.lastSeen;

  useEffect(() => {
    socket?.emit("get-status", members[0]);
  }, [socket, members]);

  return (
    <div
      className={`flex items-center space-x-4 p-3 m-1 mb-0.5 rounded hover:bg-neutral-900 cursor-pointer ${
        selectedConversation === conversation._id && "bg-neutral-900"
      }`}
      onClick={
        !hideSecondaryText
          ? () => handleConversationChange(conversation._id)
          : () => {}
      }
    >
      <div className="relative inline-block">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 capitalize">
          {members?.length > 0 && members[0][0]}
        </div>
        <span
          className={`absolute bottom-1 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${
            status === "online" ? "bg-green-400" : "bg-gray-400"
          }`}
        ></span>
      </div>

      <div className="font-medium dark:text-white">
        <div>{members?.length > 0 && members[0]}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {hideSecondaryText
            ? status === "online"
              ? "online"
              : lastSeen
              ? `last seen at ${moment(lastSeen).format(
                  "DD-MM-YYYY , hh:mm A"
                )}`
              : "Unknown"
            : getlastMessage(conversation.messages)}
        </div>
      </div>
    </div>
  );
}
