export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te';

export const LANGUAGES: { code: SupportedLanguage; label: string; nativeLabel: string; speechLocale: string }[] = [
  { code: 'en', label: 'English',  nativeLabel: 'English',      speechLocale: 'en-IN' },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिंदी',          speechLocale: 'hi-IN' },
  { code: 'mr', label: 'Marathi',  nativeLabel: 'मराठी',          speechLocale: 'mr-IN' },
  { code: 'bn', label: 'Bengali',  nativeLabel: 'বাংলা',           speechLocale: 'bn-IN' },
  { code: 'ta', label: 'Tamil',    nativeLabel: 'தமிழ்',           speechLocale: 'ta-IN' },
  { code: 'te', label: 'Telugu',   nativeLabel: 'తెలుగు',          speechLocale: 'te-IN' },
];

// ─────────────────────────────────────────────────────────────────────────────
//  TRANSLATION DICTIONARY
// ─────────────────────────────────────────────────────────────────────────────
const translations: Record<SupportedLanguage, Record<string, string>> = {
  // English is always passthrough
  en: {},

  // ── HINDI ──────────────────────────────────────────────────────────────────
  hi: {
    // ── Business Loan (existing) ─────────────────────────────────────
    "Business Loan Application": "व्यापार ऋण आवेदन",
    "Estimated Time: 45 Mins": "अनुमानित समय: 45 मिनट",
    "Page": "पृष्ठ",
    "of": "में से",
    "Next": "अगला",
    "Previous": "पिछला",
    "Save & Next": "सेव और अगला",
    "Basic Business Identity": "बुनियादी व्यापार पहचान",
    "Personal KYC": "व्यक्तिगत केवाईसी",
    "Business PAN Number": "व्यापार पैन नंबर",
    "GSTIN": "जीएसटीआईएन",
    "Registered Business Name": "पंजीकृत व्यापार का नाम",
    "Aadhaar Number": "आधार नंबर",
    "First Name (As per PAN)": "पहला नाम (पैन के अनुसार)",
    "Last Name": "अंतिम नाम",
    "Date of Birth": "जन्म तिथि",

    // ── Insurance Agent Header / Nav ──────────────────────────────────
    "Paytm Saarthi Insurance Copilot": "पेटीएम सारथी बीमा कोपायलट",
    "Change Category": "श्रेणी बदलें",
    "Quick Select": "जल्दी चुनें",
    "Type your response...": "अपना जवाब लिखें...",

    // ── Category Selector ─────────────────────────────────────────────
    "What would you like to insure today?": "आज आप क्या बीमा करवाना चाहते हैं?",
    "Health Insurance": "स्वास्थ्य बीमा",
    "Car Insurance": "कार बीमा",
    "Bike Insurance": "बाइक बीमा",
    "Home Insurance": "गृह बीमा",
    "Shop Insurance": "दुकान बीमा",
    "Protection for you & family": "आप और परिवार के लिए सुरक्षा",
    "4-Wheeler coverage": "4-पहिया वाहन कवरेज",
    "2-Wheeler coverage": "2-पहिया वाहन कवरेज",
    "Protect your home": "अपना घर सुरक्षित करें",
    "Safeguard your business": "अपना व्यापार सुरक्षित करें",

    // ── Health Insurance – Agent greetings ───────────────────────────
    "Namaste Ramesh ji! 🙏 Main aapka Paytm Saarthi Insurance Copilot hoon. Aapke aur parivaar ke liye best curated health protection plan tayyar karte hain.":
      "नमस्ते रमेश जी! 🙏 मैं आपका पेटीएम सारथी इंश्योरेंस कोपायलट हूँ। आपके और परिवार के लिए बेहतरीन स्वास्थ्य सुरक्षा योजना तैयार करते हैं।",

    // ── Car Insurance – Agent greetings ─────────────────────────────
    "Namaste Ramesh ji! 🚗 Apni car insurance ko 2 minutes mein renew karein aur challans se bachein.":
      "नमस्ते रमेश जी! 🚗 अपनी कार इंश्योरेंस 2 मिनट में रिन्यू करें और ट्रैफिक चालान से बचें।",

    // ── Health Questions ──────────────────────────────────────────────
    "Whom do you want to insure?": "आप किसे बीमित करना चाहते हैं?",
    "Only me": "केवल मैं",
    "Me & my spouse": "मैं और मेरी पत्नी/पति",
    "Me, my spouse & 1 child": "मैं, पत्नी/पति और 1 बच्चा",
    "Me, my spouse & 2 children": "मैं, पत्नी/पति और 2 बच्चे",

    "What age group do you fall into?": "आप किस आयु वर्ग में आते हैं?",
    "18-35 years": "18-35 वर्ष",
    "36-45 years": "36-45 वर्ष",
    "46-55 years": "46-55 वर्ष",
    "56-65 years": "56-65 वर्ष",

    "Any existing illness or medical history?": "कोई मौजूदा बीमारी या चिकित्सा इतिहास है?",
    "None (100% Fit)": "कोई नहीं (100% स्वस्थ)",
    "Diabetes": "मधुमेह",
    "Hypertension / BP": "उच्च रक्तचाप / बीपी",
    "Other": "अन्य",

    "What is your city/pincode for nearest cashless hospitals?": "नजदीकी कैशलेस अस्पताल के लिए अपना शहर/पिनकोड बताएं?",
    "411014 (Pune, MH)": "411014 (पुणे, मह.)",
    "302001 (Jaipur, RJ)": "302001 (जयपुर, रा.)",
    "400001 (Mumbai, MH)": "400001 (मुंबई, मह.)",
    "110001 (Delhi, DL)": "110001 (दिल्ली)",

    // ── Car Questions ─────────────────────────────────────────────────
    "Enter your vehicle number to auto-fetch RTO details:": "RTO विवरण स्वतः लाने के लिए वाहन नंबर दर्ज करें:",
    "Which coverage plan suits your daily driving?": "आपकी रोज़ाना ड्राइविंग के लिए कौन सी कवरेज योजना सही है?",
    "Comprehensive (Own Damage + 3rd Party)": "व्यापक (स्वयं क्षति + तृतीय पक्ष)",
    "Pay As You Drive (5000 km/year)": "जितना चलाएं उतना भुगतान (5000 km/वर्ष)",
    "Third Party Only (Legal Mandate)": "केवल तृतीय पक्ष (कानूनी अनिवार्य)",
    "Include mandatory ₹15 Lakh Personal Accident Cover by IndusInd GIC?": "IndusInd GIC का ₹15 लाख अनिवार्य व्यक्तिगत दुर्घटना कवर शामिल करें?",
    "Yes, include ₹15L PA Cover (+₹354)": "हाँ, ₹15L PA कवर शामिल करें (+₹354)",
    "Already have active PA Cover": "पहले से सक्रिय PA कवर है",

    // ── Quote / Success screen ────────────────────────────────────────
    "Download Policy PDF": "पॉलिसी PDF डाउनलोड करें",
    "Explore Another Insurance": "अन्य बीमा देखें",
    "Car Insurance Issued!": "कार बीमा जारी!",
    "Health Policy Issued!": "स्वास्थ्य पॉलिसी जारी!",
    "Instant Issuance Active": "तत्काल जारी सक्रिय",
    "Policy Number": "पॉलिसी नंबर",
    "Insurer": "बीमाकर्ता",
    "Insured Vehicle": "बीमित वाहन",
    "Personal Accident": "व्यक्तिगत दुर्घटना",
    "Challan Status": "चालान स्थिति",
    "UPI Autopay Mandate": "UPI ऑटोपे मैंडेट",
    "Cashless Coverage": "कैशलेस कवरेज",
    "Protected (0 Challans)": "सुरक्षित (0 चालान)",
    "₹15 Lakh Active": "₹15 लाख सक्रिय",
    "458 Hospitals (Pune)": "458 अस्पताल (पुणे)",
    "Policy active on VAHAN & mParivahan. You are 100% protected against traffic challans.":
      "नीति VAHAN और mParivahan पर सक्रिय है। आप ट्रैफिक चालान से 100% सुरक्षित हैं।",
    "Policy Document & Digital Health Card has been issued under IRDAI guidelines.":
      "IRDAI दिशानिर्देशों के तहत पॉलिसी दस्तावेज़ और डिजिटल हेल्थ कार्ड जारी किया गया है।",
    "PDF Policy document sent via WhatsApp to": "WhatsApp पर PDF पॉलिसी दस्तावेज़ भेजा गया:",

    // ── Loan agent (existing) ─────────────────────────────────────────
    "Hi, I am Saarthi. Since you're logged into Paytm for Business, I can fetch most of your details securely from your ledgers and KYC. Tap the sparkle to start!":
      "नमस्ते, मैं सारथी हूँ। चूंकि आप पेटीएम फॉर बिजनेस में लॉग इन हैं, मैं आपके लेजर और केवाईसी से आपके अधिकांश विवरण सुरक्षित रूप से प्राप्त कर सकता हूँ। शुरू करने के लिए स्पार्कल पर टैप करें!",
    "Page complete. You can review, edit manually, or ask me questions. Click Save & Next to proceed.":
      "पृष्ठ पूरा हुआ। आप समीक्षा कर सकते हैं, मैन्युअल रूप से संपादित कर सकते हैं, या मुझसे प्रश्न पूछ सकते हैं। आगे बढ़ने के लिए 'सेव और अगला' पर क्लिक करें।",
  },

  // ── MARATHI ────────────────────────────────────────────────────────────────
  mr: {
    // Business Loan (existing)
    "Business Loan Application": "व्यवसाय कर्ज अर्ज",
    "Estimated Time: 45 Mins": "अंदाजित वेळ: 45 मिनिटे",
    "Page": "पृष्ठ",
    "of": "पैकी",
    "Next": "पुढील",
    "Previous": "मागील",
    "Save & Next": "सेव्ह आणि पुढे",
    "Basic Business Identity": "मूलभूत व्यवसाय ओळख",
    "Personal KYC": "वैयक्तिक केवायसी",
    "Business PAN Number": "व्यवसाय पॅन क्रमांक",
    "GSTIN": "जीएसटीआयएन",
    "Registered Business Name": "नोंदणीकृत व्यवसायाचे नाव",
    "Aadhaar Number": "आधार क्रमांक",
    "First Name (As per PAN)": "पहिले नाव (पॅननुसार)",
    "Last Name": "आडनाव",
    "Date of Birth": "जन्मतारीख",

    // Insurance Header / Nav
    "Paytm Saarthi Insurance Copilot": "पेटीएम सारथी विमा कोपायलट",
    "Change Category": "श्रेणी बदला",
    "Quick Select": "लवकर निवडा",
    "Type your response...": "तुमचे उत्तर लिहा...",

    // Category Selector
    "What would you like to insure today?": "आज तुम्हाला काय विमा काढायचा आहे?",
    "Health Insurance": "आरोग्य विमा",
    "Car Insurance": "कार विमा",
    "Bike Insurance": "बाइक विमा",
    "Home Insurance": "गृह विमा",
    "Shop Insurance": "दुकान विमा",
    "Protection for you & family": "तुमच्यासाठी व कुटुंबासाठी संरक्षण",
    "4-Wheeler coverage": "4-चाकी वाहन संरक्षण",
    "2-Wheeler coverage": "2-चाकी वाहन संरक्षण",
    "Protect your home": "तुमचे घर सुरक्षित करा",
    "Safeguard your business": "तुमचा व्यवसाय सुरक्षित करा",

    // Greetings
    "Namaste Ramesh ji! 🙏 Main aapka Paytm Saarthi Insurance Copilot hoon. Aapke aur parivaar ke liye best curated health protection plan tayyar karte hain.":
      "नमस्कार रमेश जी! 🙏 मी तुमचा पेटीएम सारथी विमा कोपायलट आहे. तुमच्यासाठी व कुटुंबासाठी उत्तम आरोग्य विमा योजना तयार करतो.",
    "Namaste Ramesh ji! 🚗 Apni car insurance ko 2 minutes mein renew karein aur challans se bachein.":
      "नमस्कार रमेश जी! 🚗 2 मिनिटांत तुमचा कार विमा नूतनीकरण करा आणि वाहतूक दंडापासून वाचा.",

    // Health Questions
    "Whom do you want to insure?": "तुम्हाला कोणाला विमा द्यायचा आहे?",
    "Only me": "फक्त मी",
    "Me & my spouse": "मी आणि माझा जोडीदार",
    "Me, my spouse & 1 child": "मी, जोडीदार आणि 1 मूल",
    "Me, my spouse & 2 children": "मी, जोडीदार आणि 2 मुले",
    "What age group do you fall into?": "तुम्ही कोणत्या वयोगटात येता?",
    "18-35 years": "18-35 वर्षे",
    "36-45 years": "36-45 वर्षे",
    "46-55 years": "46-55 वर्षे",
    "56-65 years": "56-65 वर्षे",
    "Any existing illness or medical history?": "कोणताही आधीचा आजार किंवा वैद्यकीय इतिहास आहे का?",
    "None (100% Fit)": "काहीही नाही (100% तंदुरुस्त)",
    "Diabetes": "मधुमेह",
    "Hypertension / BP": "उच्च रक्तदाब / बीपी",
    "Other": "इतर",
    "What is your city/pincode for nearest cashless hospitals?": "जवळच्या कॅशलेस रुग्णालयासाठी तुमचे शहर/पिनकोड सांगा?",
    "411014 (Pune, MH)": "411014 (पुणे, मह.)",
    "302001 (Jaipur, RJ)": "302001 (जयपूर, रा.)",
    "400001 (Mumbai, MH)": "400001 (मुंबई, मह.)",
    "110001 (Delhi, DL)": "110001 (दिल्ली)",

    // Car Questions
    "Enter your vehicle number to auto-fetch RTO details:": "RTO तपशील आपोआप मिळवण्यासाठी वाहन क्रमांक टाका:",
    "Which coverage plan suits your daily driving?": "तुमच्या दैनंदिन ड्रायव्हिंगसाठी कोणती योजना योग्य आहे?",
    "Comprehensive (Own Damage + 3rd Party)": "सर्वसमावेशक (स्वतःचे नुकसान + तृतीय पक्ष)",
    "Pay As You Drive (5000 km/year)": "जेवढे चालवाल तेवढे भरा (5000 km/वर्ष)",
    "Third Party Only (Legal Mandate)": "केवळ तृतीय पक्ष (कायदेशीर बंधन)",
    "Include mandatory ₹15 Lakh Personal Accident Cover by IndusInd GIC?": "IndusInd GIC चे ₹15 लाख अनिवार्य वैयक्तिक अपघात कव्हर समाविष्ट करायचे का?",
    "Yes, include ₹15L PA Cover (+₹354)": "होय, ₹15L PA कव्हर समाविष्ट करा (+₹354)",
    "Already have active PA Cover": "आधीच सक्रिय PA कव्हर आहे",

    // Success screen
    "Download Policy PDF": "पॉलिसी PDF डाउनलोड करा",
    "Explore Another Insurance": "इतर विमा पाहा",
    "Car Insurance Issued!": "कार विमा जारी!",
    "Health Policy Issued!": "आरोग्य पॉलिसी जारी!",
    "Instant Issuance Active": "तत्काल जारी सक्रिय",
    "Policy Number": "पॉलिसी क्रमांक",
    "Insurer": "विमाकर्ता",
    "Insured Vehicle": "विमाधारित वाहन",
    "Personal Accident": "वैयक्तिक अपघात",
    "Challan Status": "चलान स्थिती",
    "UPI Autopay Mandate": "UPI ऑटोपे मॅंडेट",
    "Cashless Coverage": "कॅशलेस संरक्षण",
    "Protected (0 Challans)": "सुरक्षित (0 चलान)",
    "₹15 Lakh Active": "₹15 लाख सक्रिय",
    "458 Hospitals (Pune)": "458 रुग्णालये (पुणे)",
    "Policy active on VAHAN & mParivahan. You are 100% protected against traffic challans.":
      "VAHAN व mParivahan वर पॉलिसी सक्रिय. तुम्ही वाहतूक दंडापासून 100% सुरक्षित आहात.",
    "Policy Document & Digital Health Card has been issued under IRDAI guidelines.":
      "IRDAI मार्गदर्शक तत्त्वांनुसार पॉलिसी दस्तऐवज व डिजिटल हेल्थ कार्ड जारी करण्यात आले आहे.",
    "PDF Policy document sent via WhatsApp to": "WhatsApp वर PDF पॉलिसी दस्तऐवज पाठवला:",
  },

  // ── BENGALI ───────────────────────────────────────────────────────────────
  bn: {
    // Business Loan (existing)
    "Business Loan Application": "ব্যবসা ঋণ আবেদন",
    "Estimated Time: 45 Mins": "আনুমানিক সময়: 45 মিনিট",
    "Page": "পৃষ্ঠা",
    "of": "এর মধ্যে",
    "Next": "পরবর্তী",
    "Previous": "পূর্ববর্তী",
    "Save & Next": "সেভ করুন এবং পরবর্তী",
    "Basic Business Identity": "প্রাথমিক ব্যবসার পরিচয়",
    "Personal KYC": "ব্যক্তিগত কেওয়াইসি",
    "Business PAN Number": "ব্যবসার প্যান নম্বর",
    "GSTIN": "জিএসটিআইএন",
    "Registered Business Name": "নিবন্ধিত ব্যবসার নাম",
    "Aadhaar Number": "আধার নম্বর",
    "First Name (As per PAN)": "প্রথম নাম (প্যান অনুযায়ী)",
    "Last Name": "শেষ নাম",
    "Date of Birth": "জন্ম তারিখ",

    // Insurance
    "Paytm Saarthi Insurance Copilot": "পেটিএম সারথি বীমা কোপায়লট",
    "Change Category": "ক্যাটাগরি পরিবর্তন করুন",
    "Quick Select": "দ্রুত নির্বাচন",
    "Type your response...": "আপনার উত্তর লিখুন...",
    "What would you like to insure today?": "আজ আপনি কীসের বীমা করতে চান?",
    "Health Insurance": "স্বাস্থ্য বীমা",
    "Car Insurance": "গাড়ি বীমা",
    "Bike Insurance": "বাইক বীমা",
    "Home Insurance": "গৃহ বীমা",
    "Shop Insurance": "দোকান বীমা",
    "Protection for you & family": "আপনার ও পরিবারের সুরক্ষা",
    "4-Wheeler coverage": "4-চাকার যানবাহন কভারেজ",
    "2-Wheeler coverage": "2-চাকার যানবাহন কভারেজ",
    "Protect your home": "আপনার বাড়ি সুরক্ষিত করুন",
    "Safeguard your business": "আপনার ব্যবসা সুরক্ষিত করুন",

    "Namaste Ramesh ji! 🙏 Main aapka Paytm Saarthi Insurance Copilot hoon. Aapke aur parivaar ke liye best curated health protection plan tayyar karte hain.":
      "নমস্কার রমেশ জি! 🙏 আমি আপনার পেটিএম সারথি ইন্স্যুরেন্স কোপায়লট। আপনার ও পরিবারের জন্য সেরা স্বাস্থ্য বীমা পরিকল্পনা তৈরি করি।",
    "Namaste Ramesh ji! 🚗 Apni car insurance ko 2 minutes mein renew karein aur challans se bachein.":
      "নমস্কার রমেশ জি! 🚗 ২ মিনিটে আপনার গাড়ির বীমা নবায়ন করুন এবং ট্রাফিক চালান থেকে বাঁচুন।",

    "Whom do you want to insure?": "আপনি কার বীমা করতে চান?",
    "Only me": "শুধু আমি",
    "Me & my spouse": "আমি ও আমার স্বামী/স্ত্রী",
    "Me, my spouse & 1 child": "আমি, স্বামী/স্ত্রী ও ১ সন্তান",
    "Me, my spouse & 2 children": "আমি, স্বামী/স্ত্রী ও ২ সন্তান",
    "What age group do you fall into?": "আপনি কোন বয়সের গ্রুপে পড়েন?",
    "18-35 years": "১৮-৩৫ বছর",
    "36-45 years": "৩৬-৪৫ বছর",
    "46-55 years": "৪৬-৫৫ বছর",
    "56-65 years": "৫৬-৬৫ বছর",
    "Any existing illness or medical history?": "কোনো বিদ্যমান অসুখ বা চিকিৎসার ইতিহাস আছে?",
    "None (100% Fit)": "কিছু নেই (১০০% সুস্থ)",
    "Diabetes": "ডায়াবেটিস",
    "Hypertension / BP": "উচ্চ রক্তচাপ / বিপি",
    "Other": "অন্যান্য",
    "What is your city/pincode for nearest cashless hospitals?": "নিকটতম ক্যাশলেস হাসপাতালের জন্য শহর/পিনকোড বলুন?",
    "411014 (Pune, MH)": "411014 (পুনে, মহা.)",
    "302001 (Jaipur, RJ)": "302001 (জয়পুর, রাজ.)",
    "400001 (Mumbai, MH)": "400001 (মুম্বই, মহা.)",
    "110001 (Delhi, DL)": "110001 (দিল্লি)",

    "Enter your vehicle number to auto-fetch RTO details:": "RTO বিবরণ স্বয়ংক্রিয়ভাবে আনতে যানবাহন নম্বর লিখুন:",
    "Which coverage plan suits your daily driving?": "আপনার দৈনন্দিন ড্রাইভিংয়ের জন্য কোন পরিকল্পনা উপযুক্ত?",
    "Comprehensive (Own Damage + 3rd Party)": "ব্যাপক (নিজস্ব ক্ষতি + তৃতীয় পক্ষ)",
    "Pay As You Drive (5000 km/year)": "যত চালাবেন তত দেবেন (5000 km/বছর)",
    "Third Party Only (Legal Mandate)": "শুধুমাত্র তৃতীয় পক্ষ (আইনগত বাধ্যবাধকতা)",
    "Include mandatory ₹15 Lakh Personal Accident Cover by IndusInd GIC?": "IndusInd GIC-এর ₹15 লাখ বাধ্যতামূলক ব্যক্তিগত দুর্ঘটনা কভার অন্তর্ভুক্ত করবেন?",
    "Yes, include ₹15L PA Cover (+₹354)": "হ্যাঁ, ₹15L PA কভার যোগ করুন (+₹354)",
    "Already have active PA Cover": "ইতিমধ্যে সক্রিয় PA কভার আছে",

    "Download Policy PDF": "পলিসি PDF ডাউনলোড করুন",
    "Explore Another Insurance": "অন্য বীমা দেখুন",
    "Car Insurance Issued!": "গাড়ি বীমা জারি!",
    "Health Policy Issued!": "স্বাস্থ্য পলিসি জারি!",
    "Instant Issuance Active": "তাৎক্ষণিক জারি সক্রিয়",
    "Policy Number": "পলিসি নম্বর",
    "Insurer": "বীমাকারী",
    "Insured Vehicle": "বীমাকৃত যানবাহন",
    "Personal Accident": "ব্যক্তিগত দুর্ঘটনা",
    "Challan Status": "চালান স্ট্যাটাস",
    "UPI Autopay Mandate": "UPI অটোপে ম্যান্ডেট",
    "Cashless Coverage": "ক্যাশলেস কভারেজ",
    "Protected (0 Challans)": "সুরক্ষিত (0 চালান)",
    "₹15 Lakh Active": "₹15 লাখ সক্রিয়",
    "458 Hospitals (Pune)": "458 হাসপাতাল (পুনে)",
    "Policy active on VAHAN & mParivahan. You are 100% protected against traffic challans.":
      "VAHAN ও mParivahan-এ পলিসি সক্রিয়। আপনি ট্রাফিক চালান থেকে ১০০% সুরক্ষিত।",
    "Policy Document & Digital Health Card has been issued under IRDAI guidelines.":
      "IRDAI নির্দেশিকা অনুযায়ী পলিসি নথি ও ডিজিটাল হেলথ কার্ড জারি করা হয়েছে।",
    "PDF Policy document sent via WhatsApp to": "WhatsApp-এ PDF পলিসি নথি পাঠানো হয়েছে:",
  },

  // ── TAMIL ─────────────────────────────────────────────────────────────────
  ta: {
    // Business Loan (existing)
    "Business Loan Application": "வணிக கடன் விண்ணப்பம்",
    "Estimated Time: 45 Mins": "மதிப்பிடப்பட்ட நேரம்: 45 நிமிடங்கள்",
    "Page": "பக்கம்",
    "of": "இல்",
    "Next": "அடுத்து",
    "Previous": "முந்தைய",
    "Save & Next": "சேமி மற்றும் அடுத்து",
    "Basic Business Identity": "அடிப்படை வணிக அடையாளம்",
    "Personal KYC": "தனிப்பட்ட கேஒய்சி",
    "Business PAN Number": "வணிக பான் எண்",
    "GSTIN": "ஜிஎஸ்டிஐஎன்",
    "Registered Business Name": "பதிவு செய்யப்பட்ட வணிக பெயர்",
    "Aadhaar Number": "ஆதார் எண்",
    "First Name (As per PAN)": "முதல் பெயர் (பான் படி)",
    "Last Name": "கடைசி பெயர்",
    "Date of Birth": "பிறந்த தேதி",

    // Insurance
    "Paytm Saarthi Insurance Copilot": "பேடிஎம் சாரதி காப்பீடு கோபைலட்",
    "Change Category": "வகையை மாற்றவும்",
    "Quick Select": "விரைவாக தேர்வு செய்யவும்",
    "Type your response...": "உங்கள் பதிலை தட்டச்சு செய்யவும்...",
    "What would you like to insure today?": "இன்று நீங்கள் எதற்கு காப்பீடு எடுக்க விரும்புகிறீர்கள்?",
    "Health Insurance": "சுகாதார காப்பீடு",
    "Car Insurance": "கார் காப்பீடு",
    "Bike Insurance": "இரு சக்கர வண்டி காப்பீடு",
    "Home Insurance": "வீட்டு காப்பீடு",
    "Shop Insurance": "கடை காப்பீடு",
    "Protection for you & family": "உங்களுக்கும் குடும்பத்திற்கும் பாதுகாப்பு",
    "4-Wheeler coverage": "4-சக்கர வண்டி காப்பீடு",
    "2-Wheeler coverage": "2-சக்கர வண்டி காப்பீடு",
    "Protect your home": "உங்கள் வீட்டை பாதுகாக்கவும்",
    "Safeguard your business": "உங்கள் வணிகத்தை பாதுகாக்கவும்",

    "Namaste Ramesh ji! 🙏 Main aapka Paytm Saarthi Insurance Copilot hoon. Aapke aur parivaar ke liye best curated health protection plan tayyar karte hain.":
      "வணக்கம் ரமேஷ் ஜி! 🙏 நான் உங்கள் பேடிஎம் சாரதி காப்பீடு கோபைலட். உங்களுக்கும் குடும்பத்திற்கும் சிறந்த சுகாதார பாதுகாப்பு திட்டம் தயாரிக்கிறோம்.",
    "Namaste Ramesh ji! 🚗 Apni car insurance ko 2 minutes mein renew karein aur challans se bachein.":
      "வணக்கம் ரமேஷ் ஜி! 🚗 2 நிமிடங்களில் உங்கள் கார் காப்பீட்டை புதுப்பிக்கவும், போக்குவரத்து அபராதத்தில் இருந்து காப்பாற்றிக்கொள்ளவும்.",

    "Whom do you want to insure?": "நீங்கள் யாருக்கு காப்பீடு எடுக்க விரும்புகிறீர்கள்?",
    "Only me": "என்னை மட்டும்",
    "Me & my spouse": "நான் மற்றும் என் துணை",
    "Me, my spouse & 1 child": "நான், துணை மற்றும் 1 குழந்தை",
    "Me, my spouse & 2 children": "நான், துணை மற்றும் 2 குழந்தைகள்",
    "What age group do you fall into?": "நீங்கள் எந்த வயது வகுப்பில் வருகிறீர்கள்?",
    "18-35 years": "18-35 வயது",
    "36-45 years": "36-45 வயது",
    "46-55 years": "46-55 வயது",
    "56-65 years": "56-65 வயது",
    "Any existing illness or medical history?": "ஏதாவது தற்போதுள்ள நோய் அல்லது மருத்துவ வரலாறு உள்ளதா?",
    "None (100% Fit)": "எதுவுமில்லை (100% ஆரோக்கியம்)",
    "Diabetes": "சர்க்கரை நோய்",
    "Hypertension / BP": "உயர் இரத்த அழுத்தம் / பிபி",
    "Other": "மற்றவை",
    "What is your city/pincode for nearest cashless hospitals?": "அருகிலுள்ள கேஷ்லெஸ் மருத்துவமனைக்கு உங்கள் நகரம்/பின்கோடு என்ன?",
    "411014 (Pune, MH)": "411014 (புனே, மக.)",
    "302001 (Jaipur, RJ)": "302001 (ஜெய்ப்பூர், ரா.)",
    "400001 (Mumbai, MH)": "400001 (மும்பை, மக.)",
    "110001 (Delhi, DL)": "110001 (டெல்லி)",

    "Enter your vehicle number to auto-fetch RTO details:": "RTO விவரங்களை தானாக பெற வாகன எண்ணை உள்ளிடவும்:",
    "Which coverage plan suits your daily driving?": "உங்கள் தினசரி ஓட்டுதலுக்கு எந்த திட்டம் சரியானது?",
    "Comprehensive (Own Damage + 3rd Party)": "விரிவான (சொந்த சேதம் + மூன்றாம் தரப்பு)",
    "Pay As You Drive (5000 km/year)": "ஓட்டியதற்கு மட்டும் செலுத்துங்கள் (5000 km/ஆண்டு)",
    "Third Party Only (Legal Mandate)": "மூன்றாம் தரப்பு மட்டும் (சட்டகட்டாயம்)",
    "Include mandatory ₹15 Lakh Personal Accident Cover by IndusInd GIC?": "IndusInd GIC-ஆல் ₹15 லட்சம் கட்டாய தனிநபர் விபத்து காப்பீடு சேர்க்கவா?",
    "Yes, include ₹15L PA Cover (+₹354)": "ஆம், ₹15L PA காப்பீடு சேர்க்கவும் (+₹354)",
    "Already have active PA Cover": "ஏற்கனவே செயலில் PA காப்பீடு உள்ளது",

    "Download Policy PDF": "பாலிசி PDF பதிவிறக்கவும்",
    "Explore Another Insurance": "மற்றொரு காப்பீடு ஆராயுங்கள்",
    "Car Insurance Issued!": "கார் காப்பீடு வழங்கப்பட்டது!",
    "Health Policy Issued!": "சுகாதார பாலிசி வழங்கப்பட்டது!",
    "Instant Issuance Active": "உடனடி வழங்கல் செயலில்",
    "Policy Number": "பாலிசி எண்",
    "Insurer": "காப்பீட்டாளர்",
    "Insured Vehicle": "காப்பீடு செய்யப்பட்ட வாகனம்",
    "Personal Accident": "தனிநபர் விபத்து",
    "Challan Status": "சலான் நிலை",
    "UPI Autopay Mandate": "UPI ஆட்டோபே மேன்டேட்",
    "Cashless Coverage": "கேஷ்லெஸ் காப்பீடு",
    "Protected (0 Challans)": "பாதுகாக்கப்பட்டது (0 சலான்)",
    "₹15 Lakh Active": "₹15 லட்சம் செயலில்",
    "458 Hospitals (Pune)": "458 மருத்துவமனைகள் (புனே)",
    "Policy active on VAHAN & mParivahan. You are 100% protected against traffic challans.":
      "VAHAN மற்றும் mParivahan-ல் பாலிசி செயலில் உள்ளது. நீங்கள் போக்குவரத்து அபராதத்திலிருந்து 100% பாதுகாக்கப்பட்டுள்ளீர்கள்.",
    "Policy Document & Digital Health Card has been issued under IRDAI guidelines.":
      "IRDAI வழிகாட்டுதல்களின் கீழ் பாலிசி ஆவணம் மற்றும் டிஜிட்டல் உடல்நல அட்டை வழங்கப்பட்டது.",
    "PDF Policy document sent via WhatsApp to": "WhatsApp வழியாக PDF பாலிசி ஆவணம் அனுப்பப்பட்டது:",
  },

  // ── TELUGU ────────────────────────────────────────────────────────────────
  te: {
    // Business Loan (existing)
    "Business Loan Application": "వ్యాపార రుణ దరఖాస్తు",
    "Estimated Time: 45 Mins": "అంచనా సమయం: 45 నిమిషాలు",
    "Page": "పేజీ",
    "of": "లో",
    "Next": "తదుపరి",
    "Previous": "మునుపటి",
    "Save & Next": "సేవ్ చేసి తదుపరి",
    "Basic Business Identity": "ప్రాథమిక వ్యాపార గుర్తింపు",
    "Personal KYC": "వ్యక్తిగత కెవైసి",
    "Business PAN Number": "వ్యాపార పాన్ నంబర్",
    "GSTIN": "జిఎస్‌టిఐఎన్",
    "Registered Business Name": "నమోదిత వ్యాపార పేరు",
    "Aadhaar Number": "ఆధార్ నంబర్",
    "First Name (As per PAN)": "మొదటి పేరు (పాన్ ప్రకారం)",
    "Last Name": "చివరి పేరు",
    "Date of Birth": "పుట్టిన తేదీ",

    // Insurance
    "Paytm Saarthi Insurance Copilot": "పేటీఎం సారథి బీమా కోపైలట్",
    "Change Category": "వర్గాన్ని మార్చండి",
    "Quick Select": "త్వరగా ఎంచుకోండి",
    "Type your response...": "మీ జవాబు టైప్ చేయండి...",
    "What would you like to insure today?": "ఈరోజు మీరు దేనికి బీమా తీసుకోవాలనుకుంటున్నారు?",
    "Health Insurance": "ఆరోగ్య బీమా",
    "Car Insurance": "కారు బీమా",
    "Bike Insurance": "బైక్ బీమా",
    "Home Insurance": "గృహ బీమా",
    "Shop Insurance": "షాప్ బీమా",
    "Protection for you & family": "మీకు మరియు కుటుంబానికి రక్షణ",
    "4-Wheeler coverage": "4-చక్రాల వాహన కవరేజ్",
    "2-Wheeler coverage": "2-చక్రాల వాహన కవరేజ్",
    "Protect your home": "మీ ఇంటిని రక్షించుకోండి",
    "Safeguard your business": "మీ వ్యాపారాన్ని కాపాడుకోండి",

    "Namaste Ramesh ji! 🙏 Main aapka Paytm Saarthi Insurance Copilot hoon. Aapke aur parivaar ke liye best curated health protection plan tayyar karte hain.":
      "నమస్కారం రమేష్ జీ! 🙏 నేను మీ పేటీఎం సారథి బీమా కోపైలట్. మీకు మరియు కుటుంబానికి అత్యుత్తమ ఆరోగ్య రక్షణ ప్లాన్ సిద్ధం చేస్తాను.",
    "Namaste Ramesh ji! 🚗 Apni car insurance ko 2 minutes mein renew karein aur challans se bachein.":
      "నమస్కారం రమేష్ జీ! 🚗 2 నిమిషాల్లో కారు బీమాను రెన్యూ చేసుకోండి మరియు ట్రాఫిక్ చలాన్‌ల నుండి తప్పించుకోండి.",

    "Whom do you want to insure?": "మీరు ఎవరికి బీమా తీసుకోవాలనుకుంటున్నారు?",
    "Only me": "నన్ను మాత్రమే",
    "Me & my spouse": "నేను మరియు నా జీవిత భాగస్వామి",
    "Me, my spouse & 1 child": "నేను, జీవిత భాగస్వామి మరియు 1 పిల్లవాడు",
    "Me, my spouse & 2 children": "నేను, జీవిత భాగస్వామి మరియు 2 పిల్లలు",
    "What age group do you fall into?": "మీరు ఏ వయస్సు వర్గంలో వస్తారు?",
    "18-35 years": "18-35 సంవత్సరాలు",
    "36-45 years": "36-45 సంవత్సరాలు",
    "46-55 years": "46-55 సంవత్సరాలు",
    "56-65 years": "56-65 సంవత్సరాలు",
    "Any existing illness or medical history?": "ఏదైనా ప్రస్తుత అనారోగ్యం లేదా వైద్య చరిత్ర ఉందా?",
    "None (100% Fit)": "ఏమీ లేదు (100% ఆరోగ్యంగా)",
    "Diabetes": "మధుమేహం",
    "Hypertension / BP": "అధిక రక్తపోటు / బిపి",
    "Other": "ఇతరులు",
    "What is your city/pincode for nearest cashless hospitals?": "దగ్గరలోని క్యాష్‌లెస్ ఆసుపత్రికి మీ నగరం/పిన్‌కోడ్ చెప్పండి?",
    "411014 (Pune, MH)": "411014 (పుణే, మహా.)",
    "302001 (Jaipur, RJ)": "302001 (జైపూర్, రాజ.)",
    "400001 (Mumbai, MH)": "400001 (ముంబై, మహా.)",
    "110001 (Delhi, DL)": "110001 (ఢిల్లీ)",

    "Enter your vehicle number to auto-fetch RTO details:": "RTO వివరాలు స్వయంచాలకంగా తెచ్చుకోవడానికి వాహన నంబర్ నమోదు చేయండి:",
    "Which coverage plan suits your daily driving?": "మీ రోజువారీ డ్రైవింగ్‌కు ఏ కవరేజ్ ప్లాన్ సరిపోతుంది?",
    "Comprehensive (Own Damage + 3rd Party)": "సమగ్ర (స్వంత నష్టం + మూడవ పక్షం)",
    "Pay As You Drive (5000 km/year)": "నడిపినట్లు చెల్లించండి (5000 km/సంవత్సరం)",
    "Third Party Only (Legal Mandate)": "మూడవ పక్షం మాత్రమే (చట్టపరమైన తప్పనిసరి)",
    "Include mandatory ₹15 Lakh Personal Accident Cover by IndusInd GIC?": "IndusInd GIC ద్వారా ₹15 లక్ష తప్పనిసరి వ్యక్తిగత ప్రమాద కవర్ చేర్చాలా?",
    "Yes, include ₹15L PA Cover (+₹354)": "అవును, ₹15L PA కవర్ చేర్చండి (+₹354)",
    "Already have active PA Cover": "ఇప్పటికే యాక్టివ్ PA కవర్ ఉంది",

    "Download Policy PDF": "పాలసీ PDF డౌన్‌లోడ్ చేయండి",
    "Explore Another Insurance": "మరొక బీమా చూడండి",
    "Car Insurance Issued!": "కారు బీమా జారీ చేయబడింది!",
    "Health Policy Issued!": "ఆరోగ్య పాలసీ జారీ చేయబడింది!",
    "Instant Issuance Active": "తక్షణ జారీ చురుకుగా ఉంది",
    "Policy Number": "పాలసీ నంబర్",
    "Insurer": "బీమా కంపెనీ",
    "Insured Vehicle": "బీమా చేయబడిన వాహనం",
    "Personal Accident": "వ్యక్తిగత ప్రమాదం",
    "Challan Status": "చలాన్ స్థితి",
    "UPI Autopay Mandate": "UPI ఆటోపే మాండేట్",
    "Cashless Coverage": "క్యాష్‌లెస్ కవరేజ్",
    "Protected (0 Challans)": "రక్షించబడింది (0 చలాన్‌లు)",
    "₹15 Lakh Active": "₹15 లక్ష చురుకుగా ఉంది",
    "458 Hospitals (Pune)": "458 ఆసుపత్రులు (పుణే)",
    "Policy active on VAHAN & mParivahan. You are 100% protected against traffic challans.":
      "VAHAN మరియు mParivahan లో పాలసీ యాక్టివ్. మీరు ట్రాఫిక్ చలాన్‌ల నుండి 100% రక్షించబడ్డారు.",
    "Policy Document & Digital Health Card has been issued under IRDAI guidelines.":
      "IRDAI మార్గదర్శకాల ప్రకారం పాలసీ డాక్యుమెంట్ మరియు డిజిటల్ హెల్త్ కార్డ్ జారీ చేయబడింది.",
    "PDF Policy document sent via WhatsApp to": "WhatsApp ద్వారా PDF పాలసీ డాక్యుమెంట్ పంపబడింది:",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  translate() helper — call with any string + the current language
// ─────────────────────────────────────────────────────────────────────────────
export const translate = (text: string, lang: SupportedLanguage): string => {
  if (lang === 'en') return text;

  const dict = translations[lang];
  if (!dict) return text;

  // Exact match first (fastest path)
  if (dict[text]) return dict[text];

  // Partial / compound replacement — walks every key and replaces occurrences
  let translatedText = text;
  Object.keys(dict).forEach(key => {
    if (translatedText.includes(key)) {
      translatedText = translatedText.split(key).join(dict[key]);
    }
  });

  return translatedText;
};
