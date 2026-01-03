import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Options,
  Post,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { HealthService } from "./health.service";
import { ServiceHealthDto } from "./dto/health.dto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
} as const;

type HealthListResponse = {
  success: true;
  data: ServiceHealthDto[];
  count: number;
};
type HealthUpsertResponse = { success: true; data: ServiceHealthDto };
type HealthResetResponse = { success: true; message: string };

@Controller("health")
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Options()
  @HttpCode(204)
  options(@Res() res: Response) {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
    return res.send();
  }

  @Get()
  get(@Res({ passthrough: true }) res: Response): HealthListResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const data = this.service.list();
      return { success: true, data, count: data.length };
    } catch {
      throw new InternalServerErrorException("Failed to fetch health");
    }
  }

  @Post()
  post(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response
  ): HealthUpsertResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const input = body && typeof body === "object" ? (body as any) : {};
      const name = typeof input.name === "string" ? input.name.trim() : "";

      if (!name) {
        throw new BadRequestException("name is required");
      }

      const { item, created } = this.service.upsert(input);

      res.status(created ? 201 : 200);

      return { success: true, data: item };
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException("Failed to update health");
    }
  }

  @Delete()
  delete(@Res({ passthrough: true }) res: Response): HealthResetResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const { resetCount } = this.service.reset();
      return { success: true, message: `Reset ${resetCount} services` };
    } catch {
      throw new InternalServerErrorException("Failed to reset health");
    }
  }
}
