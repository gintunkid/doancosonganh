//-------------------------- ScrollMouse ---------------------------
let lastScrollTop = 0; // Lưu vị trí cuộn trước đó
const topSection = document.querySelector('.top');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Kéo chuột xuống
        topSection.style.top = "-100px"; // Ẩn phần tử
    } else {
        // Kéo chuột lên
        topSection.style.top = "0"; // Hiện phần tử
    }
    lastScrollTop = scrollTop; // Cập nhật vị trí cuộn
});

//----------- Thêm chức năng cho nút "Thêm vào giỏ hàng"-------------
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
    });
});

//------------------Menu-Cartegory-------------------
const itemsliderbar = document.querySelectorAll(".cartegory-left-li")
itemsliderbar.forEach(function(menu,index){
    menu.addEventListener("click",function(){
        menu.classList.toggle("block")
    })
})
//------------------------------ PRODUCT-------------------------
const bigImg = document.querySelector(".product-content-left-big-img img")
const smalImg = document.querySelectorAll(".product-content-left-small-img img")
smalImg.forEach(function(imgItem,X){
    imgItem.addEventListener("click",function(){
        bigImg.src = imgItem.src
    })
})
const baoquan = document.querySelector(".baoquan")
const chitiet = document.querySelector(".chitiet")
if(baoquan){
    baoquan.addEventListener("click",function(){
        document.querySelector(".product-content-right-bottom-content-chitiet").style.display = "none"
        document.querySelector(".product-content-right-bottom-content-baoquan").style.display = "block"
    })
}
if(chitiet){
    baoquan.addEventListener("click",function(){
        document.querySelector(".product-content-right-bottom-content-chitiet").style.display = "block"
        document.querySelector(".product-content-right-bottom-content-baoquan").style.display = "none"
    })
}

const butTon = document.querySelector(".product-content-right-bottom-top")
if(butTon){
    butTon.addEventListener(".click",function(){
        document.querySelector(".product-content-right-bottom-content-big").classList.toggle("activeB")
    })
}



///------------------------- LOGIN-SIGN UP---------------------
const container = document.getElementById('container');
const registerBtn = document.getElementById('register-change');
const loginBtn = document.getElementById('login-change');

// Khi nhấn vào nút Đăng ký, chuyển form sang trang Đăng ký
registerBtn.addEventListener('click', () => {
    container.classList.add("active"); 
});

// Khi nhấn vào nút Đăng nhập, chuyển form sang trang Đăng nhập
loginBtn.addEventListener('click', () => {
    container.classList.remove("active")
});