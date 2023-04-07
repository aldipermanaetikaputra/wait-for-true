/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import waitForTrue from './waitForTrue';

describe('waitForTrue with synchronous conditions', () => {
  it('should throw an error if condition is not a function', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    await expect(waitForTrue(2 as unknown as () => boolean)).rejects.toThrowError();
  });

  it('should resolve immediately if condition is true', async () => {
    const condition = jest.fn(() => true);
    await waitForTrue(condition);
    expect(condition).toHaveBeenCalledTimes(1);
  });

  it('should resolve after 100ms if condition becomes true', async () => {
    const condition = jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    await waitForTrue(condition);

    expect(condition).toHaveBeenCalledTimes(3);
  });

  it('should resolve by timeout if condition never becomes true', async () => {
    const condition = jest.fn(() => false);
    await waitForTrue(condition, { timeout: 100 });
    expect(condition).toHaveBeenCalled();
  });

  it('should reject with custom error after timeout', async () => {
    const condition = jest.fn(() => false);
    const error = new Error('Custom error');

    await expect(waitForTrue(condition, { timeout: 100, error })).rejects.toThrowError(error);

    expect(condition).toHaveBeenCalled();
  });

  it('should resolve when signal is aborted', async () => {
    const controller = new AbortController();
    const condition = jest.fn(() => false);

    setTimeout(() => controller.abort(), 100);

    await expect(waitForTrue(condition, { signal: controller.signal })).resolves.toBeUndefined();

    expect(condition).toHaveBeenCalled();
  });

  it('should abort when signal is aborted with custom error', async () => {
    const controller = new AbortController();
    const condition = jest.fn(() => false);
    const error = new Error('Custom error');

    setTimeout(() => controller.abort(), 100);

    await expect(waitForTrue(condition, { signal: controller.signal, error })).rejects.toThrowError(
      error
    );

    expect(condition).toHaveBeenCalled();
  });

  it('should reject if condition throws an error', async () => {
    const condition = jest.fn(() => {
      throw new Error('Condition error');
    });
    await expect(waitForTrue(condition)).rejects.toThrowError('Condition error');
    expect(condition).toHaveBeenCalledTimes(1);
  });

  it('should reject with error when condition throws an error', async () => {
    const error = new Error('Condition error');
    const condition = jest.fn(() => {
      throw error;
    });

    await expect(waitForTrue(condition)).rejects.toThrowError(error);

    expect(condition).toHaveBeenCalledTimes(1);
  });
});

describe('waitForTrue with asynchronous conditions', () => {
  it('should reject with error when condition rejects with an error', async () => {
    const error = new Error('Condition error');
    const condition = jest.fn(() => Promise.reject(error));

    await expect(waitForTrue(condition)).rejects.toThrowError(error);

    expect(condition).toHaveBeenCalledTimes(1);
  });

  it('should resolve after a delay when condition becomes true asynchronously', async () => {
    const condition = jest.fn(
      () => new Promise<boolean>(resolve => setTimeout(() => resolve(true), 100))
    );

    await waitForTrue(condition);

    expect(condition).toHaveBeenCalledTimes(1);
  });

  it('should work with asynchronous conditions and interval option', async () => {
    const condition = jest.fn().mockResolvedValue(false);

    setTimeout(() => condition.mockResolvedValue(true), 200);

    await waitForTrue(condition, { interval: 100 });

    expect(condition).toHaveBeenCalledTimes(3);
  });

  it('should resolve immediately if condition is already true', async () => {
    const condition = async () => true;
    await waitForTrue(condition);
  });

  it('should resolve after 100ms if condition becomes true asynchronously', async () => {
    const condition = jest
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    await waitForTrue(condition);

    expect(condition).toHaveBeenCalledTimes(3);
  });

  it('should resolve by timeout if condition never becomes true asynchronously', async () => {
    const condition = jest.fn(async () => false);
    await expect(waitForTrue(condition, { timeout: 100 })).resolves.toBeUndefined();
    expect(condition).toHaveBeenCalled();
  });

  it('should reject with custom error after timeout with asynchronous conditions', async () => {
    const condition = jest.fn(async () => false);
    const error = new Error('Custom error');

    await expect(waitForTrue(condition, { timeout: 100, error })).rejects.toThrowError(error);

    expect(condition).toHaveBeenCalled();
  });

  it('should resolve when signal is aborted with asynchronous conditions', async () => {
    const controller = new AbortController();
    const condition = jest.fn(async () => false);

    setTimeout(() => controller.abort(), 100);

    await expect(waitForTrue(condition, { signal: controller.signal })).resolves.toBeUndefined();

    expect(condition).toHaveBeenCalled();
  });

  it('should abort when signal is aborted with custom error with asynchronous conditions', async () => {
    const controller = new AbortController();
    const condition = jest.fn(async () => false);
    const error = new Error('Custom error');

    setTimeout(() => controller.abort(), 100);

    await expect(waitForTrue(condition, { signal: controller.signal, error })).rejects.toThrowError(
      error
    );

    expect(condition).toHaveBeenCalled();
  });
});
