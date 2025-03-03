// cart.js
import { db } from './firebase-config.js';

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Hiển thị giỏ hàng
async function displayCart() {
    try {
        const cart = getCart();
        console.log('Cart data:', cart);

        const cartContent = document.querySelector('.cart-content-left table tbody');
        const totalQuantityElement = document.getElementById('total-quantity');
        const totalPriceElement = document.getElementById('total-price');
        const subtotalPriceElement = document.getElementById('subtotal-price');

        if (!cartContent) {
            console.error('Cart content element not found');
            return;
        }

        cartContent.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        const collections = {
            adidas: ["adidas_nam", "adidas_nu"],
            nike: ["nike_nam", "nike_nu"],
            other_brand:["daygiay","vs_giay"],
        };

        for (const item of cart) {
            try {
                let productDoc = null;

                // Tìm kiếm sản phẩm trong tất cả các collection
                for (const [mainCategory, subCollections] of Object.entries(collections)) {
                    for (const subCollection of subCollections) {
                        const docRef = db.collection("products").doc(mainCategory).collection(subCollection).doc(item.id);
                        const doc = await docRef.get();
                        if (doc.exists) {
                            productDoc = doc;
                            break;
                        }
                    }
                    if (productDoc) break;
                }

                if (productDoc && productDoc.exists) {
                    const product = productDoc.data();
                    const subtotal = product.price * item.quantity;
                    total += subtotal;
                    totalItems += item.quantity;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${product.imageURL}" alt="${product.name}"></td>
                        <td><p>${product.name}</p></td>
                        <td>
                            <div class="quantity-controls">
                                <button onclick="decreaseQuantity('${item.id}')">-</button>
                                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                                <button onclick="increaseQuantity('${item.id}')">+</button>
                            </div>
                        </td>
                        <td><p>${product.price.toLocaleString('vi-VN')}đ</p></td>
                        <td><span class="cart-delete" onclick="removeItem('${item.id}')">Xóa</span></td>
                    `;
                    cartContent.appendChild(row);
                } else {
                    console.error('Product not found:', item.id);
                }
            } catch (error) {
                console.error("Error loading product:", error);
            }
        }

        // Cập nhật tổng tiền và số lượng
        if (totalQuantityElement) totalQuantityElement.textContent = totalItems.toString();
        if (totalPriceElement) totalPriceElement.textContent = `${total.toLocaleString('vi-VN')}đ`;
        if (subtotalPriceElement) subtotalPriceElement.textContent = `${total.toLocaleString('vi-VN')}đ`;

        // Hiển thị/ẩn thông báo giỏ hàng trống
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        if (emptyCartMessage) {
            emptyCartMessage.style.display = cart.length === 0 ? 'block' : 'none';
        }

    } catch (error) {
        console.error("Error displaying cart:", error);
    }
}
// Cập nhật số lượng sản phẩm
function updateQuantity(productId, newQuantity) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    
    if (index !== -1) {
        newQuantity = parseInt(newQuantity);
        if (newQuantity < 1) newQuantity = 1;
        cart[index].quantity = newQuantity;
        saveCart(cart);
        displayCart();
    }
}

// Tăng số lượng sản phẩm
function increaseQuantity(productId) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart[index].quantity++;
        saveCart(cart);
        displayCart();
    }
}

// Giảm số lượng sản phẩm
function decreaseQuantity(productId) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1 && cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart(cart);
        displayCart();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCart();
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
}

// Chuyển đến trang thanh toán
function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    // Kiểm tra trạng thái đăng nhập từ localStorage hoặc Firebase
    const user = localStorage.getItem('user'); // Giả sử bạn lưu thông tin user trong localStorage
    if (!user) {
        alert('Bạn cần đăng nhập để thanh toán!');
        window.location.href = "/login-admin/login.html"; // Điều hướng đến trang đăng nhập
        return;
    }

    // Nếu đã đăng nhập, chuyển đến trang thanh toán
    window.location.href = "/html-delivery/delivery.html";
}

// Khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    displayCart();

    // Thêm event listener cho nút thanh toán
    const checkoutButton = document.querySelector('.cart-content-right-button button:last-child');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', proceedToCheckout);
    }
});

// Đặt các hàm vào window object để có thể gọi từ HTML
window.updateQuantity = updateQuantity;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;

export { displayCart, updateQuantity, increaseQuantity, decreaseQuantity, removeItem, clearCart };