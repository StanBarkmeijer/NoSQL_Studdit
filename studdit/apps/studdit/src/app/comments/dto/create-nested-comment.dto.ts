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

    @ApiProperty({
        description: "The id of the parent comment",
        example: "5f9c2b7b1c9d440000b7f1e6"
    })
    @IsNotEmpty()
    @IsString()
    readonly parentCommentId: string;
}