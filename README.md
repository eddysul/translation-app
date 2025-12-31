# General Translation Take Home Assignment

## Main Features

**Text Translation**
- Translate text between multiple languages 
- Support for both newest OpenAI (GPT-5.2) and Anthropic (Claude Sonnet 4.5) models
- Language swap functionality
- Character count tracking and copy to clipboard functionality.

**JSON Translation**
- Upload JSON files or paste JSON directly
- Automatically translates all string values while preserving structure and keys
- JSON validation with error messages
- Download translated JSON files
- Character count tracking and copy to clipboard functionality.

**Modern UI and Styling**
- Responsive layout (mobile, tablet, desktop)
- Visual feedback for loading states and errors
- Smooth transitions and hover effects
- light and dark mode toggle button

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

**Technical Decisions and Assumptions:**
- **Service -> Hook -> View Architecture**: Decoupling of business logic, state management from UI allows easier testing and ability to test each feature individually without it affecting the other. 
- **UI/Logic Separation**: Used containers to decouple UI styling from state management and logic. Container components handle state and logic; view components handle rendering and UI so that it is easier to maintain and refactor code.
- **API Design**: Created server side API routes than direct client side calls to protect env variables and API keys from being exposed.
- **Extensibility**: Avoided hard coding languages and AI providers directly inside components, by creating a separate lib/constants folder. Created a constants and providers interface so that it is easier to add providers and languages if I were to scale without largely touching existing logic.
- **Model Selection**: Chose latest models GPT-5.2 and Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Translation Strategy

I system prompted the AI models with a specific set of rules. These rules can be found in lib/ai/translateText.ts
1. Output ONLY the translated text (no explanations or meta-commentary)
2. Preserve technical terms such as commands, version numbers, and code, ids, names.
3. Return empty strings and null values unchanged
4. Return the original, if it is unsure of what to translate.

### Constraints
1. Only json files are allowed to be uploaded for now
2. Only 10 languages to not overcomplicate testing.
3. Only 2 providers (Open AI and Anthropic)

## How to Run Locally

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


## Challenges

### Challenge 1: Anthropic Model Compatibility
**Problem:** Initial Anthropic API calls returned 404 "model not found" errors with various model names.

**Solution:** Tested different model versions until finding `claude-sonnet-4-5-20250929` which was supported by the proxy. The proxy has a whitelist of supported models, so we had to iterate to find a compatible one.

### Challenge 2: System Prompting AI Models
**Problem:** When translating individual JSON values, the AI models would add explanatory notes like "Here's the translation:" instead of returning just the translated text. Also, the translation would sometimes be inconsistent and not make sense.

**Solution:** Made the system prompt much more explicit and consistent with:
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

## Improvements
1. **Adding more providers and languages**: Add more AI providers and languages.
2. **History**: Add a history panel for users so users can see their most recent translation requests or view their past requests.
3. **Additional File Support**: Instead of just json files, support for text, or image files for both text and json translation version.
4. **Rate Limiting**: Put a limit on number of requests so system doesn't get overhauled.
5. **Batch Translation Requests**: Instead of translating each JSON value individually, batch them into fewer API calls for lower latency
6. **Caching**: Store recent translations to reduce API calls and costs
8. **Streaming Responses**: Stream large translation results for better perceived performance

## Testing

Test files are included in `test_files/` folder with various edge cases and can test for both text and json files:
- UI labels and error messages
- Package.json (technical terms)
- Product catalogs (mixed content)
- Empty values and null handling
- Special characters and Unicode
- HTML/Markdown/Code blocks
- Deeply nested structures
- Arrays with mixed types
- Emojis and special formatting

Run through these manually using the JSON upload feature or copy paste the text files to validate translation quality.

## Deployment

Deployed using **Vercel** at: https://translation-app-psi-ivory.vercel.app/
