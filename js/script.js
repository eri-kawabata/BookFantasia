// DOM要素取得
const bookCards = document.getElementById('book-cards');
const addBookBtn = document.getElementById('add-book-btn');
const bookTitleInput = document.getElementById('book-title');
const bookCoverInput = document.getElementById('book-cover');
const tagDropdown = document.getElementById('tag-dropdown');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');

let books = JSON.parse(localStorage.getItem('books')) || [];
const tags = ['ミステリー', 'サスペンス', 'SF', 'ホラー', 'ファンタジー', 'エッセイ', 'ノンフィクション', '漫画'];

// 初期化処理
document.addEventListener('DOMContentLoaded', () => initializeApp());

function initializeApp() {
    try {
        books.forEach(addBookCard); // 本棚の初期データを表示
        updateTagDropdown();
        updateTagFilter();
    } catch (error) {
        console.error('初期化中にエラーが発生しました:', error);
    }
}

// タグフィルタと検索の統合レンダリング処理
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

// タグフィルタ処理
tagFilter.addEventListener('change', renderFilteredBooks);

// タイトル検索処理
searchInput.addEventListener('input', renderFilteredBooks);

// タロットカードアニメーションでレンダリング
function renderBooksWithAnimation(filteredBooks) {
    bookCards.innerHTML = ''; // 現在の表示をクリア

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
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" class="book-cover">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-tags">${book.tags.join(', ')}</p>
    `;
    bookCards.appendChild(card);
}

// タグフィルタを更新
function updateTagFilter() {
    tagFilter.innerHTML = '<option value="">タグで検索</option>';
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// ドロップダウン更新
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

// フォームリセット
function resetForm() {
    bookTitleInput.value = '';
    bookCoverInput.value = '';
    tagDropdown.value = '';
}


