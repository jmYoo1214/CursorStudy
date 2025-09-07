# YouTube 요약기 Chrome 확장 프로그램

YouTube 영상을 간편하게 요약해주는 Chrome 확장 프로그램입니다.

## 🚀 주요 기능

- YouTube 영상 페이지에서 원클릭으로 요약 요청
- 깔끔한 팝업 인터페이스
- 실시간 요약 상태 표시
- 에러 처리 및 사용자 안내

## 📁 파일 구조

```
youtube-summary-extension/
├── manifest.json          # 확장 프로그램 메타데이터
├── popup.html            # 팝업 UI
├── popup.js              # 팝업 로직
├── background.js         # 백그라운드 서비스 워커
├── content.js            # YouTube 페이지 상호작용
├── icon16.png            # 16x16 아이콘
├── icon48.png            # 48x48 아이콘
├── icon128.png           # 128x128 아이콘
└── README.md             # 이 파일
```

## 🛠️ 설치 방법

### 1. 개발자 모드로 설치

1. Chrome 브라우저에서 `chrome://extensions/` 접속
2. 우측 상단의 "개발자 모드" 토글 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `youtube-summary-extension` 폴더 선택

### 2. Webhook URL 설정

`background.js` 파일을 열어서 다음 부분을 수정하세요:

```javascript
const WEBHOOK_URL = "https://your-webhook-url.com/summarize";
```

실제 서버의 webhook URL로 변경해주세요.

## 🔧 사용법

1. YouTube 영상 페이지로 이동
2. 브라우저 툴바의 확장 프로그램 아이콘 클릭
3. "요약하기" 버튼 클릭
4. 요약 결과 확인

## 📡 Webhook API 사양

### 요청

**POST** `https://your-webhook-url.com/summarize`

```json
{
  "youtube_url": "https://www.youtube.com/watch?v=abc123"
}
```

### 응답

```json
{
  "summary": "이 영상은 경제 위기에 대한 분석을 다루며..."
}
```

## 🧪 테스트

### 테스트 시나리오

| 시나리오                               | 기대 결과                                    |
| -------------------------------------- | -------------------------------------------- |
| YouTube 영상 페이지에서 확장 버튼 클릭 | 팝업에 "요약하기" 버튼 노출                  |
| 요약하기 버튼 클릭                     | 서버에 URL 전송, 응답 수신 후 요약 내용 표시 |
| 비YouTube 페이지에서 버튼 클릭         | 서버 요청 X 또는 에러 안내                   |
| 서버 오류 발생 시                      | "요약을 불러오지 못했습니다" 메시지 출력     |

## 🔒 권한 설명

- `activeTab`: 현재 활성 탭의 URL 접근
- `scripting`: 스크립트 실행 권한
- `tabs`: 탭 정보 접근
- `host_permissions`: YouTube 도메인 접근

## 🚧 개발자 정보

### 주요 파일 설명

- **manifest.json**: 확장 프로그램의 메타데이터와 권한 정의
- **popup.html/js**: 사용자가 보는 팝업 인터페이스
- **background.js**: 백그라운드에서 실행되는 서비스 워커
- **content.js**: YouTube 페이지에서 실행되는 스크립트

### 확장 아이디어

- 자막 자동 추출 및 활용
- 다국어 요약 지원
- 요약 결과 저장/공유 기능
- 요약 방식 선택 (짧게/길게)

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

문제가 발생하거나 개선 사항이 있으시면 이슈를 등록해주세요.
