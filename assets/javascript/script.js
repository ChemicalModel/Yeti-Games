
// ========== API VARIABLES =========== //
const rawgApiKey = '22b11c09e791419fb121c8d29c2eb6d2';
const gameName = 'elden-ring';
const rawgApiUrl = `https://api.rawg.io/api/games/${gameName}?language=en&key=${rawgApiKey}`;


// ========== RAWG API REQUEST =========== //
// make a request to the RAWG API
fetch(rawgApiUrl)
  .then(response => response.json())
  .then(data => {
    
    // extract the PC requirements for the first result
    const minimumRequirements = data.platforms.find(platform => platform.platform.name === "PC").requirements.minimum;
    const recommendedRequirements = data.platforms.find(platform => platform.platform.name === "PC").requirements.recommended;
    
    console.log(minimumRequirements);
    console.log(recommendedRequirements);
  })
  .catch(error => console.log(error));