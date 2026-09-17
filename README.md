# English Practice

문법·독해 연습에 특화된 영어 학습 웹앱입니다. 로그인 없이 브라우저(localStorage)에 학습 진도를 저장하는 단일 사용자 SPA입니다.

## 기술 스택

- React 18 + TypeScript (Vite)
- React Router v6
- React Context + useReducer (상태관리)
- Tailwind CSS
- Vitest + React Testing Library

## 실행 방법

```bash
npm install
npm run dev
```

`http://localhost:5173` 에서 앱을 확인할 수 있습니다.

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 체크 후 프로덕션 빌드 |
| `npm test` | Vitest 유닛/컴포넌트 테스트 실행 |
| `npm run lint` | oxlint 정적 분석 |
| `npm run preview` | 빌드 결과 미리보기 |

## 주요 기능

- **문법 연습**: 카테고리별 규칙 설명 + 예문 + 객관식 퀴즈. 틀린 문제는 오답노트에 자동 저장됩니다.
- **독해 연습**: 난이도(초급/중급/고급)별 지문. 어려운 단어를 클릭하면 뜻 팝업이 표시되고, 지문마다 이해도 확인 문제가 있습니다.
- **진도 관리**: 카테고리/지문별 완료 여부와 정답률을 localStorage에 저장하고, 홈 화면에서 전체 진도와 최근 학습 내역을 볼 수 있습니다.
- **오답노트**: 틀린 문제를 다시 풀어 정답을 맞히면 자동으로 목록에서 제거됩니다.

## 폴더 구조

```
src/
├── components/   # 재사용 UI 컴포넌트 (QuizRunner, GlossaryText 등)
├── pages/        # 라우트별 페이지 컴포넌트
├── data/         # 정적 콘텐츠 데이터 (grammar.ts, reading.ts, dictionary.ts)
├── services/     # 데이터 접근/저장/채점 로직 (content.ts, storage.ts, scoring.ts)
├── hooks/        # 커스텀 훅 (useProgress)
├── context/      # 전역 상태 (ProgressContext, progressReducer)
└── types/        # 타입 정의
```

## 콘텐츠 확장 방법

`src/services/content.ts`는 문법/독해/사전 데이터에 접근하는 유일한 통로입니다. 현재는 `src/data`의 정적 데이터를 반환하지만, 추후 API로 교체할 때는 이 파일 내부의 함수 구현만 바꾸면 되고 페이지/컴포넌트 코드는 수정할 필요가 없습니다.

## localStorage 스키마

진도 데이터는 `english-app-progress` 키로 저장되며 `schemaVersion` 필드를 포함합니다. 스키마가 바뀌면 `src/services/storage.ts`의 마이그레이션 함수에서 버전별 변환 로직을 추가할 수 있습니다.
