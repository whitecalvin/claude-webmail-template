# GXWebMail

**언어:** [English](README.md) · 한국어

기업용 웹메일 클라이언트(국내 사내 메일 시스템, Google Workspace·Microsoft 365 메일과 유사한 성격)의 고품질 UI 프로토타입입니다. Next.js App Router 기반이며, 전부 클라이언트 사이드로 동작하고 별도 백엔드가 없습니다.

## 이 프로젝트의 성격

이 프로젝트는 **디자인·인터랙션 프로토타입**이며, 실제 서비스되는 메일 서버/클라이언트가 아닙니다.

- **백엔드도 데이터베이스도 없습니다.** 받은편지함, 관리자 콘솔, 주소록, 캘린더 등 모든 데이터는 `lib/`의 mock 데이터로 시드된 React state로만 존재합니다. 페이지를 새로고침하면 전부 초기 mock 데이터로 리셋됩니다.
- **실제 인증이 없습니다.** 로그인/회원가입은 값이 비어있지만 않으면 무엇을 입력해도 통과하며, `localStorage`에 플래그 하나만 남깁니다.
- 일부 기능은 의도적으로 "UI만 있고 실제 로직은 없는" 데모입니다 — 작성 화면의 AI 톤 변경 버튼, 시작 가이드(product tour)의 체크리스트, 공용 메일함 화면의 예약 발송 흐름이 여기에 해당합니다.
- mock 데이터 기반이긴 하지만, **모든 인터랙션 요소는 완전히 연결되어 있어야 합니다.** 무언가를 클릭했을 때 항상 눈에 보이는 실제 상태 변화나 피드백(토스트, 모달, 목록 갱신 등)이 있어야 하며, 아무 반응 없는 버튼은 없어야 합니다. 그런 버튼을 발견했다면 버그입니다.

## 기술 스택

- [Next.js 16](https://nextjs.org) (App Router), [React 19](https://react.dev), TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- 아이콘: [lucide-react](https://lucide.dev)

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)을 엽니다. 로그인/회원가입 관련 라우트는 `/login`으로 이동하지만, 메인 메일 화면(`/`)은 로그인 없이도 바로 접근됩니다 — 어차피 전부 mock 상태이기 때문입니다.

기타 스크립트:

```bash
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 빌드 서빙
npm run lint    # eslint
```

## 프로젝트 구조

```
app/                  라우트 (App Router) — 화면·섹션별 폴더
components/
  admin/              관리자 콘솔 (13개 탭 + 모바일 버전)
  banner/             전역/인라인 배너
  calendar/           캘린더 그리드 뷰 (일/주/월/모바일)
  compose/            메일 작성 모달 + 일반/서식 텍스트 공용 에디터
  contacts/           주소록 + 조직도 뷰
  customizer/         실시간 테마 커스터마이저 패널
  layout/             앱 셸, 내비게이션 레일, 상단바, 사이드바
  mail/               받은편지함 목록, 읽기창, 회의 초대 카드
  notifications/      알림 벨 팝오버
  overlay/            공용 Modal / Drawer / ConfirmDialog / BottomSheet / ActionSheet
  settings/           설정 화면 (데스크톱 + 모바일)
  toast/              토스트 스택
  tour/               최초 실행 가이드 투어
  ui/                 저수준 공용 컨트롤: Checkbox, Dropdown, Switch
context/              전역 React 상태: 메일 데이터, 테마, 토스트
lib/                  mock 데이터(기능별 파일 하나씩)와 소규모 유틸리티
types/                기능별로 묶인 공용 TypeScript 타입
```

## 디자인 시스템 메모

- **스타일이 적용되는 요소에는 네이티브 폼 컨트롤을 쓰지 않습니다.** 체크박스·드롭다운·토글 스위치는 전부 `components/ui/*`의 커스텀 컴포넌트이며, 실제 `<button>` 요소로 렌더링됩니다 (`<input type="checkbox">` / `<select>` 아님). 그래야 브라우저·OS마다 다른 네이티브 UI가 노출되지 않고 일관된 디자인을 유지할 수 있습니다.
- disabled가 아닌 모든 `<button>` / `[role="button"]`에는 전역적으로 `cursor: pointer`가 적용됩니다 (`app/globals.css` 참고) — 브라우저 기본값은 `<button>`에 이 커서를 적용하지 않습니다.
- 앱 전체는 커스터마이저를 통해 실시간으로 테마를 바꿀 수 있습니다 (기본/강조 색상, 폰트, 밀도, 모서리, 레이아웃 스타일, 라이트/다크). 게시된 테마 설정은 `localStorage`에 저장되며, 커스터마이저 패널 자체는 메인 메일 화면에서만 마운트됩니다.

## 알려진 한계 (백엔드가 없다는 전제하에 의도된 것)

- 페이지를 새로고침하면 메일, 관리자 콘솔 등 대부분의 변경 가능한 상태가 mock 시드 데이터로 리셋됩니다.
- 다중 사용자, 실시간 동기화, 서버 사이드 검증이 없습니다.
- 일부 관리자·보안 작업(계정 삭제, 세션 강제 종료 등)은 로컬 상태만 바꾸고 토스트를 띄울 뿐, 실제로 어딘가에 요청을 보내지 않습니다.

## 기여 · 확장 시 참고

새 화면이나 기능을 추가할 때는 먼저 `components/ui/`를 확인하세요 — `Checkbox`, `Dropdown`, `Switch` 세 가지 프리미티브가 대부분의 폼 컨트롤 요구를 충족하며, 앱 전체의 시각적 일관성을 유지해 줍니다. 이 Next.js 버전과 관련된 에디터/에이전트 설정 관련 안내는 `AGENTS.md`를 참고하세요.
