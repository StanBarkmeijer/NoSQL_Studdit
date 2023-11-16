import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFriendshipDto {
    @ApiProperty({
        description: "The username of the user",
        example: "john.doe"
    })
    @IsNotEmpty()
    @IsString()
    readonly user: string;

    @ApiProperty({
        description: "The username of the friend",
        example: "jane.doe"
    })
    @IsNotEmpty()
    @IsString()
    readonly friend: string;
}