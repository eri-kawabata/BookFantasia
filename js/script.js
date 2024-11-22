const bookCards = document.getElementById('book-cards');
const addBookBtn = document.getElementById('add-book-btn');
const bookTitleInput = document.getElementById('book-title');
const bookCoverInput = document.getElementById('book-cover');
const tagDropdown = document.getElementById('tag-dropdown');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');
const themeToggle = document.getElementById('theme-toggle');
const modal = document.getElementById('modal');
const modalBookCover = document.getElementById('modal-book-cover');
const modalBookTitle = document.getElementById('modal-book-title');
const modalBookTags = document.getElementById('modal-book-tags');
const closeModal = document.querySelector('.close-modal');
const statusDropdown = document.getElementById('status-dropdown');

// タグの定義
const tags = ['ミステリー', 'サスペンス', 'SF', 'ホラー', 'ファンタジー', 'エッセイ', 'ノンフィクション', '漫画'];
let books = JSON.parse(localStorage.getItem('books')) || [];

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    applySavedTheme();
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
    document.body.className = theme; // 直接クラスを設定
    themeToggle.textContent = theme === 'dark-mode' ? '☀️' : '🌙';
    saveTheme(theme);
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    setTheme(savedTheme);
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// 本カード作成
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = `book-card status-${getStatusClass(book.status)}`;
    card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" class="book-cover">
        <h3>${book.title}</h3>
        <p>タグ: ${book.tags.join(', ')}</p>
        <p>
            <select onchange="updateBookStatus('${book.title}', this.value)">
                <option value="未読" ${book.status === '未読' ? 'selected' : ''}>未読</option>
                <option value="読書中" ${book.status === '読書中' ? 'selected' : ''}>読書中</option>
                <option value="読了" ${book.status === '読了' ? 'selected' : ''}>読了</option>
            </select>
        </p>
        <button class="btn-details">詳細を見る</button>
    `;
    card.querySelector('.btn-details').addEventListener('click', () => openModal(book));
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

// 本を追加
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
        books.push({
            title,
            tags: [selectedTag],
            status,
            cover: reader.result,
        });
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

// モーダルを開く
function openModal(book) {
    modalBookCover.src = book.cover;
    modalBookTitle.textContent = book.title;
    modalBookTags.textContent = `タグ: ${book.tags.join(', ')}`;
    modal.style.display = 'flex';
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

