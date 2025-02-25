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
            sendBotMessage('Book Haven là một trang web bán sách trực tuyến, chuyên cung cấp các cuốn sách đa dạng từ nhiều thể loại khác nhau, bao gồm các sách tự xuất bản của tác giả. Với sứ mệnh hỗ trợ các tác giả tự xuất bản, Book Haven không chỉ cung cấp nền tảng xuất bản dễ dàng mà còn giúp các tác giả xây dựng thương hiệu và tăng cường sự hiện diện trực tuyến.');
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
        { text: "Sách đang bán chạy nhất ở đây là gì?", answer: "Sách bán chạy nhất hiện nay là 'Cô gái đến từ hôm qua' của tác giả Nguyễn Nhật Ánh." },
        { text: "Chính sách bảo hành ở đây là gì?", answer: " Mỗi sản phẩm đều có chính sách bảo hành riêng, nhưng có thể đổi trả trong vòng 7 ngày nếu sách bị lỗi." },
        { text: "Shop có bán sách chính hãng không?", answer: "Tất cả sách bán tại Book Haven đều là sách chính hãng." }
    ];


    if (messageArea) {
        const questions = [
            { text: "Sách đang bán chạy nhất ở đây là gì?", answer: "Sách bán chạy nhất hiện nay là 'Cô gái đến từ hôm qua' của tác giả Nguyễn Nhật Ánh." },
            { text: "Chính sách bảo hành ở đây là gì?", answer: "Sách không có chính sách bảo hành, nhưng có thể đổi trả trong vòng 7 ngày nếu sách bị lỗi." },
            { text: "Shop có bán sách chính hãng không?", answer: "Tất cả sách bán tại Book Haven đều là sách chính hãng." }
        ];


        questions.forEach((question) => {
            const button = document.createElement("button");
            button.innerText = question.text;
            button.onclick = function () {
                sendAnswer(question.answer, button);
            };
            messageArea.appendChild(button); // Thêm câu hỏi vào messageArea
        });
    }

    questions.forEach(question => {
        const button = document.createElement("button");
        button.innerText = question.text;
        button.onclick = function() {
            sendAnswer(question.answer, button);
        };
        messageArea.appendChild(button);  // Thêm câu hỏi vào messageArea
    });

}

function sendAnswer(answer, questionButton) {
    const messageArea = document.getElementById("messages");

    // Tạo tin nhắn bot
    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");

    // Kiểm tra nếu câu trả lời chứa một URL
    const linkRegex = /https?:\/\/[^\s]+/g;
    const containsLink = answer.match(linkRegex);

    if (containsLink) {
        // Nếu câu trả lời có chứa đường link, thay thế URL bằng thẻ <a>
        answer = answer.replace(linkRegex, function(url) {
            return `<a href="${url}" target="_blank">${url}</a>`;
        });

        botMessage.innerHTML = answer;  // Dùng innerHTML để có thể hiển thị đường link
    } else {
        botMessage.innerText = answer;  // Nếu không có URL, dùng innerText để tránh thẻ HTML
    }

    messageArea.appendChild(botMessage);

    // Cuộn xuống cuối cùng để thấy tin nhắn mới
    messageArea.scrollTop = messageArea.scrollHeight;

    // Xóa câu hỏi đã được nhấn
    if (questionButton) {
        questionButton.remove();
    }

    scrollToBottom(); // Cuộn xuống cuối sau khi gửi câu trả lời
};

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
        { keywords: ["chào shop", "hi", "hello", "dạ chào shop"], response: "Chào bạn, tôi là bot của shop bán sách Book Haven, mọi câu trả lời của tôi được lập trình sẵn. Nếu cần tư vấn riêng hãy liên hệ trang facebook cá nhân của shop." },
        { keywords: ["địa chỉ cửa hàng", "cửa hàng ở đâu"], response: "Hiện tại cửa hàng đang ở 12 Trần Quốc Toản, phường 8, quận 3." },
        { keywords: ["sách bán chạy", "sách hot", "best seller"], response: "Sách bán chạy nhất hiện nay là 'Cô gái đến từ hôm qua' của tác giả Nguyễn Nhật Ánh." },
        { keywords: ["bảo hành", "đổi trả"], response: "Sách không có chính sách bảo hành, nhưng có thể đổi trả trong vòng 7 ngày nếu sách bị lỗi." },
        { keywords: ["sách chính hãng", "hợp lệ", "uy tín"], response: "Tất cả sách bán tại Book Haven đều là sách chính hãng." },
        { keywords: ["giao hàng"], response: "Thời gian ship hàng là 2-3 ngày kể từ khi nhận được đơn hàng." },
        { keywords: ["mượn sách", "thuê sách", "rent", "mướn sách"], response: "Shop chỉ bán sách chứ không cho thuê. Mong bạn thông cảm. (Bot Reply)" }
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