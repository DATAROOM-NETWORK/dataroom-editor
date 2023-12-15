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


function findNearestNotebookPage(){
  const tagName = 'notebook-page'.toUpperCase();
  while(element){
    if(element.tagName = tagName){
      return element;
    }
    element = element.parentNode;
  }

}


class HashTag extends HTMLElement {
  connectedCallback(){
    this.addEventListener('click', (e) => {
      console.log(this.innerText)
      // Create a new custom event with a specific type (e.g., "customEvent") and a detail property
    const hash_tag_clicked = new CustomEvent("hash-tag-clicked", {
        detail: {
            hash_tag_id: this.innerText
        }
    });

    // Dispatch the custom event on a target element or the document
    // For example, dispatching on the document:
    this.dispatchEvent(hash_tag_clicked);

    });
  }
}

customElements.define('hash-tag', HashTag);