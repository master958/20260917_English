# English Practice

문법·독해 연습에 특화된 영어 학습 웹앱입니다. 로그인 없이도 브라우저(localStorage)에 학습 진도를 저장하며, 구글 로그인 시 Firebase Firestore에 진도를 동기화해 여러 기기에서 이어서 학습할 수 있습니다.

## 기술 스택

- React 18 + TypeScript (Vite)
- React Router v6
- React Context + useReducer (상태관리)
- Tailwind CSS
- Firebase (Spark 무료 요금제: Authentication, Cloud Firestore, Analytics)
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
├── context/      # 전역 상태 (AuthContext, ProgressContext, progressReducer)
├── lib/          # Firebase 초기화 (firebase.ts)
└── types/        # 타입 정의
```

## 콘텐츠 확장 방법

`src/services/content.ts`는 문법/독해/사전 데이터에 접근하는 유일한 통로입니다. 현재는 `src/data`의 정적 데이터를 반환하지만, 추후 API로 교체할 때는 이 파일 내부의 함수 구현만 바꾸면 되고 페이지/컴포넌트 코드는 수정할 필요가 없습니다.

## localStorage 스키마

진도 데이터는 `english-app-progress` 키로 저장되며 `schemaVersion` 필드를 포함합니다. 스키마가 바뀌면 `src/services/storage.ts`의 마이그레이션 함수에서 버전별 변환 로직을 추가할 수 있습니다.

## Firebase 연동 (Spark 무료 요금제)

Spark 요금제에서 무료로 쓸 수 있는 기능만 사용합니다.

| 기능 | 용도 | Spark 무료 한도 |
| --- | --- | --- |
| Authentication (Google) | 구글 로그인 | 무료 (전화 인증 제외) |
| Cloud Firestore | 사용자 프로필·학습 진도 저장 | 저장 1GiB, 읽기 5만/일, 쓰기 2만/일 |
| Analytics | 방문 통계 (프로덕션 빌드에서만) | 무료 |
| Hosting (선택) | 사이트 배포 | 저장 10GB, 전송 360MB/일 |

Cloud Storage·Cloud Functions는 Blaze(종량제) 요금제가 필요하므로 사용하지 않습니다.

### 데이터 구조

```
users/{uid}
  displayName, email, photoURL, lastLoginAt   # 로그인 시 갱신
  progress: { schemaVersion, grammar, reading, wrongAnswers }
  progressUpdatedAt
```

- 로그인하면 Firestore 진도를 1회 읽어 로컬 진도와 항목별로 병합합니다 (더 최근에 푼 기록 우선, 오답은 문제 ID로 합침).
- 이후 진도가 바뀌면 1.5초 동안 모았다가 한 번에 저장해 쓰기 횟수를 아낍니다.
- 로그아웃하면 브라우저의 진도만 비우고 Firestore 데이터는 유지됩니다.

### Firebase 콘솔 설정 (최초 1회)

1. **Authentication → 로그인 방법 → Google** 사용 설정
2. **Authentication → 설정 → 승인된 도메인**에 배포 도메인 추가 (`localhost`는 기본 포함)
3. **Firestore Database → 데이터베이스 만들기** (프로덕션 모드, 리전은 `asia-northeast3` 서울 권장)
4. 보안 규칙 배포: `firestore.rules`의 내용을 콘솔의 **Firestore → 규칙** 탭에 붙여넣거나 CLI로 배포

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
# (선택) Firebase Hosting 배포
npm run build && firebase deploy --only hosting
```

보안 규칙은 로그인한 사용자가 자기 문서(`users/{uid}`)만 읽고 쓸 수 있게 제한합니다. 웹 설정값(`apiKey` 등)은 공개되어도 되는 식별자이며, 다른 프로젝트를 쓰려면 `.env.example`을 `.env.local`로 복사해 값을 바꾸면 됩니다.
