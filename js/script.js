const bookCards = document.getElementById('book-cards');
const addBookBtn = document.getElementById('add-book-btn');
const bookTitleInput = document.getElementById('book-title');
const bookCoverInput = document.getElementById('book-cover');
const tagDropdown = document.getElementById('tag-dropdown');
const selectedTagsContainer = document.getElementById('tags-list');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');
const themeToggle = document.getElementById('theme-toggle');

let books = JSON.parse(localStorage.getItem('books')) || [];
const tags = ['ミステリー', 'サスペンス', 'SF', 'ホラー', 'ファンタジー', 'エッセイ', 'ノンフィクション', '漫画'];
let selectedTags = [];

// 初期化処理
document.addEventListener('DOMContentLoaded', () => initializeApp());

function initializeApp() {
    try {
        // 本棚の初期データを表示
        books.forEach(addBookCard);

        // タグの初期設定
        updateTagDropdown();
        updateTagFilter();

        // テーマの適用
        applySavedTheme();
    } catch (error) {
        console.error('初期化中にエラーが発生しました:', error);
    }
}

// タグ選択処理（追加）
tagFilter.addEventListener('change', () => {
    try {
        const selectedTag = tagFilter.value;

        if (selectedTag === '') {
            renderBooks(books); // すべて表示
        } else {
            const filteredBooks = books.filter(book => book.tags.includes(selectedTag));
            renderBooks(filteredBooks); // 選択されたタグに一致する本を表示
        }
    } catch (error) {
        console.error('タグフィルタ処理でエラー:', error);
    }
});

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

        const reader = new FileReader();
        reader.onload = () => {
            const book = {
                title,
                tags: [selectedTag], // 選択されたタグのみ
                cover: reader.result,
            };

            books.push(book);
            saveBooks();
            addBookCard(book);
            resetForm(); // フォームをリセット
        };
        reader.readAsDataURL(coverFile);
    } catch (error) {
        console.error('本の追加中にエラー:', error);
    }
});

// 本棚にカードを追加
function addBookCard(book) {
    try {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${book.cover}" alt="${book.title}" class="book-cover">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-tags">${book.tags.join(', ')}</p>
        `;
        bookCards.appendChild(card);
    } catch (error) {
        console.error('本棚にカードを追加中にエラー:', error);
    }
}

// 本をレンダリング（再利用可能関数）
function renderBooks(filteredBooks) {
    bookCards.innerHTML = ''; // 現在の表示をクリア
    filteredBooks.forEach(addBookCard); // 新しいデータを表示
}

// タグフィルタを更新
function updateTagFilter() {
    try {
        tagFilter.innerHTML = '<option value="">タグで検索</option>';
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
    } catch (error) {
        console.error('タグフィルタの更新中にエラー:', error);
    }
}

// タグフィルタ処理（タロットカード風アニメーション追加）
tagFilter.addEventListener('change', () => {
    try {
        const selectedTag = tagFilter.value;

        if (selectedTag === '') {
            renderBooksWithAnimation(books); // すべて表示
        } else {
            const filteredBooks = books.filter(book => book.tags.includes(selectedTag));
            renderBooksWithAnimation(filteredBooks); // 選択されたタグに一致する本を表示
        }
    } catch (error) {
        console.error('タグフィルタ処理でエラー:', error);
    }
});

// 本をアニメーション付きでレンダリング
function renderBooksWithAnimation(filteredBooks) {
    bookCards.innerHTML = ''; // 現在の表示をクリア

    // タロットカード風の配置アニメーション
    filteredBooks.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = 'book-card tarot-animation';
        card.style.animationDelay = `${index * 0.1}s`; // 順次アニメーションを遅らせる
        card.innerHTML = `
            <img src="${book.cover}" alt="${book.title}" class="book-cover">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-tags">${book.tags.join(', ')}</p>
        `;
        bookCards.appendChild(card);
    });
}


// ドロップダウン更新
function updateTagDropdown() {
    try {
        tagDropdown.innerHTML = `
            <option value="" disabled selected>タグを選択</option>
            ${tags.map(tag => `<option value="${tag}">${tag}</option>`).join('')}
        `;
    } catch (error) {
        console.error('タグドロップダウンの更新中にエラー:', error);
    }
}

// 本の保存
function saveBooks() {
    try {
        localStorage.setItem('books', JSON.stringify(books));
    } catch (error) {
        console.error('本の保存中にエラー:', error);
    }
}

// フォームリセット
function resetForm() {
    bookTitleInput.value = '';
    bookCoverInput.value = '';
    tagDropdown.value = '';
    selectedTags = [];
    updateSelectedTags();
}

// テーマ切り替え
themeToggle.addEventListener('click', () => {
    try {
        const isDark = document.body.classList.toggle('theme-dark');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
        console.error('テーマ切り替え中にエラー:', error);
    }
});

// 保存されたテーマ適用
function applySavedTheme() {
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('theme-dark');
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
    } catch (error) {
        console.error('保存されたテーマ適用中にエラー:', error);
    }
}

