// 독해 지문에서 사전 단어를 클릭하면 뜻 팝업을 보여주는 컴포넌트
import { useMemo, useState } from "react";
import type { DictionaryEntry } from "../types";

interface GlossaryTextProps {
  text: string;
  glossary: DictionaryEntry[];
}

export function GlossaryText({ text, glossary }: GlossaryTextProps) {
  const [activeWordKey, setActiveWordKey] = useState<string | null>(null);

  const glossaryMap = useMemo(() => {
    const map = new Map<string, DictionaryEntry>();
    for (const entry of glossary) {
      map.set(entry.word.toLowerCase(), entry);
    }
    return map;
  }, [glossary]);

  const tokens = text.split(/(\s+)/);

  return (
    <p className="text-lg leading-relaxed text-gray-800">
      {tokens.map((token, index) => {
        if (token === "" || /^\s+$/.test(token)) {
          return <span key={index}>{token}</span>;
        }
        const cleaned = token.replace(/[.,!?;:"']/g, "").toLowerCase();
        const entry = glossaryMap.get(cleaned);
        if (!entry) {
          return <span key={index}>{token}</span>;
        }
        const wordKey = `${entry.id}-${index}`;
        const isActive = activeWordKey === wordKey;
        return (
          <span key={index} className="relative inline-block">
            <button
              type="button"
              className="text-blue-600 underline decoration-dotted underline-offset-4 hover:text-blue-800"
              onClick={() => setActiveWordKey(isActive ? null : wordKey)}
            >
              {token}
            </button>
            {isActive && (
              <span
                role="tooltip"
                className="absolute left-0 top-full z-10 mt-1 w-max max-w-xs rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
              >
                <strong>{entry.word}</strong>: {entry.meaning}
              </span>
            )}
          </span>
        );
      })}
    </p>
  );
}
