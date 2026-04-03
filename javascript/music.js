const playlist = [
    { label: 'Lo-fi Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { label: 'Jazz Vibes',  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { label: 'Focus Flow',  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];
let trackIndex = 0;
const audio = new Audio(playlist[0].url);
audio.volume = 0.7;

function spawnMusic() {
    const w = makeWallWidget('music');

    const label = document.createElement('div');
    label.className = 'music-label';
    label.textContent = playlist[trackIndex].label;

    const controls = document.createElement('div');
    controls.className = 'music-controls';

    const prev = document.createElement('button'); prev.textContent = '|◀'; prev.title = 'previous';
    const play = document.createElement('button'); play.textContent = '▶';  play.title = 'play / pause';
    const next = document.createElement('button'); next.textContent = '▶|'; next.title = 'next';

    const loopBtn = document.createElement('button');
    loopBtn.textContent = '↺'; loopBtn.title = 'loop track';
    loopBtn.style.opacity = '0.4';
    loopBtn.onclick = () => {
        audio.loop = !audio.loop;
        loopBtn.style.opacity = audio.loop ? '1' : '0.4';
    };

    const progress = document.createElement('input');
    progress.type = 'range'; progress.className = 'music-progress';
    progress.min = 0; progress.max = 100; progress.value = 0;
    progress.title = 'seek';

    const volRow = document.createElement('div');
    volRow.className = 'music-vol-row';
    const volIcon = document.createElement('span');
    volIcon.textContent = '♪'; volIcon.className = 'music-vol-icon';
    const volSlider = document.createElement('input');
    volSlider.type = 'range'; volSlider.className = 'music-progress';
    volSlider.min = 0; volSlider.max = 100; volSlider.value = 70;
    volSlider.title = 'volume';
    volSlider.oninput = () => { audio.volume = volSlider.value / 100; };
    volRow.append(volIcon, volSlider);

    function loadTrack(i) {
        trackIndex = (i + playlist.length) % playlist.length;
        audio.src = playlist[trackIndex].url;
        label.textContent = playlist[trackIndex].label;
        audio.play(); play.textContent = '⏸';
    }

    play.onclick = () => { audio.paused ? (audio.play(), play.textContent = '⏸') : (audio.pause(), play.textContent = '▶'); };
    prev.onclick = () => loadTrack(trackIndex - 1);
    next.onclick = () => loadTrack(trackIndex + 1);
    audio.onended = () => { if (!audio.loop) loadTrack(trackIndex + 1); };
    audio.ontimeupdate = () => { if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 100; };
    progress.oninput = () => { audio.currentTime = (progress.value / 100) * audio.duration; };

    controls.append(prev, play, next, loopBtn);
    w.append(label, controls, progress, volRow);
    document.getElementById('wall').appendChild(w);
    makeWallDraggable(w);
}

function spawnQuote() {
    if (document.getElementById('wall-quote')) return;
    const quotes = [
        'do what you can, with what you have, where you are.',
        'a little progress each day adds up to big results.',
        'the secret of getting ahead is getting started.',
        'focus on being productive instead of busy.',
        'one day or day one. you decide.',
        'small steps every day.',
        'rest is productive too.',
    ];
    const w = document.createElement('div');
    w.id = 'wall-quote';
    w.textContent = '\u201c' + quotes[new Date().getDay() % quotes.length] + '\u201d';
    w.title = 'drag to move';
    document.getElementById('wall').appendChild(w);
    makeWallDraggable(w);
}

function makeWallWidget(type) {
    const w = document.createElement('div');
    w.className = 'widget wall-widget-item';

    const existing = document.querySelectorAll('.wall-widget-item').length;
    w.style.left = (20 + existing * 18) + 'px';
    w.style.top  = (20 + existing * 18) + 'px';

    const title = document.createElement('div');
    title.className = 'widget-title';
    title.textContent = type;

    const close = document.createElement('button');
    close.className = 'widget-close';
    close.textContent = '✕';
    close.title = 'close';
    close.onclick = () => w.remove();

    w.append(title, close);
    return w;
}

function makeWallDraggable(el) {
    let ox, oy;
    el.onmousedown = e => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        const wr = document.getElementById('wall').getBoundingClientRect();
        ox = e.clientX - (el.getBoundingClientRect().left - wr.left);
        oy = e.clientY - (el.getBoundingClientRect().top  - wr.top);
        document.onmousemove = e => {
            const wr2 = document.getElementById('wall').getBoundingClientRect();
            el.style.left   = Math.min(wr2.width  - el.offsetWidth,  Math.max(0, e.clientX - wr2.left - ox)) + 'px';
            el.style.top    = Math.min(wr2.height - el.offsetHeight, Math.max(0, e.clientY - wr2.top  - oy)) + 'px';
            el.style.right  = 'auto';
            el.style.bottom = 'auto';
        };
        document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
    };
}

function toggleTheme() { document.body.classList.toggle('dark'); }

function clearTable() {
    document.querySelectorAll('.wall-widget-item').forEach(n => n.remove());
    document.querySelectorAll('.wall-note').forEach(n => n.remove());
    const clock = document.getElementById('wall-clock');
    if (clock) clock.remove();
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const widgets = document.querySelectorAll('.wall-widget-item');
        if (widgets.length) widgets[widgets.length - 1].remove();
    }
});

window.addEventListener('DOMContentLoaded', spawnQuote);
