// DOM要素取得
const bookCards = document.getElementById('book-cards');
const addBookBtn = document.getElementById('add-book-btn');
const bookTitleInput = document.getElementById('book-title');
const bookCoverInput = document.getElementById('book-cover');
const tagDropdown = document.getElementById('tag-dropdown');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');
const header = document.querySelector('.header'); // ヘッダーを取得
const themeToggle = document.getElementById('theme-toggle');
const modal = document.getElementById('modal');
const modalBookCover = document.getElementById('modal-book-cover');
const modalBookTitle = document.getElementById('modal-book-title');
const modalBookTags = document.getElementById('modal-book-tags');
const modalBookDate = document.getElementById('modal-book-date');
const modalBookStatus = document.getElementById('modal-book-status');
const modalEditTitle = document.getElementById('modal-edit-title');
const modalSaveBtn = document.getElementById('modal-save-btn');
const modalDeleteBtn = document.getElementById('modal-delete-btn');
const closeModal = document.querySelector('.close-modal');
const statusDropdown = document.getElementById('status-dropdown');
const sortOptions = document.getElementById('sort-options');

// タグの定義
const tags = ['ミステリー', 'サスペンス', 'SF', 'ホラー', 'ファンタジー', 'エッセイ', 'ノンフィクション', '漫画'];
let books = JSON.parse(localStorage.getItem('books')) || [];

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    applySavedTheme();
    loadSavedSortOption();
});

// アプリの初期化
function initializeApp() {
    renderBooksWithAnimation(books);
    updateTagDropdown();
    updateTagFilter();
}

// テーマ設定
themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    setTheme(isDarkMode ? 'light-mode' : 'dark-mode');
});

function setTheme(theme) {
    document.body.className = theme; // bodyにテーマを設定
    themeToggle.textContent = theme === 'dark-mode' ? '🌙' : '☀';

    // ヘッダーにテーマクラスを設定
    if (header) {
        header.className = `header ${theme}`;
    }

    saveTheme(theme); // 選択したテーマを保存
}

// 保存されたテーマを適用する関数
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode'; // デフォルトはダークモード
    setTheme(savedTheme); // 保存されたテーマを適用
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// 並び替え機能
sortOptions.addEventListener('change', () => {
    const sortValue = sortOptions.value;
    localStorage.setItem('sortOption', sortValue); // 並び替えオプションを保存
    sortBooks(sortValue);
});

function loadSavedSortOption() {
    const savedSortOption = localStorage.getItem('sortOption');
    if (savedSortOption) {
        sortOptions.value = savedSortOption;
        sortBooks(savedSortOption);
    }
}

function sortBooks(sortValue) {
    switch (sortValue) {
        case 'title-asc':
            books.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            books.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'tag-asc':
            books.sort((a, b) => (a.tags[0] || '').localeCompare(b.tags[0] || ''));
            break;
        case 'tag-desc':
            books.sort((a, b) => (b.tags[0] || '').localeCompare(a.tags[0] || ''));
            break;
        case 'date-asc':
            books.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            break;
        case 'date-desc':
            books.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        default:
            break;
    }
    renderBooksWithAnimation(books); // 並び替え後に再描画
}

