/*

  RSSFeed Server Code

  endpoint is available at /rss-feed 

*/

// Importing metadata from a JSON file (assuming metadata.json is in the same directory as this script)
const metadata = require('./metadata.json');

// Defining an async function with a placeholder name (RSSFeed)
async function fetchRSSFeeds(feeds) {
  const fetchPromises = feeds.map(async (feed) => {
    try {
      const response = await fetch(feed);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${feed}: ${response.statusText}`);
      }
      const rssContent = await response.text();
      console.log(`Fetched ${feed}:`, rssContent);
      return rssContent;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  });

  const rssContents = await Promise.all(fetchPromises);
  return rssContents.filter(content => content !== null);
}


// Exporting a function that takes an Express.js app as a parameter
module.exports = function (app) {
  // Setting up a route handler for POST requests on a dynamic endpoint (rss-feed)
  app.post('/rss-feed', async function (req, res) {
    // Extracting the request data from the request body
    const {rss_feeds} = req.body;
    // Calling the RSSFeed async function to retrieve metadata
    const data = await fetchRSSFeeds(rss_feeds);

    // Sending the retrieved metadata as a JSON response
    res.json(data);
  });
};