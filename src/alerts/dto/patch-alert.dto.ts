import { IsBoolean, IsNumber } from "class-validator";

export class PatchAlertDto {
  @IsNumber()
  id!: number;

  @IsBoolean()
  acknowledged!: boolean;
}
