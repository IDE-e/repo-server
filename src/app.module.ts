import { Module } from "@nestjs/common";
import { AlertsModule } from "./alerts/alerts.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DiffModule } from "./diff/diff.module";
import { ClusterModule } from "./cluster/cluster.module";
import { BrokerModule } from "./broker/broker.module";
import { RequestModule } from "./api-client/requests/request.module";
import { SendModule } from "./api-client/send/send.module";
import { GalleryModule } from "./gallery/gallery.module";
import { HealthModule } from "./health/health.module";
import { LogsModule } from "./logs/logs.module";
import { MetricsModule } from "./metrics/metrics.module";
import { TopicsModule } from "./topics/topics.module";

// Nest는 트리 구조이기 때문에 루트에서 연결 되어야한다!
@Module({
  imports: [
    AlertsModule,
    BrokerModule,
    RequestModule,
    SendModule,
    ClusterModule,
    DashboardModule,
    DiffModule,
    GalleryModule,
    HealthModule,
    LogsModule,
    MetricsModule,
    TopicsModule,
  ],
})
export class AppModule {}
