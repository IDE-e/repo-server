import { Injectable, OnModuleInit } from "@nestjs/common";
import { getHealthStore, getHealthTicker } from "./health.store";
import { seedHealth } from "./health.seed";
import { ServiceStatus, ServiceHealthDto } from "./dto/health.dto";

type UpsertInput = {
  name?: unknown;
  status?: unknown;
  latencyMs?: unknown;
  errorRate?: unknown;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function isStatus(x: unknown): x is ServiceStatus {
  return x === "UP" || x === "DEGRADED" || x === "DOWN";
}

function computeStatus(latencyMs: number, errorRate: number): ServiceStatus {
  if (Math.random() < 0.01) return "DOWN";

  if (errorRate > 2 || latencyMs > 200) return "DEGRADED";
  return "UP";
}

function tickOne(s: ServiceHealthDto): ServiceHealthDto {
  const nextLatency = Math.max(
    1,
    Math.round(s.latencyMs + (Math.random() * 30 - 15))
  );
  const nextError = round2(
    clamp(s.errorRate + (Math.random() * 0.4 - 0.2), 0, 5)
  );
  const nextStatus = computeStatus(nextLatency, nextError);

  return {
    ...s,
    latencyMs: nextLatency,
    errorRate: nextError,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };
}

@Injectable()
export class HealthService implements OnModuleInit {
  onModuleInit() {
    this.ensureTicker();
  }

  ensureTicker() {
    const ticker = getHealthTicker();
    if (ticker.started) return;

    ticker.started = true;

    ticker.timer = setInterval(() => {
      const store = getHealthStore();
      store.services = store.services.map(tickOne);
    }, 4000);
  }

  list(): ServiceHealthDto[] {
    const store = getHealthStore();
    return structuredClone(store.services);
  }

  reset(): { resetCount: number } {
    const store = getHealthStore();
    const resetCount = store.services.length;
    store.services = seedHealth();
    return { resetCount };
  }

  upsert(input: UpsertInput): { item: ServiceHealthDto; created: boolean } {
    const store = getHealthStore();

    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (!name) {
      const now = new Date().toISOString();
      return {
        created: false,
        item: {
          name: "",
          status: "UP",
          latencyMs: 0,
          errorRate: 0,
          updatedAt: now,
        },
      };
    }

    const idx = store.services.findIndex((s) => s.name === name);
    const exists = idx >= 0;

    const cur = exists
      ? store.services[idx]
      : ({
          name,
          status: "UP",
          latencyMs: 0,
          errorRate: 0,
          updatedAt: new Date().toISOString(),
        } satisfies ServiceHealthDto);

    const next: ServiceHealthDto = {
      name,
      status: isStatus(input.status) ? input.status : cur.status,
      latencyMs:
        typeof input.latencyMs === "number" ? input.latencyMs : cur.latencyMs,
      errorRate:
        typeof input.errorRate === "number" ? input.errorRate : cur.errorRate,
      updatedAt: new Date().toISOString(),
    };

    next.latencyMs = Math.max(1, Math.round(next.latencyMs));
    next.errorRate = round2(clamp(next.errorRate, 0, 5));

    if (!isStatus(input.status)) {
      next.status = computeStatus(next.latencyMs, next.errorRate);
    }

    if (exists) {
      store.services[idx] = next;
      return { item: structuredClone(next), created: false };
    }

    store.services.push(next);
    return { item: structuredClone(next), created: true };
  }
}
