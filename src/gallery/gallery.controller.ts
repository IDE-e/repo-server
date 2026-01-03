import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Options,
  Patch,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { GalleryPayloadDto, GalleryStoreDto } from "./dto/gallery.dto";
import { GalleryService } from "./gallery.service";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,PATCH,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
} as const;

@Controller("gallery")
export class GalleryController {
  constructor(private readonly service: GalleryService) {}

  @Options()
  @HttpCode(204)
  options(@Res() res: Response) {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
    return res.send();
  }

  @Get()
  get(@Res({ passthrough: true }) res: Response): GalleryPayloadDto {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
      return this.service.getPayload();
    } catch {
      throw new InternalServerErrorException("Failed to fetch gallery");
    }
  }

  @Patch()
  patch(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response
  ): GalleryStoreDto {
    try {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

      // Spec: version is applied only if it's a string.
      const input =
        body && typeof body === "object" ? (body as { version?: unknown }) : {};

      return this.service.patchVersion(input);
    } catch {
      throw new InternalServerErrorException("Failed to update gallery");
    }
  }
}
