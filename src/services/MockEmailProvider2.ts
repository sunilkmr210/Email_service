import { Logger } from '../utils/Logger';

export class MockEmailProvider2 {

    private logger: Logger;

    constructor(){
        this.logger = new Logger();
    }

    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        if (Math.random() > 0.5) throw new Error('MockEmailProvider2 failed');
        this.logger.log(`Email sent by MockEmailProvider2 to ${to}`);
        return true;
    }
}