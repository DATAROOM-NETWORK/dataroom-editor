/*
  
  DATAROOM ELEMENT

  #dataroom


 */

export class DataroomElement extends HTMLElement {

  connectedCallback(){
    this.dtrm_id = this.getAttribute('dtrm-id');

    if(this.dtrm_id === null){
      console.error('dtrm-id required');
      this.innerText = 'dtrm-id attribute required'
      return
    }

    this.initialize();
    const dtrm_server = document.querySelector('dataroom-server');
    dtrm_server.addEventListener(this.dtrm_id, (e) => {
      this.updateFile();
    });
  }

  disconnectedCallback(){
    console.log(this, "disconnecting");
  }


  /*
  
    UPDATE FILE

    if you want a different action
    when the file updates override
    this function in your subclass

   */
  async updateFile(){
    const { content } = await this.getFile(this.dtrm_id);
    this.innerHTML = content;
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

  async createFile(){
    try {
      const response = await fetch('/create-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'file-id': this.dtrm_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('File saved successfully');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file. Please try again.');
    }
  }

  async saveFile(file_content){
    try {
      const response = await fetch('/save-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'file-id': this.dtrm_id,
          content: file_content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('File saved successfully');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file. Please try again.');
    }
  }

  async getFile(){
    if(this.dtrm_id === null || !this.dtrm_id) return
    try {
      const response = await fetch('/load-notebook-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'file-id': this.dtrm_id,
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

  async appendToFile(content){
    if(this.dtrm_id === null || !this.dtrm_id) return

    try {
      const response = await fetch('/append-to-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          'file-id': this.dtrm_id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result
      } else {
        const error = await response.json();
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