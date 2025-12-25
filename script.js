const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");
const amountInput = document.getElementById("amount");

const currencies = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD"];

let ratesCache = {}; // 💾 cache exchange rates
let baseCurrency = "USD";

// Populate dropdowns
currencies.forEach(currency => {
  fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
  toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
});

fromCurrency.value = "USD";
toCurrency.value = "INR";

// 🚀 Fetch exchange rates ONCE
async function fetchRates(base = "USD") {
  result.innerText = "Loading rates...";
  try {
    const res = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${base}`
    );
    const data = await res.json();
    ratesCache = data.rates;
    baseCurrency = base;
    result.innerText = "Rates loaded ✔";
  } catch (err) {
    result.innerText = "Failed to load rates ❌";
  }
}

// 🔄 Convert instantly (no API call)
function convertCurrency() {
  const amount = amountInput.value;
  if (!amount) {
    result.innerText = "Please enter amount";
    return;
  }

  const from = fromCurrency.value;
  const to = toCurrency.value;

  // If base currency changed → fetch again
  if (from !== baseCurrency) {
    fetchRates(from).then(() => {
      calculate(amount, to);
    });
  } else {
    calculate(amount, to);
  }
}

function calculate(amount, to) {
  const rate = ratesCache[to];
  const converted = (amount * rate).toFixed(2);
  result.innerText = `${amount} ${baseCurrency} = ${converted} ${to}`;
}

// 🔁 Swap currencies instantly
function swapCurrencies() {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
}

// ⚡ Prefetch rates on page load
fetchRates();
amountInput.addEventListener("keydown", e => {
  if (e.key === "Enter") convertCurrency();
});
