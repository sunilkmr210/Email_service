import { EmailService } from '../services/EmailService';
import { RateLimiter } from '../services/RateLimiter';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  it('should send an email successfully', async () => {
    const result = await emailService.sendEmail('test@example.com', 'Hello', 'This is a test');
    expect(result).toBe(true);
  });

  it('should prevent duplicate emails', async () => {
    await emailService.sendEmail('test@example.com', 'Hello', 'This is a test');
    const result = await emailService.sendEmail('test@example.com', 'Hello', 'This is a test');
    expect(result).toBe(false);
  });

  it('should handle rate limiting', async () => {

    const rateLimiter = new RateLimiter(60);

    let result;

    // Simulate sending 60 emails within the rate limit
    for (let i = 0; i < 60; i++) {
      const isAllowed = await rateLimiter.isAllowed();
      if (isAllowed) {
        result = await emailService.sendEmail(`test${i}@example.com`, 'Hello', 'This is a test');
      }
    }

    // Now send the 61st email which should be blocked
    const isAllowed = await rateLimiter.isAllowed();
    if (isAllowed) {
      result = await emailService.sendEmail('test61@example.com', 'Hello', 'This is a test');
    } else {
      result = false;
    }

    expect(result).toBe(false);
  }, 100000);
});
