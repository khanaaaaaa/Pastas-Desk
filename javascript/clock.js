function spawnClock() {
    if (document.getElementById('wall-clock')) return;

    const w = document.createElement('div');
    w.id = 'wall-clock';

    const size = 110;
    const cx = size / 2, cy = size / 2, r = 46;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.style.display = 'block';

    let ticks = '';
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + Math.cos(angle) * (r - 5);
        const y1 = cy + Math.sin(angle) * (r - 5);
        const x2 = cx + Math.cos(angle) * (r - 1);
        const y2 = cy + Math.sin(angle) * (r - 1);
        ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#9a7030" stroke-width="${i % 3 === 0 ? 2 : 1}" />`;
    }

    svg.innerHTML = `
        <circle cx="${cx}" cy="${cy}" r="${r+5}" fill="#6a4018" />
        <circle cx="${cx}" cy="${cy}" r="${r+2}" fill="#b08030" />
        <circle cx="${cx}" cy="${cy}" r="${r}"   fill="#fdf5e0" />
        ${ticks}
        <line id="wc-hr"  x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-24}" stroke="#3a1e08" stroke-width="3" stroke-linecap="round" />
        <line id="wc-min" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-34}" stroke="#5a3010" stroke-width="2" stroke-linecap="round" />
        <line id="wc-sec" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-38}" stroke="#b03010" stroke-width="1" stroke-linecap="round" />
        <circle cx="${cx}" cy="${cy}" r="3" fill="#3a1e08" />
    `;

    const dateLabel = document.createElement('div');
    dateLabel.id = 'wall-clock-date';

    function update() {
        const now = new Date();
        const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds();
        const hA = ((h + m / 60) / 12) * 360 - 90;
        const mA = ((m + s / 60) / 60) * 360 - 90;
        const sA = (s / 60) * 360 - 90;

        function setHand(id, deg, len) {
            const a = deg * Math.PI / 180;
            const el = svg.querySelector(id);
            el.setAttribute('x2', (cx + Math.cos(a) * len).toFixed(1));
            el.setAttribute('y2', (cy + Math.sin(a) * len).toFixed(1));
        }

        setHand('#wc-hr',  hA, 24);
        setHand('#wc-min', mA, 34);
        setHand('#wc-sec', sA, 38);
        dateLabel.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }

    update();
    setInterval(update, 1000);

    w.append(svg, dateLabel);
    document.getElementById('wall').appendChild(w);

    let ox, oy;
    w.onmousedown = e => {
        ox = e.clientX - w.offsetLeft;
        oy = e.clientY - w.offsetTop;
        document.onmousemove = e => {
            const wall = document.getElementById('wall');
            const wr = wall.getBoundingClientRect();
            const maxX = wr.width  - w.offsetWidth;
            const maxY = wr.height - w.offsetHeight;
            w.style.left = Math.min(maxX, Math.max(0, e.clientX - ox)) + 'px';
            w.style.top  = Math.min(maxY, Math.max(0, e.clientY - oy)) + 'px';
        };
        document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
    };
}
