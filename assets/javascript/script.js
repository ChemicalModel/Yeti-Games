// ========== API KEY VARIABLES =========== //
let rainforestAPIKey;
let rawgAPIKey;

// ========== MIN/REC ARRAYS =========== //
const neededComponents = [
  'Processor',
  'Memory',
  'Graphics',
  'Storage'
];
const memorySearchTerm = 'ddr4 dimm';
const storageSearchTerm = 'sata ssd';


let minComponentArray = [];
let recComponentArray = [];
let searchArray;
let searchHistoryLimit = 5;

// ========== ELEMENTS FROM PAGE =========== //
const datalist = document.querySelector('#search-options');
const inputField = document.querySelector('#search-bar input');
const searchButton = document.querySelector('#search-button');



//=====================================================================================
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
   const url = 'https://yorkieportunus.herokuapp.com/store/brogrammers-rainforest -apikey2'
   const response = await fetch(url);
   const key2 = await response.json();
   return key2;
 }
 // Call this wherever you need your key.
 fetchKey2().then((key2) => {
     rainforestAPIKey = key2.apiKey; 
});


//=====================================================================================
// Check Storage/Build Array
function checkStorage() {
  if ( localStorage.getItem('searchHistory') ) {
    const stringArray = localStorage.getItem('searchHistory');
    searchArray = JSON.parse(stringArray);
  } else {
    searchArray = [];
  };
  searchHistoryArrray();
};
checkStorage();
//=========================
// Build From Array
function searchHistoryArrray() {
  const datalist = document.querySelector('#search-options');
  //loops through array from storage, builds options, inserts into database
  for (i=0; i<searchArray.length; i++) {
    const option = document.createElement("option");
    option.value = searchArray[i];
    option.text = searchArray[i];
    datalist.append(option);
  }
};
//=========================
// Add Input Search to History
function addSearchToHistory() {
  const searchTerm = inputField.value.trim();
  //check for duplicates in array
  const index = searchArray.indexOf(searchTerm);
  if (index > -1) {
    searchArray.splice(index, 1);
  };
  //sets input in array
  searchArray.unshift(searchTerm);
  // limit array to 5 items
  if (searchArray.length > searchHistoryLimit) {
    searchArray.pop(); // remove last item
  };

  //check for duplicates in database
  const options = datalist.options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === searchTerm) {
      const datalist = document.querySelector('#search-options');
      const optionToRemove = datalist.querySelector(`option[value="${searchTerm}"]`);
      datalist.removeChild(optionToRemove);
      break;
    };
  };
  //builds option and insert into database
  const option = document.createElement("option");
  option.value = searchTerm;
  option.text = searchTerm;
  datalist.insertBefore(option, datalist.options[0]);  
  // limit database to 5 items
  if (datalist.options.length > searchHistoryLimit) {
    datalist.removeChild(datalist.lastElementChild);
  };

}
//=========================
// Send To Storage
function sendToStorage() {
  let arrayString = JSON.stringify(searchArray);
  localStorage.setItem('searchHistory', arrayString);
};





//===============================================================================================================================
// ========== SEARCH EVENT LISTENER =========== //
searchButton.addEventListener('click', function(event) {
  event.preventDefault(); // prevent form submission

  //breaks clickfunction if input is empty
  if (inputField.value == '') {
    return;
  };

  //display divs when clicked
  let hiddenDiv1 = document.querySelector('.min-specs-list');
  hiddenDiv1.style.display = 'inline-block';

  let hiddenDiv2 = document.querySelector('.max-specs-list');
  hiddenDiv2.style.display = 'inline-block';

  addSearchToHistory();
  sendToStorage();

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

      //run useInfo function when data is fetched
      useInfo(minimumRequirements, recommendedRequirements);
    })
    .catch(error => console.log(error));
}



