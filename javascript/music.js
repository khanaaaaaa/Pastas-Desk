const playlist = [
    { label: 'Lo-fi Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { label: 'Jazz Vibes',  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { label: 'Focus Flow',  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

let trackIndex = 0;
const audio = new Audio(playlist[0].url);

function spawnMusic() {
    const w = makeWidget('music');

    const label = document.createElement('div');
    label.className = 'music-label';
    label.textContent = playlist[trackIndex].label;

    const controls = document.createElement('div');
    controls.className = 'music-controls';

    const prev = document.createElement('button');
    prev.textContent = '|◀';
    const play = document.createElement('button');
    play.textContent = '▶';
    const next = document.createElement('button');
    next.textContent = '▶|';

    const progress = document.createElement('input');
    progress.type = 'range'; progress.className = 'music-progress';
    progress.min = 0; progress.max = 100; progress.value = 0;

    function loadTrack(i) {
        trackIndex = (i + playlist.length) % playlist.length;
        audio.src = playlist[trackIndex].url;
        label.textContent = playlist[trackIndex].label;
        audio.play(); play.textContent = '⏸';
    }

    play.onclick = () => {
        audio.paused ? (audio.play(), play.textContent = '⏸') : (audio.pause(), play.textContent = '▶');
    };
    prev.onclick = () => loadTrack(trackIndex - 1);
    next.onclick = () => loadTrack(trackIndex + 1);

    audio.ontimeupdate = () => {
        if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 100;
    };
    progress.oninput = () => {
        audio.currentTime = (progress.value / 100) * audio.duration;
    };

    controls.append(prev, play, next);
    w.append(label, controls, progress);
    document.getElementById('widgets-container').appendChild(w);
    makeDraggable(w);
}

function makeWidget(type) {
    const w = document.createElement('div');
    w.className = 'widget';

    const table = document.getElementById('table');
    const tr = table.getBoundingClientRect();
    const offset = document.querySelectorAll('.widget').length * 20;
    w.style.left = Math.max(10, (tr.width / 2) - 90 + offset) + 'px';
    w.style.top  = Math.max(10, (tr.height / 2) - 60 + offset) + 'px';

    const title = document.createElement('div');
    title.className = 'widget-title';
    title.textContent = type;

    const close = document.createElement('button');
    close.className = 'widget-close';
    close.textContent = '✕';
    close.onclick = () => w.remove();

    w.append(title, close);
    return w;
}

function makeDraggable(el) {
    let ox, oy;
    el.onmousedown = e => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
        document.onmousemove = e => { el.style.left = (e.clientX - ox) + 'px'; el.style.top = (e.clientY - oy) + 'px'; };
        document.onmouseup  = () => { document.onmousemove = null; document.onmouseup = null; };
    };
}

function toggleTheme() { document.body.classList.toggle('dark'); }
function clearTable()  { document.getElementById('widgets-container').innerHTML = ''; }
