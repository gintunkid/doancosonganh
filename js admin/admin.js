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
    let imagePath = ''; // Biến để lưu đường dẫn hình ảnh
    // Chuyển đổi giá thành kiểu số
    price = parseFloat(price); // Chuyển đổi giá sang kiểu số

    // Kiểm tra xem giá có hợp lệ không
    if (isNaN(price)) {
        alert("Giá không hợp lệ. Vui lòng nhập giá bằng số.");
        return; // Dừng hàm nếu giá không hợp lệ
    }

 // Xác định đường dẫn Firestore và đường dẫn hình ảnh dựa trên loại sản phẩm
    if (productType === 'nike_nam') {
        collectionPath = "products/nike/nike_nam";
        imagePath = 'image/sach/comic/'; // Đường dẫn hình ảnh cho sản phẩm comic
    } else if (productType === 'snn') {
        collectionPath = "product/sach/sachngoaingu";
        imagePath = 'image/sach/snn/'; // Đường dẫn hình ảnh cho sách ngoại ngữ
    } else if (productType === 'tlkn') {
        collectionPath = "product/sach/tamlikinangsong";
        imagePath = 'image/sach/tlkn/'; // Đường dẫn hình ảnh cho sách kỹ năng sống
    } else if (productType === 'giaoduc') {
        collectionPath = "product/dochoi/giaoduc";
        imagePath = 'image/dochoi/giaoduc/'; // Đường dẫn hình ảnh cho đồ chơi giáo dục
    } else if (productType === 'mohinh') {
        collectionPath = "product/dochoi/mohinh";
        imagePath = 'image/dochoi/mohinh/'; 
    }    else if (productType === 'vpp') {
        collectionPath = "product/vpp/dungcuvanphongpham";
        imagePath = 'image/dochoi/dungcuvanphongpham/'; 
    }   else if (productType ==='butviet'){
        collectionPath = "product/vpp/butviet";
        imagePath = 'image/vpp/butviet/';
    }else if (productType ==='giay'){
        collectionPath = "product/vpp/sanphamgiay";
        imagePath = 'image/vpp/sanphamgiay/';
    }
    if (imageFile) {
        const storageRef = ref(storage, imagePath + imageFile.name);
        await uploadBytes(storageRef, imageFile);
        const imageURL = await getDownloadURL(storageRef);

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
        displayProducts(); // Cập nhật danh sách sản phẩm sau khi thêm
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
        if (category === 'comic') {
            collectionPath = 'product/sach/comic';
        } else if (category === 'snn') {
            collectionPath = 'product/sach/sachngoaingu';
        } else if (category === 'tlkn') {
            collectionPath = 'product/sach/tamlikinangsong';
        } else if (category === 'giaoduc') {
            collectionPath = 'product/dochoi/giaoduc';
        } else if (category === 'mohinh') {
            collectionPath = 'product/dochoi/mohinh';
        } else if (category === 'vpp') {
            collectionPath = 'product/vpp/dungcuvanphong';
        } else if (category === 'butviet') {
            collectionPath = 'product/vpp/butviet';
        } else if(category === 'giay'){
            collectionPath = 'product/vpp/sanphamgiay';
        }
    
        try {
            // Lấy sản phẩm từ Firestore
            const productsRef = collection(db, collectionPath);
            const snapshot = await getDocs(productsRef);
    
            snapshot.forEach(doc => {
                const product = doc.data();
                const productId = doc.id; // Lưu ID sản phẩm
    
                const productElement = document.createElement('div'); // Định nghĩa productElement ở đây
                productElement.classList.add('product');
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

