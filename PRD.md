
# 랜덤 캐릭터 합성 AI 게임 - PRD (요약)

## 1. 개요
- 랜덤 파츠(동물, 과일, 사물 등)를 합성해 캐릭터를 생성하는 모바일 게임.
- 기본은 **무료 뽑기**, 광고(또는 프리미엄 버튼)를 통해 **AI 기반 프리미엄 뽑기** 제공.
- 캐릭터는 도감에 수집되며, 일부는 프리미엄 전용 캐릭터로 표시.

## 2. 핵심 기능

### 2.1 클라이언트 (React Native + Expo)
- 홈 화면
  - 무료 뽑기 버튼
  - 프리미엄 뽑기 버튼 (현재는 광고 자리, 추후 보상형 광고 SDK 연동)
  - 최근 조합 파츠 표시
  - 도감으로 이동 버튼
- 결과 화면
  - 캐릭터 이미지
  - 이름 / 파츠 조합 / 설명
  - 프리미엄 캐릭터 뱃지 표시
- 도감 화면
  - 수집된 캐릭터 목록 (그리드)
  - 프리미엄 여부 표시

### 2.3 파츠 카테고리 및 확장 로드맵
- 무료 카테고리(초기 데이터는 전부 프리셋으로 준비)
  - 동물(현존): 고양이, 강아지, 코끼리, 해마, 돌고래, 수달, 여우, 판다, 하마, 미어캣, 올빼미 등
  - 곤충/소형생물: 딱정벌레, 사마귀, 잠자리, 무당벌레, 나비, 달팽이, 지렁이, 개미 등
  - 과일: 딸기, 바나나, 사과, 포도, 수박, 파인애플, 망고, 블루베리, 키위 등
  - 야채/식물: 당근, 브로콜리, 옥수수, 호박, 가지, 양배추, 콩나물, 버섯, 선인장, 해바라기 등
  - 사물/도구: 망원경, 우산, 물총, 연필, 북, 탬버린, 종이비행기, 풍선, 찻주전자, 롤러 스케이트 등
  - 자연/기상: 구름, 별, 달, 돌멩이, 파도, 눈송이, 번개, 무지개, 불꽃 등
  - 판타지/마스코트(라이트): 정령, 로봇, 요정, 슬라임, 작은 고블린, 작은 용(미니 드래곤) 등
- 프리미엄 전용 카테고리
  - 고대/멸종 생물: 티라노사우루스, 트리케라톱스, 스테고사우루스, 파라사우롤로푸스, 매머드, 검치호, 아르케옵테릭스, 안킬로사우루스 등
  - 희귀/신화 생물 및 테마팩 대비: 그리핀, 페가수스, 크라켄, 봉황, 키메라, 유니콘(프리미엄 변형), 사이버 고양이, 네온 돌고래, 드론 벌, 메카 토끼 등
- 순차 업데이트 로드맵
  - Phase 0(프로토): 무료 카테고리에서 각 8~12개로 좁게 시작, 전부 프리셋 데이터로 안정화
  - Phase 1(소프트런치): 무료 카테고리 확장(각 15~20개), 자연/기상 + 판타지 라이트 추가, 프리미엄에 멸종 생물 6~8종 투입
  - Phase 2(테마 업데이트): 사막/심해/우주/사이버 테마팩으로 무료 5~10개 + 프리미엄 2~3개씩 추가, 멸종+신화 시즌 한정 캐릭터 투입
  - Phase 3(라이브 서비스): 월간 시즌 테마(봄꽃/여름축제/핼러윈/겨울왕국), 시즌 한정 프리미엄 파츠 추가

### 2.2 서버 (Node.js + Express)
- `POST /generate-character`
  - 요청:
    - `parts: string[]`
    - `premium?: boolean`
    - `deviceId?: string` (premium 요청 시 필수)
  - 응답:
    - `name`, `description`, `imageUrl`, `premium`
- 무료 뽑기
  - 캐시에서 조회 후 없으면 AI 시도 → 실패 시 fallback 캐릭터
- 프리미엄 뽑기
  - `premiumUsage` 확인 (일일 제한)
  - 허용 시 AI 생성 시도
  - 실패 시 fallback 캐릭터

## 3. AI 흐름

