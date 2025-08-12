import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub-flavored markdown

const isExternalLink = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname !== window.location.hostname; // If the hostname is different, it's external
  } catch (error) {
    return false; // If the URL is malformed, treat it as internal
  }
};

const Markdown = ({ children, className }) => {
  return (
    <ReactMarkdown
    className={className}
    remarkPlugins={[remarkGfm]} // Enable GitHub-flavored markdown features
    components={{
        a: ({ node, ...props }) => {
          const isExternal = isExternalLink(props.href);
          return (
            <a
              {...props}
              className={`text-brandorange hover:underline hover:text-brandred ${className}`}
              target={isExternal ? "_blank" : "_self"} // Only open external links in a new tab
              rel={isExternal ? "noopener noreferrer" : undefined} // Only add security attributes for external links
            >
              {props.children}
            </a>
          );
        },
        // Customize other tags if necessary
        h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-semibold">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
        p: ({ children }) => <p className="my-4">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
        li: ({ children }) => <li className="mb-2">{children}</li>,
        blockquote: ({ children }) => <blockquote className="italic border-l-4 pl-4 my-4">{children}</blockquote>,
        code: ({ children }) => <code className="bg-gray-200 p-1 rounded">{children}</code>,
        pre: ({ children }) => (
          <pre className="bg-gray-800 text-white p-4 rounded">
            <code>{children}</code>
          </pre>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;