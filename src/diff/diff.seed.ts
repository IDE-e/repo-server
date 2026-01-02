import { DiffPayloadDto } from "./dto/diff.dto";

export const DIFF_SEED_BASE = {
  original:
    'import React from "react";\n\nexport function Hello() {\n  return <div>Hello world!</div>;\n}\n',
  modified:
    'import React from "react";\n\nexport function Hello({ name }) {\n  return <div>Hello {name}</div>;\n}\n',
  language: "typescript",
} as const satisfies Omit<DiffPayloadDto, "updatedAt">;
