import { IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;
  shortUrl:string | null
  userId: string;
}
