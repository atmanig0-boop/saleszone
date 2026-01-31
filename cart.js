function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-items-container");
    const countSpan = document.getElementById("cart-items-count");
    let subtotal = 0;

    if(cart.length === 0) {
        container.innerHTML = `<div class="cart-empty">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Add some products to see them here...</p>
            <a href="product.html" class="btn">Continue Shopping</a>
        </div>`;
        countSpan.textContent = 0;
        document.getElementById("subtotal").textContent = "$0.00";
        document.getElementById("total").textContent = "$0.00";
        return;
    }

    container.innerHTML = cart.map(item => {
        subtotal += item.price * item.quantity;
        return `
        <div class="cart-row">
            <div class="header-product">${item.title}</div>
            <div class="header-price">$${item.price.toFixed(2)}</div>
            <div class="header-quantity">${item.quantity}</div>
            <div class="header-total">$${(item.price*item.quantity).toFixed(2)}</div>
            <div class="header-Actions">
                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        </div>`;
    }).join("");

    countSpan.textContent = cart.length;
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("total").textContent = `$${subtotal.toFixed(2)}`;
}

function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);

