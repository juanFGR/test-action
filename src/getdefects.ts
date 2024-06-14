// Import fetch from node-fetch
import axios from 'axios';

// Define an async function to make the request
async function fetchBuildDetails() {
  const buildId = process.env.BUILD_ID; // Replace this with your actual build ID
  const percyToken = process.env.PERCY_TOKEN; // Replace this with your actual Percy token


  try {
    const response = await axios.get(`https://percy.io/api/v1/builds/${buildId}`, {
      headers: {
        'Authorization': `Token token=${percyToken}`
      }
    });

    console.log("Total Snapshot: ", response.data.data.attributes['total-snapshots']);
    console.log("Total Unreviewed: ", response.data.data.attributes['total-snapshots-unreviewed']);
  } catch (error) {
    console.error('Failed to fetch build details:', error);
  }
}

// Execute the function
fetchBuildDetails();