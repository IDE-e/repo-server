import { getGlobalSingleton } from "src/common/global-singleton";
import { GalleryStoreDto } from "./dto/gallery.dto";
import { seedGalleryStore } from "./gallery.seed";

type GalleryStore = { value: GalleryStoreDto };

export function getGalleryStore(): GalleryStore {
  return getGlobalSingleton<GalleryStore>("__mockGallery", () => ({
    value: seedGalleryStore(),
  }));
}
