/*

  Notebook Pages

 */


class NotebookPages extends HTMLElement {
  connectedCallback(){
    this.init();
  }
  async init(){
    const data = await this.fetchData();
    this.innerHTML = data.map(d => {
      return `<hash-tag>${d}</hash-tag>`
    }).join('');
  }
  async fetchData(post = {}){
    const response = await fetch("/list-notebook-pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post)
    });
    const data = response.json();
    return data;
  }
}

customElements.define('notebook-pages', NotebookPages);