import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { SupabaseService } from '../supabase/supabase.service';

const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockResolvedValue({
    data: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
    ],
    error: null,
  }),
};

const mockSupabaseService = {
  getClient: jest.fn().mockReturnValue(mockSupabaseClient),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('first_name');
      expect(result[0]).toHaveProperty('last_name');
    });

    it('should return example users when database is empty', async () => {
      mockSupabaseClient.order.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].email).toBe('john.doe@example.com');
    });

    it('should throw error when database query fails', async () => {
      mockSupabaseClient.order.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database connection failed' },
      });

      await expect(service.findAll()).rejects.toThrow('Database query failed');
    });
  });
});
