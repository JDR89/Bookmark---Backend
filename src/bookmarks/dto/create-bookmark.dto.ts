import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, IsUrl, MinLength } from 'class-validator';

export class CreateBookmarkDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @IsUrl()
    url: string;

    @IsUUID()
    collectionId: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    favicon?: string;

    @IsBoolean()
    @IsOptional()
    isFavorite?: boolean;

    @IsString()
    @IsOptional()
    status?: string;
}
