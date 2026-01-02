import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { LogsService } from "./logs.service";
import { LogEntryDto } from "./dto/logs.dto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
} as const;

type LogsListResponse = { success: true; data: LogEntryDto[]; count: number };
type LogsCreateResponse = { success: true; data: LogEntryDto };
type LogsClearResponse = { success: true; message: string };

@Controller("logs")
export class LogsController {
  constructor(private readonly service: LogsService) {}

  @Get()
  get(
    @Query("level") level: string | undefined,
    @Res({ passthrough: true }) res: Response
  ): LogsListResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const data = this.service.list(level);
      return { success: true, data, count: data.length };
    } catch {
      throw new InternalServerErrorException("Failed to fetch logs");
    }
  }

  @Post()
  post(
    @Req() req: Request & { rawBody?: string },
    @Res({ passthrough: true }) res: Response
  ): LogsCreateResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const raw = typeof req.rawBody === "string" ? req.rawBody : "";
      let parsed: any = undefined;

      if (raw && raw.trim().length > 0) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = undefined;
        }
      }

      const entry = this.service.createFromParsed(parsed);
      res.status(201);
      return { success: true, data: entry };
    } catch {
      throw new InternalServerErrorException("Failed to create log");
    }
  }

  @Delete()
  delete(@Res({ passthrough: true }) res: Response): LogsClearResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const { cleared } = this.service.clear();
      return { success: true, message: `Cleared ${cleared} logs` };
    } catch {
      throw new InternalServerErrorException("Failed to clear logs");
    }
  }
}
