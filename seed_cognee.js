import fetch from 'node-fetch';

const SEED_DATA = [
  {
    merchantId: 'MERCH_JAIPUR_0821',
    text: 'Merchant Ramesh Sharma (MERCH_JAIPUR_0821) took a loan of 20000 rupees 6 months ago. The loan was fully repaid on time without any bounces. Trust score is high and the merchant is eligible for a limit upgrade up to 100000 rupees.'
  },
  {
    merchantId: 'MERCH_PUNE_0411',
    text: 'Merchant Sunita Tailors (MERCH_PUNE_0411) is a first-time borrower. There is no previous credit history or past loans in the record. The risk profile is standard.'
  }
];

async function seedGraph() {
  console.log('🌱 Starting to seed Cognee Cloud Knowledge Graph...');
  
  for (const data of SEED_DATA) {
    try {
      console.log(`\n⏳ Sending data for ${data.merchantId}...`);
      const response = await fetch('http://localhost:5000/api/cognee/remember', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const json = await response.json();
      if (response.ok) {
        console.log(`✅ Success for ${data.merchantId}:`, json.message);
      } else {
        console.error(`❌ Failed for ${data.merchantId}:`, json.error || json);
      }
    } catch (err) {
      console.error(`❌ Error connecting to backend:`, err.message);
    }
  }
  
  console.log('\n🏁 Seeding process completed.');
}

seedGraph();
