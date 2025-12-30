import { Type } from "class-transformer";
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { BrokerStatus } from "../broker.type";

export class CreateBrokerDto {
  // 미입력 시: service에서 "현재 목록 길이 + 1"로 자동 생성 권장
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id?: number;

  // 미입력 시: service에서 `broker-${id}.local`로 자동 생성 권장
  @IsOptional()
  @IsString()
  host?: string;

  // 기본값 없음(명세: "-"), 코드상 필수 검증도 없음
  @IsOptional()
  @IsString()
  rack?: string;

  // 기본값 ONLINE
  @IsOptional()
  @IsEnum(BrokerStatus)
  status: BrokerStatus;

  // 기본값 10
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cpu: number = 10;

  // 기본값 20
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  memory: number = 20;

  // 기본값 30
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  disk: number = 30;

  // 기본값 5
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  networkIn: number = 5;

  // 기본값 5
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  networkOut: number = 5;
}
