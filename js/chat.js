import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase データベース初期化
const db = getDatabase();

// DOM 要素取得
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatWindow = document.getElementById('chat-window');

// メッセージ送信
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message) {
        displayMessage(message, "you");

        const messagesRef = ref(db, 'messages');
        push(messagesRef, { text: message, sender: "you", timestamp: Date.now() });

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${window.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: message }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const reply = data.choices[0].message.content;
                displayMessage(reply, "ai");

                push(messagesRef, { text: reply, sender: "ai", timestamp: Date.now() });
            } else {
                console.error("ChatGPT API Error:", await response.text());
                displayMessage("AI の応答に失敗しました。", "ai");
            }
        } catch (error) {
            console.error("Network Error:", error);
            displayMessage("ネットワークエラーが発生しました。", "ai");
        }

        messageInput.value = "";
    }
});

// メッセージ受信
const messagesRef = ref(db, 'messages');
onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    displayMessage(data.text, data.sender);
});

// メッセージを画面に表示
function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'you' ? 'you' : 'ai');

    const messageContent = document.createElement('div');
    messageContent.textContent = message;
    messageElement.appendChild(messageContent);

    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    messageTime.textContent = new Date().toLocaleTimeString();
    messageElement.appendChild(messageTime);

    chatWindow.appendChild(messageElement);

    // 自動スクロール
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
