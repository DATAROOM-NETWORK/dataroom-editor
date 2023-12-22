/*

This regex modification uses a negative lookahead ((?![^<>]*>)) 
to ensure that the match does not occur inside angle 
brackets (< and >), effectively excluding matches 
within an <svg> tag. The (^|[^<]) part ensures that 
the match is either at the beginning of the string or not preceded by a <.

 */
function wrapLinks(text) {
  // Regular expression to find hashtags (words starting with #) excluding those inside <svg> tags
  const hashtagRegex = /(^|[^<])@([a-zA-Z0-9\-./]+)(?![^<>]*>)/g;
  // Replace hashtags with <hash-tag>...</hash-tag>
  const result = text.replace(hashtagRegex, '$1<link-tag>$2</link-tag>');
  return result;
}

String.prototype.wrapLinks = function() {
  return wrapLinks(this);
};

class LinkTag extends HTMLElement {
  connectedCallback(){
    this.addEventListener('click', (e) => {
      console.log(this.innerText);
    });
  }
}

customElements.define('link-tag', LinkTag)