import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWorkspaceDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsString()
    @IsOptional()
    color?: string;

    @IsInt()
    @IsOptional()
    orderIndex?: number;
}