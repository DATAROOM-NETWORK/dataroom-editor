const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path')
const WebSocket = require('ws');

function watchPlugins(ws){
  const plugins_directory = path.join(global.root_directory, 'plugins');
  const plugins = chokidar.watch(plugins_directory, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true, // don't call fileUpdated on the initial scan
    awaitWriteFinish: true // wait for the file to be fully written before calling fileUpdated
  });
  plugins.on('change', (filePath) => {
    ws.send(JSON.stringify({
      type: 'plugin-changed',
      msg: filePath
    }));
  });

  // Event listener for file additions
  plugins.on('add', (filePath) => {
    ws.send(JSON.stringify({
      type: 'plugin-added',
      msg: filePath
    }));
  });

  // Event listener for file deletions
  plugins.on('unlink', (filePath) => {
    ws.send(JSON.stringify({
      type: 'plugin-deleted',
      msg: filePath
    }));
  });

  // Event listener for errors
  plugins.on('error', (error) => {
    ws.send(JSON.stringify({
      type: 'plugin-watcher-error',
      msg: error
    }));
  });
}

function functionWatchNotebooks(ws){
  const notebook_directory = path.join(global.root_directory, 'notebook');
  const notebook = chokidar.watch(notebook_directory, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true, // don't call fileUpdated on the initial scan
    awaitWriteFinish: true // wait for the file to be fully written before calling fileUpdated
  });
  notebook.on('change', (filePath) => {
    ws.send(JSON.stringify({
      type: 'notebook-page-changed',
      msg: filePath.split('/').pop()
    }));
  });

  // Event listener for file additions
  notebook.on('add', (filePath) => {
    ws.send(JSON.stringify({
      type: 'notebook-page-added',
      msg: filePath.split('/').pop()
    }));
  });

  // Event listener for file deletions
  notebook.on('unlink', (filePath) => {
    ws.send(JSON.stringify({
      type: 'notebook-page-deleted',
      msg: filePath.split('/').pop()
    }));
  });

  // Event listener for errors
  notebook.on('error', (error) => {
    ws.send(JSON.stringify({
      type: 'notebook-page-watcher-error',
      msg: error
    }));
  });

}

async function initializeUpdateServer(){
  const wss = await new WebSocket.Server({ port:443 });
  wss.on('connection', ws => {
    watchPlugins(ws);
    functionWatchNotebooks(ws);
  })

}

initializeUpdateServer();

module.exports = function (app) {

}