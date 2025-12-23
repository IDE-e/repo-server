export enum AlertLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export type AlertEntry = {
  id: number;
  timestamp: string;
  level: AlertLevel;
  title: string;
  message: string;
  source?: string;
  acknowledged: boolean;
  createdAt: string;
};
