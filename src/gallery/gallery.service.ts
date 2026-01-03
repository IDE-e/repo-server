import { Injectable } from "@nestjs/common";
import { GalleryStoreDto, GalleryPayloadDto } from "./dto/gallery.dto";
import { getGalleryStore } from "./gallery.store";

@Injectable()
export class GalleryService {
  getStore(): GalleryStoreDto {
    const store = getGalleryStore();
    return structuredClone(store.value);
  }

  getPayload(): GalleryPayloadDto {
    const store = getGalleryStore();
    const base = store.value;

    const usageTemplateFn = (variant: string) =>
      `<Button variant="${variant}">\n  Click Me\n</Button>`;

    return {
      meta: base.meta,
      categories: base.categories,
      button: {
        ...base.button,
        usageTemplate: usageTemplateFn.toString(),
      },
      badge: base.badge,
      infoCard: base.infoCard,
    };
  }

  patchVersion(input: { version?: unknown }): GalleryStoreDto {
    const store = getGalleryStore();
    const cur = store.value;

    const next: GalleryStoreDto = {
      ...cur,
      meta: {
        ...cur.meta,
        version:
          typeof input.version === "string" ? input.version : cur.meta.version,
        updatedAt: new Date().toISOString(),
      },
    };

    store.value = next;
    return structuredClone(store.value);
  }
}
