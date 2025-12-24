import { IsIn, IsOptional, IsUrl } from "class-validator";
import { HttpMethod } from "../send.type";

export class CreateSendDto {
  @IsOptional()
  name?: string;

  @IsIn(["GET", "POST", "PUT", "DELETE"])
  method: HttpMethod;

  @IsUrl()
  url: string;
}
