// Paytm Soundbox Chime & Voice Synthesizer using Web Audio API + SpeechSynthesis

export function playPaytmChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Iconic 4-note ascending Paytm Soundbox chime
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = ctx.currentTime + 0.05;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.12);

      gain.gain.setValueAtTime(0, startTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, startTime + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.12);
      osc.stop(startTime + idx * 0.12 + 0.35);
    });
  } catch (e) {
    console.warn('Web Audio playback failed:', e);
  }
}

export function speakPaytmSoundbox(amount: number = 50000, lang: 'hi' | 'en' = 'hi') {
  playPaytmChime();

  setTimeout(() => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any pending speech

        const text = lang === 'hi' 
          ? `Paytm par ${amount === 50000 ? 'pachaas hazaar' : amount} rupaye prapt hue`
          : `Received ${amount.toLocaleString('en-IN')} rupees on Paytm`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.1;

        // Try to pick Hindi or Indian English voice if available
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
        if (indianVoice) {
          utterance.voice = indianVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, 600);
}
