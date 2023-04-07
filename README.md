# wait-for-true

⌛ A utility function that allows waiting for a condition to become true, with optional timeout and cancellation support.

It provides a simple and reliable way to wait for an asynchronous/synchronous condition, ensuring that the condition is checked at regular intervals until it becomes true or the timeout expires, and allowing the waiting to be canceled at any time by an optional abort signal.

## Install

```bash
# using npm
npm install wait-for-true
# using yarn
yarn add wait-for-true
```

## Usage

The `waitForTrue` function takes two arguments: a function that returns a boolean indicating whether the condition is met, and an optional configuration object.

#### Import

```js
// in ESM
import waitForTrue from 'wait-for-true';
// in CommonJS
const waitForTrue = require('wait-for-true');
```

#### Simple Use Case

```js
await waitForTrue(() => isFinished);
```

#### Advanced Use Case

```js
const asyncCondition = async () => await checkSomeCondition();
const abortController = new AbortController();
const customError = new Error('Timeout occured or abort triggered');

setTimeout(() => {
  // Abort the wait manually then customError will be thrown
  aborter.abort();
}, 5000);

await waitForTrue(asyncCondition, {
  interval: 250,
  timeout: 10000,
  signal: abortController.signal,
  error: customError,
});
```

## Configuration Options

| Option   | Type                                                                          | Description                                                                                            |
| -------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| interval | `number`                                                                      | The interval in milliseconds at which to check the condition (default: `50`)                           |
| timeout  | `number`                                                                      | The maximum amount of time to wait for the condition to be true, in milliseconds (default: `Infinity`) |
| signal   | [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) | An optional AbortSignal object that can be used to abort the wait                                      |
| error    | `Error`                                                                       | An optional error object to throw if the timeout or abort signal is triggered                          |

## Testing

This library is well tested. You can test the code as follows:

```bash
# using npm
npm test
# using yarn
yarn test
```

## Contribute

If you have anything to contribute, or functionality that you lack - you are more than welcome to participate in this!

## License

Feel free to use this library under the conditions of the MIT license.
