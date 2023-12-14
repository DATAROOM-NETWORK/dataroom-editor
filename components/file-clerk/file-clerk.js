/*
  fileClerk
  
  Usage: 
  <file-clerk></file-clerk>

  See https://javascript.info/custom-elements for more information
*/



class fileClerk extends HTMLElement {
  constructor() {
    super();
    // element created
  }

  connectedCallback(){
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    this.innerHTML = `fileClerk initialized`;
    this.init();
  }

  async init(){
    const data = await this.fetchData();
    console.log(data)
    const file_list = data.files
      .filter(f => f.slice(-2).toLowerCase() === 'md')
      .map(f => {
        return '#' + f.substring(0, f.length - 3)
    }).join(`

    `);

    const markdown_container = document.createElement('mark-down');
    markdown_container.innerText = file_list;
    this.appendChild(markdown_container);
  }

  async fetchData(post = {}){
    const response = await fetch("/list-files", {
      method: "GET",
    });
    const data = response.json();
    return data;
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
      default:
    }
  }
}

customElements.define('file-list', fileClerk)
