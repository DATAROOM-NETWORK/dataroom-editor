/*
  chatGpt
  
  Usage: 
  <chat-gpt></chat-gpt>

  See https://javascript.info/custom-elements for more information
*/



class chatGpt extends HTMLElement {
  constructor() {
    super();
    this.fetching = false;
  }


  connectedCallback(){
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    
        
    if(this.value.length > 1){
      this.queryChatGPT(this.innerText);
    }
    this.innerHTML = `<notice>Querying Chat GPT...</notice>`
  }

  async queryChatGPT(query){
    if(this.fetching) return;
    this.fetching = true;

    const prompt = [{role: "user", content: query}]

    try {
      const response = await fetch("/chat-gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    const data = await response.json();
    this.innerHTML = `
      <mark-down>${data.content}</mark-down>
    `
    this.classList.remove('loading');
    this.fetching = false;

    return data;
    } catch(e){
      this.classList.add('error');
      this.innerText = "Error:" + JSON.stringify(e);
      this.fetching = false;

    }
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
    return ['prompt'];
  }

  attributeChangedCallback(name, old_value, new_value){
    if(new_value.length < 1) return

    switch(name){
    case "prompt":
      this.query = new_value;
      this.queryChatGPT(this.query);
      break;
    default:
    }
  }
}


customElements.define('chat-gpt', chatGpt);
