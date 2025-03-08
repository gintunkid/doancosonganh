// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAf5hxg2YNKxuIM7Kw3viYnyRMVHZaMh4g",
    authDomain: "step-up-brand.firebaseapp.com",
    projectId: "step-up-brand",
    storageBucket: "step-up-brand.firebasestorage.app",
    messagingSenderId: "915455304768",
    appId: "1:915455304768:web:da213c10c670fd0384aba5",
    measurementId: "G-X23NY4DSWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Kiểm tra và lấy email người dùng nếu có
const useremail = localStorage.getItem('useremail') || "guest@example.com";

// Biến cờ kiểm soát tránh gọi `displayCartInDelivery` hai lần
let isCartDisplayed = false;

// Hàm lấy sản phẩm từ Firestore
async function getProductById(productId) {
    if (!productId) return null;

    const collections = [
        'products/nike/nike_nam',
        'products/nike/nike_nu',
        'products/adidas/adidas_nam',
        'products/adidas/adidas_nu',
        'products/other_brand/daygiay',
        'products/other_brand/vs_giay',
    ];

    for (const collectionPath of collections) {
        const docRef = doc(db, collectionPath, productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        }
    }

    console.log("Không tìm thấy sản phẩm với ID:", productId);
    return null;
}

// Hàm tính phí ship
function calculateShippingFee(district) {
    const shippingFees = {
        "Quận 1": 20000, "Quận 2": 40000, "Quận 3": 35000,
        "Quận 4": 25000, "Quận 5": 25000, "Quận 6": 30000,
        "Quận 7": 30000, "Quận 8": 30000, "Quận 9": 40000,
        "Quận 10": 25000, "Quận 11": 25000, "Quận 12": 35000,
        "Quận Phú Nhuận": 30000, "Quận Bình Thạnh": 30000,
        "Quận Tân Bình": 30000, "Quận Bình Tân": 35000,
        "Quận Thủ Đức": 40000, "Quận Gò Vấp": 0,
        "Huyện Bình Chánh": 40000, "Huyện Nhà Bè": 40000,
        "Huyện Cần Giờ": 50000, "Huyện Củ Chi": 50000
    };
    return shippingFees[district] || 0;
}

// Hiển thị giỏ hàng trên delivery.html
async function displayCartInDelivery() {
    if (isCartDisplayed) return; // Tránh gọi lại nếu đã hiển thị trước đó
    isCartDisplayed = true;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deliveryContentRight = document.querySelector('.delivery-content-right');
    deliveryContentRight.innerHTML = '';

    const table = document.createElement('table');
    table.id = "cart-table";
    table.innerHTML = `
        <tr><th>Tên sản phẩm</th><th>Số lượng</th><th>Thành tiền</th></tr>
    `;

    let total = 0;
    for (const item of cart) {
        const product = await getProductById(item.id);
        if (product) {
            const subtotal = product.price * item.quantity;
            total += subtotal;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${product.name}</td><td>${item.quantity}</td><td>${subtotal.toLocaleString('vi-VN')}đ</td>`;
            table.appendChild(row);
        }
    }

    // Phí ship
    const selectedDistrict = document.getElementById("districtDropdown").value;
    const shippingFee = calculateShippingFee(selectedDistrict);
    const grandTotal = total + shippingFee;

    table.innerHTML += `
        <tr><td colspan="2"><b>Tổng</b></td><td><b>${total.toLocaleString('vi-VN')}đ</b></td></tr>
        <tr><td colspan="2"><b>Phí ship</b></td><td><b>${shippingFee.toLocaleString('vi-VN')}đ</b></td></tr>
        <tr><td colspan="2"><b>Tổng cộng</b></td><td><b>${grandTotal.toLocaleString('vi-VN')}đ</b></td></tr>
    `;
    
    deliveryContentRight.appendChild(table);
}

// Lưu đơn hàng vào Firestore
async function saveOrder(orderData) {
    try {
        await addDoc(collection(db, "orders"), orderData);
        alert("Bạn đã đặt hàng thành công!");
        window.location.href = "../home.html";
    } catch (e) {
        console.error("Lỗi khi lưu đơn hàng: ", e);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
}

// Kiểm tra số điện thoại hợp lệ
function validatePhoneNumber(phone) {
    return /^(0\d{9}|\+84\d{9})$/.test(phone);
}

// Xử lý đặt hàng
async function submitOrder(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const district = document.getElementById("districtDropdown").value.trim();
    const ward = document.getElementById("wardInput").value.trim();
    const address = document.getElementById("addressInput").value.trim();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = firebase.auth().currentUser;
    const useremail = user ? user.email : "guest@example.com";

    if (!fullName || !phone || !district || !ward || !address) {
        alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
        return;
    }
    if (!validatePhoneNumber(phone)) {
        alert("Số điện thoại không hợp lệ.");
        return;
    }

    let total = 0;
    const items = [];
    for (const item of cart) {
        const product = await getProductById(item.id);
        if (product) {
            const subtotal = product.price * item.quantity;
            total += subtotal;
            items.push({ name: product.name, quantity: item.quantity, price: product.price, subtotal });
        }
    }

    const shippingFee = calculateShippingFee(district);
    const grandTotal = total + shippingFee;

    await saveOrder({
        useremail, 
        fullName, 
        phone, 
        province: "Thành phố Hồ Chí Minh", 
        district, 
        ward, 
        address,
        items, 
        total: grandTotal, 
        shippingFee, 
        createdAt: new Date(), 
        orderId: `ORDER-${Date.now()}`,
        status: "Đang chờ tiếp nhận", 
        payment: "Thanh toán khi nhận hàng"
    });
}

// Gán sự kiện khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    if (!isCartDisplayed) {
        displayCartInDelivery();
    }
    document.querySelector('.delivery-content-left-button button:last-child').addEventListener('click', submitOrder);
    document.getElementById('districtDropdown').addEventListener('change', displayCartInDelivery);
});
