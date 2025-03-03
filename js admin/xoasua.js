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
        comic: `products/nike/nike_nam`,
        foreignBook: `products/nike/nike_nu`,
        stationery: `products/adidas/adidas_nam`,
        psychology: `products/adidas/adidas_nu`,
        educationalToy: `products/other_brand/daygiay`,
        model: `products/other_brand/vs_giay`
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
        comic: `product/sach/comic`,
        foreignBook: `product/sach/sachngoaingu`,
        stationery: `product/vpp/dungcuvanphong`,
        psychology: `product/sach/tamlikinangsong`,
        educationalToy: `product/dochoi/giaoduc`,
        model: `product/dochoi/mohinh`,
        butviet:  `product/vpp/butviet`,
         giay: `product/vpp/sanphamgiay`
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

    // Kiểm tra giá
    if (isNaN(productData.price)) {
        alert("Giá không hợp lệ. Vui lòng nhập giá bằng số.");
        return;
    }

    const imageFile = document.getElementById('imageFile').files[0]; // Lấy tệp từ input

    let imagePath = ''; // Đường dẫn lưu hình ảnh

    // Xác định đường dẫn lưu hình ảnh dựa trên loại sản phẩm
    const productType = document.getElementById('productType').value; // Giả sử bạn có một input để chọn loại sản phẩm
    if (productType === 'comic') {
        imagePath = 'image/sach/comic/';
    } else if (productType === 'foreignBook') {
        imagePath = 'image/sach/sachngoaingu/';
    } else if (productType === 'psychology') {
        imagePath = 'image/sach/tamlikinangsong/';
    } else if (productType === 'stationery') {
        imagePath = 'image/vpp/dungcuvanphong/';
    } else if (productType === 'educationalToy') {
        imagePath = 'image/dochoi/giaoduc/'; // Đường dẫn cho Đồ chơi giáo dục
    } else if (productType === 'model') {
        imagePath = 'image/dochoi/mohinh/'; // Đường dẫn cho Mô hình
    } else if(productType === 'butviet'){
        imagePath ='image/vpp/butviet/';
    } else if(productType === 'giay'){
        imagePath ='image/vpp/sanphamgiay/';
    }

    if (imageFile) {
        try {
            // Tải tệp lên Firebase Storage

            const storageRef = ref(storage, `${imagePath}${Date.now()}_${imageFile.name}`); // Tạo tên file duy nhất // Tạo tên file duy nhất

            await uploadBytes(storageRef, imageFile);
            const imageURL = await getDownloadURL(storageRef);
            productData.imageURL = imageURL; // Cập nhật URL hình ảnh mới
        } catch (error) {
            console.error("Lỗi khi tải lên tệp:", error);
            alert("Đã xảy ra lỗi khi tải tệp lên Firebase Storage.");
            return;
        }
    } else {
        // Lấy URL hình ảnh cũ nếu không có tệp mới
        const docRef = doc(db, `product/sach/comic`, productId); // Thay đường dẫn nếu cần
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            productData.imageURL = docSnap.data().imageURL;
        }
    }

    const collectionPaths = {
        comic: `product/sach/comic`,
        foreignBook: `product/sach/sachngoaingu`,
        stationery: `product/vpp/dungcuvanphong`,
        psychology: `product/sach/tamlikinangsong`,
        educationalToy: `product/dochoi/giaoduc`,
        model: `product/dochoi/mohinh`,
        butviet:  `product/vpp/butviet`,
        giay: `product/vpp/sanphamgiay`
    };

    let docRef;

    for (const path of Object.values(collectionPaths)) {
        docRef = doc(db, path, productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await updateDoc(docRef, productData);
            alert("Sản phẩm đã được cập nhật.");
            window.location.href = 'admin_selecttoadd.html';
            return;
        }
    }

    alert("Không tìm thấy sản phẩm để cập nhật.");
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