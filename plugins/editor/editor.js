import { DataroomElement } from "../dataroom/dataroom-element.js";
import "./json-edit/json-edit.js";
import "./lnsy-edit/lnsy-edit.js";

class EditorComponent extends DataroomElement {
  async initialize(){
    this.innerHTML = ' ';
    this.lnsy_edit = document.createElement('lnsy-edit');
    this.appendChild(this.lnsy_edit);
  }
}

customElements.define('editor-component', EditorComponent);