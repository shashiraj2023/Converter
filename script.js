const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");
const amountInput = document.getElementById("amount");

const currencies = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD"];

let ratesCache = {};
let baseCurrency = "USD";

// Populate dropdowns
currencies.forEach(currency => {
  fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
  toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
});

fromCurrency.value = "USD";
toCurrency.value = "INR";

// ✅ Fetch rates once
async function fetchRates(base = "USD") {
  result.innerText = "Loading rates...";
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
    const data = await res.json();
    ratesCache = data.rates;
    baseCurrency = base;
    result.innerText = "Rates loaded ✔";
  } catch (error) {
    result.innerText = "Failed to load rates ❌";
  }
}

// ✅ Convert function
function convertCurrency() {
  const amount = amountInput.value;

  if (!amount) {
    result.innerText = "Please enter amount";
    return;
  }

  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (from !== baseCurrency) {
    fetchRates(from).then(() => calculate(amount, to));
  } else {
    calculate(amount, to);
  }
}

function calculate(amount, to) {
  const rate = ratesCache[to];
  const converted = (amount * rate).toFixed(2);
  result.innerText = `${amount} ${baseCurrency} = ${converted} ${to}`;
}

// 🔁 Swap currencies
function swapCurrencies() {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
}

// ✅ ENTER KEY FIX (THIS IS THE IMPORTANT PART)
amountInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    convertCurrency();
  }
});

// 🚀 Prefetch on load
fetchRates();
