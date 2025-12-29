import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";
import { ClusterService } from "./cluster.service";
import { ClusterPatchDto } from "./dto/cluster-patch.dto";
import {
  ApiExceptionFilter,
  ApiResponseInterceptor,
} from "../common/http/api-response";

@UseInterceptors(ApiResponseInterceptor)
@UseFilters(ApiExceptionFilter)
@Controller("api/cluster")
export class ClusterController {
  constructor(private readonly service: ClusterService) {}

  @Get()
  getCluster() {
    return this.service.getSummary();
  }

  @Post()
  updateCluster(@Body() body: ClusterPatchDto) {
    return this.service.updatePartial(body);
  }
}
