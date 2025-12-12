//If you're reading through did, I did not sweat the HTML and CSS, because that was last unit, and I'm tired. It is december 12th 9:39 pM and I just want christmas. 

const amountInput = document.getElementById("amount");
const currency1Select = document.getElementById("currency1");
const currency2Select = document.getElementById("currency2");
const currency1Search = document.getElementById("currency1-search");
const currency2Search = document.getElementById("currency2-search");
const currency1Display = document.getElementById("currency1-display");
const currency2Display = document.getElementById("currency2-display");
const finalval = document.getElementById("value");
const convrate = document.getElementById("convrate");
const searchInput = document.getElementById("currency-search-input");
const searchBtn = document.getElementById("btn-search-code");
const searchResult = document.getElementById("search-result");
const countrySelectedEl = document.getElementById("mapselected");
const mapcurrency = document.getElementById("mapcurrency");
let country = "";


let currentMode = "name";
let selectedCurrency1 = currency1Select ? currency1Select.value : "USD";
let selectedCurrency2 = currency2Select ? currency2Select.value : "EUR";
let activeCurrencyBox = null;

let countryPopupTimer;

const countryNameFallback = {
    US: "United States",
    USA: "United States",
    "United-States": "United States",
    "United-States-of-America": "United States",
    "United States": "United States",
    "UnitedStates": "United States",
    UK: "United Kingdom",
    GB: "United Kingdom",
    GBR: "United Kingdom",
    "United-Kingdom": "United Kingdom",
    "United Kingdom": "United Kingdom",
    "UnitedKingdom": "United Kingdom",
    AR: "Argentina",
    ARG: "Argentina",
    Argentina: "Argentina",
    CN: "China",
    CHN: "China",
    China: "China",
    PH: "Philippines",
    PHL: "Philippines",
    Philippines: "Philippines",
};

function ensureCountryPopup() {
    let popup = document.getElementById("country-popup");
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "country-popup";
        document.body.appendChild(popup);
    }
    return popup;
}

function showCountryPopup(name, clientX, clientY) {
    const popup = ensureCountryPopup();
    popup.textContent = name;
    popup.style.left = `${clientX}px`;
    popup.style.top = `${clientY}px`;
    popup.classList.add("show");
    clearTimeout(countryPopupTimer);
    countryPopupTimer = setTimeout(() => popup.classList.remove("show"), 1500);
}

function deriveCountryName(country) {
    const rawId = country.getAttribute("id") || "";
    let rawClass = country.getAttribute("class") || "";
    const rawName = country.getAttribute("name") || "";

    rawClass = rawClass.split(/\s+/)
        .filter(cls => cls && cls !== "country-active")
        .join(" ");

    if (rawName) {
        return countryNameFallback[rawName] || rawName;
    }

    if (rawClass && countryNameFallback[rawClass]) {
        return countryNameFallback[rawClass];
    }

    if (rawId && countryNameFallback[rawId]) {
        return countryNameFallback[rawId];
    }

    const classWords = rawClass.split(/\s+/).filter(Boolean);
    for (const word of classWords) {
        if (countryNameFallback[word]) {
            return countryNameFallback[word];
        }
    }

    return rawName || countryNameFallback[rawId] || countryNameFallback[rawClass] || rawId || (classWords[0] || "") || "Unknown country";
}

function handleMapClick(evt) {
    if (!activeCurrencyBox) {
        return;
    }

    const map = document.getElementById("world-map");
    if (!map) return;

    const countryEl = evt.target.closest("path");
    if (!countryEl || !map.contains(countryEl)) return;

    map.querySelectorAll(".country-active").forEach((c) => c.classList.remove("country-active"));
    countryEl.classList.add("country-active");

    const name = deriveCountryName(countryEl);
    country = name;
    if (countrySelectedEl) {
        countrySelectedEl.textContent = name;
    }
    showCountryPopup(name, evt.clientX, evt.clientY);

    getcountrycurrency();
}

function setupCountryClickHandlers() {
    const map = document.getElementById("world-map");
    if (!map) return;
    map.addEventListener("click", handleMapClick);
}

document.addEventListener("DOMContentLoaded", setupCountryClickHandlers);




