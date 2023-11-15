import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNestedCommentDto {
    @ApiProperty({
        description: "The username of the user",
        example: "john.doe"
    })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty({
        description: "The content of the comment",
        example: "This is the content of my first comment"
    })
    @IsNotEmpty()
    @IsString()
    readonly content: string;
}