### 3.1 텍스트 생성 (LLM)
- 입력: 파츠 목록 (예: ["코끼리", "딱정벌레", "지렁이"])
- 출력(JSON):
  - `name`: 짧고 귀여운 한국어 캐릭터 이름
  - `description`: 2~4문장, 동화 같은 설명
  - `image_prompt`: 영어 이미지 프롬프트 (2D 캐릭터, 단색 배경, 심플한 라인아트 등 포함)

### 3.2 이미지 생성
- 모델: `gpt-image-1`
- 프롬프트: `image_prompt`
- 사이즈: `512x512`
- 실패 시: placeholder 이미지 URL 사용

### 3.3 실패 전략
- OpenAI 설정이 없거나 호출 실패 시:
  - 이름: 파츠 문자열 결합
  - 설명: 단순 조합 설명
  - 이미지: `https://placekitten.com/512/512`

## 4. 프리미엄 흐름 & 일일 제한

### 4.1 흐름
1. 클라이언트가 `premium: true`와 `deviceId`를 포함하여 `/generate-character` 호출
2. 서버는 `premiumUsageStore`에서 오늘 사용량 확인
3. 제한 미만이면:
   - AI 기반 캐릭터 생성 시도
   - 성공 시 `incrementPremiumUsage(deviceId)`
4. 이미 제한에 도달한 경우:
   - HTTP 429 + 에러 메시지 반환

### 4.2 premiumUsageStore (현재 구현)
- 인메모리 Map 구조
- key: `deviceId|YYYY-MM-DD`
- value: `usage_count`
- 상수: `MAX_DAILY_PREMIUM = 5`

## 5. 캐시 구조 (현재 구현)

- 인메모리 Map
  - key: parts_key (`정렬된 파츠를 '|'로 조인`)
  - value: `GeneratedCharacter`
- 무료 뽑기 시:
  - 캐시 우선 조회 → 있으면 그대로 사용
  - 없으면 AI 시도 → 실패 시 fallback 후 캐시에 저장
- 프리셋 캐릭터 예:
  - "고양이|비둘기" → "고둘기"

## 6. DB 설계 (미래용, 아직 코드에 직접 연결 X)

### 6.1 characters
- 캐릭터 마스터 테이블
- 컬럼:
  - id, name, description, image_url
  - origin_type: 'preset' | 'ai_premium' | 'ai_free' | 'manual'
  - rarity, is_active, created_at, updated_at

### 6.2 character_parts
- 캐릭터를 구성하는 파츠 목록
- 컬럼:
  - id, character_id, part_name, part_order

### 6.3 character_cache
- parts_key → character_id 매핑
- 지금은 인메모리로만 구현되어 있으나, 확장 시 DB 테이블로 이전

### 6.4 premium_usage
- 디바이스/날짜별 프리미엄 사용량
- 지금은 인메모리 Map으로 구현, 향후 테이블로 이전 가능

### 6.5 character_draws
- 각 뽑기 로그 (언제, 어떤 파츠, 어떤 캐릭터, 무료/프리미엄 여부)
- 현재 구현 X, 향후 분석/밸런싱용으로 추가 예정

## 7. 실행 방법 (로컬 개발)

### 7.1 서버

```bash
cd server
cp .env.example .env   # OPENAI_API_KEY 설정 (없으면 fallback 모드)
npm install
npm run dev
# 서버가 http://localhost:4000 에서 실행됨
```

### 7.2 앱 (Expo)

```bash
cd app
npm install
npm run start
# Expo Dev Tools에서 에뮬레이터 또는 실제 기기로 실행
```

- 앱은 `http://localhost:4000`으로 서버를 호출하므로,
  - 같은 머신에서 서버와 Expo를 함께 실행하면 됨.
  - 실제 디바이스 테스트 시에는 API_BASE_URL을 머신 IP로 변경 필요.

## 8. 향후 확장 포인트

- 보상형 광고 SDK 연동 (프리미엄 뽑기 전에 광고 시청 강제)
- DB(PostgreSQL 등)와 premiumUsage, 캐시, 캐릭터 마스터 연동
- pre-generation 배치 스크립트로 캐릭터 풀 미리 생성
- 세계관 확장 (코딱지 유니버스, 해마딸기, 고둘기 등 프리셋 캐릭터 추가)
- 랭킹, 일일 미션, 업적 시스템 도입

