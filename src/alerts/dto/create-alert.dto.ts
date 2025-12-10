import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AlertLevel } from '../alert.type';

export class CreateAlertDto {
  @IsOptional()
  @IsEnum(AlertLevel)
  level?: AlertLevel;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  source?: string;
}
