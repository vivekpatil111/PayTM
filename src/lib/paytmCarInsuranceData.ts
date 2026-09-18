export interface CarPlan {
  id: string;
  partner: string;
  type: 'comprehensive' | 'third_party' | 'pay_as_you_drive';
  idv: string;
  claimSettlement: string;
  basePrice: number;
  popularChoice?: boolean;
  perk?: string;
  drivingLimit?: string;
}

export const MOCK_VEHICLE_DATA = {
  vehicleNumber: 'MH 14 CC 7734',
  makeModel: 'Maruti Zen Estilo',
  variant: '1.0 VXI ABS',
  fuel: 'Petrol',
  year: 2010,
  rto: 'Pimpri-Chinchwad, Pune',
  currentIdv: 126000,
  idvRange: {
    min: 102000,
    recommended: 126000,
    max: 135000
  }
};

export const CAR_COMPREHENSIVE_PLANS: CarPlan[] = [
  {
    id: 'tata_aig_comp',
    partner: 'Tata AIG',
    type: 'comprehensive',
    idv: '₹1.26 Lakhs',
    claimSettlement: '98%',
    basePrice: 3224,
    popularChoice: true,
    perk: 'Cashless garage network of 7,200+ across India'
  },
  {
    id: 'icici_pay_drive',
    partner: 'ICICI Lombard',
    type: 'pay_as_you_drive',
    idv: '₹1.02 Lakhs',
    claimSettlement: '93%',
    basePrice: 5081,
    drivingLimit: '5000 km/year',
    perk: 'Pay As You Drive plan based on yearly odometer'
  },
  {
    id: 'icici_std_comp',
    partner: 'ICICI Lombard',
    type: 'comprehensive',
    idv: '₹1.02 Lakhs',
    claimSettlement: '93%',
    basePrice: 5737
  },
  {
    id: 'zurich_kotak_comp',
    partner: 'Zurich Kotak General',
    type: 'comprehensive',
    idv: '₹1.15 Lakhs',
    claimSettlement: '98%',
    basePrice: 5839
  }
];

export const CAR_THIRD_PARTY_PLANS: CarPlan[] = [
  {
    id: 'digit_tp',
    partner: 'Go Digit',
    type: 'third_party',
    idv: 'Mandatory',
    claimSettlement: '97%',
    basePrice: 2094,
    perk: 'Free Road Side Assistance'
  },
  {
    id: 'tata_tp',
    partner: 'Tata AIG',
    type: 'third_party',
    idv: 'Mandatory',
    claimSettlement: '98%',
    basePrice: 2094,
    popularChoice: true
  },
  {
    id: 'sbi_tp',
    partner: 'SBI General',
    type: 'third_party',
    idv: 'Mandatory',
    claimSettlement: '95%',
    basePrice: 2094,
    perk: 'With Towing Assistance'
  },
  {
    id: 'acko_tp',
    partner: 'Acko',
    type: 'third_party',
    idv: 'Mandatory',
    claimSettlement: '96%',
    basePrice: 2094
  }
];

export const CAR_ADDONS = [
  {
    id: 'pa_cover',
    name: '15 Lakh Personal Accident Cover',
    subtitle: 'By IndusInd GIC • Valid for 1 year',
    price: 354,
    isMandatory: true,
    tag: 'Mandatory by Law'
  },
  {
    id: 'rsa_cover',
    name: '24x7 Roadside Assistance',
    subtitle: 'Towing, flat tyre, jumpstart & emergency fuel',
    price: 199,
    isMandatory: false,
    tag: 'Recommended'
  }
];
