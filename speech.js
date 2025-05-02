const textDisplay = document.getElementById('overlay');

// Check if browser supports speech recognition
if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    textDisplay.textContent = 'Speech recognition is not supported in this browser.';
    console.error('Speech recognition is not supported in this browser.');
} else {
    console.log('Speech recognition is supported');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    // Event handlers
    recognition.onstart = function() {
        console.log('Speech recognition started');
        textDisplay.textContent = 'Listening...';
    };

    recognition.onspeechstart = function() {
        console.log('Speech detected');
    };

    recognition.onspeechend = function() {
        console.log('Speech ended');
    };

    recognition.onresult = function(event) {
        console.log('Speech recognition result:', event);
        const results = event.results;
        const lastResult = results[results.length - 1];
        const transcript = lastResult[0].transcript;
        console.log('Transcript:', transcript);
        textDisplay.textContent = transcript;
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        textDisplay.textContent = `Error: ${event.error}`;
        
        // Try to restart on certain errors
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
            console.log('Attempting to restart recognition...');
            try {
                recognition.stop();
                setTimeout(() => {
                    recognition.start();
                }, 1000);
            } catch (error) {
                console.error('Failed to restart recognition:', error);
            }
        }
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

    // Start recognition after a short delay to ensure everything is ready
    setTimeout(() => {
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
    }, 1000);
}
