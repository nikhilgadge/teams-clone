import React, { useState } from "react";
import ProfileList from "../components/ProfileList";
import Conversation from "../components/Conversation";
import Profile from "../components/Profile";
import uuid from "react-uuid";
import CreateConversationModal from "../components/CreateConversationModal";
import useChat from "../hooks/useChat";
export default function Home() {
  const {
    conversations,
    setConversations,
    isDataLoading,
    setSelectedConversation,
    selectedConversation,
  } = useChat();

  const firstConversation =
    conversations.length > 0 ? conversations[0]._id : undefined;

  const [isOpen, setIsOpen] = useState(false);

  const handleConversationChange = (id) => {
    setSelectedConversation(id);
  };

  const onCreate = (email) => {
    const id = uuid();
    setConversations((prevConversations) => {
      return [
        {
          members: [email],
          messages: [],
          _id: id,
        },
        ...prevConversations,
      ];
    });

    setSelectedConversation(id);
  };
  return isDataLoading ? (
    <p>Conversations Loading...</p>
  ) : (
    <div className="grid grid-cols-5 h-screen">
      <div className="col-span-1 bg-neutral-800	">
        <Profile />
        <hr className="divider" />
        <div className="p-3 divide-y flex justify-between	">
          <p className="font-medium dark:text-white">Conversations</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-6 h-6 cursor-pointer"
            style={{ borderTop: "0px" }}
            onClick={() => setIsOpen(true)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div style={{ overflowY: "auto", maxHeight: "350px" }}>
          {conversations.map((conversation) => (
            <ProfileList
              selectedConversation={selectedConversation || firstConversation}
              conversation={conversation}
              key={conversation._id}
              handleConversationChange={handleConversationChange}
            />
          ))}
        </div>
      </div>
      <div className="col-span-4 bg-neutral-900">
        <Conversation
          conversation={conversations?.find(
            (conversation) =>
              conversation._id === (selectedConversation || firstConversation)
          )}
          setSelectedConversation={setSelectedConversation}
        />
      </div>

      {/* Modal */}
      <CreateConversationModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        onCreate={onCreate}
      />
    </div>
  );
}
