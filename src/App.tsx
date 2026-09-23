// 라우팅과 전역 인증/진도 프로바이더를 구성하는 최상위 앱 컴포넌트
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { GrammarListPage } from "./pages/GrammarListPage";
import { GrammarCategoryPage } from "./pages/GrammarCategoryPage";
import { WrongAnswerNotePage } from "./pages/WrongAnswerNotePage";
import { ReadingListPage } from "./pages/ReadingListPage";
import { ReadingPassagePage } from "./pages/ReadingPassagePage";

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/grammar" element={<GrammarListPage />} />
              <Route path="/grammar/:categoryId" element={<GrammarCategoryPage />} />
              <Route path="/reading" element={<ReadingListPage />} />
              <Route path="/reading/:passageId" element={<ReadingPassagePage />} />
              <Route path="/wrong-answers" element={<WrongAnswerNotePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
