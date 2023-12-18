class HashTag extends HTMLElement {
  connectedCallback(){
    this.addEventListener('click', (e) => {
      const open_in_new_tab = e.ctrlKey;
      if (open_in_new_tab) {
        const new_url = generateURLFromObject({'file-id':this.innerText})
        const newTab = window.open(new_url, '_blank');
        if (newTab) {
          newTab.focus();
        }
      } else {
        setURLValues({'file-id':this.innerText});
        window.location.assign(window.location.href);
      }
    });
  }
}

customElements.define('hash-tag', HashTag);