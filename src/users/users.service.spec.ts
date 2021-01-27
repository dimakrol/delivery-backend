import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user.entity';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'aaaa@bbbb',
      });
      const result = await service.createAccount({
        email: '',
        password: '123123',
        role: UserRole.Client,
      });
      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already',
      });
    });
  });

  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
