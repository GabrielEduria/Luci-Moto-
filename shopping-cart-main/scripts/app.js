// Show navbar and up btn
const nav = document.getElementById("navbar");
const toTopBtn = document.querySelector(".to-top-btn_container");
window.addEventListener("scroll", () => {
  if (scrollY >= 500) toTopBtn.style.display = "block";
  else if (scrollY < 500) toTopBtn.style.display = "none";
  if (!(scrollY == 0 || scrollY >= 500)) {
    nav.style.transition = "all .4s";
    nav.style.display = "none";
  } else {
    nav.style.display = "flex";
    if (scrollY == 0) {
      nav.style.height = "4rem";
    } else {
      nav.style.height = "3.8rem";
    }
  }
});

// Hamburger menu
let menu = document.querySelector(".menu-container");
let menuBtn = document.querySelector(".nav-icon");
let menuBtnIcon = document.querySelector(".bars-icon");

menuBtn.addEventListener("click", () => {
  if (menuBtnIcon.classList.contains("fa-bars")) {
    menu.style.right = "0";
    menuBtnIcon.classList = "fa fa-times bars-icon";
  } else {
    menu.style.right = "-256px";
    menuBtnIcon.classList = "fa fa-bars bars-icon";
  }
});

// Render products
const productsContainers = document.querySelectorAll(".product-content");
function renderProducts() {
  helmet.forEach((helmet) => {
    productsContainers[0].innerHTML += `
      <div class="product">
        <img
          src=${helmet.imgSrc}
          alt="${helmet.name}"
          class="product-img img-responsive"
        />
        <div class="product-desc">
          <p class="product-name">${helmet.name}</p>
          <p class="product-stock">Stock: ${helmet.inStock}</p>
          <p class="product-price" style="font-size: 2rem; font-weight: bold;">
            ${helmet.price}
          </p>
        </div>
        <button class="product-btn" onclick='addToCart(${helmet.id})'>add to cart</button>
      </div>
    `;
  });

  gears.forEach((gears) => {
    productsContainers[1].innerHTML += `
      <div class="product">
        <img
          src=${gears.imgSrc}
          alt="${gears.name}"
          class="product-img img-responsive"
        />
        <div class="product-desc">
          <p class="product-name">${gears.name}</p>
          <p class="product-stock">[STOCKS: ${gears.inStock}]</p>
          <p class="product-price" style="font-size: 2rem; font-weight: bold;">
            ${gears.price}
          </p>
        </div>
        <button class="product-btn" onclick='addToCart(${gears.id})'>add to cart</button>
      </div>
    `;
  });

  accessories.forEach((accessory) => {
    productsContainers[2].innerHTML += `
      <div class="product">
        <img
          src=${accessory.imgSrc}
          alt="${accessory.name}"
          class="product-img img-responsive"
        />
        <div class="product-desc">
          <p class="product-name">${accessory.name}</p>
          <p class="product-stock">Stock: ${accessory.inStock}</p>
          <p class="product-price" style="font-size: 2rem; font-weight: bold;">
            ${accessory.price}
          </p>
        </div>
        <button class="product-btn" onclick='addToCart(${accessory.id})'>add to cart</button>
      </div>
    `;
  });

  parts.forEach((part) => {
    productsContainers[3].innerHTML += `
      <div class="product">
        <img
          src=${part.imgSrc}
          alt="${part.name}"
          class="product-img img-responsive"
        />
        <div class="product-desc">
          <p class="product-name">${part.name}</p>
          <p class="product-stock">Stock: ${part.inStock}</p>
          <p class="product-price" style="font-size: 2rem; font-weight: bold;">
            ${part.price}
          </p>
        </div>
        <button class="product-btn" onclick='addToCart(${part.id})'>add to cart</button>
      </div>
    `;
  });
}
renderProducts();

// Shopping cart
const cart = document.getElementById("cart");
const cartMenu = document.querySelector(".cart-menu");
const cartIcon = document.querySelector(".cart-icon");
const cartNum = document.querySelector(".cart-num");
const closeCart = document.querySelector(".close-cart");
const totalCounter = document.querySelector(".total-counter");

cartIcon.addEventListener("click", () => (cart.style.display = "block"));
closeCart.addEventListener("click", () => (cart.style.display = "none"));
window.addEventListener("click", (event) => {
  if (event.target == cart) {
    cart.style.display = "none";
  }
});

