import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCollectionDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsUUID()
    workspaceId: string;
}