import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
    let service: CryptoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CryptoService],
        }).compile();

        service = module.get<CryptoService>(CryptoService)
    });

    it('should be defined', () => {
        expect(service).toBeDefined()
    });

    it('provides correct sha256 hash for given input', () => {
        const hash = service.sha256('input')

        expect(hash).toStrictEqual(
            'c96c6d5be8d08a12e7b5cdc1b207fa6b2430974c86803d8891675e76fd992c20',
        )
    });

    it('generates a random string equal to given length', () => {
        const length = 20;
        const randomString = service.randomString(length);

        expect(randomString).toHaveLength(length);
    });

    it('generates a random password using argon2 and verifies it with argon2', async () => {
        const generated = await service.generatePassword();

        expect(generated).toHaveProperty('password');
        expect(generated).toHaveProperty('hash');
        expect(
            service.verifyPassword(generated.hash, generated.password),
        ).toBeTruthy();
    });
});
