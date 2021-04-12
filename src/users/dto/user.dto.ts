import { IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    email: string

    @IsOptional()
    fullName?: string

    @IsOptional()
    username: string

}