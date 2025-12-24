import { IsOptional } from "class-validator";

export class DeleteSendDto {
  @IsOptional()
  id?: number;
}
