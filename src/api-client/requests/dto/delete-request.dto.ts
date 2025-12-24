import { IsOptional } from "class-validator";

export class DeleteRequestDto {
  @IsOptional()
  id?: number;
}
