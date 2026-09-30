// 콘텐츠(문법/독해/사전) 데이터 접근을 담당하는 서비스 레이어
// 지금은 정적 데이터를 반환하지만, 추후 API 연동 시 이 파일 내부만 교체하면 된다.
import { grammarCategories } from "../data/grammar";
import { readingPassages } from "../data/reading";
import { dictionaryEntries } from "../data/dictionary";
import type { GrammarCategory, ReadingPassage, DictionaryEntry } from "../types";

export async function getGrammarCategories(): Promise<GrammarCategory[]> {
  return grammarCategories;
}

export async function getGrammarCategory(
  categoryId: string,
): Promise<GrammarCategory | undefined> {
  return grammarCategories.find((category) => category.id === categoryId);
}

export async function getReadingPassages(): Promise<ReadingPassage[]> {
  return readingPassages;
}

export async function getReadingPassage(
  passageId: string,
): Promise<ReadingPassage | undefined> {
  return readingPassages.find((passage) => passage.id === passageId);
}

export async function getDictionaryEntries(
  wordIds: string[],
): Promise<DictionaryEntry[]> {
  const idSet = new Set(wordIds);
  return dictionaryEntries.filter((entry) => idSet.has(entry.id));
}
