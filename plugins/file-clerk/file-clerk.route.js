import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

export default function (app) {
  app.post('/list-notebook-pages', async function (req, res) {
    try {
      const { type } = req.body || { type: '.md' };
      const directoryPath = path.join(global.root_directory, 'notebook');
      const files = await fsPromises.readdir(directoryPath);
      console.log(files);
      const filteredFiles = type ? files.filter((file) => file.endsWith(`.${type}`)) : files;
      res.json(filteredFiles);
    } catch (err) {
      res.status(500).json({ error: 'Error listing files' });
    }
  });

  app.post('/create-notebook-page', async function (req, res) {
    try {
      const { file_id } = req.body;
      if (!file_id) {
        return res.status(400).json({ error: 'File ID is required' });
      }

      const directoryPath = path.join(global.root_directory, 'notebook');
      const fileName = `${file_id}.md`;
      const filePath = path.join(directoryPath, fileName);

      // Check if the file already exists
      const fileExists = await fsPromises.access(filePath).then(() => true).catch(() => false);
      if (fileExists) {
        return res.status(400).json({ error: 'File with the same ID already exists' });
      }

      const currentDate = new Date().toISOString();
      const frontMatter = `{
        "file-id": "${file_id}",
        "created-date": "${currentDate}",
        "last-updated": "${currentDate}"
      }`;

      // Create the file with front matter
      await fsPromises.writeFile(filePath, frontMatter);

      res.json({ success: true, message: 'Notebook page created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error creating notebook page' });
    }
  });


}


