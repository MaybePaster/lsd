/**
 * Military Loading Screen Script
 * Features: GMod Integration & Bass Visualization
 */

let totalFiles = 0;
let neededFiles = 0;

// Плейлист (добавьте сюда названия своих файлов)
const playlist = [
    'music/Eiffel 65 - Blue (Da Ba Dee) [Gabry Ponte Ice Pop Mix] (Original Video with subtitles).mp3',
    'music/Erica I dont know nightcore.mp3',
    'music/Give it to me - Timbaland(Zoolander Phonk Version - Tailun).mp3',
    'music/GYM HARDSTYLE - Katy Perry ＂California Girls＂ Hardstyle Remix (4K).mp3',
    'music/I FOUND IT (PoPiPo JUMPSTYLE).mp3',
    'music/Just Dance (Hardstyle Remix) (SPED UP).mp3',
    'music/Loco Loco  - It Burns! Burns! Burns!.mp3',
    'music/MAGAZ21 - ЕСЛИ В СЕРДЦЕ ЖИВЕТ ХАРДКОР.mp3',
    'music/O-Zone - Dragostea Din Tei [Official Video].mp3',
    'music/OXXXYMIRON — МОХ.mp3',
    'music/элджей - рваные джинсы bass boosted earrape remix.mp3'
];

let currentTrackIndex = Math.floor(Math.random() * playlist.length);
let isInitialized = false;

const mapNames = {
    "awm_nikaleninsk": "ПОКРОВСКА",
    "ft_belostock_v1": "СНЕЖКА",
    "ft_ww3": "ТРЕТЬЕЙ МИРОВОЙ ВОЙНЫ",
    "gm_blesmont": "БЛЕСМОНТА",
    "gm_puzilovo": "ПУЗИЛОВО",
    "rp_cherno_v3": "ЧЕРНО",
    "rp_ft_izum": "ИЗЮМА",
    "rp_ft_izum_4": "ИЗЮМА",
    "rp_ft_kharkiv_autumn": "ХАРЬКОВЩИНЫ",
    "rp_ft_kharkiv_v1": "ХАРЬКОВЩИНЫ",
    "rp_ft_kherson_v4": "ХЕРСОНА",
    "rp_ft_snow_pripyat": "ПРИПЯТИ",
    "rp_ft_ukwar_d": "УКРАИНЫ",
    "rp_ft_ww3": "ТРЕТЬЕЙ МИРОВОЙ",
    "rp_siberia_v1": "СИБИРИ",
    "rp_valkyrie_forest_v1": "ЛЕСАХ ВАЛЬКИРИИ",
    "rp_ww1_siegfriedtrenches_b02": "ОКОПАХ",
    "cl_map": "НЕИЗВЕСТНОЙ ТЕРРИТОРИИ"
};

const mapBackgrounds = {
    "awm_nikaleninsk": "maps/awm_nikaleninsk.png",
    "cl_map": "maps/cl_map.png",
    "ft_belostock_v1": "maps/ft_belostock_v1.png",
    "ft_ww3": "maps/ft_ww3.png",
    "gm_blesmont": "maps/gm_blesmont.png",
    "gm_puzilovo": "maps/gm_puzilovo.png",
    "rp_cherno_v3": "maps/rp_cherno_v3.png",
    "rp_ft_izum": "maps/rp_ft_izum.png",
    "rp_ft_izum_4": "maps/rp_ft_izum_4.png",
    "rp_ft_kharkiv_autumn": "maps/rp_ft_kharkiv_autumn.png",
    "rp_ft_kharkiv_v1": "maps/rp_ft_kharkiv_v1.png",
    "rp_ft_kherson_v4": "maps/rp_ft_kherson_v4.png",
    "rp_ft_snow_pripyat": "maps/rp_ft_snow_pripyat.png",
    "rp_ft_ukwar_d": "maps/rp_ft_ukwar_d.png",
    "rp_ft_ww3": "maps/rp_ft_ww3.png",
    "rp_siberia_v1": "maps/rp_siberia_v1.png",
    "rp_valkyrie_forest_v1": "maps/rp_valkyrie_forest_v1.png",
    "rp_ww1_siegfriedtrenches_b02": "maps/rp_ww1_siegfriedtrenches_b02.png"
};

// Инициализация аудио
const audio = document.getElementById('loading-music');
audio.volume = 0.2; // Снижаем громкость вдвойне
const logoContainer = document.getElementById('logo-container');
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status');
const percentText = document.getElementById('percent');
const serverNameText = document.getElementById('servername');
const mapNameText = document.getElementById('mapname');
const nowPlayingText = document.createElement('div');
nowPlayingText.id = 'now-playing';
nowPlayingText.className = 'now-playing-info';
document.querySelector('.server-info').appendChild(nowPlayingText);

let audioCtx;
let analyser;
let dataArray;
let source;

function initAudio() {
    if (isInitialized) return;
    isInitialized = true;

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
        // Fallback for playlist if WebAudio fails
        setupPlaylist();
    }
}

function updateNowPlaying() {
    const trackPath = playlist[currentTrackIndex];
    const trackName = trackPath.split('/').pop().replace('.mp3', '');
    nowPlayingText.innerText = `СЕЙЧАС ТЫ СЛУШАЕШЬ: ${trackName}`;
    nowPlayingText.style.opacity = '1';

    // Hide after 5 seconds
    setTimeout(() => {
        nowPlayingText.style.opacity = '0.5';
    }, 5000);
}

function setupPlaylist() {
    // Устанавливаем первый трек
    audio.src = playlist[currentTrackIndex];
    updateNowPlaying();

    // Когда трек заканчивается, играем следующий
    audio.onended = () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        audio.src = playlist[currentTrackIndex];
        updateNowPlaying();
        audio.play();
    };

    // Пытаемся запустить музыку
    const startPlay = () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        audio.play().catch(e => console.log("Playback failed:", e));
    };

    audio.play().catch(e => {
        console.log("Autoplay blocked, waiting for interaction");
        window.addEventListener('mousedown', startPlay, { once: true });
        window.addEventListener('keydown', startPlay, { once: true });
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
    document.getElementById('logo').style.filter = `drop-shadow(0 0 ${10 + glow}px rgba(0, 255, 204, ${0.3 + (bass / 255)}))`;

    // Если бас очень сильный, добавляем тряску (глич)
    if (bass > 210) {
        logoContainer.classList.add('bass-glitch');
    } else {
        logoContainer.classList.remove('bass-glitch');
    }
}

// GMod Functions
window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    serverNameText.innerText = servername || "ВОЙНА НА УКРАИНЕ";

    // Получаем красивое название из словаря или используем оригинал
    const cleanMapName = mapname ? mapname.toLowerCase() : "unknown";
    const displayName = mapNames[cleanMapName] || cleanMapName.toUpperCase();

    mapNameText.innerText = `ВЫСАЖИВАЕМСЯ НА ТЕРРИТОРИИ ${displayName}`;

    const mapBg = document.getElementById('map-bg');
    if (mapBackgrounds[cleanMapName]) {
        mapBg.style.backgroundImage = `url('${mapBackgrounds[cleanMapName]}')`;
    } else {
        const bgKeys = Object.keys(mapBackgrounds);
        const randomMap = bgKeys[Math.floor(Math.random() * bgKeys.length)];
        mapBg.style.backgroundImage = `url('${mapBackgrounds[randomMap]}')`;
    }
};

window.SetFilesTotal = function (total) {
    totalFiles = total;
};

window.SetFilesNeeded = function (needed) {
    neededFiles = needed;
    updateProgress();
};

window.SetStatusChanged = function (status) {
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
