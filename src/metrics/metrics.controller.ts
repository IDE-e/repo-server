// metrics.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Options,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { MetricsService } from "./metrics.service";
import { MetricDataPointDto, MetricType } from "./dto/metrics.dto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
} as const;

type MetricsGetResponse = {
  success: true;
  type: MetricType;
  data: MetricDataPointDto[];
  count: number;
};

type MetricsPostResponse = {
  success: true;
  type: MetricType;
  data: MetricDataPointDto;
};

@Controller("metrics")
export class MetricsController {
  constructor(private readonly service: MetricsService) {}

  @Options()
  @HttpCode(204)
  options(@Res() res: Response) {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
    return res.send();
  }

  @Get()
  get(
    @Query("type") type: string | undefined,
    @Res({ passthrough: true }) res: Response
  ): MetricsGetResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      if (!this.service.isValidType(type)) {
        throw new BadRequestException(
          "Invalid metric type. Use: requests, errors, or db"
        );
      }

      const data = this.service.list(type);
      return { success: true, type, data, count: data.length };
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException("Failed to fetch metrics");
    }
  }

  @Post()
  post(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response
  ): MetricsPostResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const input = body && typeof body === "object" ? (body as any) : {};
      const type = input.type;

      if (!this.service.isValidType(type)) {
        throw new BadRequestException("Invalid metric type");
      }

      const value = typeof input.value === "number" ? input.value : undefined;
      const point = this.service.add(type, value);

      res.status(201);
      return { success: true, type, data: point };
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException("Failed to add metric");
    }
  }
}
