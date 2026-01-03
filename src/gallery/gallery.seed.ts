import { GalleryStoreDto } from "./dto/gallery.dto";

export function seedGalleryStore(): GalleryStoreDto {
  return {
    meta: {
      title: "UI Component Gallery",
      version: "v0.1.0",
      updatedAt: new Date().toISOString(),
    },
    categories: [
      { id: "all", label: "All", activeByDefault: true },
      { id: "buttons", label: "Buttons", activeByDefault: false },
      { id: "badges", label: "Badges", activeByDefault: false },
      { id: "cards", label: "Cards", activeByDefault: false },
    ],
    button: {
      description:
        "액션을 트리거하는 기본 버튼 컴포넌트입니다. 상태와 variant에 따라 스타일이 달라집니다.",
      variants: ["primary", "secondary", "ghost"],
    },
    badge: {
      description:
        "상태나 타입을 간단히 표시하는 배지 컴포넌트입니다. 로그 레벨, 태그, 진행 상태 등에 활용합니다.",
      examples: [
        { label: "ACTIVE", tone: "info", icon: "check" },
        { label: "WARNING", tone: "warning", icon: "dot" },
        { label: "ERROR", tone: "error", icon: "square" },
        { label: "DRAFT", tone: "draft", icon: "square" },
      ],
      usageSnippet:
        '<Badge variant="info">ACTIVE</Badge>\n' +
        '<Badge variant="warning">WARNING</Badge>\n' +
        '<Badge variant="error">ERROR</Badge>',
    },
    infoCard: {
      description:
        "통계, 상태, 설명 등을 간단히 보여주는 카드 컴포넌트입니다. 대시보드 위젯, 설정 안내 등에 활용할 수 있습니다.",
      examples: [
        {
          title: "Requests / min",
          value: "1,248",
          hint: "+12.4% vs last hour",
          tone: "info",
        },
        {
          title: "Error Rate",
          value: "0.37%",
          hint: "Within SLO (1%)",
          tone: "success",
        },
        {
          title: "Queue Length",
          value: "182",
          hint: "Check worker scale",
          tone: "warning",
        },
      ],
      usageSnippet:
        "<InfoCard\n" +
        '  title="Requests / min"\n' +
        '  value="1,248"\n' +
        '  hint="+12.4% vs last hour"\n' +
        '  tone="info"\n' +
        "/>",
    },
  };
}
