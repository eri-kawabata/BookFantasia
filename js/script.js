// DOM要素取得
const bookCards = document.getElementById('book-cards');
const addBookBtn = document.getElementById('add-book-btn');
const bookTitleInput = document.getElementById('book-title');
const bookCoverInput = document.getElementById('book-cover');
const tagDropdown = document.getElementById('tag-dropdown');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');
const header = document.querySelector('.header');
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
const reviewModal = document.getElementById('review-modal');
const closeReviewModal = document.querySelector('.close-review-modal');
const reviewText = document.getElementById('review-text');
const saveReviewBtn = document.getElementById('save-review-btn');
const menuToggle = document.querySelector('.circle-menu');
const menuItems = document.querySelectorAll('.menu-item');


// タグの定義
const tags = ['ミステリー', 'サスペンス', 'SF', 'ホラー', 'ファンタジー', 'エッセイ', 'ノンフィクション', '漫画'];
let books = JSON.parse(localStorage.getItem('books')) || [];
let currentBookTitle = "";

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

// 星評価HTML生成（共通化）
function createStarRatingHTML(rating = 0) {
    return Array.from({ length: 5 }).map((_, i) =>
        `<span data-rating="${i + 1}" class="star ${i < rating ? 'selected' : ''}">★</span>`
    ).join('');
}

// テーマ設定
themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    setTheme(isDarkMode ? 'light-mode' : 'dark-mode');
});

function applyTheme(theme) {
    document.body.className = theme;
    const menu = document.querySelector('.circle-menu');
    menu.style.background = theme === 'dark-mode'
        ? 'linear-gradient(45deg, #3a1469, #1a237e)'
        : 'linear-gradient(45deg, #ff9800, #ff5722)';
}

function setTheme(theme) {
    document.body.className = theme;
    themeToggle.textContent = theme === 'dark-mode' ? '🌙' : '☀';
    if (header) header.className = `header ${theme}`;
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
    localStorage.setItem('sortOption', sortValue);
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
    const sortFunctions = {
        'title-asc': (a, b) => a.title.localeCompare(b.title),
        'title-desc': (a, b) => b.title.localeCompare(a.title),
        'tag-asc': (a, b) => (a.tags[0] || '').localeCompare(b.tags[0] || ''),
        'tag-desc': (a, b) => (b.tags[0] || '').localeCompare(a.tags[0] || ''),
        'date-asc': (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded),
        'date-desc': (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded),
    };
    books.sort(sortFunctions[sortValue]);
    renderBooksWithAnimation(books);
}

