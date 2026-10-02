const CARDS = [
  { front: '안녕하세요', back: 'Hello',       roman: 'annyeonghaseyo' },
  { front: '감사합니다', back: 'Thank you',   roman: 'gamsahamnida'  },
  { front: '네',         back: 'Yes',         roman: 'ne'            },
  { front: '아니요',     back: 'No',          roman: 'aniyo'         },
  { front: '물',         back: 'Water',       roman: 'mul'           },
  { front: '밥',         back: 'Rice / Meal', roman: 'bap'           },
  { front: '사람',       back: 'Person',      roman: 'saram'         },
  { front: '친구',       back: 'Friend',      roman: 'chingu'        },
  { front: '학교',       back: 'School',      roman: 'hakgyo'        },
  { front: '선생님',     back: 'Teacher',     roman: 'seonsaengnim'  },
  { front: '학생',       back: 'Student',     roman: 'haksaeng'      },
  { front: '책',         back: 'Book',        roman: 'chaek'         },
  { front: '집',         back: 'House',       roman: 'jip'           },
  { front: '오늘',       back: 'Today',       roman: 'oneul'         },
  { front: '내일',       back: 'Tomorrow',    roman: 'naeil'         },
];

let deck = [...CARDS];
let index = 0;
let flipped = false;

const $inner   = document.getElementById('card-inner');
const $front   = document.getElementById('card-front');
const $back    = document.getElementById('card-back');
const $roman   = document.getElementById('card-roman');
const $current = document.getElementById('card-current');
const $total   = document.getElementById('card-total');

$total.textContent = deck.length;

function render() {
  const c = deck[index];
  $front.textContent = c.front;
  $back.textContent  = c.back;
  $roman.textContent = c.roman;
  $current.textContent = index + 1;
  flipped = false;
  $inner.style.transform = 'rotateY(0deg)';

  // Track flip-views in GoatCounter
  if (window.goatcounter?.count) {
    window.goatcounter.count({ path: `flashcard/${c.front}`, title: `Card: ${c.front}`, event: true });
  }
}

document.getElementById('card').addEventListener('click', () => {
  flipped = !flipped;
  $inner.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
});

document.getElementById('next').addEventListener('click', () => {
  index = (index + 1) % deck.length;
  render();
});

document.getElementById('prev').addEventListener('click', () => {
  index = (index - 1 + deck.length) % deck.length;
  render();
});

document.getElementById('shuffle').addEventListener('click', () => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  index = 0;
  render();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') document.getElementById('next').click();
  if (e.key === 'ArrowLeft')  document.getElementById('prev').click();
  if (e.key === ' ')          { e.preventDefault(); document.getElementById('card').click(); }
});

render();