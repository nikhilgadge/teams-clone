import React from "react";
import useAuth from "../hooks/useAuth";
import useChat from "../hooks/useChat";

export default function Profile() {
  const { auth } = useAuth();
  const { membersStatus } = useChat();

  const memberDetails = membersStatus?.find(
    (member) => member?.email === auth?.user.email
  );
  const status = memberDetails?.status;
  return (
    <div className="flex flex-col items-center mt-4 w-full py-6 px-4 rounded-lg">
      <div className="relative inline-block">
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500 flex-shrink-0 capitalize text-3xl	">
          {auth?.user?.name[0]}
        </div>
        <span
          className={`absolute bottom-3 right-1 block h-2 w-2 rounded-full ring-2 ring-white ${
            status === "online" ? "bg-green-400" : "bg-gray-400"
          }`}
        ></span>
      </div>
      <div className="text-sm font-semibold mt-2 text-white">
        {auth?.user?.name}
      </div>
      <div className="text-xs text-gray-500"> {auth?.user?.email}</div>
      {/* <div className="flex flex-row items-center mt-3">
      <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
        <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
      </div>
      <div className="leading-none ml-1 text-xs">Active</div>
    </div> */}
    </div>
  );
}
