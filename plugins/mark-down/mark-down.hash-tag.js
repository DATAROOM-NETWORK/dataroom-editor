/*

This regex modification uses a negative lookahead ((?![^<>]*>)) 
to ensure that the match does not occur inside angle 
brackets (< and >), effectively excluding matches 
within an <svg> tag. The (^|[^<]) part ensures that 
the match is either at the beginning of the string or not preceded by a <.

 */
function wrapHashtags(text) {
  // Regular expression to find hashtags (words starting with #) excluding those preceded by a character
  const hashtagRegex = /(^|[^#\w])#([a-zA-Z0-9\-./]+)(?![^<>]*>)/g;
  // Replace hashtags with <hash-tag>...</hash-tag>
  const result = text.replace(hashtagRegex, '$1<hash-tag>$2</hash-tag>');
  return result;
}

String.prototype.wrapHashtags = function() {
  return wrapHashtags(this);
};



class HashTag extends HTMLElement {
  connectedCallback(){
    this.addEventListener('click', (e) => {
      console.log(this.innerText);
    //   const open_in_new_tab = e.ctrlKey;
    //   if (open_in_new_tab) {
    //     const new_url = generateURLFromObject({'file-id':this.innerText})
    //     const newTab = window.open(new_url, '_blank');
    //     if (newTab) {
    //       newTab.focus();
    //     }
    //   } else {
    //     setURLValues({'file-id':this.innerText});
    //     window.location.assign(window.location.href);
    //   }
    });
  }
}

customElements.define('hash-tag', HashTag);