import { APP_FILTER } from '@nestjs/core';
import { ApiOperation } from '@nestjs/swagger';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

// REVU: Не думаю что группе контента нужно имя
export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}

export class UpdateGroupDto {
  @ApiProperty()
  @IsOptional()
  name?: string;
}

export class GetOptimalContent {
  @ApiProperty()
  @IsPositive()
  width: number;

  @ApiProperty()
  @IsPositive()
  height: number;
}
