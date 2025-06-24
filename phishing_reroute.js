function captureCredentials(username, password, next) {
  console.log(`Captured: ${username} / ${password}`);
  next(username, password);
}

function showFakeFeedback(username, password, next) {
  document.getElementById("feedback").innerText = "Login successful!";
  setTimeout(() => next(username, password), 1000);
}

function redirectToTraining() {
  window.location.href = "/training";
}

document.getElementById("fakeLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;


  captureCredentials(username, password, function () {
    showFakeFeedback(username, password, function () {
      redirectToTraining();
    });
  });
});