// 本カード作成
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = `book-card status-${getStatusClass(book.status)}`;
    card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" class="book-cover">
        <h3>${book.title}</h3>
        <p>タグ: ${book.tags.join(', ')}</p>
        <div class="star-rating">
            ${Array.from({ length: 5 }).map((_, i) => `
                <span class="star ${i < book.rating ? 'selected' : ''}">★</span>
            `).join('')}
        </div>
    `;
    card.addEventListener('click', () => openModal(book));
    return card;
}

function getStatusClass(status) {
    return status === '未読' ? 'unread' : status === '読書中' ? 'reading' : 'finished';
}

// 本を追加
addBookBtn.addEventListener('click', (event) => {
    event.preventDefault();
    addBookBtn.disabled = true;
    const title = bookTitleInput.value.trim();
    const coverFile = bookCoverInput.files[0];
    const selectedTag = tagDropdown.value;
    const status = statusDropdown.value;

    if (!title || !coverFile || !selectedTag || !status) {
        alert('すべてのフィールドを入力してください。');
        addBookBtn.disabled = false;
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const book = { title, tags: [selectedTag], cover: reader.result, status, dateAdded: new Date().toISOString(), review: '', rating: 0 };
        books.push(book);
        saveBooks();
        renderBooksWithAnimation(books);
        resetForm();
        addBookBtn.disabled = false;
    };
    reader.readAsDataURL(coverFile);
});

// 本棚をレンダリング
function renderBooksWithAnimation(filteredBooks) {
    bookCards.innerHTML = '';
    filteredBooks.forEach((book, index) => {
        const card = createBookCard(book);
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('tarot-animation');
        card.addEventListener('animationend', () => card.classList.remove('tarot-animation'));
        bookCards.appendChild(card);
    });
}

// モーダルの開閉
function openModal(book) {
    modalBookCover.src = book.cover;
    modalBookTitle.textContent = book.title;
    modalBookTags.textContent = `タグ: ${book.tags.join(', ')}`;
    modalBookDate.textContent = `追加日: ${new Date(book.dateAdded).toLocaleDateString('ja-JP')}`;
    modalBookStatus.innerHTML = ['未読', '読書中', '読了'].map(status =>
        `<option value="${status}" ${status === book.status ? 'selected' : ''}>${status}</option>`).join('');
    modalEditTitle.value = book.title;

    const starContainer = document.getElementById('modal-star-rating') || document.createElement('div');
    starContainer.id = 'modal-star-rating';
    starContainer.className = 'star-rating';
    starContainer.innerHTML = createStarRatingHTML(book.rating);
    starContainer.querySelectorAll('.star').forEach(star =>
        star.addEventListener('click', (e) => {
            book.rating = parseInt(e.target.dataset.rating, 10);
            saveBooks();
            openModal(book);
        }));
    modalBookTags.parentElement.appendChild(starContainer);

    modalDeleteBtn.onclick = () => deleteBook(book.title);
    modalSaveBtn.onclick = () => {
        const newTitle = modalEditTitle.value.trim();
        if (newTitle) {
            book.title = newTitle;
            saveBooks();
            renderBooksWithAnimation(books);
            modal.style.display = 'none';
        } else alert('タイトルを入力してください。');
    };
    modal.style.display = 'flex';
}

closeModal.addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', (event) => { if (event.target === modal) modal.style.display = 'none'; });

// 本の画像クリックで感想モーダルを開く
modalBookCover.addEventListener('click', () => {
    currentBookTitle = modalBookTitle.textContent; // 本のタイトルを取得
    const book = books.find(b => b.title === currentBookTitle);
    reviewText.value = book?.review || ""; // 保存済み感想を表示
    reviewModal.style.display = 'flex'; // モーダルを表示
});

// 感想モーダルを閉じる
closeReviewModal.addEventListener('click', () => {
    reviewModal.style.display = 'none';
});

// 感想を保存
saveReviewBtn.addEventListener('click', () => {
    const book = books.find(b => b.title === currentBookTitle);
    if (book) {
        book.review = reviewText.value; // 感想を保存
        saveBooks();
        alert('感想を保存しました！');
        toggleModal(reviewModal, false);
    }
});

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function resetForm() {
    bookTitleInput.value = '';
    bookCoverInput.value = '';
    tagDropdown.value = '';
    statusDropdown.value = '';
}

// フィルタリング
tagFilter.addEventListener('change', renderFilteredBooks);
searchInput.addEventListener('input', renderFilteredBooks);

function renderFilteredBooks() {
    const selectedTag = tagFilter.value;
    const searchQuery = searchInput.value.toLowerCase().trim();
    const filteredBooks = books.filter(book =>
        (selectedTag === '' || book.tags.includes(selectedTag)) &&
        (searchQuery === '' || book.title.toLowerCase().includes(searchQuery))
    );
    renderBooksWithAnimation(filteredBooks);
}

function updateTagDropdown() {
    tagDropdown.innerHTML = `<option value="" disabled selected>タグを選択</option>` + tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
}

function updateTagFilter() {
    tagFilter.innerHTML = `<option value="">タグで検索</option>` + tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
}

function deleteBook(title) {
    if (confirm(`"${title}" を削除してもよろしいですか？`)) {
        books = books.filter(b => b.title !== title);
        saveBooks();
        renderBooksWithAnimation(books);
        toggleModal(modal, false);
    }
}

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');

    if (menuToggle.classList.contains('open')) {
        const startAngle = Math.PI; // 左方向の180度
        const endAngle = Math.PI * 1.5; // 上方向の270度
        const angleStep = (endAngle - startAngle) / (menuItems.length - 1);
        const radius = 120; // 半径（px）

        menuItems.forEach((item, index) => {
            const angle = startAngle + index * angleStep;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            item.style.transform = `translate(${x}px, ${y}px)`;
        });
    } else {
        menuItems.forEach((item) => {
            item.style.transform = 'translate(0, 0)';
        });
    }
});