document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.querySelector(".fa-user");
    const userLink = userIcon.closest("a"); // Tham chiếu đến thẻ <a> bọc icon
    const topMenuIcons = document.querySelector(".top-menu-icons");
    const cartIcon = document.querySelector(".fa-shopping-cart"); // Chọn biểu tượng giỏ hàng

    // Kiểm tra trạng thái đăng nhập
    function checkSession() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userEmail = localStorage.getItem("userEmail");
        const passwordChanged = localStorage.getItem("passwordChanged") === "true";
        return { isLoggedIn, userEmail, passwordChanged };
    }

    // Cập nhật giao diện
    function updateUserInterface() {
        const { isLoggedIn, userEmail, passwordChanged } = checkSession();

        if (passwordChanged) {
            // Nếu mật khẩu đã đổi, tự động đăng xuất
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("passwordChanged");
            alert("Bạn cần đăng nhập lại sau khi đổi mật khẩu.");
            window.location.href = "/login-admin/login.html"; // Chuyển hướng đến trang đăng nhập
            return;
        }

        if (isLoggedIn && userEmail) {
            userLink.href = "#"; // Ngăn điều hướng khi đã đăng nhập
            userIcon.classList.add("fa-solid");
            userIcon.classList.remove("fa-regular");

            // Tạo menu khi bấm vào biểu tượng
            userIcon.addEventListener("click", (e) => {
                e.preventDefault();

                // Kiểm tra menu có tồn tại không
                let userMenu = document.querySelector("#user-menu");
                if (!userMenu) {
                    userMenu = document.createElement("div");
                    userMenu.id = "user-menu";
                    userMenu.className = "menu-dropdown";
                    userMenu.innerHTML = `
                        <ul>
                            <li><a href="/html-information/orders.html"><i class="fas fa-receipt"></i> Đơn hàng của tôi</a></li>
                            <li><a href="/html-information/information.html"><i class="fas fa-eye"></i> Thông tin cá nhân</a></li>
                            <li><a href="/login-admin/forgotpassword.html"><i class="fas fa-lock"></i> Đổi mật khẩu</a></li>
                            <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                        </ul>
                    `;
                    topMenuIcons.appendChild(userMenu);

                    // Xử lý đăng xuất
                    document.querySelector("#logout-btn").addEventListener("click", () => {
                        // Hiển thị hộp thoại xác nhận
                        const confirmLogout = window.confirm("Bạn chắc chắn muốn đăng xuất?");
                        if (confirmLogout) {
                            // Nếu người dùng đồng ý, xóa session và đăng xuất
                            localStorage.removeItem("isLoggedIn");
                            localStorage.removeItem("userEmail");
                            alert("Bạn đã đăng xuất.");
                            userMenu.remove(); // Xóa menu
                            updateUserInterface(); // Cập nhật lại giao diện
                            window.location.href = "/home.html"; // Chuyển hướng về trang chủ
                        }
                    });
                }
                
                // Hiển thị menu (ẩn nếu đang hiển thị)
                userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";

                // Sự kiện ẩn menu khi click bên ngoài
                document.addEventListener("click", (event) => {
                    if (!userMenu.contains(event.target) && !userIcon.contains(event.target)) {
                        userMenu.style.display = "none";
                    }
                }, { once: true }); // Chỉ chạy 1 lần
            });
        } else {
            userLink.href = "../login-admin/login.html"; // Điều hướng đến trang đăng nhập
            userIcon.classList.add("fa-regular");
            userIcon.classList.remove("fa-solid");

            // Xóa menu nếu tồn tại
            const userMenu = document.querySelector("#user-menu");
            if (userMenu) userMenu.remove();
        }
    }

    // Xử lý sự kiện cho giỏ hàng
    if (cartIcon) {
        cartIcon.addEventListener("click", (e) => {
            e.preventDefault();

            const { isLoggedIn } = checkSession();

            if (isLoggedIn) {
                // Nếu đã đăng nhập, chuyển đến trang giỏ hàng
                window.location.href = "/html-cart/cart.html";
            } else {
                // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
                window.location.href = "/login-admin/login.html";
            }
        });
    }

    updateUserInterface();
});
