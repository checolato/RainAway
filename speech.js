const textDisplay = document.getElementById('overlay');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.continuous = true;

recognition.onresult = function(event) {
    const transcript = event.results[event.results.length - 1][0].transcript;
    textDisplay.textContent = transcript;
};

recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
};

recognition.start();
