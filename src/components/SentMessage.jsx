import moment from "moment/moment";
import React from "react";

export default function SentMessage({ message }) {
  return (
    <div className="col-start-6 col-end-13 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        {/* <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 capitalize">
          {message.authorEmail[0]}
        </div> */}
        <div className="relative mr-3 text-sm bg-slate-800 py-2 px-4 shadow rounded-xl text-white">
          <div>
            {message.type === "File" ? (
              <a
                href={`${process.env.REACT_APP_URL}/api/chat/download?filename=${message.body}`}
                download
                className="hover:text-sky-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 inline mr-1"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                  />
                </svg>
                {message.body}
              </a>
            ) : (
              message.body
            )}
            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">
              {moment(message.time).format("hh:mm A")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
