// ========== API KEY VARIABLES =========== //
let rainforestAPIKey;
let rawgAPIKey;


// ========== MIN/REC VARIABLES =========== //
//variables to store the fetched min and rec requirements
let minReq;
let recReq;
let processorArray;


// ========== RAWG API KEY FUNCTION =========== //
// This calls the API, just update the url to have your key's name.
async function fetchKey1() {
  const url = 'https://yorkieportunus.herokuapp.com/store/brogrammers-rawg-api-key'
  const response = await fetch(url);
  const key1 = await response.json();
  return key1;
}
// Call this wherever you need your key.
fetchKey1().then((key1) => {
    rawgAPIKey = key1.apiKey;
});
// ========== RAINFOREST API KEY FUNCTION =========== //     
// This calls the API, just update the url to have your key's name.
async function fetchKey2() {
  const url = 'https://yorkieportunus.herokuapp.com/store/brogrammers-rainforest-api-key'
  const response = await fetch(url);
  const key2 = await response.json();
  return key2;
}
// Call this wherever you need your key.
fetchKey2().then((key2) => {
    rainforestAPIKey = key2.apiKey;
});



// ========== API VARIABLES =========== //

const inputField = document.querySelector('.search-bar input');
const searchButton = document.querySelector('#search-button');

searchButton.addEventListener('click', function(event) {
  event.preventDefault(); // prevent form submission

  let gameName = inputField.value.trim().replace(/ /g, '-'); // Replace spaces with +
  const rawgApiUrl = `https://api.rawg.io/api/games/${gameName}?language=en&key=${rawgAPIKey}`;
  fetchRawgApi(rawgApiUrl);
});


// ========== RAWG API REQUEST =========== //
function fetchRawgApi(rawgApiUrl) {
  const searchQuery = inputField.value;
  // perform search with searchQuery
  console.log(`Searching for ${searchQuery}`);
  // make a request to the RAWG API
  fetch(rawgApiUrl)
    .then(response => response.json())
    .then(data => {
      const pcPlatforms = data.platforms.filter(platform => platform.platform.name === "PC");
      const minimumRequirements = pcPlatforms[0].requirements.minimum;
      const recommendedRequirements = pcPlatforms[0].requirements.recommended;
      console.log(minimumRequirements);
      console.log(recommendedRequirements);

      if (data.results) {
        const filteredGames = data.results.filter(game => game.rating > 4.5); // or any other condition
        console.log(filteredGames);
      }

      //run function when data is fetched
      useInfo(minimumRequirements, recommendedRequirements);
    })
    .catch(error => console.log(error));
}


//Function to grab info once fetch is complete
function useInfo(minimumRequirements, recommendedRequirements) {
  //sets global variable
  minReq = minimumRequirements;
  recReq = recommendedRequirements;
  //grabs processor string
  let processorStart = minReq.indexOf('Processor:') + 'Processor: '.length;
  let processorEnd = minReq.indexOf('Memory');
  let processorInfo = minReq.slice(processorStart, processorEnd).trim();
  console.log(processorInfo);
  //divides processor string into array
  processorArray = processorInfo.split('or').map(proc => proc.trim());
  console.log(processorArray)
  console.log(processorArray[0]);
  console.log(processorArray[1]);

  // Get span elements by ID
const processorSpan = document.getElementById("processorspan");

// Update spans with fetched data
processorSpan.innerHTML = processorArray[0];

  fetchRainforestApi();
};


// ========== RAINFOREST API REQUEST =========== //
function fetchRainforestApi() {
  let rfApiUrl = `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&search_term=${processorArray[0]}`;
  
  fetch(rfApiUrl)
  .then(response => response.json())
  .then(data => {

  console.log(data);

  const cpuResult1 = data.search_results[0].title
  const cpuLink1 = data.search_results[0].link
  const cpuPrice1 = data.search_results[0].price.raw
  console.log(cpuResult1);
  console.log(cpuLink1);
  console.log(cpuPrice1);
  })
  .catch(error => console.log(error));
};