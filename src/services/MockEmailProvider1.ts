import { Logger } from '../utils/Logger';

export class MockEmailProvider1 {

    private logger: Logger;

    constructor(){
        this.logger = new Logger();
    }

    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        if (Math.random() > 0.5) throw new Error('MockEmailProvider1 failed');
        this.logger.log(`Email sent by MockEmailProvider1 to ${to}`);
        return true;
    }
}