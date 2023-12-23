import { DataroomElement } from "../dataroom/dataroom-element.js";

class DataroomPrompt extends DataroomElement {
  async initialize(){
    this.content = this.innerText; 
    this.innerHTML = ' ';
    this.container = document.createElement('div');
    this.appendChild(this.container);

    this.query_input_container = document.createElement('form');
    this.query_input = document.createElement('input');
    this.query_input_container.appendChild(this.query_input);

    this.query_input_submit = document.createElement('input');
    this.query_input_submit.setAttribute('type', 'submit');
    this.query_input_container.appendChild(this.query_input_submit); 
    this.query_input_submit.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleSubmit(this.query_input.value);
      this.query_input.value = '';
    });

    this.appendChild(this.query_input_container);

    if(await this.checkID(this.dtrm_id)){

      this.updateFile();
    } else {
      if(this.content.length < 1){
        this.container.innerText = 'No Prompt Found. No File Exists.'
      } else {
        this.prompt = this.content
        this.content = '\n## Prompt\n' + this.prompt + '\n';
        await this.getFile();
        await this.appendToFile(this.content);
        this.updateFile();
        const query_result = await this.queryLLM(this.prompt);
        this.appendToFile("\n## Result \n\n" + query_result);
        this.updateFile();
        // this.innerText = query;
      }
    }
  }

  async handleSubmit(value){
    console.log(value);
    this.appendToFile(`\n--- \n## Prompt \n ${value}`);
    const new_file_content = await this.getFile();
    const query_result = await this.queryLLM(new_file_content.content);
    this.appendToFile(`\n## Result \n\n` + query_result);
  }

  updateFile(){
    this.container.innerHTML = ' ';
    const markdown = document.createElement('mark-down');
    markdown.setAttribute('dtrm-id', this.dtrm_id);
    this.container.appendChild(markdown);     
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