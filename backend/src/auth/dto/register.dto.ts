import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/(?=.*[A-Z])/, {
    message: 'password must contain at least 1 uppercase letter',
  })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message: 'password must contain at least 1 special character',
  })
  password: string;
}
