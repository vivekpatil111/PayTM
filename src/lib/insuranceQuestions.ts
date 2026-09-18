export interface InsuranceQuestion {
  id: string;
  question: string;
  type?: 'text' | 'number';
  options?: string[];
}

export const insuranceQuestions: Record<string, InsuranceQuestion[]> = {
  health: [
    { 
      id: 'members', 
      question: 'Whom do you want to insure?', 
      options: ['Only me', 'Me & my spouse', 'Me, my spouse & 1 child', 'Me, my spouse & 2 children'] 
    },
    { 
      id: 'age', 
      question: 'What age group do you fall into?', 
      options: ['18-35 years', '36-45 years', '46-55 years', '56-65 years'] 
    },
    { 
      id: 'health_issues', 
      question: 'Any existing illness or medical history?', 
      options: ['None (100% Fit)', 'Diabetes', 'Hypertension / BP', 'Other'] 
    },
    {
      id: 'pincode',
      question: 'What is your city/pincode for nearest cashless hospitals?',
      options: ['411014 (Pune, MH)', '302001 (Jaipur, RJ)', '400001 (Mumbai, MH)', '110001 (Delhi, DL)']
    }
  ],
  car: [
    { 
      id: 'vehicle_number', 
      question: 'Enter your vehicle number to auto-fetch RTO details:', 
      options: ['MH 14 CC 7734', 'DL 01 AB 1234', 'RJ 14 CC 9999'] 
    },
    { 
      id: 'plan_type', 
      question: 'Which coverage plan suits your daily driving?', 
      options: [
        'Comprehensive (Own Damage + 3rd Party)', 
        'Pay As You Drive (5000 km/year)', 
        'Third Party Only (Legal Mandate)'
      ] 
    },
    { 
      id: 'pa_cover', 
      question: 'Include mandatory ₹15 Lakh Personal Accident Cover by IndusInd GIC?', 
      options: ['Yes, include ₹15L PA Cover (+₹354)', 'Already have active PA Cover'] 
    }
  ],
  bike: [
    { id: 'model', question: 'Bike ka make aur model kya hai?', type: 'text' },
    { id: 'year', question: 'Bike kitne saal purani hai?', type: 'number' },
    { id: 'city', question: 'Aap kis city mein rehte ho?', type: 'text' },
  ],
  home: [
    { id: 'city', question: 'Ghar kahan hai?', type: 'text' },
    { id: 'value', question: 'Ghar ka approx value kitna hai?', options: ['₹10-25 lakh', '₹25-50 lakh', '₹50 lakh - 1 crore', '₹1 crore+'] },
    { id: 'family', question: 'Family ke saath rehte ho?', options: ['Akela', 'Couple', 'Family with kids'] },
  ],
  shop: [
    { id: 'type', question: 'Shop ka type kya hai?', options: ['Kirana', 'Electronics', 'Clothing', 'Restaurant', 'Other'] },
    { id: 'value', question: 'Shop ka approx value kitna hai?', options: ['₹5-10 lakh', '₹10-25 lakh', '₹25-50 lakh', '₹50 lakh+'] },
    { id: 'loan', question: 'Kya aapne Paytm se loan liya hai?', options: ['Haan', 'Nahi'] },
  ],
};
