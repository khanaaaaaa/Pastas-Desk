function spawnPomodoro() {
    const w = makeWidget('pomodoro');
    let mins = 25, secs = 0, running = false, interval = null;

    const display = document.createElement('div');
    display.className = 'pomodoro-time';
    display.textContent = '25:00';

    const controls = document.createElement('div');
    controls.className = 'pomodoro-controls';

    const startBtn = document.createElement('button');
    startBtn.textContent = 'start';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'reset';

    function tick() {
        if (secs === 0) {
            if (mins === 0) { clearInterval(interval); running = false; startBtn.textContent = 'start'; return; }
            mins--; secs = 59;
        } else secs--;
        display.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }

    startBtn.onclick = () => {
        running = !running;
        running ? (interval = setInterval(tick, 1000), startBtn.textContent = 'pause')
                : (clearInterval(interval), startBtn.textContent = 'start');
    };

    resetBtn.onclick = () => {
        clearInterval(interval); running = false;
        mins = 25; secs = 0;
        display.textContent = '25:00';
        startBtn.textContent = 'start';
    };

    controls.append(startBtn, resetBtn);
    w.append(display, controls);
    document.getElementById('widgets-container').appendChild(w);
    makeDraggable(w);
}
