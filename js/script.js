// DOM要素取得
const bookCards = document.getElementById('book-cards');
const addBookBtn = document.getElementById('add-book-btn');
const bookTitleInput = document.getElementById('book-title');
const bookCoverInput = document.getElementById('book-cover');
const tagDropdown = document.getElementById('tag-dropdown');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');
const themeToggle = document.getElementById('theme-toggle');

// タグの定義
const tags = ['ミステリー', 'サスペンス', 'SF', 'ホラー', 'ファンタジー', 'エッセイ', 'ノンフィクション', '漫画'];

// ローカルストレージから本データを取得
let books = JSON.parse(localStorage.getItem('books')) || [];

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    applySavedTheme();
});

// アプリの初期化
function initializeApp() {
    try {
        renderBooksWithAnimation(books); // 本棚の初期データを表示
        updateTagDropdown(); // タグドロップダウンを更新
        updateTagFilter(); // タグフィルタを更新
    } catch (error) {
        console.error('初期化中にエラーが発生しました:', error);
    }
}

// テーマ切り替え
themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    setTheme(isDarkMode ? 'light-mode' : 'dark-mode');
});

// テーマの設定
function setTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark-mode');
    document.body.classList.toggle('light-mode', theme === 'light-mode');
    themeToggle.textContent = theme === 'dark-mode' ? '☀️' : '🌙';
    saveTheme(theme);
}

// 保存されたテーマを適用
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    setTheme(savedTheme);
}

// 現在のテーマを保存
function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// 本を追加
addBookBtn.addEventListener('click', (event) => {
    event.preventDefault(); // フォーム送信を防ぐ
    try {
        const title = bookTitleInput.value.trim();
        const coverFile = bookCoverInput.files[0];
        const selectedTag = tagDropdown.value;

        if (!title || !coverFile || !selectedTag) {
            alert('すべてのフィールドを入力してください。');
            return;
        }

        if (!coverFile.type.startsWith('image/')) {
            alert('画像ファイルを選択してください。');
            return;
        }

        if (coverFile.size > 2 * 1024 * 1024) { // 2MB制限
            alert('画像ファイルは2MB以下である必要があります。');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const book = {
                title,
                tags: [selectedTag],
                cover: reader.result,
            };

            books.push(book);
            saveBooks();
            renderBooksWithAnimation(books);
            resetForm();
        };
        reader.readAsDataURL(coverFile);
    } catch (error) {
        console.error('本の追加中にエラー:', error);
    }
});

// 本棚をレンダリング（アニメーション付き）
function renderBooksWithAnimation(filteredBooks) {
    bookCards.innerHTML = ''; // 現在の表示をクリア
    filteredBooks.forEach((book, index) => {
        const card = createBookCard(book);
        card.classList.add('tarot-animation');
        card.style.animationDelay = `${index * 0.1}s`; // 順次アニメーション
        bookCards.appendChild(card);
    });
}

// 本のカードを作成
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" class="book-cover">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-tags">${book.tags.join(', ')}</p>
    `;
    return card;
}

// タグフィルタと検索の処理
function renderFilteredBooks() {
    const selectedTag = tagFilter.value;
    const searchQuery = searchInput.value.toLowerCase().trim();

    const filteredBooks = books.filter(book => {
        const matchesTag = selectedTag === '' || book.tags.includes(selectedTag);
        const matchesSearch = searchQuery === '' || book.title.toLowerCase().includes(searchQuery);
        return matchesTag && matchesSearch;
    });

    renderBooksWithAnimation(filteredBooks);
}

// タグフィルタの更新
tagFilter.addEventListener('change', renderFilteredBooks);
searchInput.addEventListener('input', renderFilteredBooks);

// タグドロップダウンの更新
function updateTagDropdown() {
    tagDropdown.innerHTML = `
        <option value="" disabled selected>タグを選択</option>
        ${tags.map(tag => `<option value="${tag}">${tag}</option>`).join('')}
    `;
}

// 本の保存
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

// フォームのリセット
function resetForm() {
    bookTitleInput.value = '';
    bookCoverInput.value = '';
    tagDropdown.value = '';
}
