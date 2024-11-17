// DOM要素取得
const bookCards = document.getElementById('book-cards');
const addBookBtn = document.getElementById('add-book-btn');
const bookTitleInput = document.getElementById('book-title');
const bookCoverInput = document.getElementById('book-cover');
const themeLightBtn = document.getElementById('theme-light');
const themeDarkBtn = document.getElementById('theme-dark');

// 本のデータ管理
let books = JSON.parse(localStorage.getItem('books')) || [];

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
  books.forEach(addBookCard);
});

// 本を追加
addBookBtn.addEventListener('click', () => {
  const title = bookTitleInput.value.trim();
  const coverFile = bookCoverInput.files[0];

  if (title && coverFile) {
    const reader = new FileReader();
    reader.onload = () => {
      const book = { title, cover: reader.result, progress: 0 };
      books.push(book);
      addBookCard(book);
      saveBooks();
      bookTitleInput.value = '';
      bookCoverInput.value = '';
    };
    reader.readAsDataURL(coverFile);
  } else {
    alert('本のタイトルと表紙画像を入力してください。');
  }
});

// 本のカードをUIに追加
function addBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.innerHTML = `
    <img src="${book.cover}" alt="${book.title}">
    <h3>${book.title}</h3>
    <progress value="${book.progress}" max="100"></progress>
    <button class="progress-btn">+10%</button>
  `;

  const progressBar = card.querySelector('progress');
  const progressBtn = card.querySelector('.progress-btn');

  progressBtn.addEventListener('click', () => {
    book.progress = Math.min(book.progress + 10, 100);
    progressBar.value = book.progress;
    saveBooks();
  });

  bookCards.appendChild(card);
}

// 本のデータを保存
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// テーマ変更
themeLightBtn.addEventListener('click', () => document.body.classList.remove('theme-dark'));
themeDarkBtn.addEventListener('click', () => document.body.classList.add('theme-dark'));

