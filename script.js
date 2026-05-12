/**
 * Military Loading Screen Script
 * Features: GMod Integration & Bass Visualization
 */

let totalFiles = 0;
let neededFiles = 0;

// Плейлист (добавьте сюда названия своих файлов)
const playlist = [
    'music.mp3',
    'music2.mp3',
    'music3.mp3'
];

let currentTrackIndex = Math.floor(Math.random() * playlist.length);

// Инициализация аудио
const audio = document.getElementById('loading-music');
const logoContainer = document.getElementById('logo-container');
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status');
const percentText = document.getElementById('percent');
const serverNameText = document.getElementById('servername');
const mapNameText = document.getElementById('mapname');

let audioCtx;
let analyser;
let dataArray;
let source;

function initAudio() {
    if (audioCtx) return;

    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Настройка плейлиста
        setupPlaylist();
        
        // Запуск визуализации
        renderFrame();
    } catch (e) {
        console.error("Audio API error:", e);
    }
}

function setupPlaylist() {
    // Устанавливаем первый трек
    audio.src = playlist[currentTrackIndex];
    
    // Когда трек заканчивается, играем следующий
    audio.onended = () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        audio.src = playlist[currentTrackIndex];
        audio.play();
    };

    // Пытаемся запустить музыку
    audio.play().catch(e => {
        console.log("Autoplay blocked, waiting for interaction");
        window.addEventListener('mousedown', () => {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            audio.play();
        }, { once: true });
    });
}

function renderFrame() {
    requestAnimationFrame(renderFrame);
    
    if (!analyser) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    // Вычисляем уровень баса (первые несколько частотных корзин)
    let bass = 0;
    for (let i = 0; i < 10; i++) {
        bass += dataArray[i];
    }
    bass = bass / 10; // Среднее значение баса (0-255)
    
    // Масштабирование логотипа на основе баса
    const scale = 1 + (bass / 255) * 0.2; // Увеличиваем до 1.2x
    logoContainer.style.transform = `scale(${scale})`;
    
    // Дополнительное свечение при сильном басе
    const glow = (bass / 255) * 40;
    document.getElementById('logo').style.filter = `drop-shadow(0 0 ${10 + glow}px rgba(0, 255, 204, ${0.3 + (bass/255)}))`;

    // Если бас очень сильный, добавляем тряску (глич)
    if (bass > 210) {
        logoContainer.classList.add('bass-glitch');
    } else {
        logoContainer.classList.remove('bass-glitch');
    }
}

// GMod Functions
window.GameDetails = function(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    serverNameText.innerText = servername || "MILITARY OPERATIONS";
    mapNameText.innerText = `DEPLOYING TO: ${mapname || "UNKNOWN"}`;
};

window.SetFilesTotal = function(total) {
    totalFiles = total;
};

window.SetFilesNeeded = function(needed) {
    neededFiles = needed;
    updateProgress();
};

window.SetStatusChanged = function(status) {
    statusText.innerText = status;
    
    // Если статус содержит информацию о начале загрузки, пробуем стартануть звук
    if (status && !audioCtx) {
        initAudio();
    }
};

function updateProgress() {
    if (totalFiles <= 0) return;
    
    const progress = Math.min(100, Math.max(0, Math.floor(((totalFiles - neededFiles) / totalFiles) * 100)));
    progressBar.style.width = progress + '%';
    percentText.innerText = progress + '%';
}

// Инициализация при загрузке страницы
window.onload = () => {
    // В некоторых версиях GMod функции могут вызываться до onload
    // Пробуем инициализировать аудио
    initAudio();
};

// Тестовые вызовы для отладки в браузере (можно удалить)
// GameDetails("ALPHA STRIKE RP", "", "rp_ncr_shady_sands", 64, "", "");
// SetFilesTotal(100);
// SetFilesNeeded(50);
