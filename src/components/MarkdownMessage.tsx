// AI 답변의 마크다운(굵게, 목록, 코드 등)을 안전하게 렌더링하는 컴포넌트 (원본 HTML은 허용하지 않음)
import ReactMarkdown from "react-markdown";

export function MarkdownMessage({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="my-1 first:mt-0 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="my-1 list-disc pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="my-1 list-decimal pl-5">{children}</ol>,
        code: ({ children }) => (
          <code className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-600">
            {children}
          </code>
        ),
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
            {children}
          </a>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
