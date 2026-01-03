export class LogEntryDto {
  id!: number; // Date.now()
  timestamp!: string; // toLocaleTimeString("ko-KR")
  level!: string;
  message!: string; // default "No message provided"
  createdAt!: string; // ISO-8601
}
