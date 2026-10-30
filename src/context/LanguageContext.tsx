import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // हिन्दी (Hindi)
  | 'ta' // தமிழ் (Tamil)
  | 'te' // తెలుగు (Telugu)
  | 'kn' // ಕನ್ನಡ (Kannada)
  | 'ml' // മലയാളം (Malayalam)
  | 'mr' // मराठी (Marathi)
  | 'bn' // বাংলা (Bengali)
  | 'gu' // ગુજરાતી (Gujarati)
  | 'pa' // ਪੰਜਾਬੀ (Punjabi)
  | 'or'; // ଓଡ଼ିଆ (Odia)

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Utility & Header
    'goi': 'Government of India',
    'moe': 'Ministry of Education',
    'aicte': 'All India Council for Technical Education',
    'aicte_hindi': 'अखिल भारतीय तकनीकी शिक्षा परिषद',
    'regulation_bureau': 'Regulation Bureau',
    'portal_title': 'e-SURAKSHA FDR Portal',
    'skip_to_main': 'Skip to Main Content',
    'screen_reader': 'Screen Reader Access',
    'select_language': 'Language',
    'font_size': 'Font Size',
    'copilot': 'Suraksha Copilot',
    'connect_supabase': 'Supabase DB',
    'reset_mock': 'Reset Records',
    
    // Sidebar Tabs
    'nav_dashboard': 'Executive Dashboard',
    'nav_repository': 'FDR Master Repository',
    'nav_scrutiny': 'Scrutiny Bureau (RO)',
    'nav_cbs': 'Core Banking (CBS) Gateway',
    'nav_maturity': 'Maturity & Validity Radar',
    'nav_refund': 'Release & Refund Portal',
    'nav_ledger': 'Regulatory Audit Ledger',
    'nav_research': 'Academic Research Hub',
    'regulatory_portals': 'REGULATORY PORTALS',
    'compliance_norm': 'APH 2024-27 Clause 2.18 Compliant',

    // Dashboard Hero
    'hero_council': 'ALL INDIA COUNCIL FOR TECHNICAL EDUCATION • REGULATION BUREAU • NEW DELHI',
    'hero_title': 'National Security Deposit & FDR Surveillance Dashboard',
    'hero_subtitle': 'Statutory regulatory portal for automated validity monitoring, live Core Banking Solution (CBS) lien tracking, multi-tier discrepancy detection, and 10-year lock-in refund management under AICTE Approval Process Handbook (APH) regulations.',
    'btn_submit_fdr': 'Submit Digital FDR',
    'btn_view_repo': 'Master Repository',

    // KPI Cards
    'kpi_total_corpus': 'TOTAL DEPOSIT CORPUS',
    'kpi_total_desc': 'Active Instruments across 8 Territorial ROs',
    'kpi_bank_lien': 'BANK LIEN COMPLIANCE',
    'kpi_bank_desc': 'non-encashable liens marked in CBS',
    'kpi_discrepancy': 'DISCREPANCY CASES',
    'kpi_discrepancy_desc': 'Action Required: RO Scrutiny & ELA Review',
    'kpi_maturity': 'MATURITY ALERTS',
    'kpi_maturity_desc': 'release requests under statutory review',

    // Table & Sections
    'queue_title': 'PRIORITY REGULATORY ACTION QUEUE',
    'view_all_cases': 'View All Regional Cases',
    'col_inst_name': 'INSTITUTION & INSTRUMENT NO',
    'col_principal': 'PRINCIPAL SUM',
    'col_ro': 'TERRITORIAL RO',
    'col_finding': 'REGULATORY FINDING',
    'col_status': 'STATUS',
    'col_action': 'ACTION',
    'btn_inspect': 'Inspect',
    'btn_view_details': 'View Details',
    'territorial_coverage': 'TERRITORIAL RO COVERAGE',
    'filter_all_ros': 'Filter All 8 Regional Offices',

    // Status Badges
    'status_compliant': '100% Compliant',
    'status_lien_marked': 'LIEN MARKED',
    'status_maturing_soon': 'MATURING SOON',
    'status_discrepancy': 'DISCREPANCY FLAGGED',
    'status_released': 'RELEASED',
    'status_pending': 'PENDING'
  },
  hi: {
    'goi': 'भारत सरकार',
    'moe': 'शिक्षा मंत्रालय',
    'aicte': 'अखिल भारतीय तकनीकी शिक्षा परिषद',
    'aicte_hindi': 'अखिल भारतीय तकनीकी शिक्षा परिषद',
    'regulation_bureau': 'विनियमन ब्यूरो',
    'portal_title': 'ई-सुरक्षा एफडीआर पोर्टल',
    'skip_to_main': 'मुख्य विषयवस्तु पर जाएं',
    'screen_reader': 'स्क्रीन रीडर एक्सेस',
    'select_language': 'भाषा चुनें',
    'font_size': 'फ़ॉन्ट आकार',
    'copilot': 'सुरक्षा सहायक',
    'connect_supabase': 'सुपाबेस डेटाबेस',
    'reset_mock': 'डेटा रीसेट करें',

    'nav_dashboard': 'कार्यकारी डैशबोर्ड',
    'nav_repository': 'एफडीआर मास्टर रिपॉजिटरी',
    'nav_scrutiny': 'जांच ब्यूरो (क्षेत्रीय कार्यालय)',
    'nav_cbs': 'कोर बैंकिंग (CBS) गेटवे',
    'nav_maturity': 'परिपक्वता एवं वैधता रडार',
    'nav_refund': 'प्रतिभूति वापसी एवं रिफंड पोर्टल',
    'nav_ledger': 'नियामक ऑडिट लेजर',
    'nav_research': 'अकादमिक अनुसंधान केंद्र',
    'regulatory_portals': 'नियामक पोर्टल',
    'compliance_norm': 'एआईसीटीई एपीएच 2024-27 खंड 2.18 अनुपालन',

    'hero_council': 'अखिल भारतीय तकनीकी शिक्षा परिषद • विनियमन ब्यूरो • नई दिल्ली',
    'hero_title': 'राष्ट्रीय प्रतिभूति जमा एवं एफडीआर निगरानी डैशबोर्ड',
    'hero_subtitle': 'एआईसीटीई अनुमोदन प्रक्रिया पुस्तिका (APH) विनियमों के अंतर्गत स्वचालित वैधता निगरानी, बैंक लियन ट्रैकिंग, विसंगति पहचान और 10-वर्षीय अनिवार्य जमा प्रबंधन हेतु केंद्रीय नियामक पोर्टल।',
    'btn_submit_fdr': 'डिजिटल एफडीआर जमा करें',
    'btn_view_repo': 'मास्टर रिपॉजिटरी',

    'kpi_total_corpus': 'कुल सुरक्षा जमा कोष',
    'kpi_total_desc': '8 क्षेत्रीय कार्यालयों में सक्रिय वित्तीय साधन',
    'kpi_bank_lien': 'बैंक लियन अनुपालन दर',
    'kpi_bank_desc': 'कोर बैंकिंग में गैर-नकदीकरण लियन पंजीकृत',
    'kpi_discrepancy': 'समीक्षाधीन विसंगति मामले',
    'kpi_discrepancy_desc': 'कार्रवाई आवश्यक: आरओ जांच एवं ईएलए फॉरेंसिक',
    'kpi_maturity': 'परिपक्वता चेतावनी अलर्ट',
    'kpi_maturity_desc': 'सांविधिक समीक्षाधीन रिलीज अनुरोध',

    'queue_title': 'प्राथमिकता नियामक कार्रवाई सूची',
    'view_all_cases': 'सभी क्षेत्रीय मामले देखें',
    'col_inst_name': 'संस्थान एवं साधन संख्या',
    'col_principal': 'मूल जमा राशि',
    'col_ro': 'क्षेत्रीय कार्यालय',
    'col_finding': 'नियामक निष्कर्ष',
    'col_status': 'स्थिति',
    'col_action': 'कार्रवाई',
    'btn_inspect': 'जांच करें',
    'btn_view_details': 'विवरण देखें',
    'territorial_coverage': 'क्षेत्रीय कार्यालय कवरेज',
    'filter_all_ros': 'सभी 8 क्षेत्रीय कार्यालय देखें',

    'status_compliant': 'पूर्णतः अनुपालन',
    'status_lien_marked': 'लियन चिह्नित',
    'status_maturing_soon': 'शीघ्र परिपक्व',
    'status_discrepancy': 'विसंगति चिह्नित',
    'status_released': 'जारी / मुक्त',
    'status_pending': 'लंबित'
  },
  ta: {
    'goi': 'இந்திய அரசு',
    'moe': 'கல்வி அமைச்சகம்',
    'aicte': 'அகில இந்திய தொழில்நுட்பக் கல்விக் குழுமம்',
    'aicte_hindi': 'அகில இந்திய தொழில்நுட்பக் கல்விக் குழுமம்',
    'regulation_bureau': 'ஒழுங்குமுறை பணியகம்',
    'portal_title': 'இ-சுரக்ஷா எஃப்டிஆர் போர்டல்',
    'skip_to_main': 'முதன்மை உள்ளடக்கத்திற்கு செல்க',
    'screen_reader': 'திரை வாசிப்பான் அணுகல்',
    'select_language': 'மொழியைத் தேர்ந்தெடுக்கவும்',
    'font_size': 'எழுத்துரு அளவு',
    'copilot': 'சுரக்ஷா வழிகாட்டி',
    'connect_supabase': 'சுபாபேஸ் தரவுத்தளம்',
    'reset_mock': 'மீட்டமைக்க',

    'nav_dashboard': 'நிர்வாக டாஷ்போர்டு',
    'nav_repository': 'எஃப்டிஆர் களஞ்சியம்',
    'nav_scrutiny': 'ஆய்வு பணியகம் (RO)',
    'nav_cbs': 'வங்கி (CBS) நுழைவாயில்',
    'nav_maturity': 'முதிர்வு & செல்லுபடி ரேடார்',
    'nav_refund': 'வைப்புத்தொகை வெளியீடு போர்டல்',
    'nav_ledger': 'தணிக்கை லெட்ஜர்',
    'nav_research': 'ஆராய்ச்சி மையம்',
    'regulatory_portals': 'ஒழுங்குமுறை போர்டல்கள்',
    'compliance_norm': 'AICTE APH விதிமுறைக்கு இணங்குகிறது',

    'hero_council': 'அகில இந்திய தொழில்நுட்பக் கல்விக் குழுமம் • ஒழுங்குமுறை பணியகம் • புது தில்லி',
    'hero_title': 'தேசிய பாதுகாப்பு வைப்பு & எஃப்டிஆர் கண்காணிப்பு டாஷ்போர்டு',
    'hero_subtitle': 'AICTE விதிமுறைகளின் கீழ் தானியங்கி முதிர்வு கண்காணிப்பு, வங்கி லியன் கண்காணிப்பு மற்றும் 10 ஆண்டு பூட்டுதல் வைப்பு மேலாண்மைக்கான அதிகாரப்பூர்வ போர்டல்.',
    'btn_submit_fdr': 'டிஜிட்டல் எஃப்டிஆர் சமர்ப்பிக்கவும்',
    'btn_view_repo': 'முதன்மை களஞ்சியம்',

    'kpi_total_corpus': 'மொத்த பாதுகாப்பு வைப்பு நிதி',
    'kpi_total_desc': '8 பிராந்திய அலுவலகங்களில் செயலில் உள்ள ஆவணங்கள்',
    'kpi_bank_lien': 'வங்கி லியன் இணக்க விகிதம்',
    'kpi_bank_desc': 'வங்கியில் பதிவு செய்யப்பட்ட முடக்கங்கள்',
    'kpi_discrepancy': 'முரண்பாடு வழக்குகள்',
    'kpi_discrepancy_desc': 'நடவடிக்கை தேவை: RO ஆய்வு & ELA சரிபார்ப்பு',
    'kpi_maturity': 'முதிர்வு விழிப்பூட்டல்கள்',
    'kpi_maturity_desc': 'சட்டப்பூர்வ பரிசீலனையில் உள்ள கோரிக்கைகள்',

    'queue_title': 'முன்னுரிமை ஒழுங்குமுறை நடவடிக்கை வரிசை',
    'view_all_cases': 'அனைத்து வழக்குகளையும் காண்க',
    'col_inst_name': 'நிறுவனம் & ஆவண எண்',
    'col_principal': 'அசல் தொகை',
    'col_ro': 'பிராந்திய அலுவலகம்',
    'col_finding': 'ஆய்வு முடிவு',
    'col_status': 'நிலை',
    'col_action': 'செயல்',
    'btn_inspect': 'ஆய்வு செய்க',
    'btn_view_details': 'விவரங்களை காண்க',
    'territorial_coverage': 'பிராந்திய RO பாதுகாப்பு',
    'filter_all_ros': 'அனைத்து 8 பிராந்தியங்கள்',

    'status_compliant': '100% இணக்கமானது',
    'status_lien_marked': 'லியன் குறிக்கப்பட்டது',
    'status_maturing_soon': 'விரைவில் முதிர்வு',
    'status_discrepancy': 'முரண்பாடு உள்ளது',
    'status_released': 'வெளியிடப்பட்டது',
    'status_pending': 'நிலுவையில் உள்ளது'
  },
  te: {
    'goi': 'భారత ప్రభుత్వం',
    'moe': 'విద్యా మంత్రిత్వ శాఖ',
    'aicte': 'అఖిల భారత సాంకేతిక విద్యా మండలి',
    'aicte_hindi': 'అఖిల భారత సాంకేతిక విద్యా మండలి',
    'regulation_bureau': 'రెగ్యులేషన్ బ్యూరో',
    'portal_title': 'ఇ-సురక్ష FDR పోర్టల్',
    'skip_to_main': 'ప్రధాన కంటెంట్‌కు వెళ్లండి',
    'screen_reader': 'స్క్రీన్ రీడర్ యాక్సెస్',
    'select_language': 'భాషను ఎంచుకోండి',
    'font_size': 'ఫాంట్ పరిమాణం',
    'copilot': 'సురక్ష కోపైలట్',
    'connect_supabase': 'సుపాబేస్ డేటాబేస్',
    'reset_mock': 'రీసెట్ చేయండి',

    'nav_dashboard': 'ఎగ్జిక్యూటివ్ డాష్‌బోర్డ్',
    'nav_repository': 'FDR మాస్టర్ రిపోజిటరీ',
    'nav_scrutiny': 'పరిశీలన బ్యూరో (RO)',
    'nav_cbs': 'కోర్ బ్యాంకింగ్ (CBS) గేట్‌వే',
    'nav_maturity': 'గడువు & చెల్లుబాటు రాడార్',
    'nav_refund': 'డిపాజిట్ విడుదల పోర్టల్',
    'nav_ledger': 'ఆడిట్ లెడ్జర్',
    'nav_research': 'పరిశోధన కేంద్రం',
    'regulatory_portals': 'రెగ్యులేటరీ పోర్టల్స్',
    'compliance_norm': 'AICTE నిబంధనలకు అనుగుణంగా',

    'hero_council': 'అఖిల భారత సాంకేతిక విద్యా మండలి • రెగ్యులేషన్ బ్యూరో • న్యూఢిల్లీ',
    'hero_title': 'జాతీయ సెక్యూరిటీ డిపాజిట్ & FDR నిఘా డాష్‌బోర్డ్',
    'hero_subtitle': 'AICTE నిబంధనల ప్రకారం ఆటోమేటెడ్ గడువు పర్యవేక్షణ, బ్యాంక్ అనుసంధానం మరియు 10 సంవత్సరాల లాక్-ఇన్ డిపాజిట్ నిర్వహణ కోసం కేంద్ర పోర్టల్.',
    'btn_submit_fdr': 'డిజిటల్ FDR సమర్పించండి',
    'btn_view_repo': 'మాస్టర్ రిపోజిటరీ',

    'kpi_total_corpus': 'మొత్తం సెక్యూరిటీ డిపాజిట్ కార్పస్',
    'kpi_total_desc': '8 ప్రాంతీయ కార్యాలయాలలో క్రియాశీల సాధనాలు',
    'kpi_bank_lien': 'బ్యాంక్ లీన్ వర్తింపు శాతం',
    'kpi_bank_desc': 'కోర్ బ్యాంకింగ్‌లో నమోదైన లీన్‌లు',
    'kpi_discrepancy': 'పరిశీలనలో ఉన్న వ్యత్యాసాలు',
    'kpi_discrepancy_desc': 'చర్య అవసరం: RO పరిశీలన & ELA సమీక్ష',
    'kpi_maturity': 'గడువు హెచ్చరికలు',
    'kpi_maturity_desc': 'సమీక్షలో ఉన్న రీఫండ్ అభ్యర్థనలు',

    'queue_title': 'ప్రాధాన్యత చర్యల జాబితా',
    'view_all_cases': 'అన్ని ప్రాంతీయ కేసులు చూడండి',
    'col_inst_name': 'సంస్థ & పరికరం నం',
    'col_principal': 'డిపాజిట్ మొత్తం',
    'col_ro': 'ప్రాంతీయ RO',
    'col_finding': 'పరిశీలన నివేదిక',
    'col_status': 'స్థితి',
    'col_action': 'చర్య',
    'btn_inspect': 'తనిఖీ చేయండి',
    'btn_view_details': 'వివరాలు చూడండి',
    'territorial_coverage': 'ప్రాంతీయ RO కవరేజ్',
    'filter_all_ros': 'అన్ని ప్రాంతాలు',

    'status_compliant': '100% ఆమోదించబడింది',
    'status_lien_marked': 'లీన్ గుర్తించబడింది',
    'status_maturing_soon': 'త్వరలో గడువు ముగింపు',
    'status_discrepancy': 'వ్యత్యాసం గుర్తించబడింది',
    'status_released': 'విడుదల చేయబడింది',
    'status_pending': 'పెండింగ్‌లో ఉంది'
  },
  kn: {
    'goi': 'ಭಾರತ ಸರ್ಕಾರ',
    'moe': 'ಶಿಕ್ಷಣ ಸಚಿವಾಲಯ',
    'aicte': 'ಅಖಿಲ ಭಾರತ ತಾಂತ್ರಿಕ ಶಿಕ್ಷಣ ಮಂಡಳಿ',
    'aicte_hindi': 'ಅಖಿಲ ಭಾರತ ತಾಂತ್ರಿಕ ಶಿಕ್ಷಣ ಮಂಡಳಿ',
    'regulation_bureau': 'ನಿಯಂತ್ರಣ ಬ್ಯೂರೋ',
    'portal_title': 'ಇ-ಸುರಕ್ಷಾ ಎಫ್‌ಡಿಆರ್ ಪೋರ್ಟಲ್',
    'skip_to_main': 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
    'screen_reader': 'ಸ್ಕ್ರೀನ್ ರೀಡರ್ ಪ್ರವೇಶ',
    'select_language': 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    'font_size': 'ಅಕ್ಷರ ಗಾತ್ರ',
    'copilot': 'ಸುರಕ್ಷಾ ಸಹಾಯಕ',
    'connect_supabase': 'ಸುಪಬೇಸ್ ಡೇಟಾಬೇಸ್',
    'reset_mock': 'ಮರುಹೊಂದಿಸಿ',

    'nav_dashboard': 'ಕಾರ್ಯನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav_repository': 'ಎಫ್‌ಡಿಆರ್ ಭಂಡಾರ',
    'nav_scrutiny': 'ಪರಿಶೀಲನಾ ಬ್ಯೂರೋ (RO)',
    'nav_cbs': 'ಕೋರ್ ಬ್ಯಾಂಕಿಂಗ್ (CBS) ಗೇಟ್‌ವೇ',
    'nav_maturity': 'ಅವಧಿ ಮುಕ್ತಾಯ ರಾಡಾರ್',
    'nav_refund': 'ಠೇವಣಿ ಮರುಪಾವತಿ ಪೋರ್ಟಲ್',
    'nav_ledger': 'ಲೆಕ್ಕಪರಿಶೋಧನಾ ಲೆಡ್ಜರ್',
    'nav_research': 'ಸಂಶೋಧನಾ ಕೇಂದ್ರ',
    'regulatory_portals': 'ನಿಯಂತ್ರಕ ಪೋರ್ಟಲ್‌ಗಳು',
    'compliance_norm': 'AICTE ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ',

    'hero_council': 'ಅಖಿಲ ಭಾರತ ತಾಂತ್ರಿಕ ಶಿಕ್ಷಣ ಮಂಡಳಿ • ನಿಯಂತ್ರಣ ಬ್ಯೂರೋ • ನವದೆಹಲಿ',
    'hero_title': 'ರಾಷ್ಟ್ರೀಯ ಭದ್ರತಾ ಠೇವಣಿ & ಎಫ್‌ಡಿಆರ್ ಕಣ್ಗಾವಲು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'hero_subtitle': 'AICTE ನಿಯಮಗಳ ಅಡಿಯಲ್ಲಿ ಸ್ವಯಂಚಾಲಿತ ಮಾನ್ಯತೆ ಮೇಲ್ವಿಚಾರಣೆ, ಬ್ಯಾಂಕ್ ಲೀನ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು 10 ವರ್ಷಗಳ ಲಾಕ್-ಇನ್ ಠೇವಣಿ ನಿರ್ವಹಣೆಯ ಕೇಂದ್ರ ಪೋರ್ಟಲ್.',
    'btn_submit_fdr': 'ಡಿಜಿಟಲ್ ಎಫ್‌ಡಿಆರ್ ಸಲ್ಲಿಸಿ',
    'btn_view_repo': 'ಮಾಸ್ಟರ್ ಭಂಡಾರ',

    'kpi_total_corpus': 'ಒಟ್ಟು ಭದ್ರತಾ ಠೇವಣಿ ನಿಧಿ',
    'kpi_total_desc': '8 ಪ್ರಾದೇಶಿಕ ಕಚೇರಿಗಳಲ್ಲಿ ಸಕ್ರಿಯ ದಾಖಲೆಗಳು',
    'kpi_bank_lien': 'ಬ್ಯಾಂಕ್ ಲೀನ್ ಅನುಸರಣೆ ದರ',
    'kpi_bank_desc': 'ಕೋರ್ ಬ್ಯಾಂಕಿಂಗ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಲಾದ ಲೀನ್‌ಗಳು',
    'kpi_discrepancy': 'ಪರಿಶೀಲನೆಯಲ್ಲಿರುವ ವ್ಯತ್ಯಾಸಗಳು',
    'kpi_discrepancy_desc': 'ಕ್ರಮ ಅಗತ್ಯ: RO ಪರಿಶೀಲನೆ & ELA ವಿಶ್ಲೇಷಣೆ',
    'kpi_maturity': 'ಅವಧಿ ಮುಕ್ತಾಯ ಎಚ್ಚರಿಕೆಗಳು',
    'kpi_maturity_desc': 'ಪರಿಶೀಲನೆಯಲ್ಲಿರುವ ಬಿಡುಗಡೆ ವಿನಂತಿಗಳು',

    'queue_title': 'ಆದ್ಯತೆಯ ನಿಯಂತ್ರಕ ಕ್ರಮಗಳ ಪಟ್ಟಿ',
    'view_all_cases': 'ಎಲ್ಲಾ ಪ್ರಾದೇಶಿಕ ಪ್ರಕರಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    'col_inst_name': 'ಸಂಸ್ಥೆ ಮತ್ತು ದಾಖಲೆ ಸಂಖ್ಯೆ',
    'col_principal': 'ಮೂಲ ಠೇವಣಿ',
    'col_ro': 'ಪ್ರಾದೇಶಿಕ RO',
    'col_finding': 'ಪರಿಶೀಲನಾ ವರದಿ',
    'col_status': 'ಸ್ಥಿತಿ',
    'col_action': 'ಕ್ರಮ',
    'btn_inspect': 'ಪರಿಶೀಲಿಸಿ',
    'btn_view_details': 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    'territorial_coverage': 'ಪ್ರಾದೇಶಿಕ RO ವ್ಯಾಪ್ತಿ',
    'filter_all_ros': 'ಎಲ್ಲಾ 8 ಕಚೇರಿಗಳು',

    'status_compliant': '100% ಅನುಸರಿಸಲಾಗಿದೆ',
    'status_lien_marked': 'ಲೀನ್ ಗುರುತಿಸಲಾಗಿದೆ',
    'status_maturing_soon': 'ಶೀಘ್ರದಲ್ಲೇ ಮುಕ್ತಾಯ',
    'status_discrepancy': 'ವ್ಯತ್ಯಾಸ ಗುರುತಿಸಲಾಗಿದೆ',
    'status_released': 'ಬಿಡುಗಡೆ ಮಾಡಲಾಗಿದೆ',
    'status_pending': 'ಬಾಕಿ ಉಳಿದಿದೆ'
  },
  ml: {
    'goi': 'ഭാരത സർക്കാർ',
    'moe': 'വിദ്യാഭ്യാസ മന്ത്രാലയം',
    'aicte': 'ഓൾ ഇന്ത്യാ കൗൺസിൽ ഫോർ ടെക്നിക്കൽ എജ്യുക്കേഷൻ',
    'aicte_hindi': 'ഓൾ ഇന്ത്യാ കൗൺസിൽ ഫോർ ടെക്നിക്കൽ എജ്യുക്കേഷൻ',
    'regulation_bureau': 'റെഗുലേഷൻ ബ്യൂറോ',
    'portal_title': 'ഇ-സുരക്ഷ എഫ്ഡിആർ പോർട്ടൽ',
    'skip_to_main': 'പ്രധാന ഉള്ളടക്കത്തിലേക്ക് പോകുക',
    'screen_reader': 'സ്ക്രീൻ റീഡർ ആക്സസ്',
    'select_language': 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    'font_size': 'ഫോണ്ട് വലുപ്പം',
    'copilot': 'സുരക്ഷ സഹായകൻ',
    'connect_supabase': 'സുപാബേസ് ഡാറ്റാബേസ്',
    'reset_mock': 'റീസെറ്റ് ചെയ്യുക',

    'nav_dashboard': 'എക്സിക്യൂട്ടീവ് ഡാഷ്‌ബോർഡ്',
    'nav_repository': 'എഫ്ഡിആർ ശേഖരം',
    'nav_scrutiny': 'പരിശോധനാ ബ്യൂറോ (RO)',
    'nav_cbs': 'കോർ ബാങ്കിംഗ് (CBS) ഗേറ്റ്‌വേ',
    'nav_maturity': 'കാലാവധി നിരീക്ഷണ റഡാർ',
    'nav_refund': 'റീഫണ്ട് പോർട്ടൽ',
    'nav_ledger': 'ഓഡിറ്റ് ലെഡ്ജർ',
    'nav_research': 'ഗവേഷണ കേന്ദ്രം',
    'regulatory_portals': 'നിയന്ത്രണ പോർട്ടലുകൾ',
    'compliance_norm': 'AICTE ചട്ടങ്ങൾക്ക് അനുസൃതമായി',

    'hero_council': 'ഓൾ ഇന്ത്യാ കൗൺസിൽ ഫോർ ടെക്നിക്കൽ എജ്യുക്കേഷൻ • ന്യൂഡൽഹി',
    'hero_title': 'ദേശീയ സെക്യൂരിറ്റി ഡെപ്പോസിറ്റ് & എഫ്ഡിആർ നിരീക്ഷണ ഡാഷ്‌ബോർഡ്',
    'hero_subtitle': 'AICTE ചട്ടങ്ങൾ പ്രകാരം സുരക്ഷാ ഡെപ്പോസിറ്റുകളുടെ കാലാവധി നിരീക്ഷണം, ബാങ്ക് ലിയൻ ട്രാക്കിംഗ് എന്നിവയ്ക്കുള്ള കേന്ദ്രീകൃത പോർട്ടൽ.',
    'btn_submit_fdr': 'ഡിജിറ്റൽ എഫ്ഡിആർ സമർപ്പിക്കുക',
    'btn_view_repo': 'മാസ്റ്റർ ശേഖരം',

    'kpi_total_corpus': 'ആകെ സെക്യൂരിറ്റി ഡെപ്പോസിറ്റ്',
    'kpi_total_desc': '8 റീജിയണൽ ഓഫീസുകളിലെ സജീവ നിക്ഷേപങ്ങൾ',
    'kpi_bank_lien': 'ബാങ്ക് ലിയൻ അനുസരണ നിരക്ക്',
    'kpi_bank_desc': 'ബാങ്കിൽ രേഖപ്പെടുത്തിയ നിയന്ത്രണങ്ങൾ',
    'kpi_discrepancy': 'പരിശോധനയിലെ പൊരുത്തക്കേടുകൾ',
    'kpi_discrepancy_desc': 'നടപടി ആവശ്യമാണ്: RO പരിശോധന',
    'kpi_maturity': 'കാലാവധി മുന്നറിയിപ്പുകൾ',
    'kpi_maturity_desc': 'പരിഗണനയിലുള്ള അപേക്ഷകൾ',

    'queue_title': 'മുൻഗണനാ നടപടികളുടെ പട്ടിക',
    'view_all_cases': 'എല്ലാ കേസുകളും കാണുക',
    'col_inst_name': 'സ്ഥാപനവും രേഖ നമ്പറും',
    'col_principal': 'നിക്ഷേപ തുക',
    'col_ro': 'റീജിയണൽ ഓഫീസ്',
    'col_finding': 'പരിശോധനാ കണ്ടെത്തൽ',
    'col_status': 'നിലവിലെ അവസ്ഥ',
    'col_action': 'നടപടി',
    'btn_inspect': 'പരിശോധിക്കുക',
    'btn_view_details': 'വിശദാംശങ്ങൾ കാണുക',
    'territorial_coverage': 'മേഖലാതല പരിരക്ഷ',
    'filter_all_ros': 'എല്ലാ ഓഫീസുകളും',

    'status_compliant': '100% അംഗീകൃതം',
    'status_lien_marked': 'ലിയൻ രേഖപ്പെടുത്തി',
    'status_maturing_soon': 'ഉടൻ കാലാവധി തീരും',
    'status_discrepancy': 'പൊരുത്തക്കേട് കണ്ടെത്തി',
    'status_released': 'തുക തിരികെ നൽകി',
    'status_pending': 'തീർപ്പാക്കാനുണ്ട്'
  },
  mr: {
    'goi': 'भारत सरकार',
    'moe': 'शिक्षण मंत्रालय',
    'aicte': 'अखिल भारतीय तंत्रशिक्षण परिषद',
    'aicte_hindi': 'अखिल भारतीय तंत्रशिक्षण परिषद',
    'regulation_bureau': 'विनियमन ब्युरो',
    'portal_title': 'ई-सुरक्षा एफडीआर पोर्टल',
    'skip_to_main': 'मुख्य मजकुरावर जा',
    'screen_reader': 'स्क्रीन रीडर प्रवेश',
    'select_language': 'भाषा निवडा',
    'font_size': 'फॉन्ट आकार',
    'copilot': 'सुरक्षा मार्गदर्शक',
    'connect_supabase': 'सुपाबेस डेटाबेस',
    'reset_mock': 'रीसेट करा',

    'nav_dashboard': 'कार्यकारी डॅशबोर्ड',
    'nav_repository': 'एफडीआर मुख्य भांडार',
    'nav_scrutiny': 'तपासणी ब्युरो (RO)',
    'nav_cbs': 'कोअर बँकिंग (CBS) गेटवे',
    'nav_maturity': 'परिपक्वता व वैधता रडार',
    'nav_refund': 'ठेव परतावा पोर्टल',
    'nav_ledger': 'लेखापरीक्षण लेजर',
    'nav_research': 'संशोधन केंद्र',
    'regulatory_portals': 'नियामक पोर्टल्स',
    'compliance_norm': 'AICTE APH नियमांनुसार',

    'hero_council': 'अखिल भारतीय तंत्रशिक्षण परिषद • विनियमन ब्युरो • नवी दिल्ली',
    'hero_title': 'राष्ट्रीय सुरक्षा ठेव व एफडीआर देखरेख डॅशबोर्ड',
    'hero_subtitle': 'AICTE नियमांनुसार स्वयंचलित मुदत देखरेख, बँक लियन ट्रॅकिंग आणि १० वर्षांच्या अनिवार्य ठेव व्यवस्थापनासाठी अधिकृत पोर्टल.',
    'btn_submit_fdr': 'डिजिटल एफडीआर सादर करा',
    'btn_view_repo': 'मुख्य भांडार',

    'kpi_total_corpus': 'एकूण सुरक्षा ठेव निधी',
    'kpi_total_desc': '८ विभागीय कार्यालयांमध्ये सक्रिय ठेवी',
    'kpi_bank_lien': 'बँक लियन पूर्तता दर',
    'kpi_bank_desc': 'कोअर बँकिंगमध्ये नोंदवलेले लियन',
    'kpi_discrepancy': 'तपासणीतील त्रुटी प्रकरणे',
    'kpi_discrepancy_desc': 'कारवाई आवश्यक: RO तपासणी व ELA विश्लेषण',
    'kpi_maturity': 'मुदतपूर्ती सूचना अलर्ट',
    'kpi_maturity_desc': 'समीक्षेखालील परतावा अर्ज',

    'queue_title': 'प्राधान्य नियामक कारवाई यादी',
    'view_all_cases': 'सर्व विभागीय प्रकरणे पहा',
    'col_inst_name': 'संस्था व दस्तऐवज क्रमांक',
    'col_principal': 'मूळ ठेव रक्कम',
    'col_ro': 'विभागीय कार्यालय',
    'col_finding': 'तपासणी निष्कर्ष',
    'col_status': 'स्थिती',
    'col_action': 'कारवाई',
    'btn_inspect': 'तपासा',
    'btn_view_details': 'तपशील पहा',
    'territorial_coverage': 'विभागीय RO व्याप्ती',
    'filter_all_ros': 'सर्व ८ कार्यालये',

    'status_compliant': '१००% अनुपालन',
    'status_lien_marked': 'लियन चिन्हांकित',
    'status_maturing_soon': 'लवकरच मुदत समाप्त',
    'status_discrepancy': 'त्रुटी आढळली',
    'status_released': 'मुक्त / परत केले',
    'status_pending': 'प्रलंबित'
  },
  bn: {
    'goi': 'ভারত সরকার',
    'moe': 'শিক্ষা মন্ত্রক',
    'aicte': 'অল ইন্ডিয়া কাউন্সিল ফর টেকনিক্যাল এডুকেশন',
    'aicte_hindi': 'অল ইন্ডিয়া কাউন্সিল ফর টেকনিক্যাল এডুকেশন',
    'regulation_bureau': 'নিয়ামক ব্যুরো',
    'portal_title': 'ই-সুরক্ষা এফডিআর পোর্টাল',
    'skip_to_main': 'প্রধান বিষয়বস্তুতে যান',
    'screen_reader': 'স্ক্রিন রিডার অ্যাক্সেস',
    'select_language': 'ভাষা নির্বাচন করুন',
    'font_size': 'ফন্ট সাইজ',
    'copilot': 'সুরক্ষা সহকারী',
    'connect_supabase': 'সুপাবেস ডাটাবেস',
    'reset_mock': 'রিসেট করুন',

    'nav_dashboard': 'এক্সিকিউটিভ ড্যাশবোর্ড',
    'nav_repository': 'এফডিআর মাস্টার রিপোজিটরি',
    'nav_scrutiny': 'যাচাই ব্যুরো (RO)',
    'nav_cbs': 'কোর ব্যাংকিং (CBS) গেটওয়ে',
    'nav_maturity': 'মেয়াদ উত্তীর্ণের রাডার',
    'nav_refund': 'আমানত ফেরত পোর্টাল',
    'nav_ledger': 'অডিট লেজার',
    'nav_research': 'গবেষণা কেন্দ্র',
    'regulatory_portals': 'নিয়ামক পোর্টালসমূহ',
    'compliance_norm': 'AICTE নিয়মাবলীর অনুবর্তী',

    'hero_council': 'অল ইন্ডিয়া কাউন্সিল ফর টেকনিক্যাল এডুকেশন • নিউ দিল্লি',
    'hero_title': 'জাতীয় নিরাপত্তা আমানত ও এফডিআর নজরদারি ড্যাশবোর্ড',
    'hero_subtitle': 'AICTE নিয়মাবলীর অধীনে স্বয়ংক্রিয় মেয়াদ নিরীক্ষণ, ব্যাংক লিয়েন ট্র্যাকিং এবং ১০ বছরের আমানত ব্যবস্থাপনার কেন্দ্রীয় পোর্টাল।',
    'btn_submit_fdr': 'ডিজিটাল এফডিআর জমা দিন',
    'btn_view_repo': 'মাস্টার রিপোজিটরি',

    'kpi_total_corpus': 'মোট নিরাপত্তা আমানত তহবিল',
    'kpi_total_desc': '৮টি আঞ্চলিক কার্যালয়ে সক্রিয় আমানত',
    'kpi_bank_lien': 'ব্যাংক লিয়েন সম্মতি হার',
    'kpi_bank_desc': 'কোর ব্যাংকিংয়ে নিবন্ধিত লিয়েন',
    'kpi_discrepancy': 'অসঙ্গতির কেসসমূহ',
    'kpi_discrepancy_desc': 'পদক্ষেপ প্রয়োজন: আঞ্চলিক যাচাইকরণ',
    'kpi_maturity': 'মেয়াদপূর্তি সতর্কতা',
    'kpi_maturity_desc': 'পর্যালোচনাধীন ফেরত আবেদন',

    'queue_title': 'অগ্রাধিকার পদক্ষেপের তালিকা',
    'view_all_cases': 'সমস্ত আঞ্চলিক কেস দেখুন',
    'col_inst_name': 'প্রতিষ্ঠান ও নথি নম্বর',
    'col_principal': 'আমানতের পরিমাণ',
    'col_ro': 'আঞ্চলিক কার্যালয়',
    'col_finding': 'যাচাইকরণের ফলাফল',
    'col_status': 'অবস্থা',
    'col_action': 'পদক্ষেপ',
    'btn_inspect': 'পরিদর্শন করুন',
    'btn_view_details': 'বিবরণ দেখুন',
    'territorial_coverage': 'আঞ্চলিক কভারেজ',
    'filter_all_ros': 'সকল ৮টি অঞ্চল',

    'status_compliant': '১০০% সম্মত',
    'status_lien_marked': 'লিয়েন চিহ্নিত',
    'status_maturing_soon': 'শীঘ্রই মেয়াদ শেষ',
    'status_discrepancy': 'অসঙ্গতি চিহ্নিত',
    'status_released': 'ফেরত দেওয়া হয়েছে',
    'status_pending': 'অপেক্ষমান'
  },
  gu: {
    'goi': 'ભારત સરકાર',
    'moe': 'શિક્ષણ મંત્રાલય',
    'aicte': 'અખિલ ભારતીય ટેકનિકલ શિક્ષણ પરિષદ',
    'aicte_hindi': 'અખિલ ભારતીય ટેકનિકલ શિક્ષણ પરિષદ',
    'regulation_bureau': 'નિયમન બ્યુરો',
    'portal_title': 'ઇ-સુરક્ષા એફડીઆર પોર્ટલ',
    'skip_to_main': 'મુખ્ય સામગ્રી પર જાઓ',
    'screen_reader': 'સ્ક્રીન રીડર ઍક્સેસ',
    'select_language': 'ભાષા પસંદ કરો',
    'font_size': 'ફોન્ટ સાઇઝ',
    'copilot': 'સુરક્ષા સહાયક',
    'connect_supabase': 'સુપાબેઝ ડેટાબેઝ',
    'reset_mock': 'રીસેટ કરો',

    'nav_dashboard': 'કાર્યકારી ડેશબોર્ડ',
    'nav_repository': 'એફડીઆર સંગ્રહ',
    'nav_scrutiny': 'તપાસ બ્યુરો (RO)',
    'nav_cbs': 'કોર બેંકિંગ (CBS) ગેટવે',
    'nav_maturity': 'મુદત પૂર્ણતા રડાર',
    'nav_refund': 'ડિપોઝિટ રિફંડ પોર્ટલ',
    'nav_ledger': 'ઓડિટ લેજર',
    'nav_research': 'સંશોધન કેન્દ્ર',
    'regulatory_portals': 'નિયમનકારી પોર્ટલ્સ',
    'compliance_norm': 'AICTE નિયમો અનુસાર',

    'hero_council': 'અખિલ ભારતીય ટેકનિકલ શિક્ષણ પરિષદ • નિયમન બ્યુરો • નવી દિલ્હી',
    'hero_title': 'રાષ્ટ્રીય સિક્યોરિટી ડિપોઝિટ અને એફડીઆર સર્વેલન્સ ડેશબોર્ડ',
    'hero_subtitle': 'AICTE નિયમો હેઠળ સ્વચાલિત મુદત દેખરેખ, બેંક લિયન ટ્રેકિંગ અને 10 વર્ષની ડિપોઝિટ વ્યવસ્થાપન માટેનું પોર્ટલ.',
    'btn_submit_fdr': 'ડિજિટલ એફડીઆર સબમિટ કરો',
    'btn_view_repo': 'મુખ્ય સંગ્રહ',

    'kpi_total_corpus': 'કુલ સિક્યોરિટી ડિપોઝિટ ભંડોળ',
    'kpi_total_desc': '8 પ્રાદેશિક કચેરીઓમાં સક્રિય ડિપોઝિટ્સ',
    'kpi_bank_lien': 'બેંક લિયન પાલન દર',
    'kpi_bank_desc': 'બેંકમાં નોંધાયેલ સુરક્ષિત લિયન',
    'kpi_discrepancy': 'ચકાસણી હેઠળની વિસંગતતાઓ',
    'kpi_discrepancy_desc': 'પગલાં જરૂરી: RO તપાસ અને ચકાસણી',
    'kpi_maturity': 'મુદત ચેતવણી એલર્ટ્સ',
    'kpi_maturity_desc': 'સમીક્ષા હેઠળની રિફંડ અરજીઓ',

    'queue_title': 'પ્રાથમિકતા કાર્યવાહી યાદી',
    'view_all_cases': 'બધા પ્રાદેશિક કેસો જુઓ',
    'col_inst_name': 'સંસ્થા અને દસ્તાવેજ નંબર',
    'col_principal': 'ડિપોઝિટ રકમ',
    'col_ro': 'પ્રાદેશિક કચેરી',
    'col_finding': 'તપાસ અહેવાલ',
    'col_status': 'સ્થિતિ',
    'col_action': 'પગલું',
    'btn_inspect': 'તપાસ કરો',
    'btn_view_details': 'વિગતો જુઓ',
    'territorial_coverage': 'પ્રાદેશિક RO કવરેજ',
    'filter_all_ros': 'બધી 8 કચેરીઓ',

    'status_compliant': '100% માન્ય',
    'status_lien_marked': 'લિયન નોંધાયેલ',
    'status_maturing_soon': 'ટૂંક સમયમાં મુદત પૂરી',
    'status_discrepancy': 'વિસંગતતા જણાયેલ',
    'status_released': 'પરત ચૂકવેલ',
    'status_pending': 'બાકી છે'
  },
  pa: {
    'goi': 'ਭਾਰਤ ਸਰਕਾਰ',
    'moe': 'ਸਿੱਖਿਆ ਮੰਤਰਾਲਾ',
    'aicte': 'ਆਲ ਇੰਡੀਆ ਕੌਂਸਲ ਫਾਰ ਟੈਕਨੀਕਲ ਐਜੂਕੇਸ਼ਨ',
    'aicte_hindi': 'ਆਲ ਇੰਡੀਆ ਕੌਂਸਲ ਫਾਰ ਟੈਕਨੀਕਲ ਐਜੂਕੇਸ਼ਨ',
    'regulation_bureau': 'ਰੈਗੂਲੇਸ਼ਨ ਬਿਊਰੋ',
    'portal_title': 'ਈ-ਸੁਰੱਖਿਆ ਐਫਡੀਆਰ ਪੋਰਟਲ',
    'skip_to_main': 'ਮੁੱਖ ਸਮੱਗਰੀ ਤੇ ਜਾਓ',
    'screen_reader': 'ਸਕ੍ਰੀਨ ਰੀਡਰ ਐਕਸੈਸ',
    'select_language': 'ਭਾਸ਼ਾ ਚੁਣੋ',
    'font_size': 'ਫੌਂਟ ਦਾ ਆਕਾਰ',
    'copilot': 'ਸੁਰੱਖਿਆ ਸਹਾਇਕ',
    'connect_supabase': 'ਸੁਪਾਬੇਸ ਡੇਟਾਬੇਸ',
    'reset_mock': 'ਰੀਸੈਟ ਕਰੋ',

    'nav_dashboard': 'ਕਾਰਜਕਾਰੀ ਡੈਸ਼ਬੋਰਡ',
    'nav_repository': 'ਐਫਡੀਆਰ ਭੰਡਾਰ',
    'nav_scrutiny': 'ਜਾਂਚ ਬਿਊਰੋ (RO)',
    'nav_cbs': 'ਕੋਰ ਬੈਂਕਿੰਗ (CBS) ਗੇਟਵੇਅ',
    'nav_maturity': 'ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਦਾ ਰਾਡਾਰ',
    'nav_refund': 'ਰਿਫੰਡ ਪੋਰਟਲ',
    'nav_ledger': 'ਆਡਿਟ ਲੇਜ਼ਰ',
    'nav_research': 'ਖੋਜ ਕੇਂਦਰ',
    'regulatory_portals': 'ਨਿਯਾਮਕ ਪੋਰਟਲ',
    'compliance_norm': 'AICTE ਨਿਯਮਾਂ ਅਨੁਸਾਰ',

    'hero_council': 'ਆਲ ਇੰਡੀਆ ਕੌਂਸਲ ਫਾਰ ਟੈਕਨੀਕਲ ਐਜੂਕੇਸ਼ਨ • ਨਵੀਂ ਦਿੱਲੀ',
    'hero_title': 'ਰਾਸ਼ਟਰੀ ਸੁਰੱਖਿਆ ਜਮ੍ਹਾਂ ਅਤੇ ਐਫਡੀਆਰ ਨਿਗਰਾਨੀ ਡੈਸ਼ਬੋਰਡ',
    'hero_subtitle': 'AICTE ਨਿਯਮਾਂ ਦੇ ਤਹਿਤ ਆਟੋਮੇਟਿਡ ਮਿਆਦ ਨਿਗਰਾਨੀ ਅਤੇ 10 ਸਾਲਾਂ ਦੇ ਜਮ੍ਹਾਂ ਪ੍ਰਬੰਧਨ ਲਈ ਕੇਂਦਰੀ ਪੋਰਟਲ।',
    'btn_submit_fdr': 'ਡਿਜੀਟਲ ਐਫਡੀਆਰ ਜਮ੍ਹਾਂ ਕਰੋ',
    'btn_view_repo': 'ਮਾਸਟਰ ਭੰਡਾਰ',

    'kpi_total_corpus': 'ਕੁੱਲ ਸੁਰੱਖਿਆ ਜਮ੍ਹਾਂ ਫੰਡ',
    'kpi_total_desc': '8 ਖੇਤਰੀ ਦਫ਼ਤਰਾਂ ਵਿੱਚ ਸਰਗਰਮ ਜਮ੍ਹਾਂ',
    'kpi_bank_lien': 'ਬੈਂਕ ਲੀਅਨ ਦਰ',
    'kpi_bank_desc': 'ਬੈਂਕ ਵਿੱਚ ਦਰਜ ਸੁਰੱਖਿਅਤ ਲੀਅਨ',
    'kpi_discrepancy': 'ਜਾਂਚ ਅਧੀਨ ਮਾਮਲੇ',
    'kpi_discrepancy_desc': 'ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ: RO ਜਾਂਚ',
    'kpi_maturity': 'ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਦੇ ਅਲਰਟ',
    'kpi_maturity_desc': 'ਵਿਚਾਰ ਅਧੀਨ ਰਿਫੰਡ ਬੇਨਤੀਆਂ',

    'queue_title': 'ਤਰਜੀਹੀ ਕਾਰਵਾਈ ਸੂਚੀ',
    'view_all_cases': 'ਸਾਰੇ ਖੇਤਰੀ ਕੇਸ ਵੇਖੋ',
    'col_inst_name': 'ਸੰਸਥਾ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਨੰਬਰ',
    'col_principal': 'ਜਮ੍ਹਾਂ ਰਕਮ',
    'col_ro': 'ਖੇਤਰੀ ਦਫ਼ਤਰ',
    'col_finding': 'ਜਾਂਚ ਰਿਪੋਰਟ',
    'col_status': 'ਸਥਿਤੀ',
    'col_action': 'ਕਾਰਵਾਈ',
    'btn_inspect': 'ਜਾਂਚ ਕਰੋ',
    'btn_view_details': 'ਵੇਰਵੇ ਵੇਖੋ',
    'territorial_coverage': 'ਖੇਤਰੀ RO ਕਵਰੇਜ',
    'filter_all_ros': 'ਸਾਰੇ 8 ਦਫ਼ਤਰ',

    'status_compliant': '100% ਪ੍ਰਮਾਣਿਤ',
    'status_lien_marked': 'ਲੀਅਨ ਦਰਜ',
    'status_maturing_soon': 'ਛੇਤੀ ਮਿਆਦ ਪੂਰੀ',
    'status_discrepancy': 'ਤਰੁੱਟੀ ਪਾਈ ਗਈ',
    'status_released': 'ਜਾਰੀ ਕੀਤਾ ਗਿਆ',
    'status_pending': 'ਬਕਾਇਆ'
  },
  or: {
    'goi': 'ଭାରତ ସରକାର',
    'moe': 'ଶିକ୍ଷା ମନ୍ତ୍ରଣାଳୟ',
    'aicte': 'ସର୍ବଭାରତୀୟ ବୈଷୟିକ ଶିକ୍ଷା ପରିଷଦ',
    'aicte_hindi': 'ସର୍ବଭାରତୀୟ ବୈଷୟିକ ଶିକ୍ଷା ପରିଷଦ',
    'regulation_bureau': 'ନିୟାମକ ବ୍ୟୁରୋ',
    'portal_title': 'ଇ-ସୁରକ୍ଷା ଏଫଡିଆର ପୋର୍ଟାଲ',
    'skip_to_main': 'ମୁଖ୍ୟ ବିଷୟବସ୍ତୁକୁ ଯାଆନ୍ତୁ',
    'screen_reader': 'ସ୍କ୍ରିନ ରିଡର ପ୍ରବେଶ',
    'select_language': 'ଭାଷା ବାଛନ୍ତୁ',
    'font_size': 'ଫଣ୍ଟ ଆକାର',
    'copilot': 'ସୁରକ୍ଷା ସହାୟକ',
    'connect_supabase': 'ସୁପାବେସ ଡାଟାବେସ',
    'reset_mock': 'ପୁନଃସ୍ଥାପନ',

    'nav_dashboard': 'କାର୍ଯ୍ୟନିର୍ବାହୀ ଡ୍ୟାସବୋର୍ଡ',
    'nav_repository': 'ଏଫଡିଆର ଭଣ୍ଡାର',
    'nav_scrutiny': 'ଯାଞ୍ଚ ବ୍ୟୁରୋ (RO)',
    'nav_cbs': 'କୋର ବ୍ୟାଙ୍କିଙ୍ଗ (CBS) ଗେଟୱେ',
    'nav_maturity': 'ଅବଧି ସମାପ୍ତି ରାଡାର',
    'nav_refund': 'ଜମା ଫେରସ୍ତ ପୋର୍ଟାଲ',
    'nav_ledger': 'ଅଡିଟ ଲେଜର',
    'nav_research': 'ଗବେଷଣା କେନ୍ଦ୍ର',
    'regulatory_portals': 'ନିୟାମକ ପୋର୍ଟାଲ',
    'compliance_norm': 'AICTE ନିୟମାବଳୀ ଅନୁଯାୟୀ',

    'hero_council': 'ସର୍ବଭାରତୀୟ ବୈଷୟିକ ଶିକ୍ଷା ପରିଷଦ • ନୂଆଦିଲ୍ଲୀ',
    'hero_title': 'ଜାତୀୟ ସୁରକ୍ଷା ଜମା ଓ ଏଫଡିଆର ନିରୀକ୍ଷଣ ଡ୍ୟାସବୋର୍ଡ',
    'hero_subtitle': 'AICTE ନିୟମ ଅନୁସାରେ ସୁରକ୍ଷା ଜମା ପରିଚାଳନା ଏବଂ ୧୦ ବର୍ଷର ଜମା ନିରୀକ୍ଷଣ ପାଇଁ କେନ୍ଦ୍ରୀୟ ପୋର୍ଟାଲ।',
    'btn_submit_fdr': 'ଡିଜିଟାଲ ଏଫଡିଆର ଦାଖଲ କରନ୍ତୁ',
    'btn_view_repo': 'ମୁଖ୍ୟ ଭଣ୍ଡାର',

    'kpi_total_corpus': 'ମୋଟ ସୁରକ୍ଷା ଜମା ପାଣ୍ଠି',
    'kpi_total_desc': '୮ଟି ଆଞ୍ଚଳିକ କାର୍ଯ୍ୟାଳୟରେ ସକ୍ରିୟ ଜମା',
    'kpi_bank_lien': 'ବ୍ୟାଙ୍କ ଲିୟେନ ଅନୁପାଳନ ହାର',
    'kpi_bank_desc': 'ବ୍ୟାଙ୍କରେ ପଞ୍ଜୀକୃତ ଲିୟେନ',
    'kpi_discrepancy': 'ଯାଞ୍ଚାଧୀନ ତ୍ରୁଟି ମାମଲା',
    'kpi_discrepancy_desc': 'ପଦକ୍ଷେପ ଆବଶ୍ୟକ: RO ଯାଞ୍ଚ',
    'kpi_maturity': 'ଅବଧି ସମାପ୍ତି ଚେତାବନୀ',
    'kpi_maturity_desc': 'ବିଚାରାଧୀନ ଫେରସ୍ତ ଆବେଦନ',

    'queue_title': 'ପ୍ରାଥମିକ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ତାଲିକା',
    'view_all_cases': 'ସମସ୍ତ ଆଞ୍ଚଳିକ ମାମଲା ଦେଖନ୍ତୁ',
    'col_inst_name': 'ଅନୁଷ୍ଠାନ ଏବଂ ଦସ୍ତାବିଜ ନଂ',
    'col_principal': 'ଜମା ରାଶି',
    'col_ro': 'ଆଞ୍ଚଳିକ କାର୍ଯ୍ୟାଳୟ',
    'col_finding': 'ଯାଞ୍ଚ ରିପୋର୍ଟ',
    'col_status': 'ସ୍ଥିତି',
    'col_action': 'ପଦକ୍ଷେପ',
    'btn_inspect': 'ଯାଞ୍ଚ କରନ୍ତୁ',
    'btn_view_details': 'ବିବରଣୀ ଦେଖନ୍ତୁ',
    'territorial_coverage': 'ଆଞ୍ଚଳିକ RO କଭରେଜ',
    'filter_all_ros': 'ସମସ୍ତ ୮ଟି କାର୍ଯ୍ୟାଳୟ',

    'status_compliant': '୧୦୦% ଅନୁପାଳିତ',
    'status_lien_marked': 'ଲିୟେନ ଚିହ୍ନିତ',
    'status_maturing_soon': 'ଶୀଘ୍ର ଅବଧି ସରିବ',
    'status_discrepancy': 'ତ୍ରୁଟି ଚିହ୍ନିତ',
    'status_released': 'ଫେରସ୍ତ କରାଯାଇଛି',
    'status_pending': 'ବକେୟା ଅଛି'
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('aicte_portal_lang') as SupportedLanguage;
    return saved && TRANSLATIONS[saved] ? saved : 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('aicte_portal_lang', lang);

    // Apply document html lang attribute
    document.documentElement.lang = lang;

    // Trigger Google Translate engine if available
    try {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      // Ignore if google translate not active
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

