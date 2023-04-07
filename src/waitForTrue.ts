type Options = {
  interval?: number;
  timeout?: number;
  signal?: AbortSignal;
  error?: Error;
};

/**
 * Waits until a given condition is true or a timeout is reached, with optional support for abort signals.
 *
 * @param condition - A function that returns a boolean indicating whether the condition is met.
 * @param options - Optional configuration options.
 * @param options.interval - The interval in milliseconds at which to check the condition (default: 50ms).
 * @param options.timeout - The maximum amount of time to wait for the condition to be true, in milliseconds (default: Infinity).
 * @param options.signal - An optional `AbortSignal` object that can be used to abort the wait.
 * @param options.error - An optional error object to throw if the timeout or abort signal is triggered.
 *
 * @throws {TypeError} If the condition argument is not a function.
 * @throws {Error} If the abort signal is triggered or the timeout is reached and an error object is provided.
 */
const waitForTrue = async (
  condition: () => boolean | Promise<boolean>,
  options?: Options
): Promise<void> => {
  if (typeof condition !== 'function') {
    throw new TypeError('condition must be a function');
  }

  const aborter = new AbortController();

  let timeout: ReturnType<typeof setTimeout> | undefined;

  const interval = options?.interval ?? 50;
  const minimumInterval = options?.timeout ? Math.min(interval, options.timeout) : interval;

  if (options?.signal) options.signal.addEventListener('abort', () => aborter.abort());
  if (options?.timeout) timeout = setTimeout(() => aborter.abort(), options.timeout);

  try {
    while (!aborter.signal.aborted && !options?.signal?.aborted && !(await condition())) {
      await new Promise<void>(resolve => {
        const delayTimer = setTimeout(resolve, minimumInterval);

        aborter.signal.addEventListener('abort', () => {
          clearTimeout(delayTimer);
          resolve();
        });
      });
    }

    if (aborter.signal.aborted || options?.signal?.aborted) {
      if (options?.error) throw options.error;
      return;
    }
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

module.exports = waitForTrue;
export default waitForTrue;
