import { DataroomElement } from './dataroom-element.js';

class DataroomPanel extends DataroomElement {
  preLoad(){
    this.container = document.createElement('dataroom-container');
    this.appendChild(this.container);
  }

  async initialize(){
    const mode = this.getAttribute('mode');
    if(mode === null){
      this.setAttribute('mode', 'text-mode');
    }

    const button_bar = document.createElement('button-bar');
    this.appendChild(button_bar);

    button_bar.addEventListener('button-clicked', (e) => {
      const new_mode = e.detail.id; 
      this.setAttribute('mode', new_mode);
    });

    const { content } = await this.getFile(this.dtrm_id);
    this.innerHTML = content;
  }

  handleModeChange(new_mode){
    switch(new_mode){
    case "graph-mode":
      this.renderGraph();
      break;
    case "map-mode":
      this.renderMap();
      break;
    case "text-mode":
      this.renderText();
      break
    default:
      this.renderEditor();
    }
  }

  renderGraph(){
    this.container.innerHTML = `<graph-mode dtrm-id="${this.id}">Graph Mode ${this.id}</graph-mode>`
  }

  renderMap(){
    this.container.innerHTML = `<map-mode>Map Mode ${this.id}</map-mode>`
  }

  renderText(){
    this.container.innerHTML = `<text-mode>Text Mode ${this.id}</text-mode>`
  }

  renderEditor(){
    this.container.innerHTML = `<editor-mode>Editor mode ${this.id}</editor-mode>`
  }

  static get observedAttributes() {
    return ['dtrm-id', 'mode'];
  }

  attributeChangedCallback(name, old_value, new_value){
    if(new_value === old_value) return;
    switch(name){
    case "dtrm-id":
      break;
    case "mode":
      this.handleModeChange(new_value);
      break;
    default:
    }
  }
}

customElements.define('dataroom-panel', DataroomPanel)