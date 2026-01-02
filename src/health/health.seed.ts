import { ServiceHealthDto } from "./dto/health.dto";

export function seedHealth(): ServiceHealthDto[] {
  const now = new Date().toISOString();

  return [
    {
      name: "api",
      status: "UP",
      latencyMs: 54,
      errorRate: 0.12,
      updatedAt: now,
    },
    {
      name: "auth",
      status: "UP",
      latencyMs: 41,
      errorRate: 0.08,
      updatedAt: now,
    },
    {
      name: "worker",
      status: "UP",
      latencyMs: 88,
      errorRate: 0.22,
      updatedAt: now,
    },
    {
      name: "db",
      status: "UP",
      latencyMs: 32,
      errorRate: 0.03,
      updatedAt: now,
    },
    {
      name: "cache",
      status: "UP",
      latencyMs: 12,
      errorRate: 0.01,
      updatedAt: now,
    },
    {
      name: "gateway",
      status: "UP",
      latencyMs: 63,
      errorRate: 0.15,
      updatedAt: now,
    },
  ];
}
