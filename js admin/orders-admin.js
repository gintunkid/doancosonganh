import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzjS1Zf-rh1txM7KtoiGm5LkdDaWzTh-U",
    authDomain: "store-music-fae02.firebaseapp.com",
    projectId: "store-music-fae02",
    storageBucket: "store-music-fae02.appspot.com",
    messagingSenderId: "35440000355",
    appId: "1:35440000355:web:8a266ed1a96e7c2f812756",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to fetch orders for the current user
async function fetchUserOrders(userEmail) {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, where("useremail", "==", userEmail)); // Query to fetch orders for the given user email
    const ordersSnapshot = await getDocs(q);
    const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const ordersContainer = document.querySelector('.container-orders');
    ordersContainer.innerHTML = ""; // Clear any previous orders

    if (ordersList.length === 0) {
        // If no orders are found, display the default message
        ordersContainer.innerHTML = "<p>Chưa có đơn hàng nào.</p>";
        return; // Stop further processing if no orders
    }

    // If orders are found, create and display the order elements
    ordersList.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        // Create a dropdown for status
        const createStatusDropdown = (status) => {
            const statuses = ["Đang chờ tiếp nhận", "Đang xử lý", "Đang giao hàng", "Đã giao thành công", "Đã hủy"];
            return ` 
                <select class="status-dropdown" data-order-id="${order.orderId}">
                    ${statuses.map(option => ` 
                        <option value="${option}" ${option === status ? "selected" : ""}>
                            ${option}
                        </option>
                    `).join('')}
                </select>
            `;
        };

        orderDiv.innerHTML = `
            <div class="order-header">
                <h2>ID Đơn hàng: ${order.orderId}</h2>
                <span class="status">${order.status || 'Đang xử lý'}</span>
            </div>
            <div class="customer-info">
                <p><strong>Họ và tên:</strong> ${order.fullName || 'Chưa cập nhật'}</p>
                <p><strong>Số điện thoại:</strong> ${order.phone || 'Chưa cập nhật'}</p>
                <p><strong>Địa chỉ:</strong> ${order.address || 'Chưa cập nhật'}</p>
                <p><strong>Phường/Xã/Thị trấn:</strong> ${order.ward || 'Chưa cập nhật'}</p>
                <p><strong>Quận:</strong> ${order.district || 'Chưa cập nhật'}</p>
                <p><strong>Tỉnh:</strong> ${order.province || 'Chưa cập nhật'}</p>
                <p><strong>Phương thức thanh toán:</strong> ${order.payment}</p>
            </div>
            <div class="product-list">
                ${order.items.map(item => `
                    <div class="product">
                        <span>${item.name || 'Không xác định'}</span>
                        <span>Số lượng: ${item.quantity || 0}</span>
                        <span>Thành tiền: ${item.subtotal || 0} đ</span>
                    </div>
                `).join('')}
            </div>
            <div class="total">Tổng tiền: ${order.total || 0} đ</div>
            <div class="order-status">
                ${createStatusDropdown(order.status)}
            </div>
        `;

        ordersContainer.appendChild(orderDiv);
    });

    // Handle status change event
    const statusDropdowns = document.querySelectorAll('.status-dropdown');
    statusDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', async (event) => {
            const orderId = event.target.getAttribute('data-order-id');
            const newStatus = event.target.value;

            const ordersCollection = collection(db, "orders");
            const q = query(ordersCollection, where("orderId", "==", orderId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.error(`Tài liệu với orderId ${orderId} không tồn tại trong Firestore`);
                return;
            }

            const orderDoc = querySnapshot.docs[0];
            const orderRef = doc(db, "orders", orderDoc.id);

            await updateDoc(orderRef, { status: newStatus });

            // Update the status in DOM
            const statusElement = event.target.closest('.order').querySelector('.status');
            statusElement.textContent = newStatus;
        });
    });
}

// Listen for email selection change
document.getElementById('emailOptions').addEventListener('change', (event) => {
    const selectedEmail = event.target.value;
    const ordersContainer = document.querySelector('.container-orders');

    if (!selectedEmail) {
        ordersContainer.innerHTML = "<p>Vui lòng chọn email để xem đơn hàng.</p>";
        return;
    }

    fetchUserOrders(selectedEmail); // Fetch orders for selected email
});

// Fetch the list of emails from Firestore
async function loadEmails() {
    const usersRef = collection(db, "user");
    const snapshot = await getDocs(usersRef);
    const emailSelect = document.getElementById('emailOptions');

    snapshot.forEach((doc) => {
        const user = doc.data();
        const option = document.createElement('option');
        option.value = user.email; // Assuming you have the email field in the user
        option.textContent = user.email;
        emailSelect.appendChild(option);
    });
}

// Load the email list when the page is loaded
loadEmails();

// Listen for user authentication state changes
onAuthStateChanged(auth, async (user) => {
    const ordersContainer = document.querySelector('.container-orders');
    if (user) {
        // User is logged in, set the email
        const userEmail = user.email;

        // Auto-select the email in the dropdown, but do NOT fetch orders automatically
        const emailSelect = document.getElementById('emailOptions');
        emailSelect.value = userEmail; // Set the email
    } else {
        // User is not logged in, clear the orders container and show the message
        ordersContainer.innerHTML = "<p>Người dùng chưa đăng nhập. Vui lòng đăng nhập để xem đơn hàng.</p>";
    }
});
