export function matchPartner(category: string, premium: number, coverage: number) {
  const partners: Record<string, { name: string, rating: number, claimSettlement: string }[]> = {
    health: [
      { 
        name: 'ICICI Lombard', 
        rating: 4.8, 
        claimSettlement: '96.26%',
        claimsSettled: '16 Lakh+',
        lifeInsured: '2.17 Cr+',
        subtitle: 'Nibhaye Vaade',
        logo: '🛡️'
      },
      { 
        name: 'Aditya Birla Capital', 
        rating: 4.6, 
        claimSettlement: '95.1%',
        claimsSettled: '12 Lakh+',
        lifeInsured: '1.8 Cr+',
        subtitle: 'Health Insurance',
        logo: '🏢'
      },
    ],
    car: [
      { name: 'ICICI Lombard', rating: 4.5, claimSettlement: '96.26%' },
      { name: 'Bajaj Allianz', rating: 4.2, claimSettlement: '95.1%' },
      { name: 'TATA AIG', rating: 4.3, claimSettlement: '94.8%' },
    ],
    bike: [
      { name: 'ICICI Lombard', rating: 4.5, claimSettlement: '96.26%' },
      { name: 'Bajaj Allianz', rating: 4.2, claimSettlement: '95.1%' },
    ],
    home: [
      { name: 'ICICI Lombard', rating: 4.5, claimSettlement: '96.26%' },
      { name: 'HDFC Ergo', rating: 4.3, claimSettlement: '95.8%' },
      { name: 'SBI General', rating: 4.1, claimSettlement: '93.5%' },
    ],
    shop: [
      { name: 'ICICI Lombard', rating: 4.5, claimSettlement: '96.26%' },
      { name: 'Bajaj Allianz', rating: 4.2, claimSettlement: '95.1%' },
      { name: 'New India Assurance', rating: 4.0, claimSettlement: '92.8%' },
    ],
  };
  
  // Sort by rating (descending)
  const availablePartners = partners[category] || partners['health'];
  return availablePartners.sort((a, b) => b.rating - a.rating)[0];
}
