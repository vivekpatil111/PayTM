export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te';

export const LANGUAGES: { code: SupportedLanguage; label: string; speechLocale: string }[] = [
  { code: 'en', label: 'English', speechLocale: 'en-IN' },
  { code: 'hi', label: 'हिंदी (Hindi)', speechLocale: 'hi-IN' },
  { code: 'mr', label: 'मराठी (Marathi)', speechLocale: 'mr-IN' },
  { code: 'bn', label: 'বাংলা (Bengali)', speechLocale: 'bn-IN' },
  { code: 'ta', label: 'தமிழ் (Tamil)', speechLocale: 'ta-IN' },
  { code: 'te', label: 'తెలుగు (Telugu)', speechLocale: 'te-IN' }
];

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {},
  hi: {
    // Form Headers & Buttons
    "Business Loan Application": "व्यापार ऋण आवेदन",
    "Estimated Time: 45 Mins": "अनुमानित समय: 45 मिनट",
    "Page": "पृष्ठ",
    "of": "में से",
    "Next": "अगला",
    "Previous": "पिछला",
    "Save & Next": "सेव और अगला",
    
    // Page Titles
    "Basic Business Identity": "बुनियादी व्यापार पहचान",
    "Personal KYC": "व्यक्तिगत केवाईसी",
    
    // Field Labels
    "Business PAN Number": "व्यापार पैन नंबर",
    "GSTIN": "जीएसटीआईएन (GSTIN)",
    "Registered Business Name": "पंजीकृत व्यापार का नाम",
    "Aadhaar Number": "आधार नंबर",
    "First Name (As per PAN)": "पहला नाम (पैन के अनुसार)",
    "Last Name": "अंतिम नाम",
    "Date of Birth": "जन्म तिथि",

    // Agent Messaging
    "Hi, I am Saarthi. Since you're logged into Paytm for Business, I can fetch most of your details securely from your ledgers and KYC. Tap the sparkle to start!": 
      "नमस्ते, मैं सारथी हूँ। चूंकि आप पेटीएम फॉर बिजनेस में लॉग इन हैं, मैं आपके लेजर और केवाईसी से आपके अधिकांश विवरण सुरक्षित रूप से प्राप्त कर सकता हूँ। शुरू करने के लिए स्पार्कल पर टैप करें!",
    
    "Securely fetching": "सुरक्षित रूप से प्राप्त किया जा रहा है",
    "from your Paytm account and KYC records...": "आपके पेटीएम खाते और केवाईसी रिकॉर्ड से...",
    "from your Paytm account.": "आपके पेटीएम खाते से।",
    "Fetching your details securely from your Paytm account.": "आपके पेटीएम खाते से आपके विवरण सुरक्षित रूप से प्राप्त किए जा रहे हैं।",

    "Page complete. You can review, edit manually, or ask me questions. Click Save & Next to proceed.": 
      "पृष्ठ पूरा हुआ। आप समीक्षा कर सकते हैं, मैन्युअल रूप से संपादित कर सकते हैं, या मुझसे प्रश्न पूछ सकते हैं। आगे बढ़ने के लिए 'सेव और अगला' पर क्लिक करें।",
    "Page filled. Please review and click Next.": "पृष्ठ भर गया है। कृपया समीक्षा करें और अगला क्लिक करें।",
    "Form completed with 100% accuracy. Preparing audit report.": "फॉर्म 100% सटीकता के साथ पूरा हुआ। ऑडिट रिपोर्ट तैयार की जा रही है।",
    "All details verified. Generating your audit report.": "सभी विवरण सत्यापित। आपकी ऑडिट रिपोर्ट तैयार की जा रही है।",
    
    // Chat responses
    "Since you have an active Paytm for Business account, we already have your verified KYC and transaction history. I am fetching that securely to save your time.":
      "चूंकि आपका एक सक्रिय पेटीएम फॉर बिजनेस खाता है, हमारे पास पहले से ही आपका सत्यापित केवाईसी और लेनदेन इतिहास है। मैं आपका समय बचाने के लिए इसे सुरक्षित रूप से प्राप्त कर रहा हूँ।",
    "Don't worry! Tell me what you need help with. I can fill the fields for you based on your Paytm history.":
      "चिंता न करें! मुझे बताएं कि आपको किसमें मदद चाहिए। मैं आपके पेटीएम इतिहास के आधार पर आपके लिए फ़ील्ड भर सकता हूँ।"
  },
  mr: {
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
    "GSTIN": "जीएसटीआयएन (GSTIN)",
    "Registered Business Name": "नोंदणीकृत व्यवसायाचे नाव",
    "Aadhaar Number": "आधार क्रमांक",
    "First Name (As per PAN)": "पहिले नाव (पॅननुसार)",
    "Last Name": "आडनाव",
    "Date of Birth": "जन्मतारीख",

    "Hi, I am Saarthi. Since you're logged into Paytm for Business, I can fetch most of your details securely from your ledgers and KYC. Tap the sparkle to start!": 
      "नमस्कार, मी सारथी आहे. आपण पेटीएम फॉर बिझनेसमध्ये लॉग इन असल्यामुळे, मी तुमचे लेजर आणि केवायसीमधून तुमचे बहुतांश तपशील सुरक्षितपणे मिळवू शकतो. सुरू करण्यासाठी स्पार्कलवर टॅप करा!",
    "Securely fetching": "सुरक्षितपणे मिळवत आहे",
    "from your Paytm account and KYC records...": "तुमच्या पेटीएम खाते आणि केवायसी रेकॉर्डमधून...",
    "from your Paytm account.": "तुमच्या पेटीएम खात्यातून.",
    "Fetching your details securely from your Paytm account.": "तुमच्या पेटीएम खात्यातून तुमचे तपशील सुरक्षितपणे मिळवत आहे.",
    "Page complete. You can review, edit manually, or ask me questions. Click Save & Next to proceed.": 
      "पृष्ठ पूर्ण झाले. आपण पुनरावलोकन करू शकता, स्वतः संपादित करू शकता किंवा मला प्रश्न विचारू शकता. पुढे जाण्यासाठी 'सेव्ह आणि पुढे' वर क्लिक करा.",
    "Page filled. Please review and click Next.": "पृष्ठ भरले आहे. कृपया पुनरावलोकन करा आणि पुढे क्लिक करा.",
    "Form completed with 100% accuracy. Preparing audit report.": "फॉर्म 100% अचूकतेसह पूर्ण झाला. ऑडिट अहवाल तयार करत आहे.",
    "All details verified. Generating your audit report.": "सर्व तपशील सत्यापित. आपला ऑडिट अहवाल तयार करत आहे.",
    
    "Since you have an active Paytm for Business account, we already have your verified KYC and transaction history. I am fetching that securely to save your time.":
      "आपले सक्रिय पेटीएम फॉर बिझनेस खाते असल्यामुळे, आमच्याकडे आधीपासूनच आपला सत्यापित केवायसी आणि व्यवहाराचा इतिहास आहे. आपला वेळ वाचवण्यासाठी मी ते सुरक्षितपणे मिळवत आहे.",
    "Don't worry! Tell me what you need help with. I can fill the fields for you based on your Paytm history.":
      "काळजी करू नका! तुम्हाला कशात मदत हवी आहे ते मला सांगा. मी तुमच्या पेटीएम इतिहासावर आधारित तुमच्यासाठी फील्ड भरू शकतो."
  },
  bn: {
    "Business Loan Application": "ব্যবসা ঋণ আবেদন",
    "Estimated Time: 45 Mins": "আনুমানিক সময়: 45 মিনিট",
    "Page": "পৃষ্ঠা",
    "of": "এর মধ্যে",
    "Next": "পরবর্তী",
    "Previous": "পূর্ববর্তী",
    "Save & Next": "সেভ করুন এবং পরবর্তী",
    
    "Basic Business Identity": "প্রাথমিক ব্যবসার পরিচয়",
    "Personal KYC": "ব্যক্তিগত কেওয়াইসি (KYC)",
    
    "Business PAN Number": "ব্যবসার প্যান নম্বর",
    "GSTIN": "জিএসটিআইএন (GSTIN)",
    "Registered Business Name": "নিবন্ধিত ব্যবসার নাম",
    "Aadhaar Number": "আধার নম্বর",
    "First Name (As per PAN)": "প্রথম নাম (প্যান অনুযায়ী)",
    "Last Name": "শেষ নাম",
    "Date of Birth": "জন্ম তারিখ",

    "Hi, I am Saarthi. Since you're logged into Paytm for Business, I can fetch most of your details securely from your ledgers and KYC. Tap the sparkle to start!": 
      "নমস্কার, আমি সারথি। যেহেতু আপনি পেটিএম ফর বিজনেস-এ লগ ইন করেছেন, তাই আমি আপনার লেজার এবং কেওয়াইসি থেকে আপনার বেশিরভাগ বিবরণ নিরাপদে নিয়ে আসতে পারি। শুরু করতে স্পার্কলে ট্যাপ করুন!",
    "Securely fetching": "নিরাপদে আনা হচ্ছে",
    "from your Paytm account and KYC records...": "আপনার পেটিএম অ্যাকাউন্ট এবং কেওয়াইসি রেকর্ড থেকে...",
    "from your Paytm account.": "আপনার পেটিএম অ্যাকাউন্ট থেকে।",
    "Fetching your details securely from your Paytm account.": "আপনার পেটিএম অ্যাকাউন্ট থেকে আপনার বিশদ নিরাপদে আনা হচ্ছে।",
    "Page complete. You can review, edit manually, or ask me questions. Click Save & Next to proceed.": 
      "পৃষ্ঠাটি সম্পন্ন হয়েছে। আপনি পর্যালোচনা করতে পারেন, ম্যানুয়ালি সম্পাদনা করতে পারেন বা আমাকে প্রশ্ন করতে পারেন। এগিয়ে যেতে 'সেভ এবং পরবর্তী' ক্লিক করুন।",
    "Page filled. Please review and click Next.": "পৃষ্ঠা পূর্ণ হয়েছে। অনুগ্রহ করে পর্যালোচনা করুন এবং পরবর্তী ক্লিক করুন।",
    "Form completed with 100% accuracy. Preparing audit report.": "ফর্মটি 100% নির্ভুলতার সাথে সম্পন্ন হয়েছে। অডিট রিপোর্ট প্রস্তুত করা হচ্ছে।",
    "All details verified. Generating your audit report.": "সমস্ত বিবরণ যাচাই করা হয়েছে। আপনার অডিট রিপোর্ট তৈরি করা হচ্ছে।",
    
    "Since you have an active Paytm for Business account, we already have your verified KYC and transaction history. I am fetching that securely to save your time.":
      "যেহেতু আপনার একটি সক্রিয় পেটিএম ফর বিজনেস অ্যাকাউন্ট রয়েছে, আমাদের কাছে ইতিমধ্যে আপনার যাচাই করা কেওয়াইসি এবং লেনদেনের ইতিহাস রয়েছে। আমি আপনার সময় বাঁচাতে নিরাপদে তা নিয়ে আসছি।",
    "Don't worry! Tell me what you need help with. I can fill the fields for you based on your Paytm history.":
      "চিন্তা করবেন না! আমাকে বলুন আপনার কিসে সাহায্য প্রয়োজন। আমি আপনার পেটিএম ইতিহাসের উপর ভিত্তি করে আপনার জন্য ফিল্ডগুলি পূরণ করতে পারি।"
  },
  ta: {
    "Business Loan Application": "வணிக கடன் விண்ணப்பம்",
    "Estimated Time: 45 Mins": "மதிப்பிடப்பட்ட நேரம்: 45 நிமிடங்கள்",
    "Page": "பக்கம்",
    "of": "இல்",
    "Next": "அடுத்து",
    "Previous": "முந்தைய",
    "Save & Next": "சேமி மற்றும் அடுத்து",
    
    "Basic Business Identity": "அடிப்படை வணிக அடையாளம்",
    "Personal KYC": "தனிப்பட்ட கேஒய்சி (KYC)",
    
    "Business PAN Number": "வணிக பான் எண்",
    "GSTIN": "ஜிஎஸ்டிஐஎன் (GSTIN)",
    "Registered Business Name": "பதிவு செய்யப்பட்ட வணிக பெயர்",
    "Aadhaar Number": "ஆதார் எண்",
    "First Name (As per PAN)": "முதல் பெயர் (பான் படி)",
    "Last Name": "கடைசி பெயர்",
    "Date of Birth": "பிறந்த தேதி",

    "Hi, I am Saarthi. Since you're logged into Paytm for Business, I can fetch most of your details securely from your ledgers and KYC. Tap the sparkle to start!": 
      "வணக்கம், நான் சாரதி. நீங்கள் பேடிஎம் ஃபார் பிசினஸில் லாக் இன் செய்துள்ளதால், உங்கள் லெட்ஜர்கள் மற்றும் கேஒய்சியிலிருந்து பெரும்பாலான விவரங்களை என்னால் பாதுகாப்பாகப் பெற முடியும். தொடங்க ஸ்பார்க்கிளைத் தட்டவும்!",
    "Securely fetching": "பாதுகாப்பாக பெறப்படுகிறது",
    "from your Paytm account and KYC records...": "உங்கள் பேடிஎம் கணக்கு மற்றும் கேஒய்சி பதிவுகளிலிருந்து...",
    "from your Paytm account.": "உங்கள் பேடிஎம் கணக்கிலிருந்து.",
    "Fetching your details securely from your Paytm account.": "உங்கள் பேடிஎம் கணக்கிலிருந்து உங்கள் விவரங்கள் பாதுகாப்பாக பெறப்படுகின்றன.",
    "Page complete. You can review, edit manually, or ask me questions. Click Save & Next to proceed.": 
      "பக்கம் முடிந்தது. நீங்கள் மதிப்பாய்வு செய்யலாம், கைமுறையாக திருத்தலாம் அல்லது என்னிடம் கேள்விகள் கேட்கலாம். தொடர 'சேமி மற்றும் அடுத்து' என்பதைக் கிளிக் செய்யவும்.",
    "Page filled. Please review and click Next.": "பக்கம் நிரப்பப்பட்டது. தயவுசெய்து மதிப்பாய்வு செய்து அடுத்து என்பதைக் கிளிக் செய்யவும்.",
    "Form completed with 100% accuracy. Preparing audit report.": "படிவம் 100% துல்லியத்துடன் முடிந்தது. தணிக்கை அறிக்கை தயாரிக்கப்படுகிறது.",
    "All details verified. Generating your audit report.": "அனைத்து விவரங்களும் சரிபார்க்கப்பட்டன. உங்கள் தணிக்கை அறிக்கை உருவாக்கப்படுகிறது.",
    
    "Since you have an active Paytm for Business account, we already have your verified KYC and transaction history. I am fetching that securely to save your time.":
      "உங்களிடம் செயலில் உள்ள பேடிஎம் ஃபார் பிசினஸ் கணக்கு இருப்பதால், உங்கள் சரிபார்க்கப்பட்ட கேஒய்சி மற்றும் பரிவர்த்தனை வரலாறு எங்களிடம் ஏற்கனவே உள்ளது. உங்கள் நேரத்தை மிச்சப்படுத்த நான் அதை பாதுகாப்பாக பெறுகிறேன்.",
    "Don't worry! Tell me what you need help with. I can fill the fields for you based on your Paytm history.":
      "கவலைப்பட வேண்டாம்! உங்களுக்கு என்ன உதவி தேவை என்று சொல்லுங்கள். உங்கள் பேடிஎம் வரலாற்றின் அடிப்படையில் நான் உங்களுக்காக புலங்களை நிரப்ப முடியும்."
  },
  te: {
    "Business Loan Application": "వ్యాపార రుణ దరఖాస్తు",
    "Estimated Time: 45 Mins": "అంచనా సమయం: 45 నిమిషాలు",
    "Page": "పేజీ",
    "of": "లో",
    "Next": "తదుపరి",
    "Previous": "మునుపటి",
    "Save & Next": "సేవ్ చేసి తదుపరి",
    
    "Basic Business Identity": "ప్రాథమిక వ్యాపార గుర్తింపు",
    "Personal KYC": "వ్యక్తిగత కెవైసి (KYC)",
    
    "Business PAN Number": "వ్యాపార పాన్ నంబర్",
    "GSTIN": "జిఎస్‌టిఐఎన్ (GSTIN)",
    "Registered Business Name": "నమోదిత వ్యాపార పేరు",
    "Aadhaar Number": "ఆధార్ నంబర్",
    "First Name (As per PAN)": "మొదటి పేరు (పాన్ ప్రకారం)",
    "Last Name": "చివరి పేరు",
    "Date of Birth": "పుట్టిన తేదీ",

    "Hi, I am Saarthi. Since you're logged into Paytm for Business, I can fetch most of your details securely from your ledgers and KYC. Tap the sparkle to start!": 
      "నమస్కారం, నేను సారథిని. మీరు పేటీఎం ఫర్ బిజినెస్ కు లాగిన్ అయినందున, నేను మీ లెడ్జర్లు మరియు కెవైసి నుండి మీ వివరాలను చాలా వరకు సురక్షితంగా పొందగలను. ప్రారంభించడానికి స్పార్కిల్ పై నొక్కండి!",
    "Securely fetching": "సురక్షితంగా పొందుతున్నాము",
    "from your Paytm account and KYC records...": "మీ పేటీఎం ఖాతా మరియు కెవైసి రికార్డుల నుండి...",
    "from your Paytm account.": "మీ పేటీఎం ఖాతా నుండి.",
    "Fetching your details securely from your Paytm account.": "మీ పేటీఎం ఖాతా నుండి మీ వివరాలు సురక్షితంగా పొందబడుతున్నాయి.",
    "Page complete. You can review, edit manually, or ask me questions. Click Save & Next to proceed.": 
      "పేజీ పూర్తయింది. మీరు సమీక్షించవచ్చు, మాన్యువల్‌గా సవరించవచ్చు లేదా నన్ను ప్రశ్నలు అడగవచ్చు. కొనసాగడానికి 'సేవ్ చేసి తదుపరి' క్లిక్ చేయండి.",
    "Page filled. Please review and click Next.": "పేజీ నిండింది. దయచేసి సమీక్షించి తదుపరి క్లిక్ చేయండి.",
    "Form completed with 100% accuracy. Preparing audit report.": "ఫారం 100% ఖచ్చితత్వంతో పూర్తయింది. ఆడిట్ నివేదికను సిద్ధం చేస్తున్నాము.",
    "All details verified. Generating your audit report.": "అన్ని వివరాలు ధృవీకరించబడ్డాయి. మీ ఆడిట్ నివేదికను రూపొందిస్తున్నాము.",
    
    "Since you have an active Paytm for Business account, we already have your verified KYC and transaction history. I am fetching that securely to save your time.":
      "మీకు క్రియాశీల పేటీఎం ఫర్ బిజినెస్ ఖాతా ఉన్నందున, మా వద్ద ఇప్పటికే మీ ధృవీకరించబడిన కెవైసి మరియు లావాదేవీల చరిత్ర ఉంది. మీ సమయాన్ని ఆదా చేయడానికి నేను దానిని సురక్షితంగా పొందుతున్నాను.",
    "Don't worry! Tell me what you need help with. I can fill the fields for you based on your Paytm history.":
      "ఆందోళన చెందకండి! మీకు దేనిలో సహాయం కావాలో చెప్పండి. నేను మీ పేటీఎం చరిత్ర ఆధారంగా మీ కోసం ఫీల్డ్‌లను నింపగలను."
  }
};

export const translate = (text: string, lang: SupportedLanguage): string => {
  if (lang === 'en') return text;
  
  // Clean string mapping
  const dict = translations[lang];
  if (!dict) return text;

  // Direct exact match
  if (dict[text]) return dict[text];
  
  // Partial replacements for dynamic strings (like "Fetching details for Basic Business Identity...")
  let translatedText = text;
  Object.keys(dict).forEach(key => {
    // Basic string replacement for compound phrases
    translatedText = translatedText.replace(key, dict[key]);
  });

  return translatedText;
};
