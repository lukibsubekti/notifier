import { HttpStatus } from '@nestjs/common';

export class WorkerResult<T> {
  status: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: HttpStatus;

  constructor(
    { status, data = null, message = '', errors = [], statusCode = HttpStatus.OK }: {
      status: boolean;
      data?: T;
      message?: string;
      errors?: string[];
      statusCode?: HttpStatus;
    }
  ) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.errors = errors;
    this.statusCode = statusCode;
  }
}