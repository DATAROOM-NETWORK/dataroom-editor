/*
  RSSFeed
  
  Usage: 
  <rss-feed></rss-feed>

  See https://javascript.info/custom-elements for more information
*/


function ParseXML(xmlText){
  console.log(xmlText);

    // Parse the XML content using DOMParser
  // Parse the XML content using DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    // Check if required elements exist
    const channelTitleElement = xmlDoc.querySelector('title');
    if (!channelTitleElement) {
      throw new Error('Missing required "channel title" element');
    }

    const feedTitle = channelTitleElement.textContent;
    
    const feedItems = Array.from(xmlDoc.querySelectorAll('entry')).map(item => {
      return {
        title: item.querySelector('title')?.textContent || 'No title available',
        link: item.querySelector('link')?.textContent || '#',
        description: item.querySelector('description')?.textContent || 'No description available',
        pubDate: item.querySelector('pubDate')?.textContent || 'No date available'
      };
    });

    // Create semantic HTML output
    const htmlOutput = `
      <div>
        <h1>${feedTitle}</h1>
        <ul>
          ${feedItems.map(item => `
            <li>
              <h2>${item.title}</h2>
              <p><strong>Published:</strong> ${item.pubDate}</p>
              <p>${item.description}</p>
              <a href="${item.link}" target="_blank">Read more</a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    return htmlOutput;

}

class RSSFeed extends HTMLElement {
  constructor() {
    super();
    // element created
  }

  connectedCallback(){
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    this.init();
  }

  async init(){
    const rss_feeds = this.innerText.split(/[\r\n]+/).filter(line => line.trim() !== '');

    const data = await this.fetchData(rss_feeds);
    this.innerHTML = ParseXML(data);
  }

  async fetchData(rss_feeds){
    const response = await fetch("/rss-feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({rss_feeds})
    });
    const data = response.json();
    return data;
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
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

customElements.define('rss-feed', RSSFeed);