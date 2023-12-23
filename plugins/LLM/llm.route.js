module.exports = function (app) {
  app.post('/query-llm', async function (req, res) {

    const request_data = req.body.content;

    console.log(request_data);

    // Building the payload for the OpenAI API
    const openaiPayload = {
      "model": "gpt-3.5-turbo-1106",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant named hans"
        },
        {
          "role": "user",
          "content": request_data
        }
      ]
    };

    try {
      // Making a request to the OpenAI API using the fetch API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use your OpenAI API key here
        },
        body: JSON.stringify(openaiPayload)
      });

      // Checking if the request was successful (status code 2xx)
      if (response.ok) {
        // Parsing the response JSON
        const data = await response.json();
        // Sending the retrieved data as a JSON response
        res.json(data);
      } else {
        // Handling non-successful responses
        console.error('Error calling OpenAI API:', response.statusText);
        res.status(response.status).json({ error: 'OpenAI API Error' });
      }
    } catch (error) {
      // Handling errors
      console.error('Error calling OpenAI API:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/query-llm-for-json', async function (req, res) {

    const request_data = req.body.content;
    console.log(request_data)

    // Building the payload for the OpenAI API
    const openaiPayload = {
      "model": "gpt-3.5-turbo-1106",
      "response_format": { "type": "json_object" },
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant designed to output JSON."
        },
        {
          "role": "user",
          "content": request_data
        }
      ]
    };

    console.log(openaiPayload);

    try {
      // Making a request to the OpenAI API using the fetch API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use your OpenAI API key here
        },
        body: JSON.stringify(openaiPayload)
      });

      console.log(response)

      // Checking if the request was successful (status code 2xx)
      if (response.ok) {
        // Parsing the response JSON
        const data = await response.json();

        // Sending the retrieved data as a JSON response
        res.json(data);
      } else {
        // Handling non-successful responses
        console.error('Error calling OpenAI API:', response.statusText);
        res.status(response.status).json({ error: 'OpenAI API Error' });
      }
    } catch (error) {
      // Handling errors
      console.error('Error calling OpenAI API:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


}