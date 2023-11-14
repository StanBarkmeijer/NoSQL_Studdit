import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({
        description: "The username of the user",
        example: "john.doe"
    })
    readonly username: string;
    
    @ApiProperty({
        description: "The password of the user",
        example: "password123"
    })
    readonly password: string;
}