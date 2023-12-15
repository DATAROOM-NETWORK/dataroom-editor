/*
  
  Notebook Page


 */

class NotebookPage extends HTMLElement {
  connectedCallback(){
    this.init();
  }
  async init(){
    if(!this.id){return}
    this.renderPage(this.id);
  }



  async renderPage(id){
    const data = await this.fetchData(id);
    const markdown_component = document.createElement('mark-down');
    markdown_component.innerText = data.content;
    this.innerHTML = " ";
    this.appendChild(markdown_component);
    [...this.querySelectorAll('hash-tag')].forEach(hashtag => {
      hashtag.addEventListener('hash-tag-clicked', (e) => {
        e.preventDefault();
        const { hash_tag_id } = e.detail;
        this.setAttribute('id', hash_tag_id);
      })
    })
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
    console.log(new_value)
    switch(name){
      case 'id':
        this.renderPage(new_value);
        break;
      default:
    }
  }

}

customElements.define('notebook-page', NotebookPage);