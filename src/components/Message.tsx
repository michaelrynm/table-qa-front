import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FaChevronRight } from "react-icons/fa";

interface Props {
  message: DocumentData;
}

// Fungsi untuk mendeteksi apakah perlu accordion
const shouldShowAccordion = (text: string) => {
  // Kondisi 1: Text terlalu panjang
  if (text.length > 800) return true;

  // Kondisi 2: Ada multiple headings
  const headingCount = (text.match(/^#{1,3}\s/gm) || []).length;
  if (headingCount >= 3) return true;

  // Kondisi 3: Ada keywords tertentu
  const accordionKeywords = [
    "step",
    "tutorial",
    "guide",
    "explanation",
    "how to",
    "langkah",
    "cara",
    "panduan",
    "penjelasan",
  ];
  const hasKeywords = accordionKeywords.some((keyword) =>
    text.toLowerCase().includes(keyword)
  );
  if (hasKeywords && text.length > 400) return true;

  // Kondisi 4: Ada banyak list items
  const listItemCount =
    (text.match(/^[\s]*[-*+]\s/gm) || []).length +
    (text.match(/^[\s]*\d+\.\s/gm) || []).length;
  if (listItemCount >= 5) return true;

  // Kondisi 5: Ada code blocks yang besar
  const codeBlockCount = (text.match(/```[\s\S]*?```/g) || []).length;
  if (codeBlockCount >= 2) return true;

  return false;
};

// Fungsi untuk memisahkan intro dan detail content
const separateContent = (text: string) => {
  const lines = text.split("\n");
  let detailStartIndex = -1;

  // Cari pola untuk memisahkan intro dan detail
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Jika menemukan heading level 2 atau 3 setelah beberapa baris
    if (
      i > 2 &&
      (line.match(/^#{2,3}\s/) ||
        line.match(/^\d+\.\s/) ||
        line.match(/^[-*+]\s.*:$/))
    ) {
      detailStartIndex = i;
      break;
    }

    // Jika menemukan paragraf yang menandakan mulai detail
    if (
      i > 1 &&
      (line.toLowerCase().includes("berikut") ||
        line.toLowerCase().includes("detail") ||
        line.toLowerCase().includes("langkah") ||
        line.toLowerCase().includes("cara") ||
        line.toLowerCase().includes("here are") ||
        line.toLowerCase().includes("steps:") ||
        line.toLowerCase().includes("follow"))
    ) {
      detailStartIndex = i + 1;
      break;
    }
  }

  // Jika tidak ada pemisahan yang jelas, ambil 2-3 paragraf pertama sebagai intro
  if (detailStartIndex === -1) {
    const paragraphs = text.split("\n\n");
    if (paragraphs.length > 2) {
      const introText = paragraphs.slice(0, 2).join("\n\n");
      const detailText = paragraphs.slice(2).join("\n\n");
      return {
        intro: introText,
        detail: detailText,
        hasDetail: detailText.trim().length > 50,
      };
    }
  }

  if (detailStartIndex > 0) {
    return {
      intro: lines.slice(0, detailStartIndex).join("\n"),
      detail: lines.slice(detailStartIndex).join("\n"),
      hasDetail: true,
    };
  }

  return {
    intro: text,
    detail: "",
    hasDetail: false,
  };
};

const LoadingSpinner = () => (
  <div className="flex items-center gap-2">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
    <span className="text-sm text-gray-400">Thinking...</span>
  </div>
);

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

// Komponen Accordion
const AccordionContent = ({
  intro,
  detail,
}: {
  intro: string;
  detail: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const markdownComponents = {
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-lg font-semibold tracking-wide my-2" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="my-1 leading-normal tracking-wide" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul
        className="flex flex-col gap-0 list-disc list-inside ml-4 my-2"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className="flex flex-col gap-0 list-decimal list-inside ml-4 my-2"
        {...props}
      >
        {children}
      </ol>
    ),
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
            className="px-1 py-0.5 rounded text-sm bg-[#1a1a1a] text-gray-100"
            {...props}
          >
            {children}
          </code>
        );
      }
    },
  };

  return (
    <div>
      {/* Intro content - selalu tampil */}
      <ReactMarkdown components={markdownComponents}>{intro}</ReactMarkdown>

      {/* Accordion untuk detail content */}
      <div className="mt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer focus:outline-none"
        >
          <FaChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-90" : "rotate-0"
            }`}
          />

          {isExpanded ? "Sembunyikan detail" : "Lihat detail lengkap"}
        </button>

        {/* Detail content - tampil saat expanded */}
        <div
          className={`overflow-y-auto transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[2000px] opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-l-2 border-blue-500 pl-4 bg-[#1F1F1F] rounded-r-lg p-3">
            <ReactMarkdown components={markdownComponents}>
              {detail}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

const Message = ({ message }: Props) => {
  const isChatGPT = message.user.name === "ChatGPT";
  const isLoading = message.isLoading;
  const messageText = message?.text || "";

  // Cek apakah perlu accordion dan pisahkan content
  const needsAccordion =
    isChatGPT && !isLoading && shouldShowAccordion(messageText);
  const { intro, detail, hasDetail } = needsAccordion
    ? separateContent(messageText)
    : { intro: messageText, detail: "", hasDetail: false };

  const standardMarkdownComponents = {
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-lg font-semibold tracking-wide my-2" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="my-1 leading-normal tracking-wide" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul
        className="flex flex-col gap-0 list-disc list-inside ml-4 my-2"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className="flex flex-col gap-0 list-decimal list-inside ml-4 my-2"
        {...props}
      >
        {children}
      </ol>
    ),
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
  };

  return (
    <div className="py-5 text-white">
      <div
        className={`flex space-x-2.5 md:space-x-5 md:px-10 ${
          isChatGPT ? "justify-start" : "justify-end"
        }`}
      >
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

        <div
          className={`flex flex-col max-w-[70%] ${
            isChatGPT ? "items-start" : "items-end"
          }`}
        >
          <div
            className={`${
              isChatGPT
                ? "bg-[#2F2F2F] rounded-br-lg rounded-t-lg rounded-bl-sm"
                : "bg-blue-600 rounded-bl-lg rounded-t-lg rounded-br-sm"
            } flex flex-col gap-0 px-4 py-3 shadow-sm text-base font-medium tracking-wide whitespace-pre-line`}
          >
            {/* Loading state */}
            {isLoading ? (
              <LoadingSpinner />
            ) : needsAccordion && hasDetail ? (
              /* Accordion content untuk AI responses yang panjang */
              <AccordionContent intro={intro} detail={detail} />
            ) : (
              /* Standard content */
              <ReactMarkdown components={standardMarkdownComponents}>
                {messageText}
              </ReactMarkdown>
            )}
          </div>

          {/* Timestamp */}
          {!isLoading && (
            <div
              className={`text-xs mt-1 ${
                isChatGPT
                  ? "text-gray-400 self-start"
                  : "text-gray-300 self-end"
              }`}
            >
              {message?.createdAt &&
                new Date(message.createdAt.seconds * 1000).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
            </div>
          )}
        </div>

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
