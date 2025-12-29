import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ClusterController } from "./cluster.controller";
import { ClusterService } from "./cluster.service";
import { ClusterCorsMiddleware } from "./cluster.cors.middleware";

@Module({
  controllers: [ClusterController],
  providers: [ClusterService],
  exports: [ClusterService],
})
export class ClusterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClusterCorsMiddleware)
      .forRoutes({ path: "api/cluster", method: RequestMethod.ALL });
  }
}
