// dotenv を使って環境変数を読み込む
if (typeof process !== "undefined") {
    require('dotenv').config(); // .env ファイルを読み込む
}

var config = {
  apiKey: "AIzaSyBI_EseIy_MW_oIlT7w5nV9RZBYxPdHkss",
  authDomain: "bookfantasia-9c1a0.firebaseapp.com",
  databaseURL: "https://bookfantasia-9c1a0-default-rtdb.firebaseio.com",
  projectId: "bookfantasia-9c1a0",
  storageBucket: "bookfantasia-9c1a0.firebasestorage.app",
  messagingSenderId: "737526103482",
  appId: "1:737526103482:web:6d16d28e4525e30bbf3183"
};
firebase.initializeApp(config);

// DOM取得
var inputarea = document.getElementById('input-area');
var newuser = document.getElementById('newuser');
var login = document.getElementById('login');
var logout = document.getElementById('logout');
var info = document.getElementById('info');

// 新規登録処理
newuser.addEventListener('click', function () {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // メールアドレスからユーザーネームを生成
    var username = email.split('@')[0];

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;

            // プロフィールに displayName を設定
            return user.updateProfile({
                displayName: username
            }).then(() => user.reload()); // 再読み込みして最新データを反映
        })
        .then(() => {
            showMessage("登録に成功しました！", "white");
        })
        .catch((error) => {
            showMessage(`登録できません: ${error.message}`, "white");
        });
});

// ログイン処理
login.addEventListener('click', function () {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            info.textContent = ""; // UIリセット
        })
        .catch((error) => {
            showMessage(`ログインできません: ${error.message}`, "white");
        });
});

// ログアウト処理
logout.addEventListener('click', function () {
    firebase.auth().signOut()
        .then(() => {
            showMessage("ログアウトしました。", "white");
            logoutDisplay();
        });
});

// 認証状態の確認
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        loginDisplay(user.displayName);
    } else {
        logoutDisplay();
    }
});

// ログイン時のUI更新
function loginDisplay(username) {
    logout.classList.remove('hide');
    inputarea.classList.add('hide');

    // displayName が null の場合メールアドレスの一部を使用
    if (!username || username === "null") {
        var user = firebase.auth().currentUser;
        if (user && user.email) {
            username = user.email.split('@')[0]; // メールアドレスの@の前を取得
        } else {
            username = "ゲスト"; // 万が一何も取得できない場合のデフォルト
        }
    }

    showMessage(`ようこそ、${username} さん！`, "white");

    info.style.opacity = "0";
    info.style.transform = "translateX(-50%) scale(0.5)";
    setTimeout(() => {
        info.style.opacity = "1";
        info.style.transform = "translateX(-50%) scale(1)";
    }, 100);
}

// ログアウト時のUI更新
function logoutDisplay() {
    logout.classList.add('hide');
    inputarea.classList.remove('hide');
    info.textContent = "";
    info.style.opacity = "0";
    info.style.transform = "translateX(-50%) scale(0.5)";
}

// メッセージ表示の共通関数
function showMessage(message, color) {
  info.textContent = message;
  info.style.color = color;
}