// ========== USE RAWG DATA FUNCTION =========== //
function useInfo(minimumRequirements, recommendedRequirements) {
  //surrounded in an if to only build arrays if there are min or rec requirements
  if (minimumRequirements) {
    //split minReq strings into array
    let minReqArray = minimumRequirements.split('\n');
    //loop through neededComponents array, and build min components array
    for (i=0; i<neededComponents.length; i++) {
      let minComponentString = minReqArray.find(str => str.startsWith(neededComponents[i]));
      let minCompArray = minComponentString.split(':')[1].split(' or ');
      minComponentArray.push(minCompArray);
    };
    minComponentArray[1] = [memorySearchTerm + minComponentArray[1]];
    minComponentArray[3] = [storageSearchTerm + minComponentArray[3]];
    console.log(minComponentArray);
  }
  if (recommendedRequirements) {
    //split recReq strings into array
    let recReqArray = recommendedRequirements.split('\n');
    console.log(recReqArray);
    //loop through neededComponents array, and build rec components array
    for (i=0; i<neededComponents.length; i++) {
      let recComponentString = recReqArray.find(str => str.startsWith(neededComponents[i]));
      let recCompArray = recComponentString.split(':')[1].split(' or ');
      recComponentArray.push(recCompArray);
    };
    recComponentArray[1] = [memorySearchTerm + recComponentArray[1]];
    recComponentArray[3] = [storageSearchTerm + recComponentArray[3]];
    console.log(recComponentArray);
  }

  fetchRainforestApi();
};


// ========== RAINFOREST API REQUEST =========== //
function fetchRainforestApi() {
  let rfApiUrl = [
    `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&sort_by=featured&search_term=${minComponentArray[0][0]}`,
    `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&sort_by=featured&search_term=${minComponentArray[1][0]}`,
    `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&sort_by=featured&search_term=${minComponentArray[2][0]}`,
    `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&sort_by=featured&search_term=${minComponentArray[3][0]}`,
    `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&sort_by=featured&search_term=${recComponentArray[0][0]}`,
    `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&sort_by=featured&search_term=${recComponentArray[1][0]}`,
    `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&sort_by=featured&search_term=${recComponentArray[2][0]}`,
    `https://api.rainforestapi.com/request?api_key=${rainforestAPIKey}&type=search&amazon_domain=amazon.com&sort_by=featured&search_term=${recComponentArray[3][0]}`
  ];

  let minimumSpecs = document.querySelector('.min-specs-list');
  let maximumSpecs = document.querySelector('.max-specs-list');

  for (let i = 0; i < rfApiUrl.length; i++) {
    let item = {};

    fetch(rfApiUrl[i])
      .then(response => response.json())
      .then(data => {
        console.log(data);
        try {
          const result1 = data.search_results[0].title;
          const result2 = data.search_results[0].link;
          const result3 = data.search_results[0].image;
          let result4;

          if (data.search_results[0].price && data.search_results[0].price.raw) {
            result4 = data.search_results[0].price.raw;
          } else {
            result4 = '';
          }

          item.title = result1;
          item.link = result2;
          item.image = result3;
          item.price = result4;

          console.log(item);
          results.push(item);
          console.log(results);

          // Update the HTML with the results
          if (i < 4) {
            let element = minimumSpecs.children[i].querySelector('span');
            element.innerHTML = '';
            let title = document.createElement('p');
            title.innerHTML = item.title;
            element.append(title);
            let image = document.createElement('img');
            image.src = item.image;
            image.alt = item.title;
            let link = document.createElement('a');
            link.href = item.link;
            link.setAttribute('target', '_blank');
            link.appendChild(image);
            image.style.maxWidth = '100%';
            image.style.maxHeight = '200px';
            element.append(link);
          } else {
            let element = maximumSpecs.children[i - 4].querySelector('span');
            element.innerHTML = '';
            let title = document.createElement('p');
            title.innerHTML = item.title;
            element.append(title);
            let image = document.createElement('img');
            image.src = item.image;
            image.alt = item.title;
            let link = document.createElement('a');
            link.href = item.link;
            link.setAttribute('target', '_blank');
            link.appendChild(image);
            image.style.maxWidth = '100%';
            image.style.maxHeight = '200px';
            element.append(link);
          }
        } catch (error) {
          // Modify the value of result4 if it caused an error

        }
      })
      .catch(error => console.log(error));
  }

  // Clears array from previous search
  results = [];
}
