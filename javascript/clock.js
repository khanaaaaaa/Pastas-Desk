function spawnClock() {
    const w = makeWidget('clock', 'Clock', 320, 25);

    const time = document.createElement('div');
    time.className = 'clock-time';

    const date = document.createElement('div');
    date.className = 'clock-date';

    function updte() { 
        const now = new Date();
        time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        date.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    }

    update();
    setInterval(update, 1000);
    w.append(time, date);
    document.getElementById('widgets-container').appendChild(w);
    makeDraggable(w);
}