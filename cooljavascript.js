const amountInput = document.getElementById("amount");
const currency1Select = document.getElementById("currency1");
const currency2Select = document.getElementById("currency2");
const finalval = document.getElementById("value");
const convrate = document.getElementById("convrate");

async function updateConversion() {
 
    if (amount === "") return;

    else{

    try {

        const amount = amountInput.value;
        const fromCurrency = currency1Select.value;
        const toCurrency = currency2Select.value;
        // Fetch data
        const response = await fetch(`https://api.currencyfreaks.com/v2.0/convert/latest?apikey=f97ea07525e24989a4aaa4e89ecf152b&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
        const data = await response.json();
        
        console.log(data); 

        finalval.textContent = data.convertedAmount; 

    } catch (error) {
        console.error('Error:', error);
        finalval.textContent = "Error";
    }
}
}

async function updateRates() {
        const fromCurrency = currency1Select.value;
        const toCurrency = currency2Select.value;

        if (fromCurrency === "USD" || toCurrency === "USD") {
   
    
            try {

                const currency1 = currency1Select.value;
                const currency2 = currency2Select.value;

                
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
            convrate.textContent = "Only USD conversion rates supported"
        }
    }



amountInput.addEventListener("input", updateConversion);
currency1Select.addEventListener("change", updateConversion);
currency2Select.addEventListener("change", updateConversion);
currency1Select.addEventListener("change", updateRates);
currency2Select.addEventListener("change", updateRates);

updateConversion();
updateRates();