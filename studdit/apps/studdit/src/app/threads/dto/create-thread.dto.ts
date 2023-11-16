import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateThreadDto {
    @ApiProperty({
        description: "The username of the user",
        example: "john.doe"
    })
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @ApiProperty({
        description: "The title of the thread",
        example: "My first thread"
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: "The content of the thread",
        example: "This is the content of my first thread"
    })
    @IsNotEmpty()
    @IsString()
    readonly content: string;
}