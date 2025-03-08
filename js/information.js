// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Function to log in
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

        // Lưu trạng thái đăng nhập
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);

        alert("Đăng nhập thành công!");
        console.log("Thông tin người dùng:", user);

        // Chuyển hướng đến trang thông tin cá nhân
        window.location.href = "information.html";
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        alert("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
}

document.getElementById("toggle-password").addEventListener("click", function () {
    const passwordField = document.getElementById("login-password");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
});

// Function to fetch and display user info
async function displayUserInfo() {
    const user = auth.currentUser;
    if (!user) {
        console.log("Người dùng chưa đăng nhập.");
        return;
    }
    
    const userDocRef = doc(db, "users", user.uid);
    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById("display-email").value = user.email;
            document.getElementById("display-fullname").value = userData.fullName || "";
            document.getElementById("display-phone").value = userData.phone || "";
        } else {
            console.log("Không tìm thấy thông tin người dùng trong Firestore.");
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
}

// Function to update user info
async function updatePersonalInfo() {
    const user = auth.currentUser;
    if (!user) {
        alert("Bạn chưa đăng nhập.");
        return;
    }
    
    const fullName = document.getElementById("display-fullname").value;
    const phone = document.getElementById("display-phone").value;

    try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            fullName: fullName,
            phone: phone
        });
        alert("Cập nhật thông tin thành công!");
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        alert("Lỗi khi cập nhật thông tin: " + error.message);
    }
}

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        displayUserInfo();
    }
});
