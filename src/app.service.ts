import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'MochiExpress Services API is running! 🚀';
  }
}
