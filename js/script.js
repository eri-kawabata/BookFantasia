// DOM要素取得
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

// ステータス変更ドロップダウン
    const statusDropdown = document.createElement('select');
    ['未読', '読書中', '読了'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        if (book.status === status) option.selected = true;
        statusDropdown.appendChild(option);
    });
    statusDropdown.addEventListener('change', () => updateBookStatus(book.title, statusDropdown.value));
    card.appendChild(statusDropdown);

// 詳細ボタン
    const detailsButton = document.createElement('button');
    detailsButton.className = 'btn-details';
    detailsButton.textContent = '詳細を見る';
    detailsButton.addEventListener('click', () => openModal(book));
  card.appendChild(detailsButton);

    // 編集ボタン
    const editButton = document.createElement('button');
    editButton.className = 'btn-edit';
    editButton.textContent = '編集';
    editButton.addEventListener('click', () => editBook(book));
  card.appendChild(editButton);

    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-delete';
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => deleteBook(book.title));
    card.appendChild(deleteButton);

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

// 削除機能
function deleteBook(title) {
    if (confirm('この本を削除しますか？')) {
        books = books.filter(book => book.title !== title);
        saveBooks();
        renderBooksWithAnimation(books);
    }
}

// 編集機能
function editBook(book) {
    bookTitleInput.value = book.title;
    tagDropdown.value = book.tags[0] || '';
    statusDropdown.value = book.status;
    const saveButton = addBookBtn.cloneNode(true);
    saveButton.textContent = '保存';
    addBookBtn.replaceWith(saveButton);

    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        book.title = bookTitleInput.value.trim();
        book.tags = [tagDropdown.value];
        book.status = statusDropdown.value;
        saveBooks();
        renderBooksWithAnimation(books);
        resetForm();
        saveButton.replaceWith(addBookBtn);
    });
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
    const modalBookDate = document.getElementById('modal-book-date');
    modalBookDate.textContent = `追加日: ${formattedDate}`;

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
