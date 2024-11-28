// Firebaseの設定を初期化
firebase.initializeApp(window.ENV);

// DOM取得
const inputarea = document.getElementById('input-area');
const newuser = document.getElementById('newuser');
const login = document.getElementById('login');
const logout = document.getElementById('logout');
const info = document.getElementById('info');

// 新規登録処理
newuser.addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const username = email.split('@')[0];

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user.updateProfile({
                displayName: username,
            }).then(() => user.reload());
        })
        .then(() => {
            console.log("登録成功");
            showMessage("登録に成功しました！", "success");
        })
        .catch((error) => {
            console.error("登録エラー:", error);
            showMessage(`登録できません: ${error.message}`, "error");
        });
});

// ログイン処理
login.addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log("ログイン成功");
        })
        .catch((error) => {
            console.error("ログインエラー:", error);
            showMessage(`ログインできません: ${error.message}`, "error");
        });
});

// ログアウト処理
logout.addEventListener('click', function () {
    firebase.auth().signOut()
        .then(() => {
            console.log("ログアウト完了");
            showMessage("ログアウトしました。", "success");
            logoutDisplay();
        });
});

// 認証状態の確認
firebase.auth().onAuthStateChanged(function (user) {
    console.log("認証状態の変更:", user);
    if (user) {
        const username = user.displayName || user.email.split('@')[0] || "ゲスト";
        loginDisplay(username);
    } else {
        logoutDisplay();
    }
});

// ログイン時のUI更新
function loginDisplay(username) {
    logout.classList.remove('hide');
    inputarea.classList.add('hide');

    if (!username || username === "null") {
        const user = firebase.auth().currentUser;
        username = user?.displayName || user?.email?.split('@')[0] || "ゲスト";
    }

    console.log("ログイン時のユーザー名:", username);
    showMessage(`ようこそ、${username} さん！`, "success");
}

// ログアウト時のUI更新
function logoutDisplay() {
    logout.classList.add('hide');
    inputarea.classList.remove('hide');
    info.textContent = "";
    info.style.opacity = "0";
    info.style.transform = "translateX(-50%) scale(0.5)";
}

function showMessage(message, type) {
    info.textContent = message;

    // メッセージタイプに応じたスタイル設定
    if (type === "success") {
        info.style.color = "white";
        info.style.backgroundColor = "green";
    } else if (type === "error") {
        info.style.color = "white";
        info.style.backgroundColor = "red";
    } else {
        info.style.color = "black";
        info.style.backgroundColor = "lightgrey";
    }

    // 常に表示し続けるのでタイマーは削除
    info.style.opacity = "1";
    info.style.transform = "translateX(-50%) scale(1)";
}

