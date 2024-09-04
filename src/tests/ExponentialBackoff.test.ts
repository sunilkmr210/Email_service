import { exponentialBackoff } from "../utils/ExponentialBackoff";

describe('exponentialBackoff', () => {
    it('should retry the specified number of times before giving up', async () => {
        const mockFn = jest.fn()
            .mockRejectedValueOnce(new Error('First attempt'))
            .mockRejectedValueOnce(new Error('Second attempt'))
            .mockResolvedValue(true);

        await expect(exponentialBackoff(3, mockFn)).resolves.toBe(true);
        expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should increase delay exponentially with each retry', async () => {
        const mockFn = jest.fn().mockRejectedValue(new Error('Always fails'));

        const startTime = Date.now();
        await expect(exponentialBackoff(3, mockFn)).rejects.toThrow('Always fails');
        const endTime = Date.now();

        const elapsed = endTime - startTime;

        // Assert that the elapsed time is approximately what we expect
        // 100ms + 200ms + 400ms = 700ms (plus some small overhead)
        expect(elapsed).toBeGreaterThan(300);
        expect(elapsed).toBeLessThan(750); //buffer of 50 ms
    });

    it('should return the result of the function if it succeeds', async () => {
        const mockFn = jest.fn().mockResolvedValue(true);

        await expect(exponentialBackoff(3, mockFn)).resolves.toBe(true);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if all retries fail', async () => {
        const mockFn = jest.fn().mockRejectedValue(new Error('Always fails'));

        await expect(exponentialBackoff(3, mockFn)).rejects.toThrow('Always fails');
        expect(mockFn).toHaveBeenCalledTimes(4);
    });
});
