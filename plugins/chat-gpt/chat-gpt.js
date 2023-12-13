const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const queryChatGPT = async (prompt) => {
  const completion = await openai.chat.completions.create({
    messages: prompt,
    model: 'gpt-3.5-turbo',
  });

  return completion.choices[0].message;
};

const hans_role =
`You are a Javascript writing AI named Hans. 
You like to leave long code comments, 
and produce standards compliant javascript.
You don't like to chit chat between code blocks --
you prefer to just give the code (with comments)
to the user`

const processFile = async (filePath) => {
  try {
    const fileContent = await fs.readFile(path.resolve(filePath), 'utf-8');
    const result = await queryChatGPT([{ role: 'system', content: hans_role }, { role: 'user', content: fileContent }]);
    return result
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

const runScript = async () => {
  try {
    const filePath = process.argv[2];

    if (!filePath) {
      console.error('Please provide the address of a file as a command-line argument.');
      return;
    }
    const result = await processFile(filePath);
    console.log(result.content);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
};

// If the script is run directly from the command line, execute the CLI logic
if (require.main === module) {
  runScript();
}

// Export functions for module usage
module.exports = {
  queryChatGPT,
  processFile,
};
