import { Controller, Get, Post, Delete, Body, Query } from "@nestjs/common";
import { RequestService } from "./request.service";
import { CreateRequestDto } from "./dto/create-request.dto";

@Controller("requests")
export class RequestController {
  constructor(private readonly service: RequestService) {}

  @Get()
  getRequests() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: CreateRequestDto) {
    return this.service.create(body);
  }

  @Delete()
  remove(@Query("id") id?: string) {
    return this.service.remove(id ? Number(id) : undefined);
  }
}
