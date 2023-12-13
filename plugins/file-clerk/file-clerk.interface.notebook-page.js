/*
  
  Notebook Page


 */

class NotebookPage extends HTMLElement {
  connectedCallback(){
    this.init();
  }
  async init(){
    const data = await this.fetchData(this.id);
    this.innerText = JSON.stringify(data);
  }
  async fetchData(id){
    const response = await fetch("/load-notebook-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"file-id":id})
    });
    const data = response.json();
    return data;
  }
  static get observedAttributes() {
    return ['id'];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
      case 'id':
        this.fetchData(new_value);
        break;
      default:
    }
  }

}

customElements.define('notebook-page', NotebookPage);