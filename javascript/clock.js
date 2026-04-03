function spawnClock() {
    if (document.getElementById('wall-clock')) return;

    const w = document.createElement('div');
    w.id = 'wall-clock';
    w.style.position = 'absolute';
    w.style.top = '20px';
    w.style.right = '20px';
    w.style.left = 'auto';
    w.style.cursor = 'move';
    w.style.userSelect = 'none';
    w.style.zIndex = '10';
    w.style.filter = 'drop-shadow(4px 6px 12px rgba(0,0,0,0.35))';

    const close = document.createElement('button');
    close.className = 'widget-close';
    close.textContent = '✕';
    close.onclick = () => w.remove();
    w.appendChild(close);

    const S = 180, cx = 90, cy = 90, r = 68;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', S);
    svg.setAttribute('height', S);
    svg.setAttribute('viewBox', `0 0 ${S} ${S}`);

    function el(tag, attrs) {
        const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
        return e;
    }

    svg.appendChild(el('circle', { cx, cy, r: r + 10, fill: '#6a3e10' }));
    svg.appendChild(el('circle', { cx, cy, r: r + 6,  fill: '#9a6428' }));
    svg.appendChild(el('circle', { cx, cy, r: r + 2,  fill: '#7a4e18' }));
    svg.appendChild(el('circle', { cx, cy, r, fill: '#fdf8ee' }));
    svg.appendChild(el('circle', { cx, cy, r, fill: 'none', stroke: '#e8d8b8', 'stroke-width': '1' }));

    ['12','1','2','3','4','5','6','7','8','9','10','11'].forEach((n, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const nx = cx + Math.cos(a) * (r - 13);
        const ny = cy + Math.sin(a) * (r - 13);
        svg.appendChild(el('text', {
            x: nx.toFixed(1), y: ny.toFixed(1),
            'text-anchor': 'middle', 'dominant-baseline': 'central',
            'font-family': 'Georgia, serif',
            'font-size': i % 3 === 0 ? '10' : '7',
            'font-weight': i % 3 === 0 ? 'bold' : 'normal',
            fill: '#5a3010'
        })).textContent = n;
    });

    for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue;
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        svg.appendChild(el('line', {
            x1: (cx + Math.cos(a) * (r - 5)).toFixed(1),
            y1: (cy + Math.sin(a) * (r - 5)).toFixed(1),
            x2: (cx + Math.cos(a) * (r - 2)).toFixed(1),
            y2: (cy + Math.sin(a) * (r - 2)).toFixed(1),
            stroke: '#c8a878', 'stroke-width': '0.8'
        }));
    }

    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        svg.appendChild(el('line', {
            x1: (cx + Math.cos(a) * (r - 7)).toFixed(1),
            y1: (cy + Math.sin(a) * (r - 7)).toFixed(1),
            x2: (cx + Math.cos(a) * (r - 2)).toFixed(1),
            y2: (cy + Math.sin(a) * (r - 2)).toFixed(1),
            stroke: '#9a7040', 'stroke-width': '1.5'
        }));
    }

    const hrHand  = el('line', { x1: cx, y1: cy, x2: cx, y2: cy - 40, stroke: '#2a1408', 'stroke-width': '3.5', 'stroke-linecap': 'round' });
    const minHand = el('line', { x1: cx, y1: cy, x2: cx, y2: cy - 56, stroke: '#4a2c10', 'stroke-width': '2',   'stroke-linecap': 'round' });
    const secHand = el('line', { x1: cx, y1: cy + 14, x2: cx, y2: cy - 60, stroke: '#a02010', 'stroke-width': '1', 'stroke-linecap': 'round' });

    svg.append(hrHand, minHand, secHand);
    svg.appendChild(el('circle', { cx, cy, r: '4',   fill: '#2a1408' }));
    svg.appendChild(el('circle', { cx, cy, r: '1.5', fill: '#c8a060' }));

    w.appendChild(svg);
    document.getElementById('wall').appendChild(w);

    function rotateHand(hand, deg) {
        hand.setAttribute('transform', `rotate(${deg.toFixed(3)},${cx},${cy})`);
    }

    function update() {
        const now = new Date();
        const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds();
        rotateHand(hrHand,  ((h + m / 60) / 12) * 360);
        rotateHand(minHand, ((m + s / 60) / 60) * 360);
        rotateHand(secHand, (s / 60) * 360);
    }

    update();
    setInterval(update, 1000);

    let ox, oy;
    w.onmousedown = e => {
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        const wr = document.getElementById('wall').getBoundingClientRect();
        ox = e.clientX - (w.getBoundingClientRect().left - wr.left);
        oy = e.clientY - (w.getBoundingClientRect().top  - wr.top);
        document.onmousemove = e => {
            const wr2 = document.getElementById('wall').getBoundingClientRect();
            w.style.left  = Math.min(wr2.width  - w.offsetWidth,  Math.max(0, e.clientX - wr2.left - ox)) + 'px';
            w.style.top   = Math.min(wr2.height - w.offsetHeight, Math.max(0, e.clientY - wr2.top  - oy)) + 'px';
            w.style.right = 'auto';
        };
        document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
    };
}
