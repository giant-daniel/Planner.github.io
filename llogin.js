// DOM Elements
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

// Tab switching
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});

signupTab.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// User data (simulate database)
let users = JSON.parse(localStorage.getItem("users")) || [];

// Login function
loginBtn.addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    loginMessage.textContent = "Please fill in all fields";
    return;
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Save current user to session
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    // Redirect to planner
    window.location.href = "index.html";
  } else {
    loginMessage.textContent = "Invalid email or password";
  }
});

// Signup function
signupBtn.addEventListener("click", () => {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document
    .getElementById("signupConfirmPassword")
    .value.trim();

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    signupMessage.textContent = "Please fill in all fields";
    return;
  }

  if (password !== confirmPassword) {
    signupMessage.textContent = "Passwords do not match";
    return;
  }

  if (users.some((u) => u.email === email)) {
    signupMessage.textContent = "Email already registered";
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    tasks: [],
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Auto login after signup
  sessionStorage.setItem("currentUser", JSON.stringify(newUser));
  window.location.href = "index.html";
});

// Check if already logged in
window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("currentUser")) {
    window.location.href = "index.html";
  }
});
