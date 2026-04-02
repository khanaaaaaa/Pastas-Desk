function spawnNote() {
    const w = makeWidget('note', 'Note', 200, 30);
    const ta = document.createElement('textarea');
    ta.className = 'note-area';
    ta.placeholder = 'Write something...';

    const key = 'note-' + Date.now();
    ta.oninput = () => localStorage.setItem(key, ta.value);

    w.appendChild(ta);
    document.getElementById('widgets-container').appendChild(w);
    makeDraggable(w);
}