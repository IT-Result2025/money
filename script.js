function signupUser() {
  const name = document.getElementById('signupName').value;
  const mobile = document.getElementById('signupMobile').value;
  const password = document.getElementById('signupPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.some(user => user.mobile === mobile)) {
    alert("Mobile already registered!");
    return;
  }

  const newUser = { name, mobile, password, coins: 0, youtubeClaimed: false };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Auto login
  localStorage.setItem('loggedInUser', JSON.stringify(newUser));
  alert("Signup successful! Redirecting...");

  // 👉 SEND to Google Sheet (REPLACE URL BELOW)
  fetch("https://script.google.com/macros/s/AKfycbwEUzVnhbPV54m3azABZ9BXZd7rLZIzvMs5e29yptgV18jvRh-yrzJXZ4TvdPp4XolCxA/exec", {
    method: "POST",
    body: JSON.stringify({
      name,
      mobile,
      password,
      coins: 0
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  window.location.href = "index.html";
}

function loginUser() {
  const mobile = document.getElementById('loginMobile').value;
  const password = document.getElementById('loginPassword').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(u => u.mobile === mobile && u.password === password);

  if (!user) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem('loggedInUser', JSON.stringify(user));
  showDashboard();
}

function showDashboard() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) return;

  document.getElementById('loginBox')?.classList.add('hidden');
  const dash = document.getElementById('dashboard');
  if (dash) {
    dash.classList.remove('hidden');
    document.getElementById('username').textContent = user.name;
    document.getElementById('coinCount').textContent = user.coins;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileMobile').textContent = user.mobile;
    document.getElementById('profileCoins').textContent = user.coins;
  }
}

function claimYouTubeReward() {
  let users = JSON.parse(localStorage.getItem('users'));
  let user = JSON.parse(localStorage.getItem('loggedInUser'));

  if (user.youtubeClaimed) {
    alert("You've already claimed this reward.");
    return;
  }

  user.coins += 100;
  user.youtubeClaimed = true;

  users = users.map(u => u.mobile === user.mobile ? user : u);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('loggedInUser', JSON.stringify(user));
  alert("✅ +100 Coins added for YouTube task!");

  updateUI(user);
}

function withdraw() {
  let users = JSON.parse(localStorage.getItem('users'));
  let user = JSON.parse(localStorage.getItem('loggedInUser'));

  if (user.coins < 5000) {
    alert("❌ You need at least 5000 coins to withdraw.");
    return;
  }

  user.coins -= 5000;
  alert("✅ ₹2800 will be sent within 2 hours.");

  users = users.map(u => u.mobile === user.mobile ? user : u);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('loggedInUser', JSON.stringify(user));

  updateUI(user);
}

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = "index.html";
}

function updateUI(user) {
  document.getElementById('coinCount').textContent = user.coins;
  document.getElementById('profileCoins').textContent = user.coins;
}

window.onload = function () {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user && window.location.pathname.includes('index')) {
    showDashboard();
  }
};
