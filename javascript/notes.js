const NOTE_COLORS = ['#f5e87a', '#f5c4a0', '#c8e6a0', '#a8d8f0', '#e8b8f0'];

function spawnNote() {
    const wall = document.getElementById('wall');
    const existing = wall.querySelectorAll('.wall-note').length;
    const key = 'note-' + Date.now();
    const colorIndex = existing % NOTE_COLORS.length;

    const w = document.createElement('div');
    w.className = 'wall-note';
    w.style.left = (18 + existing * 22) + 'px';
    w.style.top  = (24 + existing * 18) + 'px';
    w.style.transform = `rotate(${(Math.random() * 5 - 2.5).toFixed(1)}deg)`;
    w.style.background = NOTE_COLORS[colorIndex];

    // color picker strip
    const colorStrip = document.createElement('div');
    colorStrip.className = 'note-color-strip';
    NOTE_COLORS.forEach(c => {
        const dot = document.createElement('button');
        dot.className = 'note-color-dot';
        dot.style.background = c;
        dot.title = 'change color';
        dot.onclick = e => { e.stopPropagation(); w.style.background = c; };
        colorStrip.appendChild(dot);
    });

    const ta = document.createElement('textarea');
    ta.className = 'note-area';
    ta.placeholder = 'write here...';
    ta.value = localStorage.getItem(key) || '';
    ta.oninput = () => localStorage.setItem(key, ta.value);

    const close = document.createElement('button');
    close.className = 'widget-close';
    close.textContent = '✕';
    close.title = 'remove note';
    close.onclick = () => { localStorage.removeItem(key); w.remove(); };

    w.append(close, colorStrip, ta);
    wall.appendChild(w);

    let ox, oy;
    w.onmousedown = e => {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        const wr = document.getElementById('wall').getBoundingClientRect();
        ox = e.clientX - (w.getBoundingClientRect().left - wr.left);
        oy = e.clientY - (w.getBoundingClientRect().top  - wr.top);
        document.onmousemove = e => {
            const wr2 = document.getElementById('wall').getBoundingClientRect();
            w.style.left = Math.min(wr2.width  - w.offsetWidth,  Math.max(0, e.clientX - wr2.left - ox)) + 'px';
            w.style.top  = Math.min(wr2.height - w.offsetHeight, Math.max(0, e.clientY - wr2.top  - oy)) + 'px';
        };
        document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
    };
}
