document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = false; // Replace this with actual login state from backend/session
    const checkoutButton = document.getElementById("checkout-btn");
  
    if (isLoggedIn) {
      checkoutButton.disabled = false;
      checkoutButton.addEventListener("click", () => {
        alert("Proceeding to checkout...");
      });
    } else {
      checkoutButton.disabled = true;
      alert("You must be logged in to use the cart.");
    }
  });
  