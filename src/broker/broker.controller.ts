import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { BrokerService } from "./broker.service";
import { GetBrokerDto } from "./dto/get-broker-dto";
import { CreateBrokerDto } from "./dto/create-broker-dto";

@Controller("brokers")
export class BrokerController {
  constructor(private readonly service: BrokerService) {}

  // GET /brokers?status=ONLINE
  @Get()
  findAll(@Query() query: GetBrokerDto) {
    return this.service.findAll(query.status);
  }

  // POST /brokers
  @Post()
  create(@Body() body: CreateBrokerDto) {
    return this.service.create(body);
  }

  // DELETE /brokers  -> Reset (seed 3개로 재생성)
  @Delete()
  reset() {
    return this.service.reset(3);
  }
}
