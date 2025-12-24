import { Injectable, NotFoundException } from "@nestjs/common";
import { AlertEntry, AlertLevel } from "./alerts.type";
import { CreateAlertDto } from "./dto/create-alerts.dto";
import { GetAlertsQueryDto } from "./dto/get-alerts.dto";

@Injectable()
export class AlertsService {
  // 인메모리 (현재 DB 없음)
  private alerts: AlertEntry[] = [];

  // GET
  findAll(q: GetAlertsQueryDto) {
    let data = this.alerts;

    if (q.level) data = data.filter((a) => a.level === q.level);
    if (q.ack === "true") data = data.filter((a) => a.acknowledged);
    if (q.ack === "false") data = data.filter((a) => !a.acknowledged);

    return { success: true, data, count: data.length };
  }

  // POST
  create(body: CreateAlertDto) {
    const newAlert: AlertEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString("ko-KR"),
      level: (body.level ?? "INFO") as AlertLevel,
      title: body.title ?? "Alert",
      message: body.message ?? "No details provided",
      source: body.source,
      acknowledged: false,
      createdAt: new Date().toISOString(),
    };

    this.alerts.push(newAlert);
    return { success: true, data: newAlert };
  }

  // PATCH
  patchAck(id: number, acknowledged: boolean) {
    const target = this.alerts.find((a) => a.id === id);
    if (!target) throw new NotFoundException("Alert not found");

    target.acknowledged = acknowledged;
    return { success: true, data: target };
  }

  // DELETE
  clearAll() {
    const count = this.alerts.length;
    this.alerts.splice(0, this.alerts.length);
    return { success: true, message: `Cleared ${count} alerts` };
  }
}
