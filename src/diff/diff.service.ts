import { Injectable } from "@nestjs/common";
import { getDiffStore, resetDiffStore } from "./diff.store";
import { DiffPayloadDto } from "./dto/diff.dto";

type PartialDiffUpdate = {
  original?: unknown;
  modified?: unknown;
  language?: unknown;
};

@Injectable()
export class DiffService {
  get(): DiffPayloadDto {
    const store = getDiffStore();
    return structuredClone(store.value);
  }

  update(partial: PartialDiffUpdate): DiffPayloadDto {
    const store = getDiffStore();
    const cur = store.value;

    const next: DiffPayloadDto = {
      original:
        typeof partial.original === "string" ? partial.original : cur.original,
      modified:
        typeof partial.modified === "string" ? partial.modified : cur.modified,
      language:
        typeof partial.language === "string" ? partial.language : cur.language,
      updatedAt: new Date().toISOString(),
    };

    store.value = next;
    return structuredClone(store.value);
  }

  reset(): DiffPayloadDto {
    return structuredClone(resetDiffStore());
  }
}
