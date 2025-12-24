import { IsEnum, IsIn, IsOptional, IsString, IsUrl } from "class-validator";
import { HttpMethod } from "../request.type";

export class CreateRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(HttpMethod)
  method: HttpMethod;

  @IsUrl()
  url: string;
}
