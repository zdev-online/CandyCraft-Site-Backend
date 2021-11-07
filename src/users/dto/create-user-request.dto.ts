export class CreateUserRequestDto {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  captcha_token: string;
  agreement: boolean;
}
