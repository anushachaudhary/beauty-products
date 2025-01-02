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
    { name: "Nail Polish", link: "nail.html" },
    { name: "Foundation", link: "face.html" },
    { name: "Comb", link: "hair.html" },
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


  