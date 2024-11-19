// DOM要素取得
const bookCards = document.getElementById('book-cards');
const addBookBtn = document.getElementById('add-book-btn');
const bookTitleInput = document.getElementById('book-title');
const bookCoverInput = document.getElementById('book-cover');
const tagDropdown = document.getElementById('tag-dropdown');
const newTagInput = document.getElementById('new-tag-input');
const addTagBtn = document.getElementById('add-tag-btn');
const selectedTagsContainer = document.getElementById('tags-list');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');
const themeToggle = document.getElementById('theme-toggle');

let books = JSON.parse(localStorage.getItem('books')) || [];
let tags = new Set(['魔法', '冒険', 'ドラマ']); // 初期タグ
let selectedTags = [];

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    try {
        books.forEach(book => addBookCard(book)); // 本棚に初期データを表示
        updateTagDropdown(); // タグドロップダウンを更新
        updateTagFilter(); // 検索用タグフィルタを更新
        applySavedTheme(); // 保存されたテーマを適用
    } catch (error) {
        console.error('初期化中にエラーが発生しました:', error);
    }
});

// タグ選択処理
tagDropdown.addEventListener('change', (event) => {
    try {
        const selectedValue = event.target.value;

        if (selectedValue === 'add-new') {
            // 新しいタグを入力するUIを表示
            newTagInput.style.display = 'block';
            addTagBtn.style.display = 'inline-block';
        } else if (selectedValue && !selectedTags.includes(selectedValue)) {
            // 選択されたタグをリストに追加
            selectedTags.push(selectedValue);
            updateSelectedTags();
        }

        // ドロップダウンを初期状態に戻す
        tagDropdown.value = '';
    } catch (error) {
        console.error('タグ選択処理でエラー:', error);
    }
});

// 新しいタグを追加
addTagBtn.addEventListener('click', () => {
    try {
        const newTag = newTagInput.value.trim();

        if (newTag && !tags.has(newTag)) {
            tags.add(newTag);

            // 新しいタグをドロップダウンに追加
            const option = document.createElement('option');
            option.value = newTag;
            option.textContent = newTag;
            tagDropdown.appendChild(option);

            // 新しいタグを選択状態に追加
            selectedTags.push(newTag);
            updateSelectedTags();
        }

        // 入力欄をリセット
        newTagInput.value = '';
        newTagInput.style.display = 'none';
        addTagBtn.style.display = 'none';
    } catch (error) {
        console.error('新しいタグの追加中にエラー:', error);
    }
});

// 選択されたタグを更新
function updateSelectedTags() {
    try {
        selectedTagsContainer.textContent = selectedTags.join(', ');
    } catch (error) {
        console.error('選択されたタグの更新中にエラー:', error);
    }
}

// 本を追加
addBookBtn.addEventListener('click', () => {
    try {
        const title = bookTitleInput.value.trim();
        const coverFile = bookCoverInput.files[0];

        if (!title || !coverFile) {
            alert('タイトルと画像を入力してください！');
            return;
        }

        if (selectedTags.length === 0) {
            alert('少なくとも1つのタグを選択してください！');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const book = {
                title,
                tags: [...selectedTags],
                cover: reader.result,
            };

            books.push(book);
            saveBooks();
            addBookCard(book);

            // 入力をリセット
            bookTitleInput.value = '';
            bookCoverInput.value = '';
            selectedTags = [];
            updateSelectedTags();
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
            <img src="${book.cover}" alt="${book.title}" style="width: 100%; height: auto; border-radius: 5px;">
            <h3>${book.title}</h3>
            <p>${book.tags.join(', ')}</p>
        `;
        bookCards.appendChild(card);
    } catch (error) {
        console.error('本棚にカードを追加中にエラー:', error);
    }
}

// タグフィルタを更新
function updateTagFilter() {
    try {
        tagFilter.innerHTML = '<option value="">すべてのタグ</option>';
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

// ドロップダウン更新
function updateTagDropdown() {
    try {
        tagDropdown.innerHTML = `
            <option value="" disabled selected>タグを選択</option>
            ${Array.from(tags).map(tag => `<option value="${tag}">${tag}</option>`).join('')}
            <option value="add-new">+ 新しいタグを追加</option>
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
