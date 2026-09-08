// Mock data for the attachments (Files) browser page.
export const FILE_TYPES = [
  { name: "문서", count: 1420, color: "#2B4BF2" },
  { name: "스프레드시트", count: 982, color: "#2E8B5B" },
  { name: "프레젠테이션", count: 412, color: "#E0AC4A" },
  { name: "이미지", count: 806, color: "#6B5CA8" },
  { name: "압축", count: 318, color: "#C0433B" },
  { name: "기타", count: 244, color: "#9A9EA5" },
];

export const FILE_PERIODS = ["최근 7일", "최근 30일", "올해", "전체 기간"];

export interface FileCard {
  name: string;
  ext: string;
  from: string;
  size: string;
  bg: string;
  fg: string;
}

export const FILE_CARDS: FileCard[] = [
  { name: "인프라_증설_제안서_v4.pdf", ext: "PDF", from: "박서준", size: "4.2 MB", bg: "#FBECEA", fg: "#C0433B" },
  { name: "2026_예산_시뮬레이션.xlsx", ext: "XLS", from: "이수민", size: "1.8 MB", bg: "#E9F3EC", fg: "#2E8B5B" },
  { name: "아틀라스_킥오프.pptx", ext: "PPT", from: "최민서", size: "28.4 MB", bg: "#FDF0E4", fg: "#B4740F" },
  { name: "조직개편안_최종.docx", ext: "DOC", from: "김하늘", size: "642 KB", bg: "#ECEFFE", fg: "#2B4BF2" },
  { name: "데이터센터_실측.jpg", ext: "IMG", from: "윤재호", size: "6.1 MB", bg: "#EDEBF7", fg: "#6B5CA8" },
  { name: "계약서_스캔본.pdf", ext: "PDF", from: "장미래", size: "12.8 MB", bg: "#FBECEA", fg: "#C0433B" },
  { name: "QA_결함목록_0902.xlsx", ext: "XLS", from: "강태윤", size: "884 KB", bg: "#E9F3EC", fg: "#2E8B5B" },
  { name: "브랜드_가이드.pdf", ext: "PDF", from: "배수아", size: "44.2 MB", bg: "#FBECEA", fg: "#C0433B" },
  { name: "로그_아카이브.zip", ext: "ZIP", from: "시스템", size: "186 MB", bg: "#F0F0EC", fg: "#5C6068" },
  { name: "채용공고_9월.docx", ext: "DOC", from: "김하늘", size: "318 KB", bg: "#ECEFFE", fg: "#2B4BF2" },
  { name: "Partner_Pricing.pdf", ext: "PDF", from: "Alex Meyer", size: "2.4 MB", bg: "#FBECEA", fg: "#C0433B" },
  { name: "회의실_배치도.png", ext: "IMG", from: "오세린", size: "1.1 MB", bg: "#EDEBF7", fg: "#6B5CA8" },
];

export const FILE_SORTS = ["최신순", "크기순", "보낸사람"];

export const BIG_LINKS = [
  { name: "브랜드_가이드_전체.zip", state: "활성", pct: 62, expiry: "5일 남음", downloads: 14, size: "1.2 GB" },
  { name: "제품_영상_최종.mp4", state: "활성", pct: 84, expiry: "12일 남음", downloads: 3, size: "840 MB" },
  { name: "데이터셋_2026Q2.csv", state: "만료 임박", pct: 6, expiry: "내일 만료", downloads: 41, size: "220 MB" },
  { name: "회계감사_자료.zip", state: "만료됨", pct: 0, expiry: "만료", downloads: 8, size: "96 MB" },
];
