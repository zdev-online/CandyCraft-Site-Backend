import { SetMetadata } from '@nestjs/common';

export const ConfirmedEmail = () => SetMetadata('for_confirmed_email', true);
