import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

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
const storage = getStorage(app);

// Lấy ID sản phẩm từ URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // ID sản phẩm được truyền qua URL

// Hàm để tải thông tin sản phẩm
async function loadProductDetail(productId) {
    const collectionPaths = {
        nike_nam: `products/nike/nike_nam`,
        nike_nu: `products/nike/nike_nu`,
        adidas_nam: `products/adidas/adidas_nam`,
        adidas_nu: `products/adidas/adidas_nu`,
        daygiay: `products/other_brand/daygiay`,
        vs_giay: `products/other_brand/vs_giay`
    };

    let docRef;

    // Kiểm tra từng loại sản phẩm
    for (const path of Object.values(collectionPaths)) {
        docRef = doc(db, path, productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setProductDetails(docSnap.data(), docSnap.id); // Gọi hàm để thiết lập thông tin sản phẩm
            return; // Nếu tìm thấy sản phẩm, không cần kiểm tra tiếp
        }
    }

    console.log("Không tìm thấy sản phẩm");
}

// Hàm để thiết lập thông tin sản phẩm vào các input
function setProductDetails(product, id) {
    document.getElementById('productId').value = id;
    document.getElementById('name').value = product.name;
    document.getElementById('description').value = product.description;
    document.getElementById('price').value = product.price;
    document.getElementById('imageURL').value = product.imageURL; // Cập nhật đường dẫn hình ảnh
    const imageElement = document.getElementById('productImage'); // ID của thẻ <img> trong HTML
    if (imageElement) {
        imageElement.src = product.imageURL; // Cập nhật src của thẻ <img> với URL hình ảnh
    }
}

// Hàm để xóa sản phẩm
async function deleteProduct() {
    const collectionPaths = {
        nike_nam: `products/nike/nike_nam`,
        nike_nu: `products/nike/nike_nu`,
        adidas_nam: `products/adidas/adidas_nam`,
        adidas_nu: `products/adidas/adidas_nu`,
        daygiay: `products/other_brand/daygiay`,
        vs_giay: `products/other_brand/vs_giay`
    };

    let docRef;

    // Kiểm tra từng loại sản phẩm
    for (const path of Object.values(collectionPaths)) {
        docRef = doc(db, path, productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await deleteDoc(docRef); // Xóa sản phẩm
            alert("Sản phẩm đã được xóa");
            window.location.href = 'admin_selecttoadd.html'; // Chuyển hướng về trang danh sách sản phẩm
            return; // Nếu xóa thành công, không cần kiểm tra tiếp
        }
    }

    alert("Không tìm thấy sản phẩm để xóa");
}

// Hàm để cập nhật sản phẩm
async function updateProduct(event) {
    event.preventDefault();

    const productData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value)
    };

    // Kiểm tra giá hợp lệ
    if (isNaN(productData.price)) {
        alert("Giá không hợp lệ. Vui lòng nhập giá bằng số.");
        return;
    }

    // Lấy URL hình ảnh cũ từ Firestore (nếu có)
    const docRef = doc(db, `products/nike/nike_nam`, productId); // Thay đường dẫn nếu cần
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        productData.imageURL = docSnap.data().imageURL; // Giữ nguyên ảnh cũ
    } else {
        productData.imageURL = ""; // Hoặc đặt giá trị mặc định nếu không có ảnh
    }

    // Cập nhật dữ liệu lên Firestore (KHÔNG thay đổi ảnh)
    try {
        await updateDoc(docRef, productData);
        alert("Cập nhật sản phẩm thành công!");
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Đã xảy ra lỗi khi cập nhật sản phẩm.");
    }
}

// Gán sự kiện cho nút xóa
document.getElementById('deleteButton').addEventListener('click', deleteProduct);

// Gán sự kiện cho form khi được gửi
document.getElementById('productForm').addEventListener('submit', updateProduct);

// Gán sự kiện cho nút cập nhật
document.getElementById('updateButton').addEventListener('click', updateProduct);

// Tải thông tin sản phẩm khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail(productId);
});