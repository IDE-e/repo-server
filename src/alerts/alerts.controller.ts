import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertLevel } from './alert.type';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  // GET /alerts?level=WARN&ack=false
  @Get()
  getAlerts(@Query('level') level?: AlertLevel, @Query('ack') ack?: string) {
    return this.alertsService.findAll(level, ack);
  }

  // POST /alerts
  @Post()
  createAlert(@Body() dto: CreateAlertDto) {
    return this.alertsService.create(dto);
  }

  // PATCH /alerts/:id  { acknowledged: true }
  @Patch(':id')
  patchAck(
    @Param('id', ParseIntPipe) id: number,
    @Body('acknowledged') acknowledged: boolean,
  ) {
    const result = this.alertsService.updateAck(id, acknowledged);
    if (!result) throw new NotFoundException('Alert not found');
    return result;
  }

  // DELETE /alerts (전체 삭제)
  @Delete()
  clearAlerts() {
    return this.alertsService.clearAll();
  }
}
