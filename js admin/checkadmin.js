// Kiểm tra trạng thái đăng nhập của admin
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        // Nếu admin chưa đăng nhập, chuyển hướng đến trang login
        window.location.href = "../login-admin/Loginadmin.html";
    } else {
        const adminname = localStorage.getItem('adminname');
        if (adminname) {
            console.log("Admin đã đăng nhập:", adminname);
        }
    }
}

// Kiểm tra đăng nhập khi tải trang admin
window.onload = checkAdminLogin;

// Hàm lấy dữ liệu từ collection admin
async function getAdminNames() {
    const adminCollection = collection(db, 'admin'); // Truy cập vào collection 'admin'
    const snapshot = await getDocs(adminCollection);
    const adminNames = snapshot.docs.map(doc => doc.id); // Lấy id của từng document
    console.log("Admin Names:", adminNames);
}

// Gọi hàm để in dữ liệu
getAdminNames();

document.addEventListener('DOMContentLoaded', function() {
    // Hàm xử lý đăng xuất
    function logoutAdmin() {
        
        // Xóa thông tin đăng nhập trong localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('adminname');

        // Hiển thị thông báo đăng xuất thành công
        alert("Đăng xuất thành công!");

        // Chuyển hướng về trang đăng nhập
        window.location.href = "Loginadmin.html"; // Chuyển hướng về trang đăng nhập
    }

    // Lắng nghe sự kiện click vào thẻ <a>
    document.getElementById('logout-link').addEventListener('click', logoutAdmin);
});