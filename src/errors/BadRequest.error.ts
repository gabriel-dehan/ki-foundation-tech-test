import { BaseError } from './Base.error';

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message);

    Object.defineProperty(this, 'name', {
      value: 'BadRequestError',
    });

    Object.defineProperty(this, 'statusCode', {
      value: 400,
    });
  }
}
