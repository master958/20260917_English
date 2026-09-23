// Firestore에 사용자 프로필과 학습 진도를 저장/불러오는 서비스
// 문서 구조: users/{uid} = { displayName, email, photoURL, lastLoginAt, progress, progressUpdatedAt }
// 로그인 시 1회 읽기 + 진도 변경 시 쓰기만 하므로 Spark 무료 할당량(일 5만 읽기/2만 쓰기) 안에서 충분하다.
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../lib/firebase";
import type { ProgressState } from "../types";

function userDoc(uid: string) {
  return doc(db, "users", uid);
}

export async function saveUserProfile(user: User): Promise<void> {
  await setDoc(
    userDoc(user.uid),
    {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function loadRemoteProgress(uid: string): Promise<ProgressState | null> {
  const snapshot = await getDoc(userDoc(uid));
  const progress = snapshot.data()?.progress as ProgressState | undefined;
  return progress ?? null;
}

export async function saveRemoteProgress(uid: string, progress: ProgressState): Promise<void> {
  await setDoc(
    userDoc(uid),
    { progress, progressUpdatedAt: serverTimestamp() },
    { merge: true },
  );
}
