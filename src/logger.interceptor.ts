import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import e from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const start = new Date().getTime();
		const { ip, path, method, body }: e.Request = context.switchToHttp().getRequest();
		const logger_message = `${method} запрос на ${path} от ${ip}. Время ответа: `;
		return next.handle().pipe(
			tap(() => {
				const end = new Date().getTime();
				console.log(`${logger_message}${(end - start)} мс.`);
			})
		);
	}
}