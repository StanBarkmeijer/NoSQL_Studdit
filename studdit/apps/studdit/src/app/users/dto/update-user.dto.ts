import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({
        description: "The current password of the user",
        example: "password123"
    })
    readonly currentPassword: string;

    @ApiProperty({
        description: "The new password of the user",
        example: "newPassword123"
    })
    readonly newPassword: string;

    @ApiProperty({
        description: "Activity status of the user",
        example: true
    })
    readonly isActive?: boolean;
}