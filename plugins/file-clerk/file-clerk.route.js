/*
  
  FILE CLERK

  Here to save the day, as usual


 */

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const markdownIt = require('markdown-it');
const hljs = require('highlight.js'); // https://highlightjs.org


const md = markdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }

      return ''; // use external default escaping
    }
})

function generateNewHeader(file_id){
    return {
    "file-id":file_id,
    "date-created":new Date(),
    "last-updated":new Date()
  }

}

function generateNewFile(file_id){
  return `---
{
  "file-id":"${file_id}",
  "date-created":"${new Date()}",
  "last-updated":"${new Date()}"
}
---

# ${file_id}

`
}

async function wrapHashtags(text) {
  const hashtagRegex = /(^|[^#!\w])#([a-zA-Z0-9\-./]+)(?![^<>]*>)/g;
  // Replace hashtags with <hash-tag>...</hash-tag>
  const result = text.replace(hashtagRegex, '$1<hash-tag>$2</hash-tag>');
  return result;

};

function removeFrontMatter(content) {
    const yamlRegex = /^---\n([\s\S]*?)\n---/;
    return content.replace(yamlRegex, '').trim();
}

async function embedLinks(text) {
  const regex = /!#([a-z.-]+-)*[a-z.]+/g;
  const matches = text.match(regex);
  if (!matches) {
    return text;
  }

  const promises = matches.map(async (match) => {
    const file_id = match.slice(2);
    try {
      const file_path = path.join(global.root_directory, 'notebook', file_id);
      const fileContent = await fsPromises.readFile(file_path, 'utf8');
      const fetched_data = removeFrontMatter(fileContent);
      return { match, fetched_data };
    } catch (error) {
      const fetched_data = `${file_id} to come`;
      return { match, fetched_data };
    }
  });

  const results = await Promise.all(promises);

  let updated_string = text;
  results.forEach(({ match, fetched_data }) => {
    updated_string = updated_string.replace(match, fetched_data);
  });

  return updated_string;
}


async function processMarkdownString(text, file_id) {
  const split_content = text.split('---');
  let json_front_matter = {}
  try {
    json_front_matter = JSON.parse(split_content[1]);
  } catch(e){
    json_front_matter = generateNewHeader(file_id);
  }
  
  const markdown_content = removeFrontMatter(split_content.join('---'));
  const embedded = await embedLinks(markdown_content);
  const hash_tags = await wrapHashtags(embedded);

  const html_content = md.render(hash_tags);

  return {
    metadata: json_front_matter,
    markdown: hash_tags,
    html: html_content
  };
}


async function fetchNotebookPage(file_path, file_id){
  const content = await fsPromises.readFile(file_path, 'utf8');
  return await processMarkdownString(content, file_id)
}

module.exports = function (app) {

  /*
  
    List All Notebook Pages

   */
  
  app.post('/list-notebook-pages', async function (req, res) {
    try {
      // Extract the "type" parameter from the request body or set it to an empty string if not provided
      const { type } = req.body || { type: '' };

      // Get the directory path
      const directoryPath = path.join(global.root_directory, 'notebook');

      // Read all files in the directory
      const files = await fsPromises.readdir(directoryPath);

      // Filter files based on the provided "type" suffix or return all files if "type" is not provided
      const filteredFiles = type
        ? files.filter((file) => file.endsWith(`.${type}`))
        : files;

      res.json(filteredFiles);
    } catch (err) {
      res.status(500).json({ error: 'Error listing files' });
    }
  });

  /*
  
    Get a single notebook page. If the page doesn't exist, create it.

  */
  app.post('/load-notebook-page', async function (req, res) {
    if(!req.body["file-id"]){
      return res.status(400).json({ error: 'file-id is required in the request body' });
    }
    const file_id = req.body["file-id"];
    const file_path = path.join(global.root_directory, 'notebook', file_id);
    try {
      const content = await fsPromises.readFile(file_path, 'utf8');
      res.json({ content });
    } catch (err) {
      const new_file = generateNewFile(file_id);
      await fsPromises.writeFile(file_path, new_file, 'utf8', (err) => {
        if (err) {return res.status(500)}
      });
      const content = await fsPromises.readFile(file_path, 'utf8');
      res.json({ content });
    }
  });

  app.post('/load-compiled-notebook-page', async function (req, res) {
    if(!req.body["file-id"]){
      return res.status(400).json({ error: 'file-id is required in the request body' });
    }
    const file_id = req.body["file-id"];
    const file_path = path.join(global.root_directory, 'notebook', file_id);
    try {
      const content = await fetchNotebookPage(file_path, file_id)
      res.json({ content });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  /*
    
    Check if a File Exists

   */
  app.post('/does-file-exist', async function (req, res) {
    if(!req.body["file-id"]){
      return res.status(400).json({ error: 'file-id is required in the request body' });
    }

    const file_id = req.body["file-id"];
    const file_path = path.join(global.root_directory, 'notebook', file_id);

    try {
      // Check if the file exists
      const exists = await fsPromises.access(file_path, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      res.json({ exists });
    } catch (err) {
      res.status(500).json({ error: 'Error checking file existence' });
    }
  });

  /*
  
    DELETE FILE

  */
 
  app.post('/delete-file', async function (req, res) {
    if (!req.body["file-id"]) {
      return res.status(400).json({ error: 'file-id is required in the request body' });
    }
    const file_id = req.body["file-id"];
    const file_path = path.join(global.root_directory, 'notebook', file_id);

    try {
      await fsPromises.unlink(file_path);
      res.json({ message: 'File deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Error deleting the file' });
    }
  });

  /*
    Create a file

   */
  app.post('/create-file', async function (req, res) {
    if (!req.body.content || !req.body["file-id"]) {
        return res.status(400).json({ error: 'Both content and file-id are required in the request body' });
    }
    const file_id = req.body["file-id"];
    // Construct the file path based on the provided file_path
    const file_path = path.join(global.root_directory, 'notebook',  file_id );
    // Write the content to the file
    
    let new_file_content = generateNewFile(file_id);
    new_file_content += req.body.content;
    fs.writeFile(file_path, new_file_content, 'utf8', (err) => {
      if (err) {
          return res.status(500).json({ error: 'Error saving the file' });
      }
      res.json({content:new_file_content});
    });
  });


  /*
    Save a file

   */
  app.post('/save-file', async function (req, res) {
    if (!req.body.content || !req.body["file-id"]) {
        return res.status(400).json({ error: 'Both content and file-id are required in the request body' });
    }
    const file_id = req.body["file-id"];
    // Construct the file path based on the provided file_path
    const file_path = path.join(global.root_directory, 'notebook',  file_id );
    // Write the content to the file
    fs.writeFile(file_path, req.body.content, 'utf8', (err) => {
      if (err) {
          return res.status(500).json({ error: 'Error saving the file' });
      }
      res.json({ message: 'File saved successfully' });
    });
  });

  /*
    Append to a file
  */
  app.post('/append-to-file', async function (req, res) {
    if (!req.body.content || !req.body["file-id"]) {
      return res.status(400).json({ error: 'Both content and file-id are required in the request body' });
    }
    
    const file_id = req.body["file-id"];
    // Construct the file path based on the provided file_path
    const file_path = path.join(global.root_directory, 'notebook', file_id);

    // Append the content to the file
    fs.appendFile(file_path, req.body.content, 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error appending to the file' });
      }
      res.json({ message: 'Content appended to the file successfully' });
    });
  });


  app.get('/get-keys', async function (req, res) {
    const keysFilePath = path.join(__dirname, '../../.keys');

    try {
      const content = await fsPromises.readFile(keysFilePath, 'utf8');
      const keysArray = content.trim().split('\n');
      const keysObject = {};

      keysArray.forEach((line) => {
        const [key, value] = line.split('=');
        keysObject[key.trim()] = value.trim();
      });

      res.json({ keys: keysObject });
    } catch (err) {
      if (err.code === 'ENOENT') {
        // ENOENT error code indicates that the file does not exist
        res.json({ keys: {} }); // Return an empty object if the file doesn't exist
      } else {
        res.status(500).json({ error: 'Error reading or parsing keys file' });
      }
    }
  });



   

}