# CivicaQuest Multilingual Support

## 🌐 22 Indian Scheduled Languages Supported

CivicaQuest now supports all 22 Scheduled Languages of India, making civic education accessible to every Indian student.

### Supported Languages

| Language | Script | Native |
|----------|--------|--------|
| English | Latin | English |
| Hindi | Devanagari | हिन्दी |
| Bengali | Bengali | বাংলা |
| Telugu | Telugu | తెలుగు |
| Marathi | Devanagari | मराठी |
| Tamil | Tamil | தமிழ் |
| Gujarati | Gujarati | ગુજરાતી |
| Kannada | Kannada | ಕನ್ನಡ |
| Malayalam | Malayalam | മലയാളം |
| Punjabi | Gurmukhi | ਪੰਜਾਬੀ |
| Odia | Odia | ଓଡ଼ିଆ |
| Assamese | Bengali | অসমীয়া |
| Urdu | Nastaliq (RTL) | اردو |
| Kashmiri | Devanagari | कॉशुर |
| Sanskrit | Devanagari | संस्कृतम् |
| Nepali | Devanagari | नेपाली |
| Maithili | Devanagari | मैथिली |
| Konkani | Devanagari | कोंकणी |
| Manipuri | Bengali | মৈতৈলোন্ |
| Dogri | Devanagari | डोगरी |
| Sindhi | Arabic (RTL) | سنڌي |
| Bodo | Devanagari | बड़ो |

## How It Works

### 1. Built-in Translations
All major UI elements (navigation, hero section, module titles, buttons) come with hand-crafted translations for the 10 most widely spoken Indian languages.

### 2. AI-Powered Translation (Claude API)
For content that doesn't have built-in translations, the system uses Claude AI to automatically translate page content in real-time. Translations are cached in the browser for performance.

### 3. Multilingual AI Chatbot
The AI assistant responds in the user's selected language, making civic education accessible to students who aren't comfortable with English.

### 4. RTL Support
Urdu and Sindhi use right-to-left text direction. The entire UI adapts automatically.

### 5. Indian Script Fonts
Proper Noto fonts are loaded for all Indian scripts via Google Fonts.

## Usage

1. Click the 🌐 language button in the top navigation bar
2. Search or browse to find your language
3. The page content translates immediately
4. The AI chatbot will respond in your language
5. Language preference is saved and persists across pages

## Technical Details

- **Files**: `static/js/cq_lang.js`, `static/css/cq_lang.css`
- **API**: Claude claude-sonnet-4-20250514 for AI translations
- **Caching**: Translations cached in browser memory per session
- **Fallback**: Built-in translations for offline/API failure scenarios
- **Standard**: Uses `data-i18n` attributes (HTML i18n standard)