// 本カード作成
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = `book-card status-${getStatusClass(book.status)}`;
    card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" class="book-cover">
        <h3>${book.title}</h3>
        <p>タグ: ${book.tags.join(', ')}</p>
    `;

    // 本カード全体をクリックでモーダルを開く
    card.addEventListener('click', () => openModal(book));

    return card;
}

// ステータスクラス名取得
function getStatusClass(status) {
    switch (status) {
        case '未読': return 'unread';
        case '読書中': return 'reading';
        case '読了': return 'finished';
        default: return 'unread';
    }
}

// ステータス変更
function updateBookStatus(title, newStatus) {
    const book = books.find(b => b.title === title);
    if (book) {
        book.status = newStatus;
        saveBooks();
        renderBooksWithAnimation(books);
    }
}

// 本を追加する際に追加日を設定
addBookBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const title = bookTitleInput.value.trim();
    const coverFile = bookCoverInput.files[0];
    const selectedTag = tagDropdown.value;
    const status = statusDropdown.value;

    if (!title || !coverFile || !selectedTag || !status) {
        alert('すべてのフィールドを入力してください。');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const book = {
            title,
            tags: [selectedTag],
            cover: reader.result,
            status,
            dateAdded: new Date().toISOString() // 追加日をISOフォーマットで保存
        };
        books.push(book);
        saveBooks();
        renderBooksWithAnimation(books);
        resetForm();
    };
    reader.readAsDataURL(coverFile);
});

// 本棚をレンダリング
function renderBooksWithAnimation(filteredBooks) {
    bookCards.innerHTML = '';
    filteredBooks.forEach((book, index) => {
        const card = createBookCard(book);
        card.style.animationDelay = `${index * 0.1}s`;
        bookCards.appendChild(card);
    });
}

function sortBooks(sortValue) {
    switch (sortValue) {
        case 'title-asc':
            books.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            books.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'tag-asc':
            books.sort((a, b) => (a.tags[0] || '').localeCompare(b.tags[0] || ''));
            break;
        case 'tag-desc':
            books.sort((a, b) => (b.tags[0] || '').localeCompare(a.tags[0] || ''));
            break;
        case 'date-asc':
            books.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            break;
        case 'date-desc':
            books.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        default:
            break;
    }

    // 並び替え後にアニメーションを適用
    renderBooksWithAnimation(books);
}

function renderBooksWithAnimation(filteredBooks) {
    bookCards.innerHTML = ''; // 本棚を一度空にする
    filteredBooks.forEach((book, index) => {
        const card = createBookCard(book);

        // アニメーションを順番に適用するために遅延を追加
        card.style.animationDelay = `${index * 0.1}s`;

        // アニメーションクラスを適用
        card.classList.add('tarot-animation');

        // アニメーション終了後にクラスを削除してリセット（再適用可能にする）
        card.addEventListener('animationend', () => {
            card.classList.remove('tarot-animation');
        });

        bookCards.appendChild(card);
    });
}


// モーダルを開く
function openModal(book) {
    modalBookCover.src = book.cover;
    modalBookTitle.textContent = book.title;
    modalBookTags.textContent = `タグ: ${book.tags.join(', ')}`;

    // 日付をフォーマットして表示
    const formattedDate = new Date(book.dateAdded).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    modalBookDate.textContent = `追加日: ${formattedDate}`;

    // ステータス変更用のドロップダウンを作成
    modalBookStatus.innerHTML = ''; // クリア
    ['未読', '読書中', '読了'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        if (book.status === status) option.selected = true;
        modalBookStatus.appendChild(option);
    });

    modalBookStatus.addEventListener('change', () => updateBookStatus(book.title, modalBookStatus.value));

    // 編集用タイトルフィールド
    modalEditTitle.value = book.title;

    // 削除ボタンの設定
    modalDeleteBtn.onclick = () => deleteBook(book.title);

    // 保存ボタンで編集内容を反映
    modalSaveBtn.onclick = () => {
        const newTitle = modalEditTitle.value.trim();
        if (newTitle) {
            book.title = newTitle;
            saveBooks();
            renderBooksWithAnimation(books);
            modal.style.display = 'none';
        } else {
            alert('タイトルを入力してください。');
        }
    };

    modal.style.display = 'flex';
}

// 本を削除
function deleteBook(title) {
    books = books.filter(book => book.title !== title);
    saveBooks();
    renderBooksWithAnimation(books);
    modal.style.display = 'none';
}

// モーダルを閉じる
closeModal.addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = 'none';
});

// タグフィルタ
function renderFilteredBooks() {
    const selectedTag = tagFilter.value;
    const searchQuery = searchInput.value.toLowerCase().trim();
    const filteredBooks = books.filter(book =>
        (selectedTag === '' || book.tags.includes(selectedTag)) &&
        (searchQuery === '' || book.title.toLowerCase().includes(searchQuery))
    );
    renderBooksWithAnimation(filteredBooks);
}

tagFilter.addEventListener('change', renderFilteredBooks);
searchInput.addEventListener('input', renderFilteredBooks);

// 更新処理
function updateTagDropdown() {
    tagDropdown.innerHTML = `
        <option value="" disabled selected>タグを選択</option>
        ${tags.map(tag => `<option value="${tag}">${tag}</option>`).join('')}
    `;
}

function updateTagFilter() {
    tagFilter.innerHTML = `<option value="">タグで検索</option>`;
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function resetForm() {
    bookTitleInput.value = '';
    bookCoverInput.value = '';
    tagDropdown.value = '';
    statusDropdown.value = '';
}