//HEre, I use the restcountry API, I am able to call the API but actually processing that dataa is a bit difficult. 
async function getcountrycurrency() {

    try{

        if (!country) {
            throw new Error("No country selected");
        }

        // Wait for currencies to load if they haven't yet
        if (yescurrencies.length === 0) {
            await currencyinAPI();
        }

        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=true&fields=currencies`);
        const data = await response.json();

        if (!Array.isArray(data) || !data[0] || !data[0].currencies) {
            throw new Error("Currency not found for country");
        }

        const currencyCodes = Object.keys(data[0].currencies);
        if (!currencyCodes.length) {
            throw new Error("No currency codes available");
        }

        const code = currencyCodes[0];

        //This basically checks if the currency you clicked on your map, exists. 
        
        if (yescurrencies.includes(code)) {
            if (mapcurrency) {
                mapcurrency.textContent = code;
            }
            // Automatically set the currency in the converter
            setCurrencyFromMap(code);
            return code;
        } else {
            if (mapcurrency) {
                mapcurrency.textContent = `Currency not supported (${code})`;
            }
            console.warn(`Currency ${code} from ${country} is not in supported list`);
            return null; // Return null to indicate unsupported currency
        }


        

    }
    catch(error){
        console.error('Error in getcountrycurrency:', error);
        if (mapcurrency) {
            mapcurrency.textContent = "Error";
        }
    }
}

let yescurrencies = []; //What I'm attempting to do here, is to sort of lay out all the yescurrencies with the map currneices. 

async function currencyinAPI() {
    try {
        const response = await fetch("https://api.currencyfreaks.com/v2.0/currency-symbols");
        const data = await response.json();
        
        yescurrencies = Object.keys(data.currencySymbols);
        
        return yescurrencies;
    }
    catch(error){
        console.error('Error', error);
        return [];
    } 
}






function getCurrency1() {
    return currentMode === "name" ? currency1Select.value : selectedCurrency1;
}

function getCurrency2() {
    return currentMode === "name" ? currency2Select.value : selectedCurrency2;
}

function setActiveCurrencyBox(boxNumber) {
    activeCurrencyBox = boxNumber;
    
    if (currency1Select) currency1Select.classList.remove("currency-active");
    if (currency2Select) currency2Select.classList.remove("currency-active");
    if (currency1Search) currency1Search.classList.remove("currency-active");
    if (currency2Search) currency2Search.classList.remove("currency-active");
    
    if (boxNumber === 1) {
        if (currentMode === "name" && currency1Select) {
            currency1Select.classList.add("currency-active");
        } else if (currentMode === "search" && currency1Search) {
            currency1Search.classList.add("currency-active");
        }
    } else if (boxNumber === 2) {
        if (currentMode === "name" && currency2Select) {
            currency2Select.classList.add("currency-active");
        } else if (currentMode === "search" && currency2Search) {
            currency2Search.classList.add("currency-active");
        }
    }
}

function setCurrencyFromMap(currencyCode) {
    if (!currencyCode || !activeCurrencyBox) return;
    
    if (activeCurrencyBox === 1) {
        if (currentMode === "name") {
            if (currency1Select && currency1Select.querySelector(`option[value="${currencyCode}"]`)) {
                currency1Select.value = currencyCode;
                updateConversion();
                updateRates();
            }
        } else {
            if (currency1Search && currency1Display) {
                currency1Search.value = currencyCode;
                currency1Display.textContent = currencyCode;
                currency1Display.style.color = "#4CAF50";
                selectedCurrency1 = currencyCode;
                updateConversion();
                updateRates();
            }
        }
    } else if (activeCurrencyBox === 2) {
        if (currentMode === "name") {
            if (currency2Select && currency2Select.querySelector(`option[value="${currencyCode}"]`)) {
                currency2Select.value = currencyCode;
                updateConversion();
                updateRates();
            }
        } else {
            if (currency2Search && currency2Display) {
                currency2Search.value = currencyCode;
                currency2Display.textContent = currencyCode;
                currency2Display.style.color = "#4CAF50";
                selectedCurrency2 = currencyCode;
                updateConversion();
                updateRates();
            }
        }
    }
}

async function updateConversion() {

 
    if (amountInput.value == 0) return;

    else{

    try {

        const amount = amountInput.value;
        const fromCurrency = getCurrency1();
        const toCurrency = getCurrency2();
        
        if (!fromCurrency || !toCurrency) {
            finalval.textContent = "Select currencies";
            return;
        }
        
        const response = await fetch('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=f97ea07525e24989a4aaa4e89ecf152b')
        const data = await response.json();
        //we can actually directly fetch  the data through a different API, 
        //but I have to pay, and I don't want to
        //Thus, I convert everything to USD, and then convert is based on the conversion
        //Trust lemme cook :)
        const rate1 = data.rates[fromCurrency];
        const rate2 = data.rates[toCurrency];
        
        if (!rate1 || !rate2) {
            finalval.textContent = "Currency not found";
            return;
        }
        
        //USD*rate1 = currency1 USD*rate 2 = currency2. 
        // USD = currency1/rate1= currency2/rate2. currency2= currency1 * rate2/rate1

        const fullrate = rate2 / rate1;

        const convertedAmount = amount * fullrate;

        finalval.textContent = convertedAmount.toFixed(4);

        

    } catch (error) {
        console.error('Error:', error);
        finalval.textContent = "Error";
    }
}
}

async function updateRates() {
        const fromCurrency = getCurrency1();
        const toCurrency = getCurrency2();
        
        if (!fromCurrency || !toCurrency) {
            convrate.textContent = "Select currencies";
            return;
        }

        if (fromCurrency === "USD" || toCurrency === "USD") {
   
    
            try {

                const currency1 = fromCurrency;
                const currency2 = toCurrency;

                
                const response = await fetch('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=f97ea07525e24989a4aaa4e89ecf152b')
                const data = await response.json();
    
                console.log(data);
    
                if (currency1 === "USD"){
    
                convrate.innerHTML = data.rates[currency2];
    
                }
                if (currency2 === "USD"){
    
                    convrate.textContent = 1 / data.rates[currency1];
                }
    
                
            }
            catch (error) {
                console.error('Error:', error);
                convrate.textContent = "Error";
            }
        } else { 
            try {

                const currency1 = fromCurrency;
                const currency2 = toCurrency;

                
                const response = await fetch('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=f97ea07525e24989a4aaa4e89ecf152b')
                const data = await response.json();
    
                const rate1 = data.rates[currency1];
                const rate2 = data.rates[currency2];

                const fullrate = rate2 / rate1;
                convrate.textContent = fullrate;

                //Same logic up there converted down here
                
            }
            catch (error) {
                console.error('Error:', error);
                convrate.textContent = "Error";
            }
            
        }
    }



function switchMode(mode) {
    currentMode = mode;
    const nameMode = document.getElementById("name-mode");
    const searchMode = document.getElementById("search-mode");
    
    const wasActive = activeCurrencyBox;
    
    if (mode === "name") {
        nameMode.style.display = "block";
        searchMode.style.display = "none";
        if (selectedCurrency1 && currency1Select.querySelector(`option[value="${selectedCurrency1}"]`)) {
            currency1Select.value = selectedCurrency1;
        }
        if (selectedCurrency2 && currency2Select.querySelector(`option[value="${selectedCurrency2}"]`)) {
            currency2Select.value = selectedCurrency2;
        }
    } else {
        nameMode.style.display = "none";
        searchMode.style.display = "block";
        if (currency1Select.value) {
            currency1Search.value = currency1Select.value;
            selectedCurrency1 = currency1Select.value;
            currency1Display.textContent = currency1Select.value;
        }
        if (currency2Select.value) {
            currency2Search.value = currency2Select.value;
            selectedCurrency2 = currency2Select.value;
            currency2Display.textContent = currency2Select.value;
        }
    }
    
    if (wasActive) {
        setActiveCurrencyBox(wasActive);
    }
    
    updateConversion();
    updateRates();
}

async function searchCurrency(searchInput, displayElement, currencyNum) {
    const searchTerm = searchInput.value.toUpperCase().trim();
    
    if (searchTerm.length === 0) {
        displayElement.textContent = "";
        if (currencyNum === 1) selectedCurrency1 = null;
        else selectedCurrency2 = null;
        updateConversion();
        updateRates();
        return;
    }
    
    if (yescurrencies.length === 0) {
        displayElement.textContent = "Loading currencies...";
        displayElement.style.color = "#666";
        await currencyinAPI();
    }
    
    if (yescurrencies.includes(searchTerm)) {
        displayElement.textContent = searchTerm;
        displayElement.style.color = "#4CAF50";
        if (currencyNum === 1) {
            selectedCurrency1 = searchTerm;
        } else {
            selectedCurrency2 = searchTerm;
        }
        updateConversion();
        updateRates();
    } else {
        const matches = yescurrencies.filter(c => 
            c.startsWith(searchTerm) || c.includes(searchTerm)
        ).slice(0, 5);
        
        if (matches.length === 1 && matches[0] === searchTerm) {
            displayElement.textContent = matches[0];
            displayElement.style.color = "#4CAF50";
            if (currencyNum === 1) {
                selectedCurrency1 = matches[0];
            } else {
                selectedCurrency2 = matches[0];
            }
            updateConversion();
            updateRates();
        } else if (matches.length > 0) {
            displayElement.textContent = `Matches: ${matches.join(", ")}`;
            displayElement.style.color = "#FF9800";
        } else {
            displayElement.textContent = "Currency not found";
            displayElement.style.color = "#f44336";
            if (currencyNum === 1) {
                selectedCurrency1 = null;
            } else {
                selectedCurrency2 = null;
            }
        }
    }
}

async function findCurrencyCode() {
    const query = searchInput.value.trim();
    if (!query) return;

    searchResult.textContent = "Searching...";
    searchResult.style.color = "#666";

    try {
        // We use the same API you used for the map!
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=false`);
        const data = await response.json();

        if (!data || data.status === 404) {
            searchResult.textContent = `Could not find country: "${query}"`;
            searchResult.style.color = "red";
            return;
        }

        // Get the first result
        const countryData = data[0];
        
        if (!countryData.currencies) {
            searchResult.textContent = "No currency information found for this country.";
            return;
        }

        // Extract the currency code (e.g., "ZAR")
        const currencyCode = Object.keys(countryData.currencies)[0];
        const currencyName = countryData.currencies[currencyCode].name;

        // Check if it is supported in our app
        if (yescurrencies.includes(currencyCode)) {
            searchResult.textContent = `Found: ${currencyCode} (${currencyName})`;
            searchResult.style.color = "green";
            
            // OPTIONAL: Automatically set the "To" dropdown to this currency
            currency2Select.value = currencyCode;
            updateConversion(); // Update the math
        } else {
            searchResult.textContent = `Found ${currencyCode}, but it is not supported by this converter yet.`;
            searchResult.style.color = "orange";
        }

    } catch (error) {
        console.error(error);
        searchResult.textContent = "Error searching for currency.";
        searchResult.style.color = "red";
    }
}



