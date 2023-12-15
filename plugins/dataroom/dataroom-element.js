export class DataroomElement extends HTMLElement {
  constructor(){
    super();
    this.dtrm_id = this.getAttribute('dtrm-id');
    if(this.dtrm_id === null){
      this.dtrm_id = `dtrm-${crypto.randomUUID()}`;
    }
    // run before anything else
    this.preLoad()
  }

  preLoad(){
    return
  }

  connectedCallback(){
    this.setAttribute('dtrm-id', this.dtrm_id);
    this.initialize();
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

  getAllHashTags(){

  }

  getAllReferences(){

  }

  // Emits a custom event
  dtrmEvent(name, detail = {}){
    const dtrmEvent = new CustomEvent(name, {
      detail
    });

    this.dispatchEvent(dtrmEvent);
  }
}