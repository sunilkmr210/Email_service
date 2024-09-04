
import { CircuitBreaker } from "../services/CircuitBreaker";

describe('CircuitBreaker', () => {
    let circuitBreaker: CircuitBreaker;
    const threshold = 3;
    const timeout = 1000; // 1 second

    beforeEach(() => {
        circuitBreaker = new CircuitBreaker(threshold, timeout);
    });

    test('should execute function successfully and reset failure count', async () => {
        const successFn = jest.fn().mockResolvedValue(true);

        const result = await circuitBreaker.execute(successFn);
        
        expect(result).toBe(true);
        expect(successFn).toHaveBeenCalled();
        expect(circuitBreaker['failureCount']).toBe(0);
        expect(circuitBreaker['isOpen']).toBe(false);
    });

    test('should open circuit breaker after reaching the threshold', async () => {
        const failFn = jest.fn().mockRejectedValue(new Error('Failed'));

        // Fail enough times to open the circuit
        for (let i = 0; i < threshold; i++) {
            await expect(circuitBreaker.execute(failFn)).rejects.toThrow('Failed');
        }

        expect(circuitBreaker['failureCount']).toBe(threshold);
        expect(circuitBreaker['isOpen']).toBe(true);

        // Try to execute while the circuit is open
        await expect(circuitBreaker.execute(() => Promise.resolve(true))).rejects.toThrow('Circuit is open');
    });
});
