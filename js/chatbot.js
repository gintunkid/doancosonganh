// Lưu tin nhắn vào sessionStorage
function saveChatHistory() {
    const messageArea = document.getElementById("messages");
    const messages = messageArea.innerHTML;
    sessionStorage.setItem("chatHistory", messages);
}
// Tải lại lịch sử trò chuyện từ sessionStorage khi mở lại trang
function loadChatHistory() {
    const messageArea = document.getElementById("messages");
    const savedMessages = sessionStorage.getItem("chatHistory");
    if (savedMessages) {
        messageArea.innerHTML = savedMessages;
    }
}
// Hàm để chuyển đổi trạng thái của chatbox (hiện/ẩn)
function toggleChat() {
    const chatbox = document.getElementById("chatbox");
    const messageArea = document.getElementById("messages");
    
    if (chatbox.style.display === "block") {
        chatbox.style.display = "none";
    } else {
        chatbox.style.display = "block";
        if (messageArea.innerHTML === "") {
            // Gửi câu hỏi ban đầu khi mở chat
            sendBotMessage('Step Up là một trang web bán giày thời trang trực tuyến, chuyên cung cấp các mẫu giày đa dạng từ nhiều thương hiệu và phong cách khác nhau, bao gồm cả các thiết kế độc quyền. Với sứ mệnh kết nối những người yêu giày với các xu hướng thời trang mới nhất, Step Up không chỉ là nơi mua sắm tiện lợi mà còn là nền tảng hỗ trợ các nhà thiết kế và thương hiệu giày độc lập xây dựng thương hiệu, mở rộng thị trường và khẳng định phong cách riêng');
            displayQuestions();  // Hiển thị câu hỏi sau khi mở chat
        }
        scrollToBottom(); // Cuộn xuống dưới khi mở chat
    }
}

// Hàm gửi tin nhắn của bot
function sendBotMessage(message) {
    const messageArea = document.getElementById("messages");
    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerText = message;
    messageArea.appendChild(botMessage);

    // Cuộn xuống dưới khi có tin nhắn mới
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Hàm tạo câu hỏi và thêm vào chatbox
function displayQuestions() {
    const messageArea = document.getElementById("messages");

    const questions = [
        { text: "Giày đang bán chạy nhất ở đây là gì?", answer: "Giày bán chạy nhất hiện nay là ADIDAS JOG 2.0 GREY của Adidas với gần 1000 sản phẩm đã bán ra." },
        { text: "Chính sách bảo hành ở đây là gì?", answer: "Mỗi sản phẩm đều có chính sách bảo hành chung đều là 2 tháng kể từ lúc khách hàng mua sản phẩm và có thể đổi trả trong vòng 7 ngày nếu khách hàng không hài lòng." },
        { text: "Shop có bán giày chính hãng không?", answer: "Tất cả giày bán tại Step Up đều là giày chính hãng." }
    ];

    questions.forEach(question => {
        // Kiểm tra nếu button đã tồn tại thì không tạo lại
        if (!document.querySelector(`#messages button[data-question="${question.text}"]`)) {
            const button = document.createElement("button");
            button.innerText = question.text;
            button.setAttribute("data-question", question.text); // Đặt thuộc tính để kiểm tra trùng lặp
            button.onclick = function () {
                sendAnswer(question.answer);
            };
            messageArea.appendChild(button);
        }
    });
}

function sendAnswer(answer) {
    const messageArea = document.getElementById("messages");

    // Tạo tin nhắn bot
    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerText = answer;

    messageArea.appendChild(botMessage);

    // Cuộn xuống cuối cùng để thấy tin nhắn mới
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Hàm kiểm tra và gửi câu trả lời từ người dùng
function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    if (!userInput.trim()) return;  // Nếu input rỗng thì không gửi tin nhắn

    const messageArea = document.getElementById("messages");

    // Tạo một container cho tin nhắn người dùng và icon
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("user-message");

    // Tạo icon cho người dùng (nếu cần)
    const userIcon = document.createElement("div");
    userIcon.classList.add("user-icon");

    // Tạo tin nhắn của người dùng
    const userMessage = document.createElement("div");
    userMessage.classList.add("message-text");
    userMessage.innerText = userInput;

    // Thêm icon và tin nhắn vào container
    messageContainer.appendChild(userIcon);
    messageContainer.appendChild(userMessage);

    // Thêm container vào khu vực tin nhắn
    messageArea.appendChild(messageContainer);

    // Cuộn xuống dưới khi có tin nhắn mới
    messageArea.scrollTop = messageArea.scrollHeight;

    // Gửi câu trả lời tự động từ bot dựa trên câu hỏi của người dùng
    autoReply(userInput);

    // Làm sạch input sau khi gửi
    document.getElementById("userInput").value = '';
    
    // Lưu lịch sử
    saveChatHistory();
}   

// Hàm trả lời tự động từ bot dựa trên câu hỏi của người dùng
function autoReply(userInput) {
    const messageArea = document.getElementById("messages");

    // Từ điển các từ khóa và câu trả lời
    const keywordResponses = [        
        { keywords: ["chào shop", "hi", "hello", "dạ chào shop"], response: "Chào bạn, tôi là bot của shop bán giày thời trang Step Up, mọi câu trả lời của tôi được lập trình sẵn. Nếu cần tư vấn riêng hãy liên hệ trang facebook cá nhân của shop." },
        { keywords: ["địa chỉ cửa hàng", "cửa hàng ở đâu"], response: "Hiện tại cửa hàng đang ở 254 đ.Lê văn Thọ q.Gò Vấp" },
        { keywords: ["giày bán chạy", "giày hot", "best seller"], response: "Giày bán chạy nhất hiện nay là ADIDAS JOG 2.0 GREY của Adidas với gần 1000 sản phẩm đã bán ra." },
        { keywords: ["bảo hành", "đổi trả"], response: "Giày sẽ có chính sách bảo hành 2 tháng kể từ lúc khách hàng mua sản phẩm và có thể đổi trả trong vòng 7 ngày nếu khách hàng không hài lòng." },
        { keywords: ["giày chính hãng", "hợp lệ", "uy tín"], response: "Tất cả giày bán tại Step Up đều là giày chính hãng." },
        { keywords: ["giao hàng", "khi nào nhận được hàng"], response: "Thời gian ship hàng là 2-3 ngày kể từ khi nhận được đơn hàng." }
    ];

    // Tìm câu trả lời phù hợp
    let botResponse = "Xin lỗi, tôi không hiểu câu hỏi của bạn. Đây là tin nhắn tự động. Vui lòng liên hệ thông qua trang facebook chính thức.";
    for (const entry of keywordResponses) {
        if (entry.keywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
            botResponse = entry.response;
            break;
        }
    }

    // Tạo tin nhắn bot trả lời
    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerText = botResponse;
    messageArea.appendChild(botMessage);

    // Cuộn xuống dưới khi có tin nhắn mới
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Hàm cuộn xuống dưới cùng của khung chat
function scrollToBottom() {
    const messageArea = document.getElementById("messages");
    messageArea.scrollTop = messageArea.scrollHeight;
}
window.onload = loadChatHistory;