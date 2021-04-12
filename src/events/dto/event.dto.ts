import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    @IsUUID()
    userId: string
}

export class UpdateEventDto {
    @IsOptional()
    description: string

    @IsNotEmpty()
    @IsUUID()
    userId: string
}