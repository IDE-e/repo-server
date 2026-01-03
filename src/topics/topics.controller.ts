import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Options,
  Post,
  Query,
  Body,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { TopicsService } from "./topics.service";
import { TopicEntryDto } from "./dto/topics.dto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
} as const;

type TopicsListResponse = {
  success: true;
  data: TopicEntryDto[];
  count: number;
};
type TopicSingleResponse = { success: true; data: TopicEntryDto };
type TopicCreateResponse = { success: true; data: TopicEntryDto };
type TopicsResetResponse = { success: true; message: string };

@Controller("topics")
export class TopicsController {
  constructor(private readonly service: TopicsService) {}

  @Options()
  @HttpCode(204)
  options(@Res() res: Response) {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
    return res.send();
  }

  @Get()
  get(
    @Query("name") name: string | undefined,
    @Res({ passthrough: true }) res: Response
  ): TopicsListResponse | TopicSingleResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      if (typeof name === "string" && name.trim()) {
        const found = this.service.findByName(name.trim());
        if (!found) throw new NotFoundException("Topic not found");
        return { success: true, data: found };
      }

      const data = this.service.list();
      return { success: true, data, count: data.length };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException("Failed to fetch topics");
    }
  }

  @Post()
  post(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response
  ): TopicCreateResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const input = body && typeof body === "object" ? (body as any) : {};
      const name = typeof input.name === "string" ? input.name.trim() : "";

      if (!name) throw new BadRequestException("name is required");

      const { created, alreadyExists } = this.service.create(input);
      if (alreadyExists) throw new ConflictException("Topic already exists");

      res.status(201);
      return { success: true, data: created };
    } catch (e) {
      if (e instanceof BadRequestException || e instanceof ConflictException) {
        throw e;
      }
      throw new InternalServerErrorException("Failed to create topic");
    }
  }

  @Delete()
  delete(@Res({ passthrough: true }) res: Response): TopicsResetResponse {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      const { resetCount } = this.service.reset();
      return { success: true, message: `Reset ${resetCount} topics` };
    } catch {
      throw new InternalServerErrorException("Failed to reset topics");
    }
  }
}
