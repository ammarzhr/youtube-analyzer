// functions/youtube-api.js
const axios = require('axios');

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const API_KEY = 'AIzaSyAVC5w5fzPtBUKIZzJz860iakX6UlAYCWA'; // Your YouTube API key
    const { path, queryParams } = JSON.parse(event.body || '{}');

    if (!path) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing path parameter' }),
      };
    }

    // Build the URL with query parameters
    let url = `https://youtube.googleapis.com/youtube/v3/${path}?key=${API_KEY}`;
    
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        url += `&${key}=${encodeURIComponent(queryParams[key])}`;
      });
    }

    // Make the request to YouTube API
    const response = await axios.get(url);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('YouTube API Error:', error);
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: error.response?.data?.error || 'Internal server error',
        message: error.message,
      }),
    };
  }
};
