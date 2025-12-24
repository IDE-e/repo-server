import { Controller, Get, Delete, Query } from "@nestjs/common";
import { SendService } from "./send.service";

@Controller("send")
export class SendController {
  constructor(private readonly service: SendService) {}

  @Get()
  getSend() {
    return this.service.findAll();
  }

  @Delete()
  remove(@Query("id") id?: number) {
    return this.service.remove(id);
  }
}
