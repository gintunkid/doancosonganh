// admin.js
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
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

// Hàm để thêm sản phẩm
async function addProduct(documentId, name, description, imageFile, price, rate, sold, productType) {
    let collectionPath = '';

    // Chuyển đổi giá thành kiểu số
    price = parseFloat(price); 

    if (isNaN(price)) {
        alert("Giá không hợp lệ. Vui lòng nhập giá bằng số.");
        return;
    }

    // Xác định đường dẫn Firestore dựa trên loại sản phẩm   
    if (productType === 'nike_nam') {
        collectionPath = "products/nike/nike_nam";
    } else if (productType === 'nike_nu') {
        collectionPath = "products/nike/nike_nu";
    } else if (productType === 'adidas_nam') {
        collectionPath = "products/adidas/adidas_nam";
    } else if (productType === 'adidas_nu') {
        collectionPath = "products/adidas/adidas_nu";
    } else if (productType === 'daygiay') {
        collectionPath = "products/other_brand/daygiay";
    } else if (productType === 'vs_giay') {
        collectionPath = "products/other_brand/vs_giay";
    }

    if (imageFile) {
        const imageURL = URL.createObjectURL(imageFile); // Lấy đường dẫn ảnh từ máy tính

        // Lưu dữ liệu vào Firestore
        await setDoc(doc(db, collectionPath, documentId), {
            documentId,
            name,
            description,
            imageURL,
            price,
            rate,
            sold
        });

        alert('Sản phẩm đã được thêm thành công!');
        displayProducts();
    } else {
        alert('Vui lòng chọn một hình ảnh.');
    }
}



// Hàm xử lý sự kiện khi form được gửi
async function handleFormSubmit(event) {
    event.preventDefault();

    const documentId = document.getElementById('documentId').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];
    const price = document.getElementById('price').value;
    const rate = document.getElementById('rate').value;
    const sold = document.getElementById('sold').value;
    const productType = document.getElementById('productType').value;

    // Gọi hàm addProduct với loại sản phẩm tương ứng
    await addProduct(documentId, name, description, imageFile, price, rate, sold, productType);

    // Optional: Clear the form after submission
    document.getElementById('dataForm').reset();
}

// Gán sự kiện xử lý form
document.getElementById('dataForm').addEventListener('submit', handleFormSubmit);


// gán sự kiện xử lý chọn theo thể loại
document.addEventListener("DOMContentLoaded", function() {
    const categorySelect = document.getElementById('categorySelect');
    const productsContainer = document.getElementById('productsContainer');

    // Hàm để hiển thị sản phẩm theo thể loại
    async function displayProductsByCategory(category) {
        const productsContainer = document.getElementById('productsContainer');
        productsContainer.innerHTML = ''; // Xóa nội dung cũ
    
        let collectionPath = '';
    
        // Xác định đường dẫn collection dựa trên thể loại
        if (category === 'nike_nam') {
            collectionPath = 'products/nike/nike_nam';
        } else if (category === 'nike_nu') {
            collectionPath = 'products/nike/nike_nu';
        } else if (category === 'adidas_nam') {
            collectionPath = 'products/adidas/adidas_nam';
        } else if (category === 'adidas_nu') {
            collectionPath = 'products/adidas/adidas_nu';
        } else if (category === 'daygiay') {
            collectionPath = 'products/other_brand/daygiay';
        } else if (category === 'vs_giay') {
            collectionPath = 'products/other_brand/vs_giay';
        }
    
        try {
            // Lấy sản phẩm từ Firestore
            const productsRef = collection(db, collectionPath);
            const snapshot = await getDocs(productsRef);
    
            snapshot.forEach(doc => {
                const product = doc.data();
                const productId = doc.id; // Lưu ID sản phẩm
    
                const productElement = document.createElement('div'); // Định nghĩa productElement ở đây
                productElement.classList.add('products');
                productElement.innerHTML = `
                    <img src="${product.imageURL}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${typeof product.price === 'number' && !isNaN(product.price) ? product.price.toLocaleString('vi-VN') : 'Giá không xác định'}đ</p>
                `;
    
                // Thêm sự kiện click cho productElement
                productElement.addEventListener('click', () => {
                    window.location.href = `xoasua.html?id=${productId}`; 
                });
    
                productsContainer.appendChild(productElement);
            });
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        }
    }
    // Lắng nghe sự kiện thay đổi trên dropdown thể loại
    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        displayProductsByCategory(selectedCategory);
    });

    // Hiển thị sản phẩm mặc định khi tải trang
    displayProductsByCategory(categorySelect.value);
});

