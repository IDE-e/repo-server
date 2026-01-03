export type MetricType = "requests" | "errors" | "db";

export class MetricDataPointDto {
  timestamp!: number; // Date.now()
  value!: number;
}
