const tg = window.Telegram.WebApp;
tg.expand();

const grid = document.getElementById('grid');
const mineLabel = document.getElementById('mine-count');
const playBtn = document.getElementById('play-btn');
const btnText = document.getElementById('btn-text');
const cdBar = document.getElementById('cd-progress');

let mines = 3;
const config = { 1: 7, 3: 5, 5: 4, 7: 3 };
const levels = [1, 3, 5, 7];
const starIcon = `<svg class="star-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;

function createGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        grid.appendChild(cell);
    }
}

function changeMines(step) {
    let idx = levels.indexOf(mines) + step;
    if (idx >= 0 && idx < levels.length) {
        mines = levels[idx];
        mineLabel.innerText = mines;
    }
}

function runPrediction() {
    createGrid(); 
    playBtn.disabled = true;

    const starCount = config[mines];
    const cells = Array.from({length: 25}, (_, i) => i);
    const selected = cells.sort(() => Math.random() - 0.5).slice(0, starCount);

    selected.forEach((cellIdx, i) => {
        setTimeout(() => {
            const cell = grid.children[cellIdx];
            cell.classList.add('active');
            cell.innerHTML = starIcon;
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        }, i * 400); // Немного ускорил появление
    });

    handleCooldown(10);
}

function handleCooldown(duration) {
    let time = duration;
    btnText.innerText = time;
    
    const timer = setInterval(() => {
        time--;
        btnText.innerText = time;
        cdBar.style.width = ((duration - time) / duration * 100) + '%';

        if (time <= 0) {
            clearInterval(timer);
            playBtn.disabled = false;
            btnText.innerText = 'Play';
            cdBar.style.width = '0%';
        }
    }, 1000);
}

createGrid();