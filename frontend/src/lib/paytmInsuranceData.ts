export interface CoverTier {
  amount: number;
  label: string;
  monthly: number;
  yearly: number;
  isRecommended?: boolean;
}

export interface NetworkHospital {
  name: string;
  address: string;
  pincode: string;
  type: string;
}

export interface InsurerPartner {
  name: string;
  subtitle: string;
  logo: string;
  claimSettlement: string;
  claimsSettled: string;
  lifeInsured: string;
  rating: number;
  features: string[];
}

export const PAYTM_COVER_TIERS: CoverTier[] = [
  { amount: 500000, label: '₹5 Lakh', monthly: 689, yearly: 8268 },
  { amount: 1000000, label: '₹10 Lakh', monthly: 804, yearly: 9648, isRecommended: true },
  { amount: 2000000, label: '₹20 Lakh', monthly: 976, yearly: 11712 },
  { amount: 5000000, label: '₹50 Lakh', monthly: 1321, yearly: 15852 },
  { amount: 10000000, label: '₹1 Crore', monthly: 1436, yearly: 17232 },
];

export const PAYTM_INSURERS: InsurerPartner[] = [
  {
    name: 'ICICI Lombard',
    subtitle: 'Nibhaye Vaade',
    logo: '🛡️',
    claimSettlement: '96.26%',
    claimsSettled: '16 Lakh+',
    lifeInsured: '2.17 Cr+',
    rating: 4.8,
    features: [
      'Exclusive no room rent cap on any room type',
      '100% hospital bills covered (Consumables + Zero co-pay)',
      '1 OPD visit/month & 24x7 Doctor-on-call',
      '10% extra cover for each claim-free year',
      '100% cover restore for unrelated illness',
      'Instant policy with zero medical tests'
    ]
  },
  {
    name: 'Aditya Birla Capital',
    subtitle: 'Health Insurance',
    logo: '🏢',
    claimSettlement: '95.1%',
    claimsSettled: '12 Lakh+',
    lifeInsured: '1.8 Cr+',
    rating: 4.6,
    features: [
      'Automatic monthly payments via UPI Autopay',
      'Day-1 coverage for accidental emergencies',
      'Free annual health check-up for all members',
      'Cashless treatment in 10,000+ network hospitals'
    ]
  }
];

export const NETWORK_HOSPITALS_PUNE: NetworkHospital[] = [
  {
    name: 'Aadhar Hospital Multispeciality & ICU',
    address: 'Old, Pune, Maharashtra',
    pincode: '412101',
    type: 'Multispeciality'
  },
  {
    name: 'Aarogyam Multispeciality Hospital',
    address: 'Chakan Talegaon Road, Opp Marathi Shala, Ranubaimala, Pune',
    pincode: '410501',
    type: 'Multispeciality'
  },
  {
    name: 'Aarya Hospital',
    address: 'In Front Of Kumar Princeville Society, Moshi - Jadhavwadi Pcmc, Pune',
    pincode: '411026',
    type: 'General Hospital'
  },
  {
    name: 'Aayush Hospital',
    address: '1442, Naigoan Chowk, Kunjirawadi, Italuka-Haveli, Pune',
    pincode: '412201',
    type: 'Super Speciality'
  },
  {
    name: 'Accord Hospital (Sant Dnyaneshwar Medical Foundation)',
    address: 'Santnagar, Plot No: 1/1, Sector No: 4, Moshi Pradhikaran, Pune',
    pincode: '412105',
    type: 'Foundation Hospital'
  },
  {
    name: 'Aditya Birla Health Services Limited',
    address: 'Survey No. 31, Aditya Birla Hospital Marg, Chinchwad, Pune',
    pincode: '411033',
    type: 'Tertiary Care & Trauma'
  },
  {
    name: 'Agarwal Maternity Hospital',
    address: 'Sangharsh Chowk, Kharadi Road, Pune',
    pincode: '411014',
    type: 'Maternity & Childcare'
  },
  {
    name: 'Aims Hospital & Research Centre',
    address: 'Parihaar Clinic, Aundh, Pune',
    pincode: '411007',
    type: 'Research & Multispeciality'
  },
  {
    name: 'Akash Eye Clinic & Laser Centre',
    address: '1St Floor, City Space Building, Above Mahindra Showroom, Viman Nagar, Pune',
    pincode: '411014',
    type: 'Eye Clinic'
  }
];

export const DEFAULT_PREFILLED_KYC = {
  fullName: 'Ramesh Kumar',
  gender: 'Male',
  dob: '14/08/1988',
  age: '35',
  mobileNumber: '9322019398',
  email: 'ramesh.merchant@gmail.com',
  pincode: '411014',
  city: 'Pune, Maharashtra',
  address: 'Shop 14, Kharadi Main Market, Pune',
  // KYC identifiers — used for format validation in the insurance buy flow
  aadhaarNumber: '234567891234',  // 12-digit, mock (not linked to any real identity)
  pan: 'RAMEK1234M'               // AAAAA9999A format, mock
};
