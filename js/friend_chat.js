import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase 初期化
const firebaseConfig = {
    apiKey: "AIzaSyApe3uZ0XSxtX45ZBxtRaPH4PnFmc-vRl8",
    authDomain: "bookfantasia-chat.firebaseapp.com",
    databaseURL: "https://bookfantasia-chat-default-rtdb.firebaseio.com",
    projectId: "bookfantasia-chat",
    storageBucket: "bookfantasia-chat.firebasestorage.app",
    messagingSenderId: "315091292226",
    appId: "1:315091292226:web:6280a716d34703ab629ddb"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM要素取得
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const chatWindow = document.getElementById("chat-window");
const friendList = document.getElementById("friend-list");
const addFriendForm = document.getElementById("add-friend-form");
const friendIdInput = document.getElementById("friend-id-input");

// ログイン中のユーザー
let userId = null;

// ログイン状態の確認
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        loadFriends(); // フレンド一覧をロード
    } else {
        alert("ログインが必要です。");
        window.location.href = "./index.html";
    }
});

// フレンド追加
addFriendForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const friendId = friendIdInput.value.trim();

    if (friendId && userId) {
        const userFriendsRef = ref(db, `users/${userId}/friends/${friendId}`);
        set(userFriendsRef, true).then(() => {
            alert("フレンドを追加しました！");
            friendIdInput.value = "";
            loadFriends(); // 再読み込み
        });
    }
});

// フレンド一覧のロード
function loadFriends() {
    const userFriendsRef = ref(db, `users/${userId}/friends`);
    get(userFriendsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const friends = snapshot.val();
            renderFriends(Object.keys(friends));
        } else {
            friendList.innerHTML = "<li>フレンドがいません。</li>";
        }
    });
}

// フレンド一覧の表示
function renderFriends(friendIds) {
    friendList.innerHTML = "";
    friendIds.forEach((friendId) => {
        const li = document.createElement("li");
        li.textContent = friendId;
        li.addEventListener("click", () => {
            alert(`フレンド ${friendId} とチャットを開始します。`);
            startChatWith(friendId);
        });
        friendList.appendChild(li);
    });
}

// フレンドとチャットを開始
function startChatWith(friendId) {
    console.log(`フレンド ${friendId} とのチャットを開始します。`);
    // チャットルームの作成や切り替えのロジックを追加
}
