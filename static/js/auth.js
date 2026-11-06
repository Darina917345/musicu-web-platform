// Наперед задані дані для входу (за завданням - у тілі скрипту)
var VALID_LOGIN = "student_1";
var VALID_PASSWORD = "MusicU2026";

var loginInput = document.getElementById("login");
var passwordInput = document.getElementById("password");
var loginError = document.getElementById("login-error");
var messageBox = document.getElementById("login-message");
var loginButton = document.getElementById("login-btn");

// Показує повідомлення у відведеному місці сторінки без її перезавантаження
function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message message--" + type;
}

// Перевірка формату логіна: 3–20 символів, латиниця, цифри, підкреслення
function validateLoginFormat() {
  var value = loginInput.value.trim();
  var ok = /^[A-Za-z0-9_]{3,20}$/.test(value);

  if (value === "") {
    loginError.textContent = "Введіть логін.";
  } else if (!ok) {
    loginError.textContent = "Логін: 3–20 символів, лише латиниця, цифри та _.";
  } else {
    loginError.textContent = "";
  }

  loginInput.className = loginError.textContent ? "invalid" : "";
  return loginError.textContent === "";
}

// Перевірка логіна та пароля при натисканні кнопки
function checkCredentials(event) {
  event.preventDefault(); // сторінка не перезавантажується

  if (!validateLoginFormat()) {
    showMessage("Виправте помилки у формі.", "error");
    return;
  }
  if (passwordInput.value === "") {
    showMessage("Введіть пароль.", "error");
    return;
  }

  if (loginInput.value.trim() === VALID_LOGIN && passwordInput.value === VALID_PASSWORD) {
    showMessage("Вітаємо, " + VALID_LOGIN + "! Вхід виконано.", "success");
  } else {
    showMessage("Невірний логін або пароль.", "error");
  }
}

// Подія 1: натискання кнопки «Увійти»
loginButton.addEventListener("click", checkCredentials);

// Подія 2: втрата фокусу полем логіна (перевірка формату)
loginInput.addEventListener("blur", validateLoginFormat);