## 9. 파츠 추출 규칙 (가챠 로직)
- 공통: 기본 조합 파츠 수는 2개이며, 3개 조합은 광고 시청 조건을 충족해야 함.
- 무료 뽑기:
  - 파츠 풀: 무료 카테고리만 사용.
  - 기본: 서로 다른 카테고리 2개 선택(중복 파츠 없음).
  - 3개 조합: 광고 시청 후 1시간 동안 3개 선택 1회 허용. 1시간 경과 후 재광고 시청 시 다시 3개 선택 가능.
  - 광고 미시청 시 3개 선택 시도 → 광고 유도 UI로 전환.
- 프리미엄 뽑기:
  - 파츠 풀: 모든 카테고리(무료 + 프리미엄)에서 추출, 프리미엄 전용 파츠 포함.
  - 기본: 서로 다른 카테고리 2개 선택(중복 파츠 없음).
  - 3개 조합: 무료와 동일한 광고 시청 조건 적용(광고 시청 → 1시간 유효, 재시도 시 재광고).
- 추가 고려: 테마/시즌 배포 시 해당 테마의 파츠 등장 가중치 보정, 파츠 중복 방지 옵션, 카테고리 다양성 확보 로직을 추후 추가.

## 10. 광고 시청 및 쿨타임 검증 설계
- 목적: 클라이언트 변조를 막고, “3개 조합 가능” 상태를 서버가 최종 판단.
- 상태 단위: 디바이스 기준(`deviceId`). 무료/프리미엄 모두 동일하게 적용.
- 서버 검증 흐름(제안):
  1) 광고 SDK 완료 콜백 → 앱에서 `/ad/claim-three-parts` (또는 `/generate-character` 호출 시 `adToken` 포함) 호출
  2) 서버는 `deviceId`로 “3개 허용” 상태를 `Map<deviceId, expiryTimestamp>`에 저장 (TTL 1시간)
  3) 이후 `/generate-character`에서 `parts.length === 3` 요청 시 서버가 해당 TTL 상태를 확인해 허용/거부
  4) 만료 시 403/400 + “광고 시청 필요” 에러 코드 반환 → 클라이언트에서 광고 유도
- 최소 변경안(빠른 적용): `/generate-character`에 `deviceId`와 `adToken(optional)` 추가. `adToken`은 서버에서 `deviceId` + 만료시각을 HMAC 서명한 짧은 토큰으로 발급 → 스토리지 없이 stateless 검증 가능.
- 단순 구현안(프로토): 인메모리 Map으로 TTL 관리, API는 `/ad/claim-three-parts`로 토큰 발급 없이 허용 플래그만 저장. 추후 HMAC 토큰 방식으로 교체.
- 응답 에러 코드 예시:
  - `AD_REQUIRED_FOR_THREE_PARTS`: 광고 미시청으로 3개 요청 거부
  - `AD_COOLDOWN_EXPIRED`: 1시간 만료 → 재광고 필요

## 11. 유저 플로우 (무료/프리미엄 공통)
1) 앱 진입 → 홈 화면 노출
   - 최신 조합 표시, 무료/프리미엄 뽑기 버튼, 도감 이동 버튼
2) 무료 뽑기(기본 2개)
   - 버튼 클릭 → 서버 호출(`/generate-character`, parts=2, premium=false)
   - 성공 → 결과 화면 표시 → 도감에 자동 저장
3) 무료 뽑기(3개 요청)
   - 버튼 클릭(3개 선택 시도) → 광고 미시청 상태면 광고 유도 팝업
   - 광고 시청 완료 → `/ad/claim-three-parts` (또는 adToken 발급)
   - 1시간 내 `/generate-character` parts=3 요청 가능(미통과 시 에러 코드 반환 → 광고 유도)
4) 프리미엄 뽑기(기본 2개)
   - 버튼 클릭 → `deviceId` 포함 서버 호출(premium=true)
   - 서버에서 일일 제한 확인(초과 시 429) → 성공 시 결과 화면 + 프리미엄 뱃지
5) 프리미엄 뽑기(3개 요청)
   - 무료와 동일한 광고 시청 흐름(1시간 유효), 단 프리미엄 파츠 풀에서 조합
6) 결과 화면
   - 이미지/이름/설명/파츠 조합, 프리미엄 여부 표시
   - “한 번 더 뽑기”, “도감 보기” 버튼
