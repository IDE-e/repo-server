import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertEntry, AlertLevel } from './alert.type';

@Injectable()
export class AlertsService {
  private alerts: AlertEntry[] = [];

  findAll(level?: AlertLevel, ack?: string) {
    let data = this.alerts;

    if (level) data = data.filter((a) => a.level === level);
    if (ack === 'true') data = data.filter((a) => a.acknowledged);
    if (ack === 'false') data = data.filter((a) => !a.acknowledged);

    return { success: true, data, count: data.length };
  }

  create(dto: CreateAlertDto) {
    const newAlert: AlertEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('ko-KR'),
      level: dto.level ?? AlertLevel.INFO,
      title: dto.title ?? 'Alert',
      message: dto.message ?? 'No details provided',
      source: dto.source,
      acknowledged: false,
      createdAt: new Date().toISOString(),
    };

    this.alerts.push(newAlert);
    return { success: true, data: newAlert };
  }

  updateAck(id: number, acknowledged: boolean) {
    const target = this.alerts.find((a) => a.id === id);
    if (!target) return null;

    target.acknowledged = acknowledged;
    return { success: true, data: target };
  }

  clearAll() {
    const count = this.alerts.length;
    this.alerts.splice(0, this.alerts.length);
    return { success: true, message: `Cleared ${count} alerts` };
  }
}
