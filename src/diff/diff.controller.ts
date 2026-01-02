import {
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
import { DiffService } from "./diff.service";
import { DiffPayloadDto } from "./dto/diff.dto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
} as const;

@Controller("diff")
export class DiffController {
  constructor(private readonly diffService: DiffService) {}

  @Options()
  @HttpCode(204)
  options(@Res() res: Response) {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
    return res.send();
  }

  @Get()
  get(@Res({ passthrough: true }) res: Response): DiffPayloadDto {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
      return this.diffService.get();
    } catch {
      throw new InternalServerErrorException("Failed to fetch diff data");
    }
  }

  @Post()
  post(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response
  ): DiffPayloadDto {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      // Body can be anything; spec says ignore non-strings.
      const partial =
        body && typeof body === "object"
          ? (body as {
              original?: unknown;
              modified?: unknown;
              language?: unknown;
            })
          : {};

      return this.diffService.update(partial);
    } catch {
      throw new InternalServerErrorException("Failed to update diff data");
    }
  }

  @Delete()
  reset(@Res({ passthrough: true }) res: Response): DiffPayloadDto {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
      return this.diffService.reset();
    } catch {
      throw new InternalServerErrorException("Failed to reset diff data");
    }
  }
}
