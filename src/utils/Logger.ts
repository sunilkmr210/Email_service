export const logs: String[] = [];

export class Logger {
    log(message: string) {
        logs.push(`[LOG] ${new Date().toISOString()}: ${message}`);
    }
}
