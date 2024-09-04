export class CircuitBreaker {
    private failureCount: number;
    private isOpen: boolean;
    private lastAttemptTime: number;

    constructor(private threshold: number, private timeout: number) {
        this.failureCount = 0;
        this.isOpen = false;
        this.lastAttemptTime = 0;
    }

    async execute(fn: () => Promise<boolean>): Promise<boolean> {
        if (this.isOpen && Date.now() - this.lastAttemptTime < this.timeout) {
            throw new Error('Circuit is open');
        }

        try {
            const result = await fn();
            this.reset();
            return result;
        } catch (error) {
            this.failureCount++;
            if (this.failureCount >= this.threshold) {
                this.isOpen = true;
                this.lastAttemptTime = Date.now();
            }
            throw error;
        }
    }

    private reset() {
        this.failureCount = 0;
        this.isOpen = false;
    }
}
