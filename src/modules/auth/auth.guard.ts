import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { EnvironmentVariables } from 'src/configs/config.type';

const TOKEN_NAME = 'x-api-token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // check if auth is enabled
    if (!this.config.get('auth.enable', { infer: true })) {
      return true;
    }

    // check token in HTTP header
    const authToken = this.config.get('auth.token', { infer: true });
    const request = context.switchToHttp().getRequest();
    const token = request.headers[TOKEN_NAME];
    if (!token || token !== authToken) {
      return false;
    }

    return true;
  }
}