7) 도감 화면
   - 로컬/서버(향후) 수집 목록 표시, 프리미엄 뱃지 표시
8) 오류/쿨다운 시나리오
   - 프리미엄 제한 초과 → 429 + 메시지
   - 3개 조합 광고 미시청/만료 → 커스텀 에러 코드 → 광고 유도 UI

## 12. 도감 동기화를 위한 로그인/계정 전략
- 목표: 기기 교체/재설치 시 도감 유지, 프리미엄 사용량/광고 쿨타임 상태 서버 권한 검증.
- 최소안(즉시 적용 가능):
  - 무계정: `deviceId`만으로 도감·프리미엄·광고 상태를 관리. 서버에 `deviceId`로 도감 레코드 저장.
  - 한계: 기기 변경 시 도감 이전 불가, `deviceId` 재설정으로 어뷰징 가능.
- 권장 베타안:
  - 소셜 로그인(Apple/Google/Guest) 선택형. 게스트 시작 → 나중에 Apple/Google로 업그레이드 시 서버에서 도감 마이그레이션.
  - 토큰: `/auth/login` -> JWT(access)/refresh 발급. 게스트는 `/auth/guest`로 임시 계정 발행.
  - 서버 스토리지 키: `userId`(선호) + `deviceId`(부가). 도감/프리미엄 사용량/광고 티켓 모두 `userId` 기준, fallback로 `deviceId`.
- 서버 엔드포인트(초안):
  - `POST /auth/guest` → { userId, accessToken, refreshToken }
  - `POST /auth/login` (소셜 토큰) → { userId, accessToken, refreshToken }
  - `POST /auth/refresh` → 토큰 재발급
  - 도감 관련 API 시 Authorization 헤더 필요. 광고/프리미엄 제어도 토큰 기반으로 강화.
- 마이그레이션 흐름:
  - 게스트 플레이 중 → 로그인 시도 → 서버에서 `deviceId` 기반 도감/사용량을 `userId`로 병합 후 `deviceId` 기록 갱신.
- 보안/어뷰징 대응:
  - `deviceId`만 있을 때는 프리미엄/광고 한도를 더 보수적으로 설정.
  - 로그인 유저는 서버 authoritative: adToken/HMAC 검증 + 일일 프리미엄 사용량 `userId` 기준.

## 13. API 스펙 (초안)
### 인증
- `POST /auth/guest`
  - 요청: `{ deviceId }`
  - 응답: `{ userId, accessToken, refreshToken }`
  - 목적: 게스트 계정 발급. 추후 소셜 로그인 시 이 userId로 도감/사용량 병합.
- `POST /auth/login`
  - 요청: `{ provider: "apple"|"google", idToken, deviceId }`
  - 응답: `{ userId, accessToken, refreshToken }`
  - 목적: 소셜 로그인 및 기존 게스트 도감 병합.
- `POST /auth/refresh`
  - 요청: `{ refreshToken }`
  - 응답: `{ accessToken, refreshToken }`
  - 목적: 액세스 토큰 갱신.
- 공통: Authorization: `Bearer <accessToken>` 필요(게스트 포함). 미인증 상태는 제한된 엔드포인트만 가능(`/generate-character`는 최소 deviceId 인증 없이 허용 가능하나, 도감 동기화/광고/프리미엄 한도는 인증 필요로 전환 권장).

### 광고/3개 조합
- 옵션 A(Stateless 권장): `POST /ad/claim-three-parts`
  - 요청: `{ deviceId }` (인증 토큰 포함 시 userId 기준)
  - 응답: `{ adToken, expiresAt }` (adToken = HMAC(deviceId|expires))
  - 사용: `/generate-character` 호출 시 `adToken` 포함하면 서버가 HMAC 검증 후 3파츠 승인.
- 옵션 B(프로토): 서버 메모리/스토리지에 `{ deviceId, expiresAt }` 저장 후 `/generate-character`에서 조회.

