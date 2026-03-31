/**
 * CivicaQuest Multilingual System
 * Supports all 22 Scheduled Languages of India
 * Uses Claude AI API for dynamic translations + local cache
 */

const CQ_LANG = {
  // All 22 Scheduled Languages of India
  LANGUAGES: {
    en: { name: 'English', native: 'English', dir: 'ltr', font: '' },
    hi: { name: 'Hindi', native: 'हिन्दी', dir: 'ltr', font: 'Noto Sans Devanagari' },
    bn: { name: 'Bengali', native: 'বাংলা', dir: 'ltr', font: 'Noto Sans Bengali' },
    te: { name: 'Telugu', native: 'తెలుగు', dir: 'ltr', font: 'Noto Sans Telugu' },
    mr: { name: 'Marathi', native: 'मराठी', dir: 'ltr', font: 'Noto Sans Devanagari' },
    ta: { name: 'Tamil', native: 'தமிழ்', dir: 'ltr', font: 'Noto Sans Tamil' },
    gu: { name: 'Gujarati', native: 'ગુજરાતી', dir: 'ltr', font: 'Noto Sans Gujarati' },
    kn: { name: 'Kannada', native: 'ಕನ್ನಡ', dir: 'ltr', font: 'Noto Sans Kannada' },
    ml: { name: 'Malayalam', native: 'മലയാളം', dir: 'ltr', font: 'Noto Sans Malayalam' },
    pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', dir: 'ltr', font: 'Noto Sans Gurmukhi' },
    or: { name: 'Odia', native: 'ଓଡ଼ିଆ', dir: 'ltr', font: 'Noto Sans Oriya' },
    as: { name: 'Assamese', native: 'অসমীয়া', dir: 'ltr', font: 'Noto Sans Bengali' },
    ur: { name: 'Urdu', native: 'اردو', dir: 'rtl', font: 'Noto Nastaliq Urdu' },
    ks: { name: 'Kashmiri', native: 'कॉशुर', dir: 'ltr', font: 'Noto Sans Devanagari' },
    sd: { name: 'Sindhi', native: 'سنڌي', dir: 'rtl', font: '' },
    sa: { name: 'Sanskrit', native: 'संस्कृतम्', dir: 'ltr', font: 'Noto Sans Devanagari' },
    ne: { name: 'Nepali', native: 'नेपाली', dir: 'ltr', font: 'Noto Sans Devanagari' },
    mai: { name: 'Maithili', native: 'मैथिली', dir: 'ltr', font: 'Noto Sans Devanagari' },
    kon: { name: 'Konkani', native: 'कोंकणी', dir: 'ltr', font: 'Noto Sans Devanagari' },
    mni: { name: 'Manipuri', native: 'মৈতৈলোন্', dir: 'ltr', font: 'Noto Sans Bengali' },
    doi: { name: 'Dogri', native: 'डोगरी', dir: 'ltr', font: 'Noto Sans Devanagari' },
    bo: { name: 'Bodo', native: 'बड़ो', dir: 'ltr', font: 'Noto Sans Devanagari' }
  },

  // Built-in translations for all key UI strings (English base)
  TRANSLATIONS: {
    en: {
      // Nav
      'nav.civics': '📚 Civics',
      'nav.quiz': '📜 Quiz',
      'nav.elections': '🗳️ Elections',
      'nav.parliament': '🏛️ Parliament',
      'nav.classroom': '🤖 Classroom',
      'nav.portfolio': '🎓 Portfolio',
      'nav.logout': 'Logout',
      'nav.login': 'Login / Sign Up',

      // Hero
      'hero.eyebrow': "India's First Gamified Civics Platform",
      'hero.title1': 'Learn Democracy.',
      'hero.title2': 'Play. Debate. Lead.',
      'hero.sub': 'Experience EVM voting, Parliament debates, budget simulation, and constitutional quizzes — built for Class 9–12 students.',
      'hero.cta1': 'Get Started Free 🚀',
      'hero.cta2': 'Try Demo First',
      'hero.stat1': 'Modules',
      'hero.stat2': 'Quiz Questions',
      'hero.stat3': 'AI Powered Tutor',
      'hero.stat4': 'Free Forever',

      // Dashboard
      'dash.journey': 'Your Civic Journey',
      'dash.modules': 'Learning Modules',
      'dash.experiences': '7 Experiences',
      'dash.progress': 'Complete each module in order to unlock the next.',
      'dash.welcome': 'Welcome back',
      'dash.continue': 'Continue your civic journey. Keep earning XP!',

      // Impact strip
      'impact.modules': 'Learning Modules',
      'impact.voting': 'Real Voting Sim',
      'impact.ai': 'AI Powered Tutor',
      'impact.class': 'Class Coverage',
      'impact.debates': 'Live Debates',

      // Game cards
      'card.parliament.title': 'Parliament Simulator',
      'card.parliament.desc': 'Experience bicameral law-making with live voice debates.',
      'card.voting.title': 'Voting Simulator',
      'card.voting.desc': 'EVM & VVPAT voting experience',
      'card.budget.title': 'Budget Game',
      'card.budget.desc': 'Allocate India\'s budget wisely',
      'card.quiz.title': 'Constitution Quiz',
      'card.quiz.desc': 'Test your knowledge of Indian Constitution',
      'card.civics.title': 'Civics Explorer',
      'card.civics.desc': 'Deep dive into civic concepts',
      'card.cases.title': 'Civic Cases',
      'card.cases.desc': 'Explore landmark legal cases',
      'card.classroom.title': 'AI Classroom',
      'card.classroom.desc': 'AI-powered civic education',

      // Path labels
      'path.civics': 'Civics',
      'path.quiz': 'Quiz',
      'path.voting': 'Voting',
      'path.budget': 'Budget',
      'path.parliament': 'Parliament',
      'path.classroom': 'AI Class',
      'path.portfolio': 'Portfolio',

      // Common UI
      'ui.loading': "India's Civic Learning Platform",
      'ui.demo': 'Demo Mode',
      'ui.demo.desc': 'Exploring as guest.',
      'ui.signup': 'Sign up free',
      'ui.save': 'Save Progress',
      'ui.close': 'Close',
      'ui.back': '← Back',
      'ui.next': 'Next →',
      'ui.start': 'Start',
      'ui.submit': 'Submit',
      'ui.score': 'Score',
      'ui.level': 'Level',
      'ui.xp': 'XP',
      'ui.badge': 'Badge',

      // Auth modal
      'auth.title': 'Join CivicaQuest',
      'auth.desc': 'Create a free account or log in to unlock all 7 interactive civic modules.',
      'auth.demo': '🎮 Try Demo',

      // Classroom
      'class.hero.title': 'AI Classroom',
      'class.hero.sub': 'Your AI-powered civic education hub',
      'class.tab.overview': '📊 Overview',
      'class.tab.students': '👥 Students',
      'class.tab.tasks': '📋 Tasks',
      'class.tab.ai': '🤖 AI Teacher',
      'class.tab.leaderboard': '🏆 Leaderboard',

      // Quiz
      'quiz.title': 'Constitution Quiz',
      'quiz.correct': 'Correct!',
      'quiz.wrong': 'Wrong Answer',
      'quiz.next': 'Next Question',
      'quiz.finish': 'Finish Quiz',
      'quiz.score': 'Your Score',

      // Parliament
      'parl.title': 'Parliament Simulator',
      'parl.loksabha': 'Lok Sabha',
      'parl.rajyasabha': 'Rajya Sabha',
      'parl.vote.yes': 'Vote Yes',
      'parl.vote.no': 'Vote No',
      'parl.debate': 'Start Debate',

      // Voting
      'vote.title': 'Voting Simulator',
      'vote.cast': 'Cast Your Vote',
      'vote.confirm': 'Confirm Vote',
      'vote.evm': 'EVM Machine',
      'vote.vvpat': 'VVPAT Receipt',

      // Budget
      'budget.title': 'Budget Game',
      'budget.allocate': 'Allocate Budget',
      'budget.total': 'Total Budget',
      'budget.remaining': 'Remaining',
      'budget.submit': 'Submit Budget',

      // AI Chatbot
      'ai.title': '🤖 CivicaQuest AI Helper',
      'ai.placeholder': 'Ask me anything...',
      'ai.send': 'Send',
      'ai.greeting': "👋 Hi! I'm your civic learning assistant!\n\nAsk me about:\n• Voting & EVM\n• Constitution\n• Parliament\n• Budget Game\n• How to use features",

      // Language picker
      'lang.select': 'Select Language',
      'lang.change': 'Language',
      'lang.powered': 'Powered by AI Translation',
      'lang.translating': 'Translating...',
      'class.tab.overview': '📊 جائزہ',
      'class.tab.students': '👥 طلباء',
      'class.tab.tasks': '📋 کام',
      'class.tab.ai': '🤖 AI استاد',
      'class.tab.leaderboard': '🏆 لیڈر بورڈ',
      'parl.loksabha': 'لوک سبھا',
      'parl.rajyasabha': 'راجیہ سبھا',
      'class.tab.overview': '📊 ਸੰਖੇਪ',
      'class.tab.students': '👥 ਵਿਦਿਆਰਥੀ',
      'class.tab.tasks': '📋 ਕੰਮ',
      'class.tab.ai': '🤖 AI ਅਧਿਆਪਕ',
      'class.tab.leaderboard': '🏆 ਲੀਡਰਬੋਰਡ',
      'parl.loksabha': 'ਲੋਕ ਸਭਾ',
      'parl.rajyasabha': 'ਰਾਜ ਸਭਾ',
      'class.tab.overview': '📊 അവലോകനം',
      'class.tab.students': '👥 വിദ്യാർഥികൾ',
      'class.tab.tasks': '📋 ടാസ്ക്കുകൾ',
      'class.tab.ai': '🤖 AI അദ്ധ്യാപകൻ',
      'class.tab.leaderboard': '🏆 ലീഡർബോർഡ്',
      'parl.loksabha': 'ലോക് സഭ',
      'parl.rajyasabha': 'രാജ്യ സഭ',
      'class.tab.overview': '📊 ಅವಲೋಕನ',
      'class.tab.students': '👥 ವಿದ್ಯಾರ್ಥಿಗಳು',
      'class.tab.tasks': '📋 ಕಾರ್ಯಗಳು',
      'class.tab.ai': '🤖 AI ಶಿಕ್ಷಕ',
      'class.tab.leaderboard': '🏆 ಲೀಡರ್‌ಬೋರ್ಡ್',
      'parl.loksabha': 'ಲೋಕ ಸಭೆ',
      'parl.rajyasabha': 'ರಾಜ್ಯ ಸಭೆ',
      'class.tab.overview': '📊 સારાંશ',
      'class.tab.students': '👥 વિદ્યાર્થીઓ',
      'class.tab.tasks': '📋 કાર્ય',
      'class.tab.ai': '🤖 AI શિક્ષક',
      'class.tab.leaderboard': '🏆 લીડરબોર્ડ',
      'parl.loksabha': 'લોક સભા',
      'parl.rajyasabha': 'રાજ્ય સભા',
      'class.tab.overview': '📊 आढावा',
      'class.tab.students': '👥 विद्यार्थी',
      'class.tab.tasks': '📋 कार्ये',
      'class.tab.ai': '🤖 AI शिक्षक',
      'class.tab.leaderboard': '🏆 लीडरबोर्ड',
      'parl.loksabha': 'लोक सभा',
      'parl.rajyasabha': 'राज्यसभा',
      'class.tab.overview': '📊 கண்ணோட்டம்',
      'class.tab.students': '👥 மாணவர்கள்',
      'class.tab.tasks': '📋 பணிகள்',
      'class.tab.ai': '🤖 AI ஆசிரியர்',
      'class.tab.leaderboard': '🏆 தலைமை பலகை',
      'parl.loksabha': 'லோக் சபா',
      'parl.rajyasabha': 'ராஜ்யசபா',
      'class.tab.overview': '📊 అవలోకన',
      'class.tab.students': '👥 విద్యార్థులు',
      'class.tab.tasks': '📋 పనులు',
      'class.tab.ai': '🤖 AI ఉపాధ్యాయుడు',
      'class.tab.leaderboard': '🏆 లీడర్‌బోర్డ్',
      'parl.loksabha': 'లోక్ సభ',
      'parl.rajyasabha': 'రాజ్యసభ',
      'class.tab.overview': '📊 সংক্ষিপ্ত',
      'class.tab.students': '👥 ছাত্রছাত্রী',
      'class.tab.tasks': '📋 কাজ',
      'class.tab.ai': '🤖 AI শিক্ষক',
      'class.tab.leaderboard': '🏆 লিডারবোর্ড',
      'parl.loksabha': 'লোক সভা',
      'parl.rajyasabha': 'রাজ্য সভা',
      'class.tab.overview': '📊 अवलोकन',
      'class.tab.students': '👥 छात्र',
      'class.tab.tasks': '📋 कार्य',
      'class.tab.ai': '🤖 AI शिक्षक',
      'class.tab.leaderboard': '🏆 लीडरबोर्ड',
      'quiz.correct': 'सही!',
      'quiz.wrong': 'गलत उत्तर',
      'parl.loksabha': 'लोक सभा',
      'parl.rajyasabha': 'राज्य सभा',
      'lang.done': 'Translation complete!',
    },

    hi: {
      'nav.civics': '📚 नागरिक शास्त्र',
      'nav.quiz': '📜 प्रश्नोत्तरी',
      'nav.elections': '🗳️ चुनाव',
      'nav.parliament': '🏛️ संसद',
      'nav.classroom': '🤖 कक्षा',
      'nav.portfolio': '🎓 पोर्टफोलियो',
      'nav.logout': 'लॉगआउट',
      'nav.login': 'लॉगिन / साइन अप',
      'hero.eyebrow': 'भारत का पहला गेमीफाइड सिविक्स प्लेटफॉर्म',
      'hero.title1': 'लोकतंत्र सीखें।',
      'hero.title2': 'खेलें। बहस करें। नेतृत्व करें।',
      'hero.sub': 'EVM मतदान, संसद बहस, बजट सिमुलेशन और संवैधानिक प्रश्नोत्तरी का अनुभव करें — कक्षा 9-12 के छात्रों के लिए।',
      'hero.cta1': 'निःशुल्क शुरू करें 🚀',
      'hero.cta2': 'पहले डेमो आज़माएं',
      'hero.stat1': 'मॉड्यूल',
      'hero.stat2': 'प्रश्न',
      'hero.stat3': 'AI ट्यूटर',
      'hero.stat4': 'हमेशा मुफ्त',
      'dash.journey': 'आपकी नागरिक यात्रा',
      'dash.modules': 'शिक्षण मॉड्यूल',
      'dash.welcome': 'वापसी पर स्वागत है',
      'dash.continue': 'अपनी नागरिक यात्रा जारी रखें। XP कमाते रहें!',
      'card.parliament.title': 'संसद सिमुलेटर',
      'card.parliament.desc': 'लाइव आवाज बहस के साथ द्विसदनीय कानून-निर्माण का अनुभव करें।',
      'card.voting.title': 'मतदान सिमुलेटर',
      'card.voting.desc': 'EVM और VVPAT मतदान अनुभव',
      'card.budget.title': 'बजट गेम',
      'card.budget.desc': 'भारत का बजट समझदारी से आवंटित करें',
      'card.quiz.title': 'संविधान प्रश्नोत्तरी',
      'card.quiz.desc': 'भारतीय संविधान का ज्ञान परखें',
      'card.civics.title': 'नागरिक एक्सप्लोरर',
      'card.civics.desc': 'नागरिक अवधारणाओं में गहरा उतरें',
      'path.civics': 'नागरिक',
      'path.quiz': 'प्रश्नोत्तरी',
      'path.voting': 'मतदान',
      'path.budget': 'बजट',
      'path.parliament': 'संसद',
      'path.classroom': 'AI कक्षा',
      'path.portfolio': 'पोर्टफोलियो',
      'ui.loading': 'भारत का नागरिक शिक्षा प्लेटफॉर्म',
      'ui.demo': 'डेमो मोड',
      'ui.back': '← वापस',
      'ui.next': 'अगला →',
      'ui.start': 'शुरू करें',
      'ui.submit': 'जमा करें',
      'ui.score': 'स्कोर',
      'ui.level': 'स्तर',
      'auth.title': 'CivicaQuest में शामिल हों',
      'auth.desc': 'सभी 7 इंटरएक्टिव नागरिक मॉड्यूल अनलॉक करने के लिए नि:शुल्क खाता बनाएं।',
      'auth.demo': '🎮 डेमो आज़माएं',
      'ai.title': '🤖 CivicaQuest AI सहायक',
      'ai.placeholder': 'मुझसे कुछ भी पूछें...',
      'ai.send': 'भेजें',
      'ai.greeting': '👋 नमस्ते! मैं आपका नागरिक शिक्षा सहायक हूं!\n\nमुझसे पूछें:\n• मतदान और EVM\n• संविधान\n• संसद\n• बजट गेम\n• फीचर उपयोग',
      'lang.select': 'भाषा चुनें',
      'lang.change': 'भाषा',
      'lang.translating': 'अनुवाद हो रहा है...',
      'lang.done': 'अनुवाद पूर्ण!',
      'quiz.title': 'संविधान प्रश्नोत्तरी',
      'quiz.correct': 'सही!',
      'quiz.wrong': 'गलत उत्तर',
      'quiz.next': 'अगला प्रश्न',
      'quiz.finish': 'प्रश्नोत्तरी समाप्त करें',
      'quiz.score': 'आपका स्कोर',
      'vote.title': 'मतदान सिमुलेटर',
      'vote.cast': 'वोट डालें',
      'vote.confirm': 'वोट की पुष्टि करें',
      'budget.title': 'बजट गेम',
      'budget.allocate': 'बजट आवंटित करें',
      'budget.remaining': 'शेष',
    },

    bn: {
      'nav.civics': '📚 নাগরিক শিক্ষা',
      'nav.quiz': '📜 কুইজ',
      'nav.elections': '🗳️ নির্বাচন',
      'nav.parliament': '🏛️ সংসদ',
      'nav.classroom': '🤖 শ্রেণীকক্ষ',
      'nav.portfolio': '🎓 পোর্টফোলিও',
      'nav.logout': 'লগআউট',
      'nav.login': 'লগইন / সাইন আপ',
      'hero.eyebrow': 'ভারতের প্রথম গেমিফাইড নাগরিক প্ল্যাটফর্ম',
      'hero.title1': 'গণতন্ত্র শিখুন।',
      'hero.title2': 'খেলুন। বিতর্ক করুন। নেতৃত্ব দিন।',
      'hero.sub': 'EVM ভোট দেওয়া, সংসদ বিতর্ক, বাজেট সিমুলেশন এবং সাংবিধানিক কুইজের অভিজ্ঞতা নিন।',
      'hero.cta1': 'বিনামূল্যে শুরু করুন 🚀',
      'hero.cta2': 'প্রথমে ডেমো চেষ্টা করুন',
      'dash.journey': 'আপনার নাগরিক যাত্রা',
      'dash.modules': 'শিক্ষা মডিউল',
      'card.parliament.title': 'সংসদ সিমুলেটর',
      'card.voting.title': 'ভোটদান সিমুলেটর',
      'card.quiz.title': 'সংবিধান কুইজ',
      'card.budget.title': 'বাজেট গেম',
      'ui.loading': 'ভারতের নাগরিক শিক্ষা প্ল্যাটফর্ম',
      'ai.placeholder': 'আমাকে যেকোনো কিছু জিজ্ঞাসা করুন...',
      'ai.send': 'পাঠান',
      'lang.select': 'ভাষা নির্বাচন করুন',
      'lang.translating': 'অনুবাদ হচ্ছে...',
    },

    te: {
      'nav.civics': '📚 పౌర శాస్త్రం',
      'nav.quiz': '📜 క్విజ్',
      'nav.elections': '🗳️ ఎన్నికలు',
      'nav.parliament': '🏛️ పార్లమెంట్',
      'nav.classroom': '🤖 తరగతి గది',
      'nav.portfolio': '🎓 పోర్ట్‌ఫోలియో',
      'nav.logout': 'లాగ్అవుట్',
      'nav.login': 'లాగిన్ / సైన్ అప్',
      'hero.eyebrow': 'భారతదేశపు మొదటి గేమిఫైడ్ పౌర వేదిక',
      'hero.title1': 'ప్రజాస్వామ్యం నేర్చుకోండి.',
      'hero.title2': 'ఆడండి. చర్చించండి. నాయకత్వం వహించండి.',
      'hero.sub': 'EVM ఓటింగ్, పార్లమెంట్ చర్చలు, బడ్జెట్ సిమ్యులేషన్ మరియు రాజ్యాంగ క్విజ్‌లను అనుభవించండి.',
      'hero.cta1': 'ఉచితంగా ప్రారంభించండి 🚀',
      'hero.cta2': 'డెమో ముందు చూడండి',
      'dash.journey': 'మీ పౌర ప్రయాణం',
      'dash.modules': 'అభ్యాస మాడ్యూల్‌లు',
      'card.parliament.title': 'పార్లమెంట్ సిమ్యులేటర్',
      'card.voting.title': 'ఓటింగ్ సిమ్యులేటర్',
      'card.quiz.title': 'రాజ్యాంగ క్విజ్',
      'card.budget.title': 'బడ్జెట్ గేమ్',
      'ui.loading': 'భారతదేశ పౌర అభ్యాస వేదిక',
      'ai.placeholder': 'నన్ను ఏదైనా అడగండి...',
      'ai.send': 'పంపండి',
      'lang.select': 'భాష ఎంచుకోండి',
      'lang.translating': 'అనువాదం అవుతోంది...',
    },

    ta: {
      'nav.civics': '📚 குடிமையியல்',
      'nav.quiz': '📜 வினாடி வினா',
      'nav.elections': '🗳️ தேர்தல்கள்',
      'nav.parliament': '🏛️ நாடாளுமன்றம்',
      'nav.classroom': '🤖 வகுப்பறை',
      'nav.portfolio': '🎓 போர்ட்ஃபோலியோ',
      'nav.logout': 'வெளியேறு',
      'nav.login': 'உள்நுழைவு / பதிவு',
      'hero.eyebrow': 'இந்தியாவின் முதல் கேமிஃபைட் குடிமையியல் தளம்',
      'hero.title1': 'ஜனநாயகம் கற்றுக்கொள்ளுங்கள்.',
      'hero.title2': 'விளையாடுங்கள். விவாதியுங்கள். தலைமை தாங்குங்கள்.',
      'hero.sub': 'EVM வாக்களிப்பு, நாடாளுமன்ற விவாதங்கள், வரவு செலவு திட்ட உருவகப்படுத்தல் மற்றும் அரசியலமைப்பு வினாடி வினா அனுபவங்களை பெறுங்கள்.',
      'hero.cta1': 'இலவசமாக தொடங்குங்கள் 🚀',
      'hero.cta2': 'முதலில் டெமோ முயற்சிக்கவும்',
      'dash.journey': 'உங்கள் குடிமையியல் பயணம்',
      'dash.modules': 'கற்றல் தொகுதிகள்',
      'card.parliament.title': 'நாடாளுமன்ற சிமுலேட்டர்',
      'card.voting.title': 'வாக்களிப்பு சிமுலேட்டர்',
      'card.quiz.title': 'அரசியலமைப்பு வினாடி வினா',
      'card.budget.title': 'வரவு செலவு திட்ட விளையாட்டு',
      'ui.loading': 'இந்தியாவின் குடிமையியல் கற்றல் தளம்',
      'ai.placeholder': 'என்னிடம் எதையும் கேளுங்கள்...',
      'ai.send': 'அனுப்பு',
      'lang.select': 'மொழி தேர்ந்தெடுக்கவும்',
      'lang.translating': 'மொழிபெயர்க்கப்படுகிறது...',
    },

    mr: {
      'nav.civics': '📚 नागरिकशास्त्र',
      'nav.quiz': '📜 प्रश्नमंजुषा',
      'nav.elections': '🗳️ निवडणुका',
      'nav.parliament': '🏛️ संसद',
      'nav.classroom': '🤖 वर्गखोली',
      'nav.portfolio': '🎓 पोर्टफोलिओ',
      'nav.logout': 'लॉगआउट',
      'nav.login': 'लॉगिन / साइन अप',
      'hero.eyebrow': 'भारताचे पहिले गेमिफाइड नागरिकशास्त्र व्यासपीठ',
      'hero.title1': 'लोकशाही शिका.',
      'hero.title2': 'खेळा. वाद घाला. नेतृत्व करा.',
      'hero.sub': 'EVM मतदान, संसद वादविवाद, बजेट सिम्युलेशन आणि घटनात्मक प्रश्नमंजुषेचा अनुभव घ्या.',
      'hero.cta1': 'विनामूल्य सुरू करा 🚀',
      'hero.cta2': 'प्रथम डेमो वापरा',
      'dash.journey': 'तुमची नागरिक यात्रा',
      'dash.modules': 'शिक्षण मॉड्यूल',
      'card.parliament.title': 'संसद सिम्युलेटर',
      'card.voting.title': 'मतदान सिम्युलेटर',
      'card.quiz.title': 'संविधान प्रश्नमंजुषा',
      'card.budget.title': 'बजेट गेम',
      'ui.loading': 'भारताचे नागरिक शिक्षण व्यासपीठ',
      'ai.placeholder': 'मला काहीही विचारा...',
      'ai.send': 'पाठवा',
      'lang.select': 'भाषा निवडा',
      'lang.translating': 'अनुवाद होत आहे...',
    },

    gu: {
      'nav.civics': '📚 નાગરિક શાસ્ત્ર',
      'nav.quiz': '📜 ક્વિઝ',
      'nav.elections': '🗳️ ચૂંટણી',
      'nav.parliament': '🏛️ સંસદ',
      'nav.classroom': '🤖 વર્ગખંડ',
      'nav.portfolio': '🎓 પોર્ટફોલિયો',
      'nav.logout': 'લોગઆઉટ',
      'nav.login': 'લોગિન / સાઇન અપ',
      'hero.eyebrow': 'ભારતનું પ્રથમ ગેમિફાઇડ સિવિક્સ પ્લેટફોર્મ',
      'hero.title1': 'લોકશાહી શીખો.',
      'hero.title2': 'રમો. ચર્ચા કરો. નેતૃત્વ કરો.',
      'hero.sub': 'EVM મતદાન, સંસદ ચર્ચાઓ, બજેટ સિમ્યુલેશન અને બંધારણીય ક્વિઝ અનુભવો.',
      'hero.cta1': 'મફત શરૂ કરો 🚀',
      'hero.cta2': 'પ્રથમ ડેમો અજમાવો',
      'dash.journey': 'તમારી નાગરિક સફર',
      'dash.modules': 'શિક્ષણ મોડ્યુલ',
      'card.parliament.title': 'સંસદ સિમ્યુલેટર',
      'card.voting.title': 'મતદાન સિમ્યુલેટર',
      'card.quiz.title': 'બંધારણ ક્વિઝ',
      'card.budget.title': 'બજેટ ગેમ',
      'ui.loading': 'ભારતનું નાગરિક શિક્ષણ પ્લેટફોર્મ',
      'ai.placeholder': 'મને કંઈ પણ પૂછો...',
      'ai.send': 'મોકલો',
      'lang.select': 'ભાષા પસંદ કરો',
      'lang.translating': 'અનુવાદ થઈ રહ્યો છે...',
    },

    kn: {
      'nav.civics': '📚 ಪೌರ ಶಾಸ್ತ್ರ',
      'nav.quiz': '📜 ರಸಪ್ರಶ್ನೆ',
      'nav.elections': '🗳️ ಚುನಾವಣೆಗಳು',
      'nav.parliament': '🏛️ ಸಂಸತ್ತು',
      'nav.classroom': '🤖 ತರಗತಿ ಕೊಠಡಿ',
      'nav.portfolio': '🎓 ಪೋರ್ಟ್‌ಫೋಲಿಯೋ',
      'nav.logout': 'ಲಾಗ್ ಔಟ್',
      'nav.login': 'ಲಾಗಿನ್ / ಸೈನ್ ಅಪ್',
      'hero.eyebrow': 'ಭಾರತದ ಮೊದಲ ಗೇಮಿಫೈಡ್ ಪೌರ ವೇದಿಕೆ',
      'hero.title1': 'ಪ್ರಜಾಪ್ರಭುತ್ವ ಕಲಿಯಿರಿ.',
      'hero.title2': 'ಆಡಿ. ಚರ್ಚಿಸಿ. ನೇತೃತ್ವ ವಹಿಸಿ.',
      'hero.sub': 'EVM ಮತದಾನ, ಸಂಸತ್ ಚರ್ಚೆಗಳು, ಬಜೆಟ್ ಸಿಮ್ಯುಲೇಷನ್ ಮತ್ತು ಸಾಂವಿಧಾನಿಕ ರಸಪ್ರಶ್ನೆ ಅನುಭವಿಸಿ.',
      'hero.cta1': 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ 🚀',
      'hero.cta2': 'ಮೊದಲು ಡೆಮೋ ಪ್ರಯತ್ನಿಸಿ',
      'dash.journey': 'ನಿಮ್ಮ ಪೌರ ಪ್ರಯಾಣ',
      'dash.modules': 'ಕಲಿಕಾ ಮಾಡ್ಯೂಲ್‌ಗಳು',
      'card.parliament.title': 'ಸಂಸತ್ ಸಿಮ್ಯುಲೇಟರ್',
      'card.voting.title': 'ಮತದಾನ ಸಿಮ್ಯುಲೇಟರ್',
      'card.quiz.title': 'ಸಂವಿಧಾನ ರಸಪ್ರಶ್ನೆ',
      'card.budget.title': 'ಬಜೆಟ್ ಗೇಮ್',
      'ui.loading': 'ಭಾರತದ ಪೌರ ಕಲಿಕಾ ವೇದಿಕೆ',
      'ai.placeholder': 'ನನ್ನನ್ನು ಏನಾದರೂ ಕೇಳಿ...',
      'ai.send': 'ಕಳುಹಿಸಿ',
      'lang.select': 'ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ',
      'lang.translating': 'ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...',
    },

    ml: {
      'nav.civics': '📚 പൗരശാസ്ത്രം',
      'nav.quiz': '📜 ക്വിസ്',
      'nav.elections': '🗳️ തിരഞ്ഞെടുപ്പ്',
      'nav.parliament': '🏛️ പാർലമെന്റ്',
      'nav.classroom': '🤖 ക്ലാസ്മുറി',
      'nav.portfolio': '🎓 പോർട്ട്ഫോളിയോ',
      'nav.logout': 'ലോഗ്ഔട്ട്',
      'nav.login': 'ലോഗിൻ / സൈൻ അപ്',
      'hero.eyebrow': 'ഇന്ത്യയുടെ ആദ്യ ഗേമിഫൈഡ് പൗര പ്ലാറ്റ്ഫോം',
      'hero.title1': 'ജനാധിപത്യം പഠിക്കൂ.',
      'hero.title2': 'കളിക്കൂ. ചർച്ച ചെയ്യൂ. നേതൃത്വം നൽകൂ.',
      'hero.sub': 'EVM വോട്ടിംഗ്, പാർലമെന്റ് ചർച്ചകൾ, ബജറ്റ് സിമുലേഷൻ, ഭരണഘടനാ ക്വിസ് അനുഭവിക്കൂ.',
      'hero.cta1': 'സൗജന്യമായി ആരംഭിക്കൂ 🚀',
      'hero.cta2': 'ആദ്യം ഡെമോ പരീക്ഷിക്കൂ',
      'dash.journey': 'നിങ്ങളുടെ പൗര യാത്ര',
      'dash.modules': 'പഠന മൊഡ്യൂളുകൾ',
      'card.parliament.title': 'പാർലമെന്റ് സിമുലേറ്റർ',
      'card.voting.title': 'വോട്ടിംഗ് സിമുലേറ്റർ',
      'card.quiz.title': 'ഭരണഘടനാ ക്വിസ്',
      'card.budget.title': 'ബജറ്റ് ഗെയിം',
      'ui.loading': 'ഇന്ത്യയുടെ പൗര പഠന പ്ലാറ്റ്ഫോം',
      'ai.placeholder': 'എന്നോട് എന്തും ചോദിക്കൂ...',
      'ai.send': 'അയക്കൂ',
      'lang.select': 'ഭാഷ തിരഞ്ഞെടുക്കൂ',
      'lang.translating': 'വിവർത്തനം ചെയ്യുന്നു...',
    },

    pa: {
      'nav.civics': '📚 ਨਾਗਰਿਕ ਸ਼ਾਸਤਰ',
      'nav.quiz': '📜 ਕੁਇਜ਼',
      'nav.elections': '🗳️ ਚੋਣਾਂ',
      'nav.parliament': '🏛️ ਸੰਸਦ',
      'nav.classroom': '🤖 ਕਲਾਸਰੂਮ',
      'nav.portfolio': '🎓 ਪੋਰਟਫੋਲੀਓ',
      'nav.logout': 'ਲੌਗਆਉਟ',
      'nav.login': 'ਲੌਗਿਨ / ਸਾਈਨ ਅੱਪ',
      'hero.eyebrow': 'ਭਾਰਤ ਦਾ ਪਹਿਲਾ ਗੇਮੀਫਾਈਡ ਸਿਵਿਕਸ ਪਲੇਟਫਾਰਮ',
      'hero.title1': 'ਲੋਕਤੰਤਰ ਸਿੱਖੋ।',
      'hero.title2': 'ਖੇਡੋ। ਬਹਿਸ ਕਰੋ। ਅਗਵਾਈ ਕਰੋ।',
      'hero.sub': 'EVM ਵੋਟਿੰਗ, ਸੰਸਦ ਬਹਿਸਾਂ, ਬਜਟ ਸਿਮੂਲੇਸ਼ਨ ਅਤੇ ਸੰਵਿਧਾਨਕ ਕੁਇਜ਼ ਦਾ ਅਨੁਭਵ ਕਰੋ।',
      'hero.cta1': 'ਮੁਫਤ ਸ਼ੁਰੂ ਕਰੋ 🚀',
      'hero.cta2': 'ਪਹਿਲਾਂ ਡੈਮੋ ਅਜ਼ਮਾਓ',
      'ui.loading': 'ਭਾਰਤ ਦਾ ਨਾਗਰਿਕ ਸਿਖਲਾਈ ਪਲੇਟਫਾਰਮ',
      'ai.placeholder': 'ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ...',
      'ai.send': 'ਭੇਜੋ',
      'lang.select': 'ਭਾਸ਼ਾ ਚੁਣੋ',
      'lang.translating': 'ਅਨੁਵਾਦ ਹੋ ਰਿਹਾ ਹੈ...',
    },

    ur: {
      'nav.civics': '📚 شہری علوم',
      'nav.quiz': '📜 کوئز',
      'nav.elections': '🗳️ انتخابات',
      'nav.parliament': '🏛️ پارلیمنٹ',
      'nav.classroom': '🤖 کلاس روم',
      'nav.portfolio': '🎓 پورٹ فولیو',
      'nav.logout': 'لاگ آؤٹ',
      'nav.login': 'لاگ ان / سائن اپ',
      'hero.eyebrow': 'بھارت کا پہلا گیمیفائیڈ شہری علوم پلیٹ فارم',
      'hero.title1': 'جمہوریت سیکھیں۔',
      'hero.title2': 'کھیلیں۔ بحث کریں۔ قیادت کریں۔',
      'hero.sub': 'EVM ووٹنگ، پارلیمنٹ مباحثے، بجٹ سمولیشن اور آئینی کوئز کا تجربہ کریں۔',
      'hero.cta1': 'مفت شروع کریں 🚀',
      'hero.cta2': 'پہلے ڈیمو آزمائیں',
      'ui.loading': 'بھارت کا شہری تعلیم پلیٹ فارم',
      'ai.placeholder': 'مجھ سے کچھ بھی پوچھیں...',
      'ai.send': 'بھیجیں',
      'lang.select': 'زبان منتخب کریں',
      'lang.translating': 'ترجمہ ہو رہا ہے...',
    },

    or: {
      'nav.civics': '📚 ନାଗରିକ ଶାସ୍ତ୍ର',
      'nav.quiz': '📜 କ୍ୱିଜ୍',
      'nav.elections': '🗳️ ନିର୍ବାଚନ',
      'nav.parliament': '🏛️ ସଂସଦ',
      'nav.classroom': '🤖 ଶ୍ରେଣୀ ଗୃହ',
      'nav.portfolio': '🎓 ପୋର୍ଟଫୋଲିଓ',
      'nav.logout': 'ଲଗ୍ ଆଉଟ୍',
      'nav.login': 'ଲଗ୍ ଇନ୍ / ସାଇନ୍ ଅପ୍',
      'hero.title1': 'ଗଣତନ୍ତ୍ର ଶିଖ।',
      'hero.title2': 'ଖେଳ। ବିତର୍କ କର। ନେତୃତ୍ୱ ନିଅ।',
      'ui.loading': 'ଭାରତର ନାଗରିକ ଶିକ୍ଷା ପ୍ଲାଟଫର୍ମ',
      'ai.placeholder': 'ମୋତେ ଯାହା ହେଉ ପଚାର...',
      'ai.send': 'ପଠାଅ',
      'lang.select': 'ଭାଷା ବାଛ',
      'lang.translating': 'ଅନୁବାଦ ହେଉଛି...',
    },

    as: {
      'nav.civics': '📚 নাগৰিক শিক্ষা',
      'nav.quiz': '📜 কুইজ',
      'nav.elections': '🗳️ নিৰ্বাচন',
      'nav.parliament': '🏛️ সংসদ',
      'nav.classroom': '🤖 শ্ৰেণীকক্ষ',
      'nav.portfolio': '🎓 পোৰ্টফলিঅ',
      'nav.logout': 'লগআউট',
      'nav.login': 'লগইন / চাইন আপ',
      'hero.title1': 'গণতন্ত্ৰ শিকক।',
      'hero.title2': 'খেলক। বিতৰ্ক কৰক। নেতৃত্ব দিয়ক।',
      'ui.loading': 'ভাৰতৰ নাগৰিক শিক্ষা প্লেটফৰ্ম',
      'ai.placeholder': 'মোক যিকোনো কথা সুধিব...',
      'ai.send': 'পঠাওক',
      'lang.select': 'ভাষা বাছনি কৰক',
      'lang.translating': 'অনুবাদ হৈছে...',
    },
  },

  currentLang: 'en',
  aiTranslationCache: {},
  isTranslating: false,

  // Initialize language system
  init() {
    const saved = localStorage.getItem('cq_language') || 'en';
    this.currentLang = saved;
    this.applyLanguage(saved, true);
    this.injectLanguagePicker();
    this.injectFonts();
  },

  // Get translation for a key
  t(key) {
    const langData = this.TRANSLATIONS[this.currentLang] || {};
    const enData   = this.TRANSLATIONS['en'] || {};
    return langData[key] || enData[key] || key;
  },

  // Apply language to page
  applyLanguage(lang, silent = false) {
    this.currentLang = lang;
    localStorage.setItem('cq_language', lang);

    const langInfo = this.LANGUAGES[lang];
    if (!langInfo) return;

    // Set document direction for RTL languages
    document.documentElement.dir  = langInfo.dir || 'ltr';
    document.documentElement.lang = lang;

    // Apply font if needed
    if (langInfo.font) {
      document.documentElement.style.setProperty('--lang-font', `'${langInfo.font}', sans-serif`);
    } else {
      document.documentElement.style.removeProperty('--lang-font');
    }

    // Translate all data-i18n elements
    this.translateDOM();

    // Update language picker UI
    this.updatePickerUI(lang);

    // If not English and no built-in translations for some keys, use AI
    if (lang !== 'en') {
      this.translateUnknownElements(lang);
    }

    if (!silent) {
      const toast = document.getElementById('cq-toast-global') || document.getElementById('cq_toast');
      if (toast) {
        toast.textContent = `🌐 ${langInfo.native}`;
        toast.classList?.add?.('show');
        toast.style.opacity = '1';
        setTimeout(() => {
          toast.classList?.remove?.('show');
          toast.style.opacity = '0';
        }, 2000);
      }
    }
  },

  // Translate all elements with data-i18n attribute
  translateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = this.t(key);
      if (translated && translated !== key) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translated;
        } else if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = translated;
        } else {
          el.textContent = translated;
        }
      }
    });

    // Also translate title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translated = this.t(key);
      if (translated && translated !== key) el.title = translated;
    });
  },

  // Use Claude AI API to translate elements that don't have built-in translations
  async translateUnknownElements(lang) {
    if (this.isTranslating) return;
    const langInfo = this.LANGUAGES[lang];
    if (!langInfo) return;

    // Collect text content that needs AI translation
    const toTranslate = [];
    const elements = [];

    document.querySelectorAll('[data-i18n-auto]').forEach(el => {
      const originalText = el.getAttribute('data-i18n-orig') || el.textContent.trim();
      if (!el.hasAttribute('data-i18n-orig')) {
        el.setAttribute('data-i18n-orig', originalText);
      }

      const cacheKey = `${lang}:${originalText}`;
      if (this.aiTranslationCache[cacheKey]) {
        el.textContent = this.aiTranslationCache[cacheKey];
      } else if (originalText && originalText.length < 500) {
        toTranslate.push(originalText);
        elements.push({ el, originalText, cacheKey });
      }
    });

    if (toTranslate.length === 0) return;

    this.isTranslating = true;
    this.showTranslatingIndicator(true);

    try {
      // Batch translate using Claude API
      const batchSize = 15;
      for (let i = 0; i < toTranslate.length; i += batchSize) {
        const batch = toTranslate.slice(i, i + batchSize);
        const batchElements = elements.slice(i, i + batchSize);

        const prompt = `Translate the following ${toTranslate.length} text items from English to ${langInfo.name} (${langInfo.native}).
These are UI labels for an Indian civic education website about democracy, voting, parliament, and constitution.
Respond with ONLY a JSON array of translated strings in the same order. Keep emojis unchanged. Keep proper nouns like "CivicaQuest", "EVM", "VVPAT", "Lok Sabha", "Rajya Sabha" unchanged.

Texts to translate:
${JSON.stringify(batch)}`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
          })
        });

        if (!response.ok) continue;

        const data = await response.json();
        const rawText = data.content?.[0]?.text || '[]';

        // Parse JSON response
        const clean = rawText.replace(/```json|```/g, '').trim();
        let translations = [];
        try {
          translations = JSON.parse(clean);
        } catch(e) {
          // Try to extract array
          const match = clean.match(/\[[\s\S]*\]/);
          if (match) translations = JSON.parse(match[0]);
        }

        // Apply translations
        translations.forEach((translated, idx) => {
          if (batchElements[idx] && translated) {
            const { el, cacheKey } = batchElements[idx];
            this.aiTranslationCache[cacheKey] = translated;
            el.textContent = translated;
          }
        });
      }
    } catch(e) {
      console.warn('AI translation failed:', e);
    }

    this.isTranslating = false;
    this.showTranslatingIndicator(false);
  },

  showTranslatingIndicator(show) {
    let ind = document.getElementById('cq-translating');
    if (show) {
      if (!ind) {
        ind = document.createElement('div');
        ind.id = 'cq-translating';
        ind.style.cssText = `
          position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
          background:#1a56db;color:#fff;padding:8px 16px;border-radius:20px;
          font-size:0.75rem;font-weight:600;z-index:999999;
          display:flex;align-items:center;gap:8px;
          box-shadow:0 4px 20px rgba(26,86,219,0.5);
        `;
        document.body.appendChild(ind);
      }
      ind.innerHTML = `<span style="animation:cq-spin 1s linear infinite;display:inline-block;">⚙️</span> ${this.t('lang.translating')}`;
      ind.style.display = 'flex';
    } else {
      if (ind) ind.style.display = 'none';
    }
  },

  // Inject Google Fonts for Indian scripts
  injectFonts() {
    if (document.getElementById('cq-lang-fonts')) return;
    const link = document.createElement('link');
    link.id = 'cq-lang-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=Noto+Sans+Telugu:wght@400;500;600;700;800&family=Noto+Sans+Tamil:wght@400;500;600;700;800&family=Noto+Sans+Gujarati:wght@400;500;600;700;800&family=Noto+Sans+Kannada:wght@400;500;600;700;800&family=Noto+Sans+Malayalam:wght@400;500;600;700;800&family=Noto+Sans+Gurmukhi:wght@400;500;600;700;800&family=Noto+Sans+Oriya:wght@400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  },

  // Inject language picker button into navbar
  injectLanguagePicker() {
    if (document.getElementById('cq-lang-picker')) return;

    const pickerHTML = `
      <div id="cq-lang-picker" class="cq-lang-picker">
        <button class="cq-lang-btn" onclick="CQ_LANG.togglePicker()" title="Change Language">
          <span class="cq-lang-globe">🌐</span>
          <span class="cq-lang-current" id="cq-lang-current">EN</span>
          <span class="cq-lang-caret">▾</span>
        </button>
        <div class="cq-lang-dropdown" id="cq-lang-dropdown">
          <div class="cq-lang-search-wrap">
            <input type="text" class="cq-lang-search" id="cq-lang-search" placeholder="Search language..." oninput="CQ_LANG.filterLangs(this.value)">
          </div>
          <div class="cq-lang-ai-note">🤖 Powered by AI Translation</div>
          <div class="cq-lang-grid" id="cq-lang-grid">
            ${Object.entries(this.LANGUAGES).map(([code, info]) => `
              <button class="cq-lang-option" data-lang="${code}" onclick="CQ_LANG.selectLang('${code}')">
                <span class="cq-lang-native">${info.native}</span>
                <span class="cq-lang-en">${info.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Insert into navbar right section
    const navRight = document.querySelector('.cq-nav-right') || document.querySelector('.nav-links') || document.querySelector('nav');
    if (navRight) {
      const pickerEl = document.createElement('div');
      pickerEl.innerHTML = pickerHTML;
      // Insert before the first child of nav-right
      navRight.insertBefore(pickerEl.firstElementChild, navRight.firstChild);
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      const picker = document.getElementById('cq-lang-picker');
      if (picker && !picker.contains(e.target)) {
        document.getElementById('cq-lang-dropdown')?.classList.remove('open');
      }
    });

    this.updatePickerUI(this.currentLang);
  },

  togglePicker() {
    const dd = document.getElementById('cq-lang-dropdown');
    if (dd) {
      dd.classList.toggle('open');
      if (dd.classList.contains('open')) {
        document.getElementById('cq-lang-search')?.focus();
      }
    }
  },

  selectLang(code) {
    this.applyLanguage(code);
    document.getElementById('cq-lang-dropdown')?.classList.remove('open');
    document.getElementById('cq-lang-search').value = '';
    this.filterLangs('');
  },

  filterLangs(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.cq-lang-option').forEach(btn => {
      const code = btn.getAttribute('data-lang');
      const info = this.LANGUAGES[code];
      const matches = info.name.toLowerCase().includes(q) || info.native.toLowerCase().includes(q) || code.includes(q);
      btn.style.display = matches ? '' : 'none';
    });
  },

  updatePickerUI(lang) {
    const current = document.getElementById('cq-lang-current');
    if (current) current.textContent = lang.toUpperCase();

    document.querySelectorAll('.cq-lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => CQ_LANG.init());
window.CQ_LANG = CQ_LANG;
