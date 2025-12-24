import { IsIn, IsOptional } from "class-validator";
import { AlertLevel } from "../alerts.type";

export class GetAlertsQueryDto {
  @IsOptional()
  @IsIn(["INFO", "WARN", "ERROR", "CRITICAL"])
  level?: AlertLevel;

  // query string은 결국 문자열이니까 "true" | "false"로 받는 게 안전
  @IsOptional()
  @IsIn(["true", "false"])
  ack?: "true" | "false";
}
