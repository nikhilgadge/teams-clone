import React from "react";

export default function FileProcess({ fileInfo, uploadFile }) {
  const { file, status } = fileInfo;
  return (
    <div className="col-start-6 col-end-13 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        {/* <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 capitalize">
      {message.authorEmail[0]}
    </div> */}
        <div className="relative mr-3 text-sm bg-slate-800 py-2 px-4 shadow rounded-xl text-white">
          <div className="flex justify-center	">
            <p> {file.name}</p>
            {status === "uploading" ? (
              <div
                class="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              ></div>
            ) : (
              <div className="ml-2 inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="red"
                  className="w-6 h-6"
                  onClick={() => uploadFile(file.file)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
