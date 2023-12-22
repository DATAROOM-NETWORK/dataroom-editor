/*

  mark-down

  Use like <mark-down></mark-down>

 */

import { DataroomElement } from "../dataroom/dataroom-element.js";
import "./vendor/markdown-it.min.js";
import { hljs } from "./vendor/highlight/highlight.min.js";
const md = markdownit();

import "./mark-down.hash-tag.js";
import "./mark-down.link-tag.js";
import { getNotebookPage } from '../file-clerk/file-clerk.interface.js';


/*
  
  Remove Front Matter

  removes the code at the beginning of a markdown file
  for rendering

*/

function removeFrontMatter(content) {
    const yamlRegex = /^---\n([\s\S]*?)\n---/;
    return content.replace(yamlRegex, '').trim();
}

String.prototype.removeFrontMatter = function() {
  return removeFrontMatter(this);
};

class MarkDown extends DataroomElement {

  async initialize(){
    this.innerHTML = 'loading...'
    this.dtrm_id = this.getAttribute('dtrm-id');
    if(this.innerText.length > 0){
      this.render(this.innerText);
    } else if (!this.dtrm_id || this.dtrm_id === null){
      const error = 'Either content or an ID are required for the mark-down element';
      this.innerHTML = `<error>${error}</error>`;
      return console.error(error);
    } else {
      this.loadMDfromID(this.dtrm_id);
    }
    this.updateFile();
    setTimeout(() => {
      this.dtrmEvent('loaded');
    }, 100);
  }

  async updateFile(){
    this.loadMDfromID(this.dtrm_id);
  }

  async loadMDfromID(dtrm_id){
    const data = await this.getFile(dtrm_id);
    this.render(data.content);
  }

  render(content){
    this.innerHTML = "loading...";
    const parsed_content = content.removeFrontMatter();
    const html_content = md.render(parsed_content)
      .wrapHashtags()
      .wrapLinks();
    this.innerHTML = html_content;
    [...this.querySelectorAll('code')].forEach(codeblock => {
      hljs.highlightElement(codeblock);
    })
  }

}

customElements.define('mark-down', MarkDown);
