import { MetricType, MetricDataPointDto } from "./dto/metrics.dto";

export const metricsHistory: Record<MetricType, MetricDataPointDto[]> = {
  requests: [],
  errors: [],
  db: [],
};
