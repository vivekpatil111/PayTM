export function calculatePremium(category: string, answers: Record<string, any>) {
  let baseRate = 0;
  let coverage = 0;
  let stabilityFactor = 1.0;
  
  switch (category) {
    case 'health': {
      // Default to 10 Lakh Recommended as per Image 8
      const isFamily = answers.members && answers.members !== 'Only me';
      coverage = isFamily ? 1000000 : 500000;
      
      // Real Paytm pricing from Image 8:
      // ₹5 Lakh = ₹689/mo (₹8,268/yr)
      // ₹10 Lakh = ₹804/mo (₹9,648/yr)
      const baseMonthly = coverage === 1000000 ? 804 : 689;
      const baseYearly = coverage === 1000000 ? 9648 : 8268;

      let multiplier = 1.0;
      if (answers.age === '46-55 years') multiplier = 1.25;
      if (answers.age === '56-65 years') multiplier = 1.5;
      if (answers.health_issues && answers.health_issues !== 'None (100% Fit)') multiplier *= 1.15;

      const monthlyPremium = Math.round(baseMonthly * multiplier);
      const annualPremium = Math.round(baseYearly * multiplier);

      return {
        coverage,
        monthlyPremium,
        annualPremium,
        dailyPremium: (annualPremium / 365).toFixed(2),
        stabilityFactor: multiplier,
        recommendedTier: '₹10 Lakh',
        cashlessHospitalsCount: 458,
        city: answers.pincode?.includes('Pune') || answers.pincode === '411014' ? 'Pune' : 'Pune'
      };
    }
      
    case 'car': {
      const isThirdParty = answers.plan_type && answers.plan_type.includes('Third Party');
      const isPayDrive = answers.plan_type && answers.plan_type.includes('Pay As You Drive');
      const hasPACover = !answers.pa_cover || answers.pa_cover.includes('+₹354');

      let basePrice = 3224; // Tata AIG Comprehensive (Default Popular Choice)
      let partner = 'Tata AIG';
      let idv = '₹1.26 Lakhs';
      let coverage = 126000;

      if (isThirdParty) {
        basePrice = 2094;
        partner = 'Go Digit';
        idv = 'Mandatory 3rd Party';
        coverage = 500000;
      } else if (isPayDrive) {
        basePrice = 5081;
        partner = 'ICICI Lombard';
        idv = '₹1.02 Lakhs';
        coverage = 102000;
      }

      const paCoverPrice = hasPACover ? 354 : 0;
      const subtotal = basePrice + paCoverPrice;
      const gst = Math.round(subtotal * 0.18);
      const totalAmount = subtotal + gst;

      return {
        coverage,
        idv,
        basePrice,
        paCoverPrice,
        gst,
        annualPremium: totalAmount,
        dailyPremium: (totalAmount / 365).toFixed(2),
        vehicleNumber: answers.vehicle_number || 'MH 14 CC 7734',
        vehicleModel: 'Maruti Zen Estilo (Petrol 1.0 VXI ABS, 2010)',
        stabilityFactor: 1.0,
        partner
      };
    }
      
    case 'bike':
      baseRate = 0.02;
      coverage = 100000;
      break;
      
    case 'home':
      baseRate = 0.0006;
      coverage = answers.value === '₹50 lakh - 1 crore' ? 7500000 : 3000000;
      break;
      
    case 'shop':
      baseRate = 0.02;
      coverage = answers.value === '₹25-50 lakh' ? 5000000 : 1000000;
      if (answers.loan === 'Haan') stabilityFactor = 0.9; // Discount for loan customers
      break;
  }
  
  const annualPremium = coverage * baseRate * stabilityFactor;
  const dailyPremium = annualPremium / 365;
  
  return {
    coverage,
    annualPremium: Math.round(annualPremium),
    dailyPremium: dailyPremium.toFixed(2),
    stabilityFactor,
  };
}
