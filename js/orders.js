// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
const auth = getAuth(app);

// Fetch orders and render buttons
async function fetchUserOrders(userEmail) {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, where("useremail", "==", userEmail));
    const ordersSnapshot = await getDocs(q);
    const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const ordersContainer = document.querySelector('.container-orders');
    ordersContainer.innerHTML = ""; // Clear existing orders

    if (ordersList.length === 0) {
        ordersContainer.innerHTML = "<p>Không có đơn hàng nào.</p>";
        return;
    }

    ordersList.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');
        orderDiv.innerHTML = `
            <div class="order-header">
                <h2>ID Đơn hàng: ${order.orderId}</h2>
                <span class="status">${order.status || 'Đang xử lý'}</span>
            </div>
            <div class="order-details">
                <p><strong>Họ tên:</strong> ${order.fullName || 'Chưa cung cấp'}</p>
                <p><strong>Số điện thoại:</strong> ${order.phone || 'Chưa cung cấp'}</p>
                <p><strong>Địa chỉ:</strong> ${order.address || 'Chưa cung cấp'}</p>
                <p><strong>Tỉnh/Thành phố:</strong> ${order.province || 'Chưa cung cấp'}</p>
                <p><strong>Quận/Huyện:</strong> ${order.district || 'Chưa cung cấp'}</p>
                <p><strong>Phường/Xã/Thị trấn:</strong> ${order.ward || 'Chưa cung cấp'}</p>
                <p><strong>Phương thức thanh toán:</strong> ${order.payment || 'Chưa cung cấp'}</p>
            </div>
            <div class="product-list">
                ${order.items.map(item => `
                    <div class="product">
                        <span>${item.name}</span>
                        <span>Số lượng: ${item.quantity}</span>
                        <span>Thành tiền: ${item.subtotal} đ</span>
                    </div>
                `).join('')}
            </div>
            <div class="total">Tổng tiền: ${order.total} đ</div>
            ${order.status === "Đang chờ tiếp nhận" 
                ? `<button class="cancel-order-btn" data-order-id="${order.id}">Hủy đơn hàng</button>` 
                : ''}
        `;
    
        ordersContainer.appendChild(orderDiv);
    });    
    attachCancelButtons(); // Attach event listeners to buttons
}

// Attach event listeners to cancel buttons
function attachCancelButtons() {
    const cancelButtons = document.querySelectorAll('.cancel-order-btn');
    console.log("Found cancel buttons:", cancelButtons.length);  // Kiểm tra số lượng nút
    cancelButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderId = event.target.getAttribute('data-order-id');
            console.log("Cancel button clicked for order ID:", orderId);  // Kiểm tra orderId khi nút được nhấn
            showCancelForm(orderId);
        });
    });
}

function showCancelForm(orderId) {
    // Xóa tất cả các modal cũ nếu có
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();  // Xóa modal cũ
        console.log("Modal cũ đã bị xóa");
    }

    const cancelFormHtml = `
        <div class="cancel-form">
            <h3>Chọn lý do hủy đơn hàng</h3>
            <select id="cancel-reason-${orderId}">
                <option value="Tôi tìm được chỗ khác tốt hơn">Tôi tìm được chỗ khác giá tốt hơn</option>
                <option value="Thay đổi địa chỉ giao hàng">Thay đổi địa chỉ giao hàng</option>
                <option value="Không còn nhu cầu">Không còn nhu cầu</option>
                <option value="Lí do khác">Lí do khác</option>
            </select>
            <button id="confirm-cancel-btn-${orderId}">Xác nhận hủy</button>
            <button id="cancel-cancel-btn-${orderId}">Hủy bỏ</button>
        </div>
    `;

    // Tạo modal
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = cancelFormHtml;

    // Thêm modal vào body
    document.body.appendChild(modal);

    // Attach event listener for confirmation
    document.getElementById(`confirm-cancel-btn-${orderId}`).addEventListener('click', () => {
        confirmCancelOrder(orderId);
    });

     // Attach event listener for cancel button (Hủy bỏ)
     document.getElementById(`cancel-cancel-btn-${orderId}`).addEventListener('click', () => {
        cancelModal();
    });
}

//Xác nhận hủy đơn hàng
async function confirmCancelOrder(orderId) {
    const reason = document.getElementById(`cancel-reason-${orderId}`).value;  // Lấy giá trị lý do hủy đơn
    try {
        const orderDocRef = doc(db, "orders", orderId);
        await updateDoc(orderDocRef, {
            status: "Đã hủy",
            cancelReason: reason
        });

        alert("Đơn hàng đã được hủy thành công!");
        document.querySelector('.modal').remove(); // Remove modal
        location.reload(); // Reload to update the order list
    } catch (e) {
        console.error("Lỗi khi hủy đơn hàng: ", e);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
}

//Hủy bỏ form hủy đơn
function cancelModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();  // Remove the modal from the DOM
    }
    console.log('Modal đã bị hủy bỏ.');
}

// Trigger fetch orders on user authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userEmail = user.email;
        fetchUserOrders(userEmail);
    } else {
        console.log("Người dùng chưa đăng nhập.");
    }
});
