class NewFile extends HTMLElement {
  connectedCallback(){
    this.form = document.createElement('form');
    this.form.innerHTML = `

    <input type="text" name="file-name">
    <textarea name="description"></textarea>
    <input type="submit">

    `

    this.appendChild(this.form);
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      var inputs = this.form.querySelectorAll('input, textarea');
      // Create an object to store name-value pairs
      var formData = {};

      // Loop through each input and store name-value pairs
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.type !== 'submit') {
          formData[input.name] = input.value;
        }
      }
    });
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

customElements.define('new-file', NewFile)


class FileClerk extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
      <new-file></new-file>
    `
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

customElements.define('file-clerk', FileClerk)