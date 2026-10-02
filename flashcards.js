/* ============================================================
   KAB Flashcards — Korean → Arabic
   ============================================================ */

const CARDS = [
  { front: '안녕하세요', back: 'مرحباً' },
  { front: '감사합니다', back: 'شكراً' },
  { front: '네',         back: 'نعم' },
  { front: '아니요',     back: 'لا' },
  { front: '물',         back: 'ماء' },
  { front: '밥',         back: 'أرز / طعام' },
  { front: '사람',       back: 'شخص' },
  { front: '친구',       back: 'صديق' },
  { front: '학교',       back: 'مدرسة' },
  { front: '선생님',     back: 'معلّم' },
  { front: '학생',       back: 'طالب' },
  { front: '책',         back: 'كتاب' },
  { front: '집',         back: 'بيت' },
  { front: '오늘',       back: 'اليوم' },
  { front: '내일',       back: 'غداً' },
];

let deck = [...CARDS];
let index = 0;
let flipped = false;

/* ---------- DOM references ---------- */
const $card     = document.getElementById('card');
const $front    = document.getElementById('card-front');
const $back     = document.getElementById('card-back');
const $current  = document.getElementById('card-current');
const $total    = document.getElementById('card-total');
const $bar      = document.getElementById('progress-bar');

$total.textContent = deck.length;

/* ---------- Render ---------- */
function render() {
  const c = deck[index];

  $front.textContent = c.front;
  $back.textContent  = c.back;
  $current.textContent = index + 1;

  const pct = ((index + 1) / deck.length) * 100;
  $bar.style.width = pct + '%';

  // Reset flip state on each new card
  flipped = false;
  $card.classList.remove('is-flipped');

  // GoatCounter tracking
  if (window.goatcounter?.count) {
    window.goatcounter.count({
      path: `flashcard/${c.front}`,
      title: `Card: ${c.front}`,
      event: true
    });
  }
}

/* ---------- Flip on card click ---------- */
$card.addEventListener('click', () => {
  flipped = !flipped;
  $card.classList.toggle('is-flipped', flipped);
});

/* ---------- Prev / Next ---------- */
document.getElementById('next').addEventListener('click', () => {
  index = (index + 1) % deck.length;
  render();
});

document.getElementById('prev').addEventListener('click', () => {
  index = (index - 1 + deck.length) % deck.length;
  render();
});

/* ---------- Shuffle ---------- */
function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  index = 0;
  render();
}

document.getElementById('shuffle-top').addEventListener('click', shuffle);

/* ---------- Keyboard shortcuts ---------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') document.getElementById('next').click();
  if (e.key === 'ArrowLeft')  document.getElementById('prev').click();
  if (e.key === ' ')          { e.preventDefault(); $card.click(); }
});

/* ---------- Initial paint ---------- */
render();