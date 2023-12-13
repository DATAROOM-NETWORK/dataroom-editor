const assert = require('assert');
const { queryChatGPT, processFile } = require('./chat-gpt.js');

// Mocha tests
describe('queryChatGPT', () => {
  it('should return the completion message', async () => {
    const prompt = [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: 'Hello, how are you?' }];

    const result = await queryChatGPT(prompt);
    console.log(result);

    // Assert the type of the result
    assert.strictEqual(typeof result, 'object');

    // Assert that the result contains the message
    assert.ok(result);
  });
});

describe('processFile', () => {
  it('should return the completion message for the file content', async () => {
    const filePath = './notebook/chat-gpt.tests.prompt';

    const result = await processFile(filePath);
    console.log(result);

    // Assert the type of the result
    assert.strictEqual(typeof result, 'object');

    // Assert that the result contains the message
    assert.ok(result);
  });

  it('should throw an error if file reading fails', async () => {
    const filePath = 'nonexistent/file.txt';

    // Assert that an error is thrown
    await assert.rejects(async () => {
      await processFile(filePath);
    }, /*Error reading file*/);
  });
});
