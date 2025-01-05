// document.getElementById('search-button').addEventListener('click', () => {
//     const searchQuery = document.getElementById('search-bar').value.toLowerCase();
//     const products = document.querySelectorAll('.product');
  
//     products.forEach(product => {
//       const productName = product.getAttribute('data-name');
//       if (productName.includes(searchQuery)) {
//         product.style.display = 'block';
//       } else {
//         product.style.display = 'none';
//       }
//     });
//   });


  // List of products to search from
  const products = [
    { name: "Nail Polish, finger, leg", link: "nail.html" },
    { name: "Foundation, face, cream", link: "face.html" },
    { name: "Comb, Hair, oil, lotion", link: "hair.html" },
    { name: "Face Wash", link: "face.html" },
    { name: "Sunscreen", link: "face.html" },
    { name: "Vaseline", link: "skin.html" },
    { name: "Makeup Brush", link: "face.html" },
    { name: "Nail Polish Set", link: "nail.html" },
  ];

  // Search function
  document.getElementById("search-button").addEventListener("click", function () {
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    const result = products.find(product => product.name.toLowerCase().includes(searchQuery));

    if (result) {
      window.location.href = result.link; // Redirect to the product page
    } else {
      alert("Product not found!");
    }
  });

  // Optional: Allow "Enter" key to trigger search
  document.getElementById("search-bar").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      document.getElementById("search-button").click();
    }
  });


 // Check user login status (stored in localStorage for this example)
function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

// Handle button clicks (Add to Cart and Buy)
function handleButtonClick(event, action) {
  if (!isUserLoggedIn()) {
    alert(`You need to log in to ${action}.`);
    event.preventDefault(); // Prevent any default actions, if applicable
  } else {
    alert(`${action} successful!`); // Simulate action success
  }
}

// Update buttons on page load
function setupButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const buyButtons = document.querySelectorAll(".buy");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => handleButtonClick(event, "add to your cart"));
  });

  buyButtons.forEach((button) => {
    button.addEventListener("click", (event) => handleButtonClick(event, "make a purchase"));
  });
}

// For demo: toggle login status
function toggleLoginStatus() {
  const loggedIn = isUserLoggedIn();
  localStorage.setItem("isLoggedIn", !loggedIn);
  alert(`User is now ${!loggedIn ? "logged in" : "logged out"}`);
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  setupButtons();

  // For demo purposes
  const loginToggleButton = document.getElementById("toggle-login");
  if (loginToggleButton) {
    loginToggleButton.addEventListener("click", toggleLoginStatus);
  }
});
