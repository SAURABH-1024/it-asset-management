import { AuthenticationStrategy } from '@loopback/authentication';
import { UserProfile, securityId } from '@loopback/security';
import { Request } from '@loopback/rest';
import { UsersRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
// import { inject } from '@loopback/core';

export class BasicStrategy implements AuthenticationStrategy {
    name = 'basic';

    constructor(
        @repository(UsersRepository) protected userRepository: UsersRepository,
    ) { }

    async authenticate(request: Request): Promise<UserProfile | undefined> {
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Basic ')) {
            throw new HttpErrors.Unauthorized('Authorization header is missing or invalid');
        }

        const encodedCredentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
        const [username, password] = credentials.split(':');

        const user = await this.userRepository.findOne({ where: { username } });

        if (user && user.password === password) { // Validate passwords securely in production
            if (!user.id) {
                throw new HttpErrors.Unauthorized('Invalid user ID');
            }
            return {
                [securityId]: user.id,
                name: user.username,
                role: user.role,
            };
        }

        throw new HttpErrors.Unauthorized('Invalid credentials');
    }
}
