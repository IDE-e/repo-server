import {
  Controller,
  Get,
  Options,
  Res,
  UseFilters,
  UseInterceptors,
  HttpCode,
} from "@nestjs/common";
import type { Response } from "express";

import { DashboardService } from "./dashboard.service";
import { corsHeaders } from "./dashboard.cors";
import {
  ApiResponseInterceptor,
  ApiExceptionFilter,
} from "src/common/http/api-response";
import { DashboardDataDto } from "./dto/dashboard.dto";

@Controller("api/dashboard")
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Options()
  @HttpCode(204)
  options(@Res() res: Response) {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
    return res.send();
  }

  @Get()
  getDashboard(@Res({ passthrough: true }) res: Response): DashboardDataDto {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

    return this.dashboardService.getDashboard();
  }
}
