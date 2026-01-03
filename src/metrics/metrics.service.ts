import { Injectable, OnModuleInit } from "@nestjs/common";
import { metricsHistory } from "./metrics.store";
import { MetricType, MetricDataPointDto } from "./dto/metrics.dto";

const MAX_POINTS = 50;

type MetricsTicker = { timer?: NodeJS.Timeout | null };
const g = globalThis as unknown as Record<string, any>;

function getTicker(): MetricsTicker {
  if (!g.__mockMetricsTicker) g.__mockMetricsTicker = { timer: null };
  return g.__mockMetricsTicker as MetricsTicker;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function isMetricType(x: unknown): x is MetricType {
  return x === "requests" || x === "errors" || x === "db";
}

function trimHistory(type: MetricType) {
  const arr = metricsHistory[type];
  while (arr.length > MAX_POINTS) arr.shift();
}

function generateNextValue(type: MetricType, prev: number): number {
  if (type === "requests") {
    const next = prev + (Math.random() * 40 - 20); // ±20
    return Math.round(clamp(next, 80, 200));
  }
  if (type === "errors") {
    const next = prev + (Math.random() * 1.0 - 0.5); // ±0.5
    return round2(clamp(next, 0, 3));
  }
  // db
  const next = prev + (Math.random() * 100 - 50); // ±50
  return Math.round(clamp(next, 250, 650));
}

function defaultSeedValue(type: MetricType): number {
  if (type === "requests") return 120;
  if (type === "errors") return 0.5;
  return 400;
}

function addPoint(type: MetricType, value?: number): MetricDataPointDto {
  const arr = metricsHistory[type];
  const prev =
    arr.length > 0 ? arr[arr.length - 1].value : defaultSeedValue(type);
  const v = typeof value === "number" ? value : generateNextValue(type, prev);

  const point: MetricDataPointDto = { timestamp: Date.now(), value: v };
  arr.push(point);
  trimHistory(type);
  return point;
}

function seedIfEmpty() {
  (["requests", "errors", "db"] as MetricType[]).forEach((type) => {
    if (metricsHistory[type].length > 0) return;

    const now = Date.now();
    const baseTsStart = now - 30_000 * 20;
    let prev = defaultSeedValue(type);

    for (let i = 0; i < 20; i++) {
      prev = generateNextValue(type, prev);
      metricsHistory[type].push({
        timestamp: baseTsStart + 30_000 * i,
        value: prev,
      });
    }

    trimHistory(type);
  });
}

@Injectable()
export class MetricsService implements OnModuleInit {
  onModuleInit() {
    seedIfEmpty();
    this.ensureAutoUpdate();
  }

  private ensureAutoUpdate() {
    const ticker = getTicker();

    if (ticker.timer) clearInterval(ticker.timer);

    ticker.timer = setInterval(() => {
      (["requests", "errors", "db"] as MetricType[]).forEach((type) => {
        addPoint(type);
      });
    }, 10_000);
  }

  list(type: MetricType): MetricDataPointDto[] {
    return structuredClone(metricsHistory[type]);
  }

  add(type: MetricType, value?: number): MetricDataPointDto {
    return structuredClone(addPoint(type, value));
  }

  isValidType(x: unknown): x is MetricType {
    return isMetricType(x);
  }
}
