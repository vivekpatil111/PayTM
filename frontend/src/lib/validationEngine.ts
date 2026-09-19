export enum ValidationState {
  PENDING = 'PENDING',
  VERIFYING = 'VERIFYING',
  VERIFIED = 'VERIFIED',
  MISMATCH = 'MISMATCH',
  ERROR = 'ERROR'
}

export interface FormField {
  id: string;
  label: string;
  value: string;
  state: ValidationState;
  source: string;
  errorMessage?: string;
}

export interface FormPage {
  pageId: number;
  title: string;
  fields: FormField[];
}

export const INITIAL_FORM_DATA: FormPage[] = [
  {
    pageId: 1,
    title: 'Personal Details',
    fields: [
      { id: 'firstName', label: 'First Name', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'lastName', label: 'Last Name', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'dob', label: 'Date of Birth', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'gender', label: 'Gender', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'email', label: 'Email Address', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'mobile', label: 'Mobile Number', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 2,
    title: 'Identity & KYC',
    fields: [
      { id: 'pan', label: 'PAN Number', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'aadhaar', label: 'Aadhaar Number', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'ckyc', label: 'CKYC Identifier', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 3,
    title: 'Address Details',
    fields: [
      { id: 'addressLine1', label: 'Flat/House No.', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'street', label: 'Street/Area', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'city', label: 'City', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'pincode', label: 'Pincode', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'state', label: 'State', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 4,
    title: 'Business Information',
    fields: [
      { id: 'businessName', label: 'Business Name', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'vintage', label: 'Business Vintage (Years)', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'category', label: 'Category', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'gstin', label: 'GSTIN (Optional)', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'udyam', label: 'Udyam Registration', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 5,
    title: 'Income & Financials',
    fields: [
      { id: 'annualIncome', label: 'Annual Income', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'monthlyTurnover', label: 'Monthly GMV', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'profitMargin', label: 'Est. Profit Margin', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 6,
    title: 'Bank Details',
    fields: [
      { id: 'accountNo', label: 'Account Number', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'ifsc', label: 'IFSC Code', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'bankName', label: 'Bank Name', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 7,
    title: 'Documents Upload',
    fields: [
      { id: 'panUpload', label: 'PAN Card Scan', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'aadhaarUpload', label: 'Aadhaar Scan', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'bankStatement', label: '6 Months Bank Statement', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 8,
    title: 'Existing Liabilities',
    fields: [
      { id: 'existingLoans', label: 'Number of Active Loans', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'totalEmi', label: 'Total Monthly EMI', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'cibilScore', label: 'Bureau Score', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 9,
    title: 'References',
    fields: [
      { id: 'ref1Name', label: 'Reference 1 Name', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'ref1Phone', label: 'Reference 1 Phone', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'ref2Name', label: 'Reference 2 Name', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'ref2Phone', label: 'Reference 2 Phone', value: '', state: ValidationState.PENDING, source: '' }
    ]
  },
  {
    pageId: 10,
    title: 'Final Declaration',
    fields: [
      { id: 'consent', label: 'Terms & Conditions', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'ipAddress', label: 'Verified IP Address', value: '', state: ValidationState.PENDING, source: '' },
      { id: 'geolocation', label: 'Geo-location Match', value: '', state: ValidationState.PENDING, source: '' }
    ]
  }
];

export type AutofillData = Record<string, { value: string, source: string, valid: ValidationState, error?: string }>;

export const AUTOFILL_MERCHANTS: Record<string, AutofillData> = {
  RAMESH: {
    firstName: { value: 'Ramesh', source: 'Paytm KYC', valid: ValidationState.VERIFIED },
    lastName: { value: 'Sharma', source: 'Paytm KYC', valid: ValidationState.VERIFIED },
    dob: { value: '15/08/1985', source: 'Aadhaar / UIDAI', valid: ValidationState.VERIFIED },
    gender: { value: 'Male', source: 'Aadhaar / UIDAI', valid: ValidationState.VERIFIED },
    email: { value: 'ramesh.sharma@gmail.com', source: 'Paytm Profile', valid: ValidationState.VERIFIED },
    mobile: { value: '+91 9876543210', source: 'Paytm Profile', valid: ValidationState.VERIFIED },
    
    pan: { value: 'ABCDE1234F', source: 'NSDL API', valid: ValidationState.VERIFIED },
    aadhaar: { value: 'XXXX-XXXX-8821', source: 'UIDAI API', valid: ValidationState.VERIFIED },
    ckyc: { value: '1002394821', source: 'CKYC Registry', valid: ValidationState.VERIFIED },

    addressLine1: { value: 'Shop 14, Main Market', source: 'Paytm Records', valid: ValidationState.MISMATCH, error: 'Address mismatch with Aadhaar' },
    street: { value: 'Tonk Road', source: 'Paytm Records', valid: ValidationState.VERIFIED },
    city: { value: 'Jaipur', source: 'Paytm Records', valid: ValidationState.VERIFIED },
    pincode: { value: '302015', source: 'Paytm Records', valid: ValidationState.VERIFIED },
    state: { value: 'Rajasthan', source: 'Paytm Records', valid: ValidationState.VERIFIED },

    businessName: { value: 'Ramesh Kirana Store', source: 'Paytm Merchant App', valid: ValidationState.VERIFIED },
    vintage: { value: '3.5 Years', source: 'Paytm QR History', valid: ValidationState.VERIFIED },
    category: { value: 'Grocery', source: 'Paytm Merchant Profile', valid: ValidationState.VERIFIED },
    gstin: { value: '08ABCDE1234F1Z5', source: 'GST API', valid: ValidationState.VERIFIED },
    udyam: { value: 'UDYAM-RJ-17-00213', source: 'MSME Registry', valid: ValidationState.VERIFIED },

    annualIncome: { value: '₹12,40,000', source: 'Account Aggregator (SBI)', valid: ValidationState.VERIFIED },
    monthlyTurnover: { value: '₹86,400', source: 'Paytm GMV Ledger', valid: ValidationState.VERIFIED },
    profitMargin: { value: '22%', source: 'AI Inference', valid: ValidationState.VERIFIED },

    accountNo: { value: 'XXXX XXXX 4821', source: 'Account Aggregator', valid: ValidationState.VERIFIED },
    ifsc: { value: 'SBIN0004120', source: 'Account Aggregator', valid: ValidationState.VERIFIED },
    bankName: { value: 'State Bank of India', source: 'Penny Drop API', valid: ValidationState.VERIFIED },

    panUpload: { value: 'Auto-fetched via DigiLocker', source: 'DigiLocker API', valid: ValidationState.VERIFIED },
    aadhaarUpload: { value: 'Auto-fetched via DigiLocker', source: 'DigiLocker API', valid: ValidationState.VERIFIED },
    bankStatement: { value: 'Digital via Account Aggregator', source: 'AA Framework', valid: ValidationState.VERIFIED },

    existingLoans: { value: '0', source: 'Experian / CIBIL Bureau', valid: ValidationState.VERIFIED },
    totalEmi: { value: '₹0', source: 'Bureau API', valid: ValidationState.VERIFIED },
    cibilScore: { value: 'NTC / Thin File — Alternative Score: 825 (Paytm GMV)', source: 'CIBIL API (No Score) + Paytm Internal', valid: ValidationState.VERIFIED },

    ref1Name: { value: 'Suresh Kumar', source: 'Paytm Device Contacts', valid: ValidationState.VERIFIED },
    ref1Phone: { value: '+91 9988776655', source: 'Paytm Device Contacts', valid: ValidationState.VERIFIED },
    ref2Name: { value: 'Rakesh Verma', source: 'Paytm Device Contacts', valid: ValidationState.VERIFIED },
    ref2Phone: { value: '+91 9123456789', source: 'Paytm Device Contacts', valid: ValidationState.VERIFIED },

    consent: { value: 'Agreed via 1-Tap OTP', source: 'eSign SDK', valid: ValidationState.VERIFIED },
    ipAddress: { value: '117.214.23.11 (Jaipur)', source: 'Network Fingerprint', valid: ValidationState.VERIFIED },
    geolocation: { value: 'Matched with Shop Address (98%)', source: 'GPS SDK', valid: ValidationState.VERIFIED }
  },
  SUNITA: {
    firstName: { value: 'Sunita', source: 'Paytm KYC', valid: ValidationState.VERIFIED },
    lastName: { value: 'Devi', source: 'Paytm KYC', valid: ValidationState.VERIFIED },
    dob: { value: '12/10/1990', source: 'Aadhaar / UIDAI', valid: ValidationState.VERIFIED },
    gender: { value: 'Female', source: 'Aadhaar / UIDAI', valid: ValidationState.VERIFIED },
    email: { value: 'sunita.tailor@gmail.com', source: 'Paytm Profile', valid: ValidationState.VERIFIED },
    mobile: { value: '+91 8877665544', source: 'Paytm Profile', valid: ValidationState.VERIFIED },
    
    pan: { value: 'XYZAB5678C', source: 'NSDL API', valid: ValidationState.VERIFIED },
    aadhaar: { value: 'XXXX-XXXX-1122', source: 'UIDAI API', valid: ValidationState.VERIFIED },
    ckyc: { value: '2003847591', source: 'CKYC Registry', valid: ValidationState.VERIFIED },

    addressLine1: { value: 'House 42, Gali No 3', source: 'Paytm Records', valid: ValidationState.VERIFIED },
    street: { value: 'Shivaji Nagar', source: 'Paytm Records', valid: ValidationState.VERIFIED },
    city: { value: 'Pune', source: 'Paytm Records', valid: ValidationState.VERIFIED },
    pincode: { value: '411005', source: 'Paytm Records', valid: ValidationState.VERIFIED },
    state: { value: 'Maharashtra', source: 'Paytm Records', valid: ValidationState.VERIFIED },

    businessName: { value: 'Sunita Boutique & Tailoring', source: 'Paytm Merchant App', valid: ValidationState.VERIFIED },
    vintage: { value: '1.2 Years', source: 'Paytm QR History', valid: ValidationState.VERIFIED },
    category: { value: 'Tailoring/Apparel', source: 'Paytm Merchant Profile', valid: ValidationState.VERIFIED },
    gstin: { value: 'Unregistered (Below Threshold)', source: 'GST API', valid: ValidationState.VERIFIED },
    udyam: { value: 'Not Available', source: 'MSME Registry', valid: ValidationState.PENDING },

    annualIncome: { value: '₹3,50,000', source: 'Account Aggregator', valid: ValidationState.VERIFIED },
    monthlyTurnover: { value: '₹22,000', source: 'Paytm GMV Ledger', valid: ValidationState.VERIFIED },
    profitMargin: { value: '45%', source: 'AI Inference', valid: ValidationState.VERIFIED },

    accountNo: { value: 'XXXX XXXX 9182', source: 'Account Aggregator', valid: ValidationState.VERIFIED },
    ifsc: { value: 'MAHB0001234', source: 'Account Aggregator', valid: ValidationState.VERIFIED },
    bankName: { value: 'Bank of Maharashtra', source: 'Penny Drop API', valid: ValidationState.VERIFIED },

    panUpload: { value: 'Auto-fetched via DigiLocker', source: 'DigiLocker API', valid: ValidationState.VERIFIED },
    aadhaarUpload: { value: 'Auto-fetched via DigiLocker', source: 'DigiLocker API', valid: ValidationState.VERIFIED },
    bankStatement: { value: 'Digital via Account Aggregator', source: 'AA Framework', valid: ValidationState.VERIFIED },

    existingLoans: { value: '0', source: 'Experian / CIBIL Bureau', valid: ValidationState.VERIFIED },
    totalEmi: { value: '₹0', source: 'Bureau API', valid: ValidationState.VERIFIED },
    cibilScore: { value: 'NTC (New To Credit)', source: 'CIBIL API', valid: ValidationState.VERIFIED },

    ref1Name: { value: 'Prakash Rao', source: 'Paytm Device Contacts', valid: ValidationState.VERIFIED },
    ref1Phone: { value: '+91 9988771122', source: 'Paytm Device Contacts', valid: ValidationState.VERIFIED },
    ref2Name: { value: 'Kavita Joshi', source: 'Paytm Device Contacts', valid: ValidationState.VERIFIED },
    ref2Phone: { value: '+91 9123451122', source: 'Paytm Device Contacts', valid: ValidationState.VERIFIED },

    consent: { value: 'Agreed via 1-Tap OTP', source: 'eSign SDK', valid: ValidationState.VERIFIED },
    ipAddress: { value: '103.22.14.88 (Pune)', source: 'Network Fingerprint', valid: ValidationState.VERIFIED },
    geolocation: { value: 'Matched with Shop Address (94%)', source: 'GPS SDK', valid: ValidationState.VERIFIED }
  }
};
