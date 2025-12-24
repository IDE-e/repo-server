import { IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { AlertLevel } from "../alerts.type";

export class CreateAlertDto {
  @IsOptional()
  @IsIn(["INFO", "WARN", "ERROR", "CRITICAL"])
  level?: AlertLevel;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  message?: string;

  @IsOptional()
  @IsString()
  source?: string;
}
