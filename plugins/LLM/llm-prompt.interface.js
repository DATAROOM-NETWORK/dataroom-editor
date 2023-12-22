import { DataroomElement } from "../dataroom/dataroom-element.js";

class DataroomPrompt extends DataroomElement {
  async initialize(){
    if(await this.checkID(this.dtrm_id)){
      this.updateFile();
    } else {
      this.content = this.innerText; 
      if(this.content.length < 1){
        this.container.innerText = 'No Prompt Found. No File Exists.'
      } else {
        this.prompt = this.content
        this.content = '## Prompt \n' + this.prompt + '\n';
        await this.getFile();
        await this.appendToFile(this.content);
        this.updateFile();
        const query_result = await this.queryLLM(this.prompt);
        this.appendToFile("## Result \n" + query_result);
        this.updateFile();
        // this.innerText = query;
      }
    }
  }

  updateFile(){
    this.innerHTML = ' ';
    const markdown = document.createElement('mark-down');
    markdown.setAttribute('dtrm-id', this.dtrm_id);
    this.appendChild(markdown)      
  }

  async queryLLM(content){
    try {
      const response = await fetch('/query-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({content}),
      });
      if (response.ok) {
        const data = await response.json();

        return data.choices[0].message.content;
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }
}

customElements.define('llm-prompt', DataroomPrompt);