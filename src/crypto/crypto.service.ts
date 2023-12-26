import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import * as argon2 from 'argon2';

@Injectable()
export class CryptoService {
    sha256(input: string): string {
        return createHash('sha256').update(input).digest('hex').toString();
    }

    async hashPassword(input: string): Promise<string> {
        return await argon2.hash(input);
    }

    async generatePassword(
        length: number = 16,
    ): Promise<{ password: string; hash: string }> {
        const password = this.randomString(length);
        const hash = await argon2.hash(password);

        return {
            password,
            hash: hash.toString(),
        };
    }

    async verifyPassword(hashed: string, actual: string): Promise<boolean> {
        let result = false;

        try {
            result = await argon2.verify(hashed, actual);
        } catch (e) {
            // @todo - handle internal error by logging or providing error message
        }

        return result;
    }

    randomString(length: number = 16): string {
        return randomBytes(length).toString('hex').substring(0, length);
    }
}
