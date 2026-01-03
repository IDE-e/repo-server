import { getGlobalSingleton } from "src/common/global-singleton";
import { DIFF_SEED_BASE } from "./diff.seed";
import { DiffPayloadDto } from "./dto/diff.dto";

type DiffStore = { value: DiffPayloadDto };

function createSeed(): DiffPayloadDto {
  return {
    ...DIFF_SEED_BASE,
    updatedAt: new Date().toISOString(),
  };
}

export function getDiffStore(): DiffStore {
  // Keeps data across HMR/dev reloads via globalThis.__mockDiff
  return getGlobalSingleton<DiffStore>("__mockDiff", () => ({
    value: createSeed(),
  }));
}

export function resetDiffStore(): DiffPayloadDto {
  const store = getDiffStore();
  store.value = createSeed();
  return store.value;
}
