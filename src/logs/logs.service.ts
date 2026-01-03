import { Injectable } from "@nestjs/common";
import { logs } from "./logs.store";
import { LogEntryDto } from "./dto/logs.dto";

function nowKoTimeString(): string {
  return new Date().toLocaleTimeString("ko-KR");
}

@Injectable()
export class LogsService {
  list(level?: string): LogEntryDto[] {
    const data = level ? logs.filter((l) => l.level === level) : logs;
    return structuredClone(data);
  }

  createFromParsed(parsed: any): LogEntryDto {
    const level =
      parsed && typeof parsed.level === "string" ? parsed.level : "INFO";
    const message =
      parsed && typeof parsed.message === "string"
        ? parsed.message
        : "No message provided";

    const entry: LogEntryDto = {
      id: Date.now(),
      timestamp: nowKoTimeString(),
      level,
      message,
      createdAt: new Date().toISOString(),
    };

    logs.push(entry);
    return structuredClone(entry);
  }

  clear(): { cleared: number } {
    const cleared = logs.length;
    logs.length = 0;
    return { cleared };
  }
}
