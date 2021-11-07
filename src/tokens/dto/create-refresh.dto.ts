export class CreateRefreshDto {
  readonly value: string;
  readonly userId: number;
  readonly expiresIn: Date;
}
