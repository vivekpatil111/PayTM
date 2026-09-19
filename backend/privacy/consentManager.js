// privacy/consentManager.js

/**
 * Mocks an RBI Account Aggregator Consent check
 * Returns valid consent for Ramesh Demo Merchant
 */
function verifyConsent(merchantId = "MERCH_0821") {
  // In a real world scenario, this queries the Setu / Onemoney AA gateway
  return {
    valid: true,
    consentId: `CONSENT_${merchantId}_${Date.now()}`,
    expiresIn: "30 days",
    dataTypes: ["QR", "BANK", "KYC"],
    provider: "RBI Account Aggregator (Mock)",
    purpose: "Loan Underwriting"
  };
}

export { verifyConsent };
