const fs = require('fs');
const path = require('path');

const folderPath = './notebook'; // Replace with the path to your folder

// Function to lowercase file names and preserve periods between words
function sanitizeFileName(fileName) {
    const lowercasedFileName = fileName.toLowerCase();
    const preservedPeriodsFileName = lowercasedFileName.replace(/ /g, '-');
    return preservedPeriodsFileName;
}

// Read the files in the folder
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    // Process each file
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const sanitizedFileName = sanitizeFileName(file);
        const newFilePath = path.join(folderPath, sanitizedFileName);

        // Rename the file
        fs.rename(filePath, newFilePath, (renameErr) => {
            if (renameErr) {
                console.error(`Error renaming file ${file}:`, renameErr);
            } else {
                console.log(`File ${file} renamed to ${sanitizedFileName}`);
            }
        });
    });
});
