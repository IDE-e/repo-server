import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
} from "@nestjs/common";
import { AlertsService } from "./alerts.service";
import { CreateAlertDto } from "./dto/create-alerts.dto";
import { GetAlertsQueryDto } from "./dto/get-alerts.dto";
import { PatchAlertDto } from "./dto/patch-alerts.dto";

@Controller("alerts")
export class AlertsController {
  constructor(private readonly service: AlertsService) {}

  // GET /api/alerts?level=WARN&ack=false
  @Get()
  getAlerts(@Query() query: GetAlertsQueryDto) {
    return this.service.findAll(query);
  }

  @Post()
  create(@Body() body: CreateAlertDto) {
    return this.service.create(body);
  }

  @Patch()
  patch(@Body() body: PatchAlertDto) {
    return this.service.patchAck(Number(body.id), body.acknowledged);
  }

  @Delete()
  clear() {
    return this.service.clearAll();
  }
}
