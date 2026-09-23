// Firebase 앱 초기화 (Spark 무료 요금제에서 사용 가능한 Auth, Firestore, Analytics만 사용)
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 웹 앱 설정값은 공개되어도 되는 식별자다. 실제 데이터 보호는 firestore.rules에서 담당한다.
// .env.local에 VITE_FIREBASE_* 값을 넣으면 아래 기본값 대신 사용된다.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC6gC9T2mr5UweRkJhqYAtsjAztVDFcdTA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "readeng.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "readeng",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "readeng.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "590055388554",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:590055388554:web:417814223bfce4bdc98473",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4QQLPYS1CR",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Analytics는 브라우저가 지원하는 경우에만 켠다 (테스트 환경·일부 브라우저에서는 미지원).
if (import.meta.env.PROD) {
  void isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}
