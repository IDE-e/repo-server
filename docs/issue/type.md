
# 🐛 Issue Log — `AlertLevel`(union type) import 에러 & enum은 왜 괜찮았나

- Date: 2025-12-23
- Context: NestJS + TypeScript 환경에서 DTO/Controller 작성 중
- Keywords: `isolatedModules`, `emitDecoratorMetadata`, Decorator, `import type`, union type, enum

---

## ✅ 증상(Symptom)

`AlertLevel`을 **union type**으로 정의하고 DTO/Controller에서 가져다 쓰면 아래 에러가 발생했다.

```ts
export type AlertLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";
````

에러 메시지(요지):

> A type referenced in a decorated signature must be imported with 'import type' ...
> when 'isolatedModules' and 'emitDecoratorMetadata' are enabled

반면, 같은 개념을 **enum**으로 정의하면 에러가 발생하지 않았다.

```ts
export enum AlertLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}
```

또한 아래처럼 **인라인 union**으로 직접 적으면 에러가 나지 않았다.

```ts
@IsOptional()
@IsIn(["INFO", "WARN", "ERROR", "CRITICAL"])
level?: "INFO" | "WARN" | "ERROR" | "CRITICAL";
```

---

## 🧠 원인(Root Cause)

핵심은 **“런타임에 존재하느냐/사라지느냐”** 차이.

### 1) `type`(union type)은 런타임에 **존재하지 않음**

`type AlertLevel = ...`은 TypeScript 컴파일 이후 JS로 변환되면 **사라진다.**
즉, 런타임에는 `AlertLevel`이라는 값이 없다.

그런데 NestJS는 DTO/Controller에 `@Body`, `@Query`, `@Param` 같은 **데코레이터**를 많이 쓰고,
TS 설정에서 `emitDecoratorMetadata`가 켜져 있으면, 타입 정보를 메타데이터로 만들기 위해
타입/값 참조를 엄격하게 다룬다.

이때 union type을 **값 import처럼** 가져오면 TS가 “이건 타입인데 값처럼 import했네?” 하고 에러를 낸다.

### 2) `enum`은 런타임에 **존재하는 값(객체)**

`enum`은 JS 결과물에도 남는다(런타임 객체).
그래서 일반 import를 해도 실제로 가져올 값이 존재하므로 문제가 없다.

### 3) 인라인 union은 **import가 없어서** 문제 상황 자체가 발생하지 않음

인라인으로 `"INFO" | ...`를 쓰면 외부 타입을 import하지 않기 때문에,
“type을 값처럼 import했냐?” 문제가 생길 여지가 없다.

---

## ✅ 해결(Solution)

### ✅ 방법 A — `type`을 유지하되 `import type`을 사용한다 (가장 단순)

```ts
// ❌ (에러 가능) type을 값 import로 가져옴
import { AlertLevel } from "../alerts.type";

// ✅ (정상) type 전용 import
import type { AlertLevel } from "../alerts.type";
```

---

## 🌟 추천 패턴(Best Practice): “값(목록) + 타입” 조합

union type도 살리고, 검증 목록도 한 곳에서 관리하고 싶으면 이 조합이 깔끔하다.

### `alerts.type.ts`

```ts
export const ALERT_LEVELS = ["INFO", "WARN", "ERROR", "CRITICAL"] as const;
export type AlertLevel = (typeof ALERT_LEVELS)[number];
```

### DTO에서 사용

```ts
import { IsIn, IsOptional } from "class-validator";
import { ALERT_LEVELS } from "../alerts.type";      // ✅ 런타임 값
import type { AlertLevel } from "../alerts.type";   // ✅ 컴파일 타입

export class CreateAlertDto {
  @IsOptional()
  @IsIn(ALERT_LEVELS)
  level?: AlertLevel;
}
```

* `ALERT_LEVELS`: 런타임에서도 존재 → `IsIn()`에 재사용 가능
* `AlertLevel`: 타입 안정성 확보
* `import type`: 데코레이터 환경(`emitDecoratorMetadata`)에서도 안전

---

## 📝 정리(One-liner)

> `enum`은 런타임 값이 있어서 데코레이터 환경에서 안전하고,
> `type`(union)은 런타임에 없어서 데코레이터 환경에서는 **반드시 `import type`로 가져와야** 한다.


