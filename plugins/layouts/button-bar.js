import { DataroomElement } from "../dataroom/dataroom-element.js";

class ButtonBar extends DataroomElement {
  async initialize(){
    this.innerHTML = `
      <button id="map-mode">Map</button>
      <button id="graph-mode">Graph</button>
      <button id="text-mode">Text</button>
      <button id="edit-mode">Edit</button>
  `;

    [...this.querySelectorAll('button')].forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.dtrmEvent('button-clicked', {id:button.id});
      })
    })
  }
}

customElements.define('button-bar', ButtonBar)