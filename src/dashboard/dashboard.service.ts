import { Injectable } from "@nestjs/common";
import { DASHBOARD_MOCK } from "./dashboard.mock";
import { DashboardDataDto } from "./dto/dashboard.dto";

@Injectable()
export class DashboardService {
  getDashboard(): DashboardDataDto {
    return structuredClone(DASHBOARD_MOCK);
  }
}
