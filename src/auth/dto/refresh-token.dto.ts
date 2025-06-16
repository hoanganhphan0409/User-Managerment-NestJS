import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}