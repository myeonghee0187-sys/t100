export type Tea = {
  id: string;
  name: string;
  category: string;
  image: string;
  caffeine: string;
  recommendedTemperature: number | null;
  recommendedDuration: number;
  icedDuration: number;
  moodKeyword?: string;
  recommendationTitle?: string;
  recommendationDescription?: string;
  tasteLabel: string;
  tasteScore: number | null;
  tanninScore: number | null;
  bodyScore: number | null;
  preferredWaterSource: "purified" | "boiled" | "bottled";
  preferredDrinkMode: "hot" | "iced";
  color: string;
};

// Temperatures and hot durations follow Home. The design only supplies one iced
// example (180 seconds), used as the editable starting value for other teas.
// Empty copy and null scores mean that the corresponding detail was not supplied.
export const teas: Tea[] = [
  {
    id: "green-tea",
    name: "녹차",
    category: "녹차",
    image: "/assets/images/recommend-green.png",
    caffeine: "",
    recommendedTemperature: 70,
    recommendedDuration: 120,
    icedDuration: 180,
    moodKeyword: "집중",
    recommendationTitle: "연둣빛이 맑게 오르면\n머리도 한 번 정리돼요",
    recommendationDescription: "짧게 우려야 쓰지 않은 녹차",
    tasteLabel: "",
    tasteScore: null,
    tanninScore: null,
    bodyScore: null,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#B8C96A",
  },
  {
    id: "black-tea",
    name: "홍차",
    category: "홍차",
    image: "/assets/images/recommend-black.png",
    caffeine: "",
    recommendedTemperature: 95,
    recommendedDuration: 180,
    icedDuration: 180,
    moodKeyword: "피로",
    recommendationTitle: "붉게 짙어지는 3분,\n오후를 다시 여는 한 잔",
    recommendationDescription: "진하게 우려도 좋은 홍차",
    tasteLabel: "",
    tasteScore: null,
    tanninScore: null,
    bodyScore: null,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#DFD5D3",
  },
  {
    id: "oolong-tea",
    name: "우롱차",
    category: "우롱차",
    image: "/assets/images/recommend-oolong.png",
    caffeine: "",
    recommendedTemperature: 90,
    recommendedDuration: 180,
    icedDuration: 180,
    moodKeyword: "여유",
    recommendationTitle: "황금빛이 천천히 번지는\n느긋한 오후",
    recommendationDescription: "진하지 않게 즐기는 우롱차",
    tasteLabel: "",
    tasteScore: null,
    tanninScore: null,
    bodyScore: null,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#DFD5D3",
  },
  {
    id: "white-tea",
    name: "백차",
    category: "백차",
    image: "/assets/images/white-tea.png",
    caffeine: "낮음",
    recommendedTemperature: 90,
    recommendedDuration: 180,
    icedDuration: 180,
    tasteLabel: "단맛",
    tasteScore: 3,
    tanninScore: 1,
    bodyScore: 1,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#DFD5D3",
  },
  {
    id: "peppermint",
    name: "페퍼민트",
    category: "허브차",
    image: "/assets/images/peppermint.png",
    caffeine: "없음",
    recommendedTemperature: 100,
    recommendedDuration: 240,
    icedDuration: 240,
    tasteLabel: "청량",
    tasteScore: 5,
    tanninScore: 1,
    bodyScore: 1,
    preferredWaterSource: "boiled",
    preferredDrinkMode: "iced",
    color: "#AFCDBB",
  },
  {
    id: "chamomile",
    name: "캐모마일",
    category: "허브차",
    image: "/assets/images/chamomile.png",
    caffeine: "없음",
    recommendedTemperature: 95,
    recommendedDuration: 240,
    icedDuration: 180,
    tasteLabel: "단맛",
    tasteScore: 4,
    tanninScore: 1,
    bodyScore: 2,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#E8C55A",
  },
  {
    id: "rooibos",
    name: "루이보스",
    category: "허브차",
    image: "/assets/images/rooibos.png",
    // Preserve the supplied Home copy; its caffeine label needs design review.
    caffeine: "낮음",
    recommendedTemperature: 100,
    recommendedDuration: 300,
    icedDuration: 180,
    tasteLabel: "단맛",
    tasteScore: 3,
    tanninScore: 2,
    bodyScore: 3,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#DFD5D3",
  },
  {
    id: "hibiscus",
    name: "히비스커스",
    category: "허브차",
    image: "/assets/images/hibiscus.png",
    caffeine: "없음",
    recommendedTemperature: 100,
    recommendedDuration: 300,
    icedDuration: 180,
    tasteLabel: "산미",
    tasteScore: 5,
    tanninScore: 2,
    bodyScore: 2,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#B5265C",
  },
  {
    id: "puer",
    name: "보이차",
    category: "보이차",
    image: "/assets/images/puer.png",
    caffeine: "중간",
    recommendedTemperature: 100,
    recommendedDuration: 180,
    icedDuration: 180,
    tasteLabel: "단맛",
    tasteScore: 2,
    tanninScore: 2,
    bodyScore: 5,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#DFD5D3",
  },
  {
    id: "butterfly-pea",
    name: "버터플라이피",
    category: "",
    image: "",
    caffeine: "",
    recommendedTemperature: null,
    // Library supplies no brewing recommendation: use the editable Choice value.
    recommendedDuration: 150,
    icedDuration: 180,
    tasteLabel: "",
    tasteScore: null,
    tanninScore: null,
    bodyScore: null,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#5368A8",
  },
  {
    id: "barley",
    name: "보리차",
    category: "",
    image: "",
    caffeine: "",
    recommendedTemperature: null,
    recommendedDuration: 150,
    icedDuration: 180,
    tasteLabel: "",
    tasteScore: null,
    tanninScore: null,
    bodyScore: null,
    preferredWaterSource: "purified",
    preferredDrinkMode: "hot",
    color: "#8A5A35",
  },
];

export const browseTeaIds = [
  "white-tea",
  "peppermint",
  "chamomile",
  "rooibos",
  "hibiscus",
  "puer",
];

export const recommendationTeaIds = ["green-tea", "black-tea", "oolong-tea"];

export function getTea(id: string): Tea | undefined {
  return teas.find((tea) => tea.id === id);
}
