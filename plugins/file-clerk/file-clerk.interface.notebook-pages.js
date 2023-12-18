/*

  Notebook Pages

 */



class NotebookPages extends HTMLElement {
  connectedCallback(){
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.innerText = 'Files';
    details.appendChild(summary);
    this.ul = document.createElement('ul');
    details.appendChild(this.ul);
    this.appendChild(details);
    this.init();
  }
  async init(){
    const data = await this.fetchData();
    data.forEach(d => {
      const item = document.createElement('li');
      item.innerHTML = `<hash-tag>${d}</hash-tag>`; 
      this.ul.appendChild(item);
    })
  }
  async fetchData(post = {}){
    const response = await fetch("/list-notebook-pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({type:''})
    });
    const data = response.json();
    return data;
  }
}

customElements.define('notebook-pages', NotebookPages);