/*
  
  DATAROOM ELEMENT

  #dataroom


 */

export class DataroomElement extends HTMLElement {
  constructor(){
    super();
    this.dtrm_id = this.getAttribute('dtrm-id');
    if(this.dtrm_id === null){
      return console.error('dtrm-id required');
    }
    this.container = document.createElement('dataroom-container');
    this.appendChild(this.container);
  }

  connectedCallback(){
    this.initialize();
    this.updateFile();
    const dtrm_server = document.querySelector('dataroom-server');
    dtrm_server.addEventListener(this.dtrm_id, (e) => {
      this.updateFile();
    });
  }

  async updateFile(){
    const { content } = await this.getFile(this.dtrm_id);
    this.container.innerHTML = content;
  }

  async initialize(){
    console.log('please override initialize in your own class');
  }

  setAttributesFromObject(obj = {}){
    Object.keys(obj).forEach(key => {
      this.setAttribute(key, obj[key]);
    })
  }

  async checkID(fileId) {
    if(!fileId || fileId === null){
      fileId = this.getAttribute('dtrm-id');
    }
    try {
      const response = await fetch('/does-file-exist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'file-id': fileId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.exists;
      } else {
        console.error(`Server returned with status code ${response.status}`);
        return false;
      }
    } catch (err) {
      console.error('Error querying server');
      return false;
    }
  }

  async getFile(dtrm_id){
    if(dtrm_id === null || !dtrm_id) return
    try {
      const response = await fetch('/load-notebook-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'file-id': dtrm_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error(`Server returned with status code ${response.status}`);
        return {};
      }
    } catch (err) {
      console.error('Error querying server');
      return err;
    }
  }

  async appendToFile(content, fileId){
    if(!fileId || fileId === null){
      fileId = this.getAttribute('dtrm-id');
    }
    try {
      const response = await fetch('/append-to-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          'file-id': fileId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while making the request');
    }
  }

  // Emits a custom event
  dtrmEvent(name, detail = {}){
    const dtrmEvent = new CustomEvent(name, {
      detail
    });
    this.dispatchEvent(dtrmEvent);
  }
}