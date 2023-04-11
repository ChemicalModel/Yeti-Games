
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

    //run function when data is fetched
    useInfo(minimumRequirements, recommendedRequirements);
  })
  .catch(error => console.log(error));


  // ========== MIN/REC VARIABLES =========== //
//variables to store the fetched min and rec requirements
let minReq;
let recReq;
let processorArray;

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
};
