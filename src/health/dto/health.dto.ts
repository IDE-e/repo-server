export type ServiceStatus = "UP" | "DEGRADED" | "DOWN";

export class ServiceHealthDto {
  name!: string;
  status!: ServiceStatus;
  latencyMs!: number;
  errorRate!: number; // 0..5, 2 decimals
  updatedAt!: string; // ISO-8601
}
