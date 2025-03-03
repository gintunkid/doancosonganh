import { db } from './firebase-config.js';

// Lấy ID sản phẩm, category và subCategory từ URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const category = urlParams.get('categories');
const subCategory = urlParams.get('subCategories');

// Biến lưu trữ thông tin sản phẩm hiện tại
let currentProduct = null;

// Hiển thị chi tiết sản phẩm
async function loadProductDetail() {
    try {
        const docRef = db.collection("products").doc(category).collection(subCategory).doc(productId);
        const doc = await docRef.get();
        
        if (doc.exists) {
            currentProduct = doc.data();
            currentProduct.id = doc.id;
            
            // Cập nhật thông tin sản phẩm trong HTML
            document.getElementById('product-image').src = currentProduct.imageURL;
            document.getElementById('product-name').textContent = currentProduct.name;
            document.getElementById('product-price').textContent = 
                `${currentProduct.price.toLocaleString('vi-VN')}đ`;
            document.getElementById('product-description').textContent = 
                currentProduct.description || 'Không có mô tả';

            // Cập nhật các hình ảnh nhỏ nếu có
            updateThumbnails(currentProduct.imageURLs || [currentProduct.imageURL]);
        } else {
            console.log("Không tìm thấy sản phẩm!");
            document.querySelector('.product-detail-container').innerHTML = '<p>Sản phẩm không tồn tại.</p>';
        }
    } catch (error) {
        console.error("Error loading product detail: ", error);
    }
}

// Cập nhật hình ảnh nhỏ
function updateThumbnails(imageUrls) {
    const thumbnailContainer = document.querySelector('.product-thumbnails');
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = imageUrls.map(url => 
            `<img src="${url}" alt="Thumbnail" class="thumbnail" onclick="changeMainImage('${url}')">`
        ).join('');
    }
}

// Thay đổi hình ảnh chính
function changeMainImage(url) {
    document.getElementById('product-image').src = url;
}

// Xử lý số lượng
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Xử lý mua hàng ngay
function buyNow() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Kiểm tra đăng nhập

    if (!isLoggedIn) {
        alert("Bạn cần đăng nhập để mua hàng!");
        window.location.href = "/login-admin/login.html"; // Chuyển hướng đến trang đăng nhập
        return;
    }

    addToCartSilently(); // Thêm sản phẩm vào giỏ hàng
    window.location.href = "/html-cart/cart.html"; // Chuyển hướng đến giỏ hàng
}
// Thêm vào giỏ hàng mà không hiển thị thông báo
function addToCartSilently() {
    if (!currentProduct) {
        console.error("Không có thông tin sản phẩm");
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItemIndex = cart.findIndex(item => item.id === currentProduct.id);
    
    if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            id: currentProduct.id,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Cập nhật số lượng giỏ hàng
}

// Thêm vào giỏ hàng và hiển thị thông báo
function addToCart() {
    addToCartSilently();
    alert('Đã thêm vào giỏ hàng!');
}

// Load chi tiết sản phẩm khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail();
    updateCartCount();

    const increaseQuantityBtn = document.getElementById('increase-quantity');
    if (increaseQuantityBtn) {
        increaseQuantityBtn.addEventListener('click', increaseQuantity);
    }

    const decreaseQuantityBtn = document.getElementById('decrease-quantity');
    if (decreaseQuantityBtn) {
        decreaseQuantityBtn.addEventListener('click', decreaseQuantity);
    }

    const buyNowBtn = document.getElementById('buy-now');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', buyNow);
    }

    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }

    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            window.location.href = '/html-cart/cart.html';
        });
    }
});

// Đặt các hàm vào window object để có thể gọi từ HTML
window.changeMainImage = changeMainImage;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.buyNow = buyNow;
window.addToCart = addToCart;


// Xuất các hàm cần thiết nếu cần import từ file khác
export { loadProductDetail, increaseQuantity, decreaseQuantity, buyNow, addToCart };