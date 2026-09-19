// privacy/piiMasker.js

const state = {
  mapping: new Map(), // To store original -> token mapping
  counter: 0,
};

function maskPII(text) {
  let maskedText = text;
  const traceDetails = []; // To send back exactly what was redacted to the trace panel

  // Mask Indian Phone Numbers (e.g. 9876543210, +919876543210)
  const phoneRegex = /(?:\+91|91)?\s?[789]\d{9}/g;
  maskedText = maskedText.replace(phoneRegex, (match) => {
    state.mapping.set('[PHONE_REDACTED]', match);
    traceDetails.push(`Phone: ${match} -> [PHONE_REDACTED]`);
    return '[PHONE_REDACTED]';
  });

  // Mask Aadhaar (e.g. 1234-5678-9012, 123456789012)
  const aadhaarRegex = /\d{4}[\s-]?\d{4}[\s-]?\d{4}/g;
  maskedText = maskedText.replace(aadhaarRegex, (match) => {
    state.mapping.set('[AADHAAR_REDACTED]', match);
    traceDetails.push(`Aadhaar: ${match} -> [AADHAAR_REDACTED]`);
    return '[AADHAAR_REDACTED]';
  });

  // Mask PAN (e.g. ABCDE1234F)
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/gi;
  maskedText = maskedText.replace(panRegex, (match) => {
    state.mapping.set('[PAN_REDACTED]', match);
    traceDetails.push(`PAN: ${match} -> [PAN_REDACTED]`);
    return '[PAN_REDACTED]';
  });

  // Simple Name Masking for Ramesh (Demo purposes)
  const nameRegex = /Ramesh( Sharma)?/gi;
  maskedText = maskedText.replace(nameRegex, (match) => {
    state.mapping.set('MERCH_0821', match);
    traceDetails.push(`Name: ${match} -> MERCH_0821`);
    return 'MERCH_0821';
  });

  return { maskedText, traceDetails };
}

function demaskPII(text) {
  let demaskedText = text;
  
  // Replace all known tokens with their original values
  for (const [token, original] of state.mapping.entries()) {
    // Regex with global flag to replace all occurrences
    const regex = new RegExp(`\\b${token}\\b|\\[${token}\\]|${token.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}`, 'gi');
    demaskedText = demaskedText.replace(regex, original);
  }

  return demaskedText;
}

export { maskPII, demaskPII };
