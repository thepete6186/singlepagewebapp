const amountInput = document.getElementById("amount");
const currency1Select = document.getElementById("currency1");
const currency2Select = document.getElementById("currency2");
const finalval = document.getElementById("value");
const convrate = document.getElementById("convrate");



async function updateConversion() {

 
    if (amountInput.value == 0) return;

    else{

    try {

        const amount = amountInput.value;
        const fromCurrency = currency1Select.value;
        const toCurrency = currency2Select.value;
        const response = await fetch('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=f97ea07525e24989a4aaa4e89ecf152b')
        const data = await response.json();
        //we can actually directly fetch  the data through a different API, 
        //but I have to pay, and I don't want to
        //Thus, I convert everything to USD, and then convert is based on the conversion
        //Trust lemme cook :)
        const rate1 = data.rates[fromCurrency];
        const rate2 = data.rates[toCurrency];
        //USD*rate1 = currency1 USD*rate 2 = currency2. 
        // USD = currency1/rate1= currency2/rate2. currency2= currency1 * rate2/rate1

        fullrate = rate2 / rate1;

        const convertedAmount = amount * fullrate;

        finalval.textContent = convertedAmount.toFixed(4);

        

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
            try {

                const currency1 = currency1Select.value;
                const currency2 = currency2Select.value;

                
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



amountInput.addEventListener("input", updateConversion);
currency1Select.addEventListener("change", updateConversion);
currency2Select.addEventListener("change", updateConversion);
currency1Select.addEventListener("change", updateRates);
currency2Select.addEventListener("change", updateRates);

updateConversion();
updateRates();