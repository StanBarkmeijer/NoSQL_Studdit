import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteUserDto {
    @ApiProperty({
        description: "The username of the user",
        example: "john.doe"
    })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty({
        description: "The password of the user",
        example: "password123"
    })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}