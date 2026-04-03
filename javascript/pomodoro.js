function spawnPomodoro() {
    const w = makeWallWidget('pomodoro');

    const WORK = 25 * 60, BREAK = 5 * 60;
    let remaining = WORK, running = false, interval = null;
    let onBreak = false, sessions = 0;

    const modeLabel = document.createElement('div');
    modeLabel.className = 'pom-mode';
    modeLabel.textContent = 'focus';

    const display = document.createElement('div');
    display.className = 'pomodoro-time';
    display.textContent = '25:00';

    const sessionDots = document.createElement('div');
    sessionDots.className = 'pom-sessions';
    sessionDots.title = 'completed sessions';

    function updateDots() {
        sessionDots.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const d = document.createElement('span');
            d.className = 'pom-dot' + (i < sessions % 4 ? ' filled' : '');
            sessionDots.appendChild(d);
        }
    }
    updateDots();

    function fmt(s) {
        return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    }

    function ping() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
            osc.start(); osc.stop(ctx.currentTime + 0.8);
        } catch(e) {}
    }

    function tick() {
        if (remaining <= 0) {
            clearInterval(interval); running = false;
            startBtn.textContent = 'start';
            ping();
            if (!onBreak) {
                sessions++; updateDots();
                onBreak = true; remaining = BREAK;
                modeLabel.textContent = 'break';
                display.style.color = '#3a7a30';
            } else {
                onBreak = false; remaining = WORK;
                modeLabel.textContent = 'focus';
                display.style.color = '';
            }
            display.textContent = fmt(remaining);
            return;
        }
        remaining--;
        display.textContent = fmt(remaining);
    }

    const controls = document.createElement('div');
    controls.className = 'pomodoro-controls';

    const startBtn = document.createElement('button'); startBtn.textContent = 'start'; startBtn.title = 'start / pause';
    const resetBtn = document.createElement('button'); resetBtn.textContent = 'reset'; resetBtn.title = 'reset to 25:00';
    const skipBtn  = document.createElement('button'); skipBtn.textContent  = 'skip';  skipBtn.title  = 'skip phase';

    startBtn.onclick = () => {
        running = !running;
        running ? (interval = setInterval(tick, 1000), startBtn.textContent = 'pause')
                : (clearInterval(interval), startBtn.textContent = 'start');
    };
    resetBtn.onclick = () => {
        clearInterval(interval); running = false; onBreak = false; remaining = WORK;
        display.textContent = fmt(WORK); display.style.color = '';
        modeLabel.textContent = 'focus'; startBtn.textContent = 'start';
    };
    skipBtn.onclick = () => {
        clearInterval(interval); running = false; startBtn.textContent = 'start';
        if (!onBreak) { sessions++; updateDots(); onBreak = true; remaining = BREAK; modeLabel.textContent = 'break'; display.style.color = '#3a7a30'; }
        else { onBreak = false; remaining = WORK; modeLabel.textContent = 'focus'; display.style.color = ''; }
        display.textContent = fmt(remaining);
    };

    controls.append(startBtn, resetBtn, skipBtn);
    w.append(modeLabel, display, sessionDots, controls);
    document.getElementById('wall').appendChild(w);
    makeWallDraggable(w);
}
