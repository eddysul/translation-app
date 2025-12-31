# GT Translate - AI-Powered Translation Application

A modern web application for translating text and JSON files using OpenAI and Anthropic APIs. Built with Next.js, TypeScript, and TailwindCSS with a clean, decoupled architecture.

## Features

✨ **Text Translation**
- Translate text between multiple languages (English, Spanish, French, German, Portuguese, Italian, Dutch, Korean, Japanese, Chinese)
- Support for both OpenAI (GPT-5.2) and Anthropic (Claude Sonnet 4.5) models
- Language swap functionality
- Character count tracking

📄 **JSON Translation**
- Upload JSON files or paste JSON directly
- Automatically translates all string values while preserving structure and keys
- JSON validation with error messages
- Download translated JSON files
- Copy to clipboard functionality

�� **Theme Support**
- Light and dark mode with toggle button
- Persistent theme preference via localStorage
- Theme-aware styling across all components

🎨 **Modern UI**
- Clean, intuitive interface with consistent design
- Responsive layout (mobile, tablet, desktop)
- Visual feedback for loading states and errors
- Smooth transitions and hover effects

## Implementation Details

### Architecture

The application follows a **service → hook → component** pattern for clean separation of concerns:

```
lib/
├── services/          # API clients (translationClient, jsonTranslationClient)
├── hooks/             # State management (useTranslator, useJsonTranslator, useTranslatorState)
├── ai/                # AI provider integration (openai.ts, anthropic.ts, translateText.ts)
├── json/              # JSON translation utilities (translateJson.ts)
├── constants/         # Configuration (languages.ts, providers.ts)
└── types.ts           # TypeScript interfaces

app/
├── components/        # Presentational components (TextTranslator, JsonTranslator, ThemeToggle)
├── api/              # API routes (/api/translate-text, /api/translate-json)
└── layout.tsx        # Root layout with theme initialization
```

**Key Design Decisions:**
- **UI/Logic Separation**: Container components handle state and logic; view components handle rendering
- **Decoupled Services**: Translation logic is isolated from API routes and React components
- **Theme System**: CSS custom properties enable seamless light/dark mode without hardcoded colors
- **File Upload Handling**: Logic in container component, UI in view component

### Models Used

- **OpenAI**: GPT-5.2 (latest model with `max_completion_tokens` parameter)
- **Anthropic**: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Translation Strategy

The system prompt is designed to:
1. Output ONLY the translated text (no explanations or meta-commentary)
2. Preserve technical terms, commands, version numbers, and code
3. Return empty strings and null values unchanged
4. Prevent hallucinations by being explicit about what NOT to do

## How to Run Locally

### Prerequisites
- Node.js 18+ and npm
- `.env.local` file with API credentials

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/eddysul/translation-app.git
cd translation-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env.local` file:**
```bash
PROXY_TOKEN=your_proxy_token_here
OPENAI_BASE_URL=https://hiring-proxy.gtx.dev/openai
ANTHROPIC_BASE_URL=https://hiring-proxy.gtx.dev/anthropic
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open the app:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Challenges & Solutions

### Challenge 1: Anthropic Model Compatibility
**Problem:** Initial Anthropic API calls returned 404 "model not found" errors with various model names.

**Solution:** Tested different model versions until finding `claude-sonnet-4-5-20250929` which was supported by the proxy. The proxy has a whitelist of supported models, so we had to iterate to find a compatible one.

### Challenge 2: AI Models Adding Explanatory Text
**Problem:** When translating individual JSON values, the AI models would add explanatory notes like "Here's the translation:" instead of returning just the translated text.

**Solution:** Made the system prompt much more explicit with:
- Numbered STRICT RULES
- Examples of correct behavior
- Emphasis on returning ONLY the translation
- Added rule to keep technical terms unchanged (preventing unwanted translations of package names, commands, etc.)

### Challenge 3: Empty String Handling
**Problem:** Anthropic API rejected requests with empty messages ("all messages must have non-empty content").

**Solution:** Added early return in `translateText()` to skip API calls for empty strings and return them unchanged.

### Challenge 4: JSON Structure Preservation
**Problem:** Ensuring JSON keys are never translated while all string values are translated recursively.

**Solution:** Created `translateJsonObject()` utility that:
- Only translates string values
- Preserves all keys unchanged
- Recursively handles nested objects and arrays
- Leaves non-string types (numbers, booleans, null) untouched

## What I Would Improve With More Time

### Short-term Improvements
1. **Batch Translation Requests**: Instead of translating each JSON value individually, batch them into fewer API calls for better performance
2. **Smooth CSS Transitions**: Add transitions when switching themes for a polished feel
3. **Caching**: Store recent translations to reduce API calls and costs
4. **Streaming Responses**: Stream large translation results for better perceived performance

### Medium-term Improvements
1. **History Panel**: Save and manage previous translations
2. **More Language Support**: Add more language pairs beyond Korean
3. **Advanced JSON Options**: 
   - Selective field translation (translate only certain keys)
   - Preserve comments in JSON files
   - Custom key patterns to skip
4. **Rate Limiting**: Implement request throttling to prevent abuse
5. **Error Retry Logic**: Automatic retry with exponential backoff for failed translations

### Long-term Improvements
1. **User Accounts**: Save translation history and preferences
2. **API Usage Dashboard**: Show token usage, costs, and statistics
3. **Custom Model Selection**: Allow users to choose from multiple model versions
4. **Collaborative Translation**: Real-time collaboration on translation projects
5. **Localization Format Support**: Support for i18n formats (YAML, TOML, PO files, etc.)
6. **Quality Metrics**: Track translation quality and user feedback

## Testing

Test files are included in `test_files/` folder with various edge cases:
- UI labels and error messages
- Package.json (technical terms)
- Product catalogs (mixed content)
- Empty values and null handling
- Special characters and Unicode
- HTML/Markdown/Code blocks
- Deeply nested structures
- Arrays with mixed types
- Emojis and special formatting

Run through these manually using the JSON upload feature to validate translation quality.

## Deployment

Deployed on **Vercel** at: [Your Vercel URL]

### Deployment Steps
1. Push code to public GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

## Technologies Used

- **Frontend**: Next.js 16.1.1, React 19.2.3, TypeScript, TailwindCSS 4
- **Backend**: Next.js API Routes
- **AI APIs**: OpenAI (via proxy), Anthropic (via proxy)
- **State Management**: React Hooks
- **Styling**: CSS Custom Properties + TailwindCSS

## Credits

- Built with Next.js and Vercel
- Uses official OpenAI and Anthropic SDKs
- Inspired by modern translation tools like Google Translate and DeepL
