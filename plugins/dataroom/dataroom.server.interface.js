import { DataroomElement } from './dataroom-element.js';

class WebSocketServer extends DataroomElement {
  async initialize(){
    this.innerHTML = " ";
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.innerText = 'DATAROOM SERVER';
    details.appendChild(summary);
    this.messageQueu = document.createElement('ul');
    details.appendChild(this.messageQueu);
    this.appendChild(details);
    await this.connectToServer();
  }

  // Connect to websocket server
  async connectToServer(){
    this.webSocket = await new WebSocket('ws://localhost:443/');
    this.webSocket.onopen = () => {
      this.handleConnect();
    }
    // event listener for receiving messages
    this.webSocket.onmessage = (event) => {
      this.handleMessage(event.data);
    }
    this.webSocket.onclose = () => {
      setTimeout(() => this.handleDisconnect(), 3000);
    }
    return this.webSocket;
  }

  handleDisconnect(){
    const new_message = document.createElement('li');
    new_message.innerText = `Server disconnected at ${Date.now()}`
    this.messageQueu.appendChild(new_message);
    this.attemptToReconnect();
    this.dtrmEvent('server-disconnected');
  }

  async attemptToReconnect(){
    try {
      await this.connectToServer();
    } catch(e){
      setTimeout(() => {
        this.connectToServer();
      }, 5000);
    }
  }

  handleConnect(){
    const new_message = document.createElement('li');
    new_message.innerText = `Server connected at ${Date.now()}`
    this.messageQueu.appendChild(new_message);
    this.dtrmEvent('server-connected');
  }

  handleMessage(data){
    const new_message = document.createElement('li');
    const message = JSON.parse(data);
    switch(message.type){
    case "plugin-changed":
      this.dtrmEvent(message.msg.join(''), message);
      break;
    case "notebook-page-changed":
      this.dtrmEvent(message.msg, message);
      break;
    case "error":
      console.error(data);
    }
    new_message.innerText = data;
    this.messageQueu.appendChild(new_message);
  }
}

customElements.define('dataroom-server', WebSocketServer);



