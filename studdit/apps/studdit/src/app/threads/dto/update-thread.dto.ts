import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateThreadDto {
    @ApiProperty({
        description: "The content of the thread",
        example: "This is the content of my first thread"
    })
    @IsNotEmpty()
    @IsString()
    readonly content: string;
}