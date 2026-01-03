import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { LogsController } from "./logs.controller";
import { LogsService } from "./logs.service";
import { logsRawBodyMiddleware } from "./logs.raw-body.middleware";

@Module({
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logsRawBodyMiddleware())
      .forRoutes({ path: "logs", method: RequestMethod.POST });
  }
}
