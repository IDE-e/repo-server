import { getGlobalSingleton } from "src/common/global-singleton";
import { ServiceHealthDto } from "./dto/health.dto";
import { seedHealth } from "./health.seed";

type HealthStore = {
  services: ServiceHealthDto[];
};

type HealthTicker = {
  started: boolean;
  timer?: NodeJS.Timeout;
};

export function getHealthStore(): HealthStore {
  return getGlobalSingleton<HealthStore>("__mockHealth", () => ({
    services: seedHealth(),
  }));
}

export function getHealthTicker(): HealthTicker {
  return getGlobalSingleton<HealthTicker>("__mockHealthTicker", () => ({
    started: false,
  }));
}
