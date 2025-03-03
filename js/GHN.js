// Cấu hình Firebase từ Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAf5hxg2YNKxuIM7Kw3viYnyRMVHZaMh4g",
    authDomain: "step-up-brand.firebaseapp.com",
    projectId: "step-up-brand",
    storageBucket: "step-up-brand.firebasestorage.app",
    messagingSenderId: "915455304768",
    appId: "1:915455304768:web:da213c10c670fd0384aba5",
    measurementId: "G-X23NY4DSWG"
  };
  // Khởi tạo Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  function submitForm() {
    // Lấy thông tin từ các input
    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const province = document.getElementById("provinceDropdown").value;
    const district = document.getElementById("districtDropdown").value;
    const address = document.getElementById("addressInput").value;

    // Kiểm tra xem tất cả các trường đã được nhập hay chưa
    if (!fullName || !phone || !province || !district || !address) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Lưu thông tin vào Firestore
    saveAddressToFirestore(fullName, phone, province, district, address);
}

async function saveAddressToFirestore(fullName, phone, province, district, address) {
    // Lấy thông tin người dùng, ví dụ từ Firebase Authentication (nếu có)
    const userID = "user123";  // Thay thế bằng ID người dùng thực tế (dùng Firebase Auth)

    try {
        const addressRef = db.collection('addresses').doc();  // Tạo một document mới trong collection "addresses"
        
        await addressRef.set({
            user_id: userID,
            full_name: fullName,
            phone: phone,
            address: address,
            district: district,
            province: province,
            created_at: firebase.firestore.FieldValue.serverTimestamp()  // Thêm thời gian tạo
        });

        alert("Địa chỉ đã được lưu thành công!");
         // Chuyển hướng đến trang payment.html
         window.location.href = "../html-payment/payment.html";  // Thay thế đường dẫn nếu cần
    } catch (error) {
        console.error("Lỗi khi lưu địa chỉ:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
}
