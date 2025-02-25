async function loginUser(event) {
    event.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    
    if (!email || !password) {
        alert("Vui lòng nhập email và mật khẩu.");
        return;
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Hiển thị email và mật khẩu
        document.getElementById("display-email").value = email;
        document.getElementById("display-password").value = password;

        // Lưu trạng thái đăng nhập
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);

        alert("Đăng nhập thành công!");
        console.log("Thông tin người dùng:", user);

        // Chuyển hướng đến trang chủ
        window.location.href = "../home.html";
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        alert("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
}
document.getElementById("toggle-password").addEventListener("click", function () {
    const passwordField = document.getElementById("display-password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
});
