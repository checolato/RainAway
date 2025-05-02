const textDisplay = document.getElementById('overlay');

// Check if browser supports speech recognition
if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    textDisplay.textContent = 'Speech recognition is not supported in this browser.';
    console.error('Speech recognition is not supported in this browser.');
} else {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = function() {
        console.log('Speech recognition started');
        textDisplay.textContent = 'Listening...';
    };

    recognition.onresult = function(event) {
        console.log('Speech recognition result:', event);
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('Transcript:', transcript);
        textDisplay.textContent = transcript;
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        textDisplay.textContent = `Error: ${event.error}`;
    };

    recognition.onend = function() {
        console.log('Speech recognition ended');
        // Restart recognition if it ends
        try {
            recognition.start();
        } catch (error) {
            console.error('Failed to restart recognition:', error);
        }
    };

    // Request microphone permission and start recognition
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            console.log('Microphone permission granted');
            try {
                recognition.start();
            } catch (error) {
                console.error('Failed to start recognition:', error);
                textDisplay.textContent = 'Failed to start speech recognition.';
            }
        })
        .catch(error => {
            console.error('Microphone permission denied:', error);
            textDisplay.textContent = 'Microphone permission is required for speech recognition.';
        });
}
