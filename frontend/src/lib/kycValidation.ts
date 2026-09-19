/**
 * KYC Format Validators for Paytm Saarthi Insurance Flow
 *
 * These are client-side format checks only (no real API call).
 * A mock "verification" delay is added to simulate a verification pipeline
 * without pretending to call a real Aadhaar/PAN API.
 */

// ── Aadhaar ────────────────────────────────────────────────────────────────────
// Format: 12 digits, must not start with 0 or 1 (UIDAI spec)
export function validateAadhaar(value: string): { valid: boolean; error?: string } {
  const cleaned = value.replace(/\s/g, '');
  if (!/^\d{12}$/.test(cleaned)) {
    return { valid: false, error: 'Aadhaar number 12 digit ka hona chahiye (sirf numbers)' };
  }
  if (/^[01]/.test(cleaned)) {
    return { valid: false, error: 'Aadhaar number 0 ya 1 se shuru nahi ho sakta' };
  }
  return { valid: true };
}

// ── PAN ────────────────────────────────────────────────────────────────────────
// Format: AAAAA9999A (5 alpha + 4 numeric + 1 alpha), always uppercase
export function validatePAN(value: string): { valid: boolean; error?: string } {
  const cleaned = value.trim().toUpperCase();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'PAN format galat hai. Example: ABCDE1234F'
    };
  }
  return { valid: true };
}

// ── Mobile ─────────────────────────────────────────────────────────────────────
// 10-digit Indian mobile, starting with 6–9
export function validateMobile(value: string): { valid: boolean; error?: string } {
  const cleaned = value.replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { valid: false, error: 'Mobile number 10 digit ka hona chahiye (6-9 se shuru)' };
  }
  return { valid: true };
}

// ── Pincode ─────────────────────────────────────────────────────────────────────
// 6-digit Indian postal code
export function validatePincode(value: string): { valid: boolean; error?: string } {
  if (!/^\d{6}$/.test(value.trim())) {
    return { valid: false, error: 'Pincode 6 digit ka hona chahiye' };
  }
  return { valid: true };
}

// ── Date of Birth ──────────────────────────────────────────────────────────────
// Must be 18+ years and not in the future
export function validateDOB(value: string): { valid: boolean; error?: string } {
  const dob = new Date(value);
  if (isNaN(dob.getTime())) {
    return { valid: false, error: 'Valid date of birth enter karein (YYYY-MM-DD)' };
  }
  const now = new Date();
  const age = now.getFullYear() - dob.getFullYear();
  if (age < 18) {
    return { valid: false, error: 'Age 18 saal se kam nahi honi chahiye' };
  }
  if (dob > now) {
    return { valid: false, error: 'Date of birth future mein nahi ho sakti' };
  }
  return { valid: true };
}

// ── Mock Verification Delay ──────────────────────────────────────────────────
// Simulates a 1.2s API roundtrip to Aadhaar/PAN verification service
export async function mockVerifyKyc(type: 'aadhaar' | 'pan' | 'mobile' | 'pincode' | 'dob', value: string): Promise<{
  verified: boolean;
  maskedValue?: string;
  error?: string;
}> {
  await new Promise(r => setTimeout(r, 1200));

  const validators: Record<string, (v: string) => { valid: boolean; error?: string }> = {
    aadhaar: validateAadhaar,
    pan: validatePAN,
    mobile: validateMobile,
    pincode: validatePincode,
    dob: validateDOB
  };

  const result = validators[type](value);
  if (!result.valid) {
    return { verified: false, error: result.error };
  }

  // Mask sensitive values for display
  const maskedValue = type === 'aadhaar'
    ? `XXXX XXXX ${value.replace(/\s/g, '').slice(-4)}`
    : type === 'pan'
      ? `${value[0]}XXXX${value.slice(-5)}`
      : type === 'mobile'
        ? `+91 XXXXX ${value.slice(-5)}`
        : value;

  return { verified: true, maskedValue };
}
