/*

  Notebook Pages

 */



class NotebookPages extends HTMLElement {
  connectedCallback(){
    this.ul = document.createElement('ul');
    this.appendChild(this.ul)
    this.init();
  }
  async init(){
    const data = await this.fetchData();
    data.forEach(d => {
      const item = document.createElement('li');
      item.innerText = d; 
      item.addEventListener('click', (e) => {
        const select_notebook = new CustomEvent("notebook-page-selected", {
          detail:d
        });

        this.dispatchEvent(select_notebook)
       
      });
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