// Add to cart
let cartArray = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

function addToCart(id) {
  let product;
  if (id >= 6 && id <= 10) { // Check if id is in the range of gears
    product = gears.find((item) => item.id === id);
  } else if (id >= 11 && id <= 20) { // Check if id is in the range of accessories or parts
    product = accessories.concat(parts).find((item) => item.id === id);
  } else {
    product = helmet.find((item) => item.id === id);
  }

  const existingProductIndex = cartArray.findIndex((item) => item.id === id);

  if (product.inStock > 0) {
    if (existingProductIndex !== -1) {
      cartArray[existingProductIndex].numberOfUnits++;
    } else {
      cartArray.push({ ...product, numberOfUnits: 1 });
    }
    product.inStock--; // Decrease stock
    updateProductStock(id); // Update stock display
    updateCart();
  } else {
    alert("This product is out of stock!");
  }
}

// Update cart
function updateCart() {
  renderCartItems();
  renderSubtotal();

  // Save cart to local storage
  localStorage.setItem("CART", JSON.stringify(cartArray));
  if (cartArray.length == 0) {
    cartMenu.classList.add("cart-empty");
  } else {
    cartMenu.classList.remove("cart-empty");
  }
}

// Render subtotal
function renderSubtotal() {
  let subTotal = 0,
    totalItems = 0;

  cartArray.forEach((item) => {
    subTotal += item.price * item.numberOfUnits;
    totalItems += item.numberOfUnits;
  });
  totalCounter.innerHTML = `$${subTotal}`;
  cartNum.innerHTML = totalItems;
}

// Render items to cart
function renderCartItems() {
  cartMenu.innerHTML = "";
  cartArray.forEach((item) => {
    cartMenu.innerHTML += `
    <li>
      <img src="${item.imgSrc}" alt="${item.name}" />
      <p>${item.name}</p>
      <p>$${item.price}</p>
      <div class="unit">
          <div class="cart-trash" title='trash' onclick='removeItemFromCart(${item.id})'>&#128465;</div>
          <div class="decrease-btn" onclick="changeNumberOfUnits('decrease',${item.id})">&#x276F;</div>
          <div class="unit-number">${item.numberOfUnits}</div>
          <div class="increase-btn" onclick="changeNumberOfUnits('increase',${item.id})">&#x276F;</div>
      </div>
    </li>
    `;
  });
}

// Change number of units for an item
function changeNumberOfUnits(action, id) {
  cartArray = cartArray.map((item) => {
    let numberOfUnits = item.numberOfUnits;

    if (item.id === id) {
      if (action === "increase" && numberOfUnits < item.inStock) {
        numberOfUnits++;
        if (numberOfUnits === item.inStock) alert("This product is no longer in stock!");
      } else if (action === "decrease" && numberOfUnits > 1) {
        numberOfUnits--;
      }
    }

    return {
      ...item,
      numberOfUnits,
    };
  });
  updateCart();
}

// Remove item from cart
function removeItemFromCart(id) {
  if (confirm("Do you want to remove this product from your cart?"))
    cartArray = cartArray.filter((item) => item.id !== id);

  updateCart();
}

// Clear cart
function clearCart() {
  cartArray.forEach((item) => {
    const product = helmet.find((m) => m.id === item.id) || gears.find((gc) => gc.id === item.id);
    product.inStock += item.numberOfUnits; // Increase stock
    updateProductStock(item.id); // Update stock display
  });
  cartArray = [];
  updateCart();
}

// Show branches info
const branchContainer = document.querySelector(".branch-container");

branchContainer.addEventListener("click", (event) => {
  var btn = event.target;
  btn.classList.toggle("active");
  var panel = btn.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
});

// Update product stock display
function updateProductStock(id) {
  let product;
  if (id >= 6 && id <= 10) { // Check if id is in the range of gears
    product = gears.find((item) => item.id === id);
  } else if (id >= 11 && id <= 20) { // Check if id is in the range of accessories or parts
    product = accessories.concat(parts).find((item) => item.id === id);
  } else {
    product = helmet.find((item) => item.id === id);
  }

  const productElement = document.querySelector(`.product-btn[onclick='addToCart(${id})']`).parentElement;
  productElement.querySelector('.product-stock').textContent = `Stock: ${product.inStock}`;
}