### 캐릭터 생성
- `POST /generate-character`
  - 요청: `{ parts: string[], premium?: boolean, deviceId?: string, adToken?: string }`
  - 검증:
    - `parts.length === 2` → OK
    - `parts.length === 3` → adToken 검증(만료/서명 실패 시 403 `AD_REQUIRED_FOR_THREE_PARTS`)
    - `premium === true` → deviceId 필수, 프리미엄 일일 한도 체크(유저 로그인 시 userId 기준)
  - 응답: `{ name, description, imageUrl, premium }`
  - 에러 코드 예시: `DAILY_PREMIUM_LIMIT_EXCEEDED`, `AD_REQUIRED_FOR_THREE_PARTS`, `AD_COOLDOWN_EXPIRED`

### 도감/컬렉션
- `GET /collection`
  - 요청: Authorization 필요. 옵션: `limit`, `cursor`
  - 응답: `{ items: CollectedCharacter[], nextCursor? }`
- `POST /collection`
  - 요청: `{ character: CharacterResponse, parts: string[], generatedAt, premium }`
  - 목적: 생성 후 서버에 도감 저장(중복 여부는 서버 정책에 따라 허용/제거).
- `DELETE /collection/:id` (옵션)
  - 요청: 경량화/정리용.
- `GET /collection/stats` (옵션)
  - 응답: `{ total, premiumCount, categories: Record<string, number> }`

### 관리/운영(후순위)
- `GET /preset-parts` / `GET /preset-characters` → 앱 초기 로드/캐시용
- `POST /events` → 클라이언트 이벤트 로깅(광고 시청, 실패, 재시도 등)

## 14. 오디오(캐릭터 생성 및 도감 재생)
- 목표: 캐릭터 생성 시 짧은 효과음 재생, 도감 카드 클릭 시 캐릭터별 전용/테마 사운드 재생.
- 전략
  - 초기: 정적 SFX 파일(짧은 0.5~1.5초) 사용. 생성 결과에 사운드 URL을 붙여주되, 없을 시 공통 기본음.
  - 확장: 파츠 조합 기반 SFX 루팅(예: 동물계 음향 + 과일계 톤을 믹스한 프리셋), 또는 TTS로 캐릭터 이름을 읽어주는 모드 추가.
- 데이터 모델
  - `GeneratedCharacter` 응답에 `soundUrl?: string` 필드 추가(선택).
  - 사운드 메타: `{ id, category, premiumOnly?, url, durationMs, volumeHint }`
  - 매핑 규칙: 파츠 카테고리별 기본 SFX / 희귀(프리미엄) 전용 SFX / 폴백 SFX.
- UX 요구사항
  - 결과 화면: 생성 즉시 1회 짧은 재생(사용자 설정에서 음소거 가능).
  - 도감: 카드 탭 시 재생, 여러 번 탭하면 이전 재생을 중단 후 재시작, 무음 옵션 제공.
  - 무음/사운드 토글: 앱 설정 또는 헤더 버튼에 저장(AsyncStorage).
- 기술적 가이드
  - 포맷: `mp3` 또는 `aac`, 길이 ≤ 2초 권장, 볼륨 노멀라이즈.
  - 캐싱: 앱 측 prefetch(도감 목록 로딩 시 썸네일처럼 사운드도 옵션 prefetch).
  - 실패 시: `soundUrl` 없거나 로드 실패 → 무음으로 처리(UX 방해 최소화).

## 15. 도감 슬롯 제한 & 확장 정책
- 기본 슬롯: 50개(무료).
- 광고 확장: 광고 시청 1회당 +10개 슬롯 부여, 최대 5회(총 50 → 100개 상한).
- 상한: 100개(광고 확장 포함).
- 소유 주체: `userId`(로그인 사용) 기준. 비로그인 시 `deviceId` 기준에서 관리하나, 로그인 시 병합.
- 서버 권한 검증:
  - `GET /collection/slots` → `{ maxSlots, used }` 제공.
  - `POST /ad/claim-collection-slots` → 광고 완료 후 호출, 서버가 +10 적용. 하드 상한 100 초과 불가.
  - `POST /collection` 시 `used >= maxSlots`면 403 `COLLECTION_FULL` 반환.
- 클라이언트 UX:
  - 도감 상단에 `used/max` 표시, 꽉 찼을 때 “슬롯 확장(광고)” CTA 노출.
  - 광고 시청 후 서버 적용 성공 시 토스트/배지로 안내.
- 주의:
  - 광고 실패/취소 시 슬롯 미지급.
  - 멀티 디바이스 동시 사용 시 서버 값을 매 호출마다 갱신 표시.
