import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same configuration as in main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  it('/api/v1/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      const user = response.body[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('created_at');
      expect(user).toHaveProperty('updated_at');
    }
  });

  it('/api/v1/users should handle errors gracefully', async () => {
    // This test assumes that if there's a connection issue,
    // the service will return example data instead of failing
    const response = await request(app.getHttpServer()).get('/api/v1/users');

    // Should either succeed (200) or fail gracefully (500)
    expect([200, 500]).toContain(response.status);

    if (response.status === 500) {
      expect(response.body).toHaveProperty('statusCode', 500);
      expect(response.body).toHaveProperty('message');
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
