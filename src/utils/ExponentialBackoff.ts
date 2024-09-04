export async function exponentialBackoff(retries: number, fn: () => Promise<boolean>): Promise<boolean> {
    let attempt = -1;
    let delay = 100;

    while (attempt < retries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            if (attempt >= retries) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }

    return false;
}
