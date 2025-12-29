import { IsEnum, IsOptional } from "class-validator";
import { BrokerStatus } from "../broker.type";

export class GetBrokerDto {
  @IsOptional()
  @IsEnum(BrokerStatus)
  status?: BrokerStatus;
}
