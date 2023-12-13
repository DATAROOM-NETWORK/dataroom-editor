/*
  
  FILE CLERK

  Here to save the day, as usual


 */

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

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


   

}