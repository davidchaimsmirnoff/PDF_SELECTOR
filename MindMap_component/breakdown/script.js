document.addEventListener('DOMContentLoaded', function() {
    const borderBox = document.getElementById('borderBox');
    let mode = 'place'; // Default mode

    borderBox.addEventListener('click', function(e) {
        if (mode === 'place' && e.shiftKey) {
            createInputBox(e.clientX, e.clientY);
        }
    });

    function createInputBox(x, y) {
        const inputBox = document.createElement('textarea');
        inputBox.classList.add('inputBox');
        inputBox.style.left = `${x}px`;
        inputBox.style.top = `${y}px`;
        borderBox.appendChild(inputBox);
        inputBox.focus();

        inputBox.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveContent(inputBox, x, y);
                mode = 'place';
            }
        });
    }

    function saveContent(inputBox, x, y) {
        const state = {
            content: inputBox.value,
            x: x,
            y: y
        };
        // Save state to state.json (assuming a server-side mechanism or localStorage)
        console.log('Saving state:', state);
        inputBox.setAttribute('readonly', true);
        inputBox.classList.remove('inputBox');
        inputBox.classList.add('savedContent');
    }
});

// Additional functionalities for edit, delete, resize, etc., should be added similarly.
