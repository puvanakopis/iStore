"use client";

import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Validates URLs to prevent XSS via dangerous protocols like javascript:, vbscript:, data:
 */
export function isSafeUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed);
}

/**
 * Clean and robust Markdown renderer for chatbot assistant responses using react-markdown and remark-gfm.
 */
export const ChatMarkdown: React.FC<ChatMarkdownProps> = memo(function ChatMarkdown({
  content,
  className = "",
}) {
  if (!content) return null;

  return (
    <div className={`chat-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => (isSafeUrl(url) ? url : "")}
        components={{
          a: ({ node, href, children, ...props }) => {
            if (!href || !isSafeUrl(href)) {
              return <span>{children}</span>;
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-markdown-link"
                {...props}
              >
                {children}
              </a>
            );
          },
          table: ({ node, children, ...props }) => (
            <div className="chat-markdown-table-wrapper">
              <table className="chat-markdown-table" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="chat-markdown-thead" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ node, children, ...props }) => (
            <tbody className="chat-markdown-tbody" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ node, children, ...props }) => (
            <tr className="chat-markdown-tr" {...props}>
              {children}
            </tr>
          ),
          th: ({ node, children, ...props }) => (
            <th className="chat-markdown-th" {...props}>
              {children}
            </th>
          ),
          td: ({ node, children, ...props }) => (
            <td className="chat-markdown-td" {...props}>
              {children}
            </td>
          ),
          pre: ({ node, children, ...props }) => (
            <pre className="chat-markdown-code-block" {...props}>
              {children}
            </pre>
          ),
          code: ({ node, children, className: codeClassName, ...props }) => {
            return (
              <code
                className={
                  codeClassName
                    ? `chat-markdown-code ${codeClassName}`
                    : "chat-markdown-code"
                }
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ node, children, ...props }) => (
            <p className="chat-markdown-p" {...props}>
              {children}
            </p>
          ),
          h1: ({ node, children, ...props }) => (
            <h1 className="chat-markdown-h1" {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 className="chat-markdown-h2" {...props}>
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 className="chat-markdown-h3" {...props}>
              {children}
            </h3>
          ),
          h4: ({ node, children, ...props }) => (
            <h4 className="chat-markdown-h4" {...props}>
              {children}
            </h4>
          ),
          h5: ({ node, children, ...props }) => (
            <h5 className="chat-markdown-h5" {...props}>
              {children}
            </h5>
          ),
          h6: ({ node, children, ...props }) => (
            <h6 className="chat-markdown-h6" {...props}>
              {children}
            </h6>
          ),
          ul: ({ node, children, ...props }) => (
            <ul className="chat-markdown-ul" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="chat-markdown-ol" {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, className: liClassName, ...props }) => (
            <li className={`chat-markdown-li ${liClassName || ""}`} {...props}>
              {children}
            </li>
          ),
          blockquote: ({ node, children, ...props }) => (
            <blockquote className="chat-markdown-blockquote" {...props}>
              {children}
            </blockquote>
          ),
          hr: ({ node, ...props }) => <hr className="chat-markdown-hr" {...props} />,
          del: ({ node, children, ...props }) => (
            <del className="chat-markdown-del" {...props}>
              {children}
            </del>
          ),
          input: ({ node, type, checked, disabled, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={Boolean(checked)}
                  disabled
                  readOnly
                  className="chat-markdown-checkbox"
                  {...props}
                />
              );
            }
            return <input type={type} disabled={disabled} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

export default ChatMarkdown;
