import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
  message: DocumentData;
}

const CodeBlock = ({
  language,
  value,
}: {
  language?: string;
  value: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="mb-3 rounded-md border border-gray-600 bg-[#1E1E1E] overflow-hidden text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-600 bg-[#2F2F2F]">
        <span className="text-xs text-gray-300 select-none">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-300 hover:text-white focus:outline-none"
        >
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          lineHeight: "1.4",
        }}
        PreTag="div"
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

// const Message = ({ message }: Props) => {
//   const isChatGPT = message.user.name === "ChatGPT";

//   return (
//     <div className="py-5 text-white">
//       <div className="flex space-x-2.5 md:space-x-5 md:px-10">
//         <div className="border border-gray-600 w-9 h-9 rounded-full p-1 overflow-hidden">
//           <Image
//             src={message?.user?.avatar}
//             alt="userImage"
//             width={100}
//             height={100}
//             className="w-full h-full rounded-full object-cover"
//           />
//         </div>

//         <div
//           className={`flex flex-col max-w-md ${
//             isChatGPT ? "items-start" : "items-end"
//           }`}
//         >
//           <div
//             className={`${
//               isChatGPT ? "bg-[#2F2F2F30]" : "bg-[#2F2F2F]"
//             } flex flex-col gap-0 px-4 py-2 rounded-lg shadow-sm text-base font-medium tracking-wide whitespace-pre-line`}
//           >
//             <ReactMarkdown
//               components={{
//                 // Judul h3
//                 h3: ({ children }) => (
//                   <h3 className="text-lg font-semibold tracking-wide my-2">
//                     {children}
//                   </h3>
//                 ),

//                 // Kurangi jarak paragraf <p>
//                 p: ({ children }) => (
//                   <p className="my-1 leading-normal tracking-wide">
//                     {children}
//                   </p>
//                 ),

//                 // Memunculkan bullet points untuk <ul>
//                 ul: ({ children }) => (
//                   <ul className="flex flex-col gap-0 list-disc list-inside ml-4 my-2">
//                     {children}
//                   </ul>
//                 ),

//                 // Memunculkan numbering untuk <ol>
//                 ol: ({ children }) => (
//                   <ol className="flex flex-col gap-0 list-decimal list-inside ml-4 my-2">
//                     {children}
//                   </ol>
//                 ),

//                 // Code block & inline code
//                 code({
//                   inline,
//                   className,
//                   children,
//                   ...props
//                 }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
//                   const match = /language-(\w+)/.exec(className || "");
//                   if (!inline && match) {
//                     return (
//                       <CodeBlock
//                         language={match[1]}
//                         value={String(children).replace(/\n$/, "")}
//                       />
//                     );
//                   } else {
//                     return (
//                       <code
//                         className="bg-[#2f2f2f] px-1 py-0.5 rounded text-sm text-gray-100"
//                         {...props}
//                       >
//                         {children}
//                       </code>
//                     );
//                   }
//                 },
//               }}
//             >
//               {message?.text || ""}
//             </ReactMarkdown>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
const Message = ({ message }: Props) => {
  const isChatGPT = message.user.name === "ChatGPT";

  return (
    <div className="py-5 text-white">
      <div className={`flex space-x-2.5 md:space-x-5 md:px-10 ${
        isChatGPT ? 'justify-start' : 'justify-end'
      }`}>
        {/* Avatar - tampil di kiri untuk ChatGPT, kanan untuk user */}
        {isChatGPT && (
          <div className="border border-gray-600 w-9 h-9 rounded-full p-1 overflow-hidden flex-shrink-0">
            <Image
              src={message?.user?.avatar}
              alt="ChatGPT"
              width={100}
              height={100}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        )}

        <div className={`flex flex-col max-w-[70%] ${
          isChatGPT ? "items-start" : "items-end"
        }`}>
          <div className={`${
            isChatGPT 
              ? "bg-[#2F2F2F] rounded-br-lg rounded-t-lg rounded-bl-sm" 
              : "bg-blue-600 rounded-bl-lg rounded-t-lg rounded-br-sm"
          } flex flex-col gap-0 px-4 py-3 shadow-sm text-base font-medium tracking-wide whitespace-pre-line`}>
            <ReactMarkdown
              components={{
                // Judul h3
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold tracking-wide my-2">
                    {children}
                  </h3>
                ),

                // Kurangi jarak paragraf <p>
                p: ({ children }) => (
                  <p className="my-1 leading-normal tracking-wide">
                    {children}
                  </p>
                ),

                // Memunculkan bullet points untuk <ul>
                ul: ({ children }) => (
                  <ul className="flex flex-col gap-0 list-disc list-inside ml-4 my-2">
                    {children}
                  </ul>
                ),

                // Memunculkan numbering untuk <ol>
                ol: ({ children }) => (
                  <ol className="flex flex-col gap-0 list-decimal list-inside ml-4 my-2">
                    {children}
                  </ol>
                ),

                // Code block & inline code
                code({
                  inline,
                  className,
                  children,
                  ...props
                }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, "")}
                      />
                    );
                  } else {
                    return (
                      <code
                        className={`px-1 py-0.5 rounded text-sm ${
                          isChatGPT 
                            ? "bg-[#1a1a1a] text-gray-100" 
                            : "bg-blue-800 text-blue-100"
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                },
              }}
            >
              {message?.text || ""}
            </ReactMarkdown>
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isChatGPT ? 'text-gray-400 self-start' : 'text-gray-300 self-end'
          }`}>
            {message?.createdAt && new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Avatar user - tampil di kanan */}
        {!isChatGPT && (
          <div className="border border-gray-600 w-9 h-9 rounded-full p-1 overflow-hidden flex-shrink-0">
            <Image
              src={message?.user?.avatar}
              alt="User"
              width={100}
              height={100}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
