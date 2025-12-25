const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");
const amountInput = document.getElementById("amount");

const currencies = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD"];

let ratesCache = {};
let baseCurrency = "USD";

// --------------------
// Populate dropdowns
// --------------------
currencies.forEach(c => {
  fromCurrency.innerHTML += `<option value="${c}">${c}</option>`;
  toCurrency.innerHTML += `<option value="${c}">${c}</option>`;
});

fromCurrency.value = "USD";
toCurrency.value = "INR";

// --------------------
// Load cached data instantly
// --------------------
const cachedRates = localStorage.getItem("ratesCache");
const cachedBase = localStorage.getItem("baseCurrency");

if (cachedRates && cachedBase) {
  ratesCache = JSON.parse(cachedRates);
  baseCurrency = cachedBase;
  result.innerText = "Ready ✔ (cached)";
} else {
  result.innerText = "Loading rates...";
}

// --------------------
// Fetch with timeout
// --------------------
async function fetchRates(base = "USD") {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000); // ⏱ 3 sec timeout

    const res = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${base}`,
      { signal: controller.signal }
    );

    const data = await res.json();
    ratesCache = data.rates;
    baseCurrency = base;

    // 💾 Save to localStorage
    localStorage.setItem("ratesCache", JSON.stringify(ratesCache));
    localStorage.setItem("baseCurrency", base);

    result.innerText = "Rates updated ✔";
  } catch (err) {
    result.innerText = "Using cached rates ⚡";
  }
}

// --------------------
// Convert instantly
// --------------------
function convertCurrency() {
  const amount = amountInput.value;
  if (!amount) {
    result.innerText = "Enter amount";
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

// --------------------
// ENTER KEY
// --------------------
amountInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    convertCurrency();
  }
});

// --------------------
// Background refresh (no blocking)
// --------------------
setTimeout(() => fetchRates(baseCurrency), 1000);
