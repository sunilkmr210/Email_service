import { MockEmailProvider1 } from './MockEmailProvider1';
import { MockEmailProvider2 } from './MockEmailProvider2';
import { exponentialBackoff } from '../utils/ExponentialBackoff';
import { RateLimiter } from './RateLimiter';
import { CircuitBreaker } from './CircuitBreaker';
import { Logger } from '../utils/Logger';

export class EmailService {
    private provider1: MockEmailProvider1;
    private provider2: MockEmailProvider2;
    private rateLimiter: RateLimiter;
    private circuitBreaker: CircuitBreaker;
    private logger: Logger;
    private sentEmails: Set<string>;

    constructor() {
        this.provider1 = new MockEmailProvider1();
        this.provider2 = new MockEmailProvider2();
        this.rateLimiter = new RateLimiter(60); // 60 requests per minute
        this.circuitBreaker = new CircuitBreaker(3, 30000); // 3 failures, 30 seconds timeout
        this.logger = new Logger();
        this.sentEmails = new Set<string>();
    }

    private generateEmailId(to: string, subject: string): string {
        return `${to}-${subject}`;
    }

    private async sendWithProvider(provider: MockEmailProvider1 | MockEmailProvider2, to: string, subject: string, body: string): Promise<boolean> {
        return this.circuitBreaker.execute(() => provider.sendEmail(to, subject, body));
    }

    public async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        const emailId = this.generateEmailId(to, subject);

        if (this.sentEmails.has(emailId)) {
            this.logger.log(`Email already sent: ${emailId}`);
            return false; // Idempotency checks
        }
        else{
            this.sentEmails.add(emailId);
        }

        if (!await this.rateLimiter.isAllowed()) {
            this.logger.log('Rate limit exceeded');
            return false;
        }

        try {
            await exponentialBackoff(3, () => this.sendWithProvider(this.provider1, to, subject, body));
        } catch (error1) {
            this.logger.log('Provider1 failed, switching to Provider2');
            try {
                await exponentialBackoff(3, () => this.sendWithProvider(this.provider2, to, subject, body));
            } catch (error2) {
                this.logger.log('Both providers failed');
                return false;
            }
        }

        this.sentEmails.add(emailId);
        this.logger.log(`Email sent successfully to ${to}`);
        return true;
    }
}
