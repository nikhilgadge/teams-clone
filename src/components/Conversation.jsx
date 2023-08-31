import React, { useEffect, useRef, useState } from "react";
import RecievedMessage from "./RecievedMessage";
import SentMessage from "./SentMessage";
import ProfileList from "./ProfileList";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";
import moment from "moment";
import FileProcess from "./FileProcess";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import peer from "../services/peer";

export default function Conversation({
  conversation,
  selectedConversation,
  setSelectedConversation,
}) {
  const [message, setMessage] = useState("");
  const [fileUploading, setFileUploading] = useState([]);
  const { socket, setMyStream } = useSocket();
  const navigate = useNavigate();

  const { auth, setRemoteEmailId } = useAuth();

  const ref = useRef(null);

  useEffect(() => {
    if (ref) ref?.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleInitiateCall = async () => {
    socket.emit(
      "initiate-call",
      {
        roomId: uuid(),
        emailId: conversation.members[0],
        offer: await peer.createOffer(),
      },
      () => {
        // call initiated

        console.log("Call initiated");
        setRemoteEmailId(conversation.members[0]);

        navigate("/call");
      }
    );
  };

  const isNewConversation = conversation?.messages?.length === 0;

  const handleFileChange = (e) => {
    // setFile(e.target.files[0]);
    handleUpload(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    try {
      if (file) {
        setFileUploading((p) => [...p, { file: file, status: "uploading" }]);
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/chat/uploadFile`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/octet-stream",
              "Content-Disposition": `attachment; filename=${
                file.name
              };sender=${auth?.user?.email};reciever=${
                conversation.members[0]
              };conversationId=${
                isNewConversation ? "" : conversation._id
              };tempId=${conversation._id}`,
            },
            body: file,
          }
        );
        const data = await response.json();
        if (data.status !== "ok") {
          return alert("Something went wrong");
        }
        setFileUploading((p) => p.filter((f) => f.file.name !== file.name));
      }
    } catch (error) {
      setFileUploading((p) =>
        p.map((f) => {
          if (f.file.name === file.name) {
            return {
              ...f,
              status: "error",
            };
          }
          return f;
        })
      );
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();

    if (!message) return;

    socket?.emit("message", {
      sender: auth?.user?.email,
      reciever: conversation.members,
      conversationId: isNewConversation ? "" : conversation._id,
      message,
      isNewConversation,
      tempId: conversation._id,
    });

    setMessage("");
  };

  let lastMessageDateDisplayed;
  // let shouldDisplayDate;
  return !conversation ? (
    <p>Start a conversation</p>
  ) : (
    <>
      <div className="flex justify-between items-center">
        <ProfileList hideSecondaryText={true} conversation={conversation} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="blue"
          className="w-6 h-6 mr-8"
          onClick={handleInitiateCall}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
          />
        </svg>
      </div>

      <hr className="divider" />
      <div className="grid grid-rows-6 ">
        <div
          className="row-span-5"
          style={{ height: "440px", overflowY: "auto" }}
        >
          {conversation?.messages?.map((message) => {
            // display message date only if it changes
            let messageDate = moment(message.time).format("DD-MM-YYYY");
            let shouldDisplayDate = false;

            if (lastMessageDateDisplayed !== messageDate) {
              // update lastMessageDateDisplayed to message's date
              lastMessageDateDisplayed = messageDate;

              // we make this true only if message's date changes
              shouldDisplayDate = true;
            }

            // display "Today" if date is today's
            if (messageDate === moment().format("DD-MM-YYYY")) {
              messageDate = "Today";
            }

            return (
              <>
                {shouldDisplayDate && (
                  <div className="text-center	text-[12px] text-gray-500 dark:text-gray-400 ml-1">
                    {messageDate}
                  </div>
                )}
                {message.authorEmail === auth.user.email ? (
                  <SentMessage message={message} />
                ) : (
                  <RecievedMessage message={message} />
                )}
              </>
            );
          })}
          {fileUploading?.length > 0 &&
            fileUploading.map((file) => (
              <FileProcess fileInfo={file} uploadFile={handleUpload} />
            ))}

          <div style={{ float: "left", clear: "both" }} ref={ref}></div>

          {conversation?.messages?.length === 0 && (
            <div className="flex flex-col	justify-center items-center	text-sm	">
              <p className="text-white">No messages here yet..</p>
              <p className="text-white">Send a message</p>
            </div>
          )}
        </div>

        {/* footer */}
        <form
          className="flex flex-row items-center h-16 w-full px-4 row-span-1"
          onSubmit={onSubmit}
        >
          <div>
            <label
              htmlFor="upload"
              className="flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              id="upload"
              hidden
              accept=".xls,.xlsx,.pdf,.docx,.msg,.png,.ppt,.pptx,.jpg"
              onClick={(e) => {
                e.target.value = null;
              }}
            />
          </div>
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                type="text"
                className="flex w-full border focus:outline-none focus:border-indigo-300 pl-4 h-10 bg-neutral-900 rounded-sm text-white	"
                placeholder="Type a new message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="ml-4">
            <button
              type="submit"
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
            >
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
