// 상단 내비게이션과 페이지 콘텐츠를 감싸는 공통 레이아웃
import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
  }`;

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
          <span className="mr-4 text-lg font-bold text-gray-900">English Practice</span>
          <NavLink to="/" end className={navLinkClass}>
            홈
          </NavLink>
          <NavLink to="/grammar" className={navLinkClass}>
            문법
          </NavLink>
          <NavLink to="/reading" className={navLinkClass}>
            독해
          </NavLink>
          <NavLink to="/wrong-answers" className={navLinkClass}>
            오답노트
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