// Event listeners
amountInput.addEventListener("input", updateConversion);
currency1Select.addEventListener("change", updateConversion);
currency2Select.addEventListener("change", updateConversion);
currency1Select.addEventListener("change", updateRates);
currency2Select.addEventListener("change", updateRates);

if (currency1Select) {
    currency1Select.addEventListener("click", () => setActiveCurrencyBox(1));
    currency1Select.addEventListener("focus", () => setActiveCurrencyBox(1));
}

if (currency2Select) {
    currency2Select.addEventListener("click", () => setActiveCurrencyBox(2));
    currency2Select.addEventListener("focus", () => setActiveCurrencyBox(2));
}

if (currency1Search) {
    currency1Search.addEventListener("click", () => setActiveCurrencyBox(1));
    currency1Search.addEventListener("focus", () => setActiveCurrencyBox(1));
}

if (currency2Search) {
    currency2Search.addEventListener("click", () => setActiveCurrencyBox(2));
    currency2Search.addEventListener("focus", () => setActiveCurrencyBox(2));
}

// Mode switching listeners
document.querySelectorAll('input[name="selectionMode"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        switchMode(e.target.value);
    });
});

// Search input listeners
if (currency1Search) {
    currency1Search.addEventListener("input", () => {
        searchCurrency(currency1Search, currency1Display, 1);
    });
}

if (currency2Search) {
    currency2Search.addEventListener("input", () => {
        searchCurrency(currency2Search, currency2Display, 2);
    });
}

document.addEventListener("DOMContentLoaded", async function() {
    await currencyinAPI(); 
});

window.onload = function() {
    svgPanZoom('#world-map', {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 1,
        maxZoom: 10
    });
};

searchBtn.addEventListener("click", findCurrencyCode);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") findCurrencyCode();
});  //Click enter to saearch here.


updateConversion();
updateRates();