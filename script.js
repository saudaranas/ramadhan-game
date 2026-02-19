// GLOBAL VARIABLES
let score = 0;
let fastingDays = JSON.parse(localStorage.getItem('fastingDays')) || [];

// SCREEN MANAGEMENT
function showMenu() {
    playSound('click');
    hideAllScreens();
    document.getElementById('menuScreen').classList.add('active');
}

function backToMenu() {
    playSound('click');
    hideAllScreens();
    document.getElementById('menuScreen').classList.add('active');
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// GAME 1: TANGKAP BINTANG
function startGame(gameType) {
    playSound('click');
    hideAllScreens();
    
    if (gameType === 'catch') {
        document.getElementById('catchGame').classList.add('active');
        score = 0;
        updateScore();
        spawnStars();
    } else if (gameType === 'decorate') {
        document.getElementById('decorateGame').classList.add('active');
    } else if (gameType === 'iftar') {
        document.getElementById('iftarGame').classList.add('active');
        setupDragAndDrop();
    }
}

function spawnStars() {
    const gameArea = document.getElementById('gameArea');
    const stars = ['⭐', '✨', '🌟'];
    
    setInterval(() => {
        const star = document.createElement('div');
        star.className = 'falling-star';
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        star.style.left = Math.random() * 90 + '%';
        
        star.onclick = function() {
            catchStar(this);
        };
        
        gameArea.appendChild(star);
        
        setTimeout(() => {
            if (star.parentNode) {
                star.remove();
            }
        }, 3000);
    }, 1000);
}

function catchStar(starElement) {
    playSound('success');
    score++;
    updateScore();
    starElement.style.animation = 'sparkle 0.5s';
    setTimeout(() => starElement.remove(), 500);
    
    // Celebration effect
    if (score % 5 === 0) {
        celebrate();
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

// GAME 2: HIAS PELITA
function addDecoration(emoji) {
    playSound('click');
    const lantern = document.getElementById('lantern');
    const decoration = document.createElement('div');
    decoration.className = 'decoration';
    decoration.textContent = emoji;
    
    // Random position around lantern
    const angle = Math.random() * 360;
    const radius = 80 + Math.random() * 40;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    
    decoration.style.left = x + 'px';
    decoration.style.top = y + 'px';
    
    lantern.appendChild(decoration);
}

function clearDecoration() {
    playSound('click');
    const decorations = document.querySelectorAll('.decoration');
    decorations.forEach(d => d.remove());
}

// GAME 3: SEDIAKAN IFTAR
function setupDragAndDrop() {
    const plate = document.getElementById('plate');
    
    plate.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    plate.addEventListener('drop', function(e) {
        e.preventDefault();
        const food = e.dataTransfer.getData('food');
        addFoodToPlate(food);
    });
}

function drag(event) {
    event.dataTransfer.setData('food', event.target.dataset.food);
}

function addFoodToPlate(foodEmoji) {
    playSound('success');
    const plate = document.getElementById('plate');
    const food = document.createElement('div');
    food.className = 'food-on-plate';
    food.textContent = foodEmoji;
    
    // Random position on plate
    const x = (Math.random() - 0.5) * 80;
    const y = (Math.random() - 0.5) * 80;
    food.style.left = x + 'px';
    food.style.top = y + 'px';
    
    plate.appendChild(food);
}

// STICKER CHART
function showStickers() {
    playSound('click');
    hideAllScreens();
    document.getElementById('stickerScreen').classList.add('active');
    renderStickerChart();
}

function renderStickerChart() {
    const grid = document.getElementById('stickerGrid');
    grid.innerHTML = '';
    
    for (let day = 1; day <= 30; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'sticker-day';
        if (fastingDays.includes(day)) {
            dayDiv.classList.add('fasted');
        }
        
        dayDiv.innerHTML = `
            <div class="day-number">Hari ${day}</div>
            <div class="day-icon">${fastingDays.includes(day) ? '⭐' : '☀️'}</div>
        `;
        
        dayDiv.onclick = function() {
            toggleFasting(day);
        };
        
        grid.appendChild(dayDiv);
    }
    
    updateFastingTotal();
}

function toggleFasting(day) {
    playSound('success');
    const index = fastingDays.indexOf(day);
    
    if (index > -1) {
        fastingDays.splice(index, 1);
    } else {
        fastingDays.push(day);
        celebrate();
    }
    
    localStorage.setItem('fastingDays', JSON.stringify(fastingDays));
    renderStickerChart();
}

function updateFastingTotal() {
    document.getElementById('totalFasting').textContent = fastingDays.length;
}

// CELEBRATION EFFECT
function celebrate() {
    const emojis = ['🎉', '⭐', '✨', '🌟', '💫'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.top = '-50px';
            emoji.style.fontSize = '40px';
            emoji.style.zIndex = '9999';
            emoji.style.pointerEvents = 'none';
            emoji.style.animation = 'fall 2s linear';
            
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 2000);
        }, i * 100);
    }
}

// SOUND EFFECTS (Simple beep using Web Audio API)
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'click') {
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'success') {
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
    }
}

// INITIALIZE
window.onload = function() {
    document.getElementById('mainScreen').classList.add('active');
};
