// src/cluster/dto/cluster-patch.dto.ts
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

/**
 * POST /api/cluster - partial update DTO
 * - status, updatedAt은 서버가 규칙/현재시각으로 결정하므로 입력에서 제외
 */
export class ClusterPatchDto {
  @IsOptional()
  @IsString()
  clusterName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  brokers?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  topics?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  partitions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  underReplicated?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  messageInPerSec?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  messageOutPerSec?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  storageUsedGB?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  storageTotalGB?: number;
}
