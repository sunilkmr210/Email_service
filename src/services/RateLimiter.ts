export class RateLimiter {
    private requests: number;
    private lastRequestTime: number;

    constructor(private maxRequestsPerMinute: number) {
        this.requests = 0;
        this.lastRequestTime = Date.now();
    }

    async isAllowed(): Promise<boolean> {
        const now = Date.now();
        if (now - this.lastRequestTime > 60000) {
            this.requests = 0;
            this.lastRequestTime = now;
        }

        if (this.requests < this.maxRequestsPerMinute) {
            this.requests++;
            return true;
        }

        return false;
    }
}
