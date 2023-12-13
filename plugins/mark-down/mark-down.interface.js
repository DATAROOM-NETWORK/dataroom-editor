/*

  mark-down

  Use like <mark-down></mark-down>

 */

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


class MarkDown extends HTMLElement {
  connectedCallback(){
    this.init();
  }

  async init(){
    if(this.innerText.length > 0){
      this.render(this.innerText);
    } else if (!this.id){
      const error = 'Either content or an ID are required for the mark-down element';
      this.innerHTML = `<error>${error}</error>`;
      return console.error(error);
    } else {
      const data = await getNotebookPage(this.id);
      this.render(data.content);
    }
  }

  render(content){
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

customElements.define('mark-down', MarkDown)