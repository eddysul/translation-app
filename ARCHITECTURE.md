# Translation App Architecture

## Overview

This translation app follows a **separation of concerns** pattern to ensure that UI and business logic are completely decoupled. This makes the application highly scalable and allows you to change the UI without touching the core translation logic.

## Architecture Layers

### 1. **Service Layer** (`lib/translationService.ts`)
The foundation of the application. Contains all business logic, validation, and API communication.

**Key Responsibilities:**
- Handles all API calls to `/api/translate`
- Validates input (text, JSON, languages)
- Manages request/response formatting
- Error handling at the service level
- Type definitions for translation requests and responses

**Key Functions:**
- `translateText(request)` - Main translation function
- `validateTextInput(text)` - Validates text input
- `validateJsonInput(json)` - Validates and parses JSON
- `validateLanguages(source, target)` - Validates language selections

**Why:** This layer is independent of React. If you want to switch from a Web UI to a CLI or mobile app, you can reuse this entire layer.

---

### 2. **Custom Hook** (`hooks/useTranslation.ts`)
A React hook that encapsulates all translation state and orchestrates business logic.

**What it manages:**
- **State**: `sourceLanguage`, `targetLanguage`, `loading`, `error`, `translatedText`, `provider`
- **Actions**: All methods to modify state and trigger translations

**Structure:**
```tsx
const [state, actions] = useTranslation();

// State properties
state.sourceLanguage      // Current source language
state.targetLanguage      // Current target language
state.loading            // Is a translation in progress?
state.error              // Current error message
state.translatedText     // Last translation result
state.provider           // Selected provider (openai | anthropic)

// Action methods
actions.setSourceLanguage(lang)    // Set source language
actions.setTargetLanguage(lang)    // Set target language
actions.setProvider(provider)      // Set translation provider
actions.swapLanguages()            // Swap source and target
actions.translateTextInput(text)    // Translate plain text
actions.translateJsonInput(json)    // Translate JSON
actions.clearError()               // Clear error message
actions.clearResult()              // Clear translation result
```

**Why:** This hook is UI framework–agnostic in logic. The same hook could work with Vue, Svelte, or any other framework with minimal changes.

---

### 3. **UI Components** (`components/`)

Components are **purely presentational** and receive all state and handlers from the hook via props.

#### **TranslationInterface.tsx**
- Entry point for the translation feature
- Uses `useTranslation()` hook to get state and actions
- Passes both to child components
- Manages overall layout and card structure

#### **TranslationTabs.tsx**
- Manages tab navigation (Text vs JSON)
- Delegates rendering to `TextTranslation` or `JsonTranslation`
- Passes state and actions down to tab content

#### **TextTranslation.tsx**
- Handles text input UI
- Displays source and target in side-by-side columns
- Calls `actions.translateTextInput(inputText)` on translate
- No business logic—only UI presentation

#### **JsonTranslation.tsx**
- Handles JSON input UI
- Mirrors TextTranslation layout but for JSON
- Calls `actions.translateJsonInput(json)` on translate
- No business logic—only UI presentation

#### **LanguageSelector.tsx**
- Reusable dropdown for language selection
- Purely presentational
- No knowledge of translation logic

#### **ProviderSelector.tsx**
- Reusable dropdown for provider selection
- Purely presentational

---

## Data Flow

```
User Action (e.g., click Translate)
    ↓
UI Component (TextTranslation.tsx)
    ↓
Hook Action (actions.translateTextInput)
    ↓
Service Function (translateText)
    ↓
API Endpoint (/api/translate)
    ↓
Response returned & Hook updates state
    ↓
Components re-render with new state
```

---

## Scalability Benefits

### **Changing the UI**
If you want to redesign the interface (mobile layout, different components, new color scheme), you only modify files in `components/`. The hook and service remain untouched.

**Example:** Change `TextTranslation.tsx` layout from side-by-side to vertical without touching any logic.

### **Changing the Translation Provider**
If you want to add a new provider or change the API endpoint, you modify only:
- `lib/translationService.ts` (API call logic)
- `app/api/translate/route.ts` (backend logic)

UI components are unaffected because they work with the hook's abstraction.

### **Adding New Features**
Want to add file upload, translation history, or batch translation?
1. Add new actions to the hook (`useTranslation.ts`)
2. Add new service functions to (`lib/translationService.ts`)
3. Create new components that use the hook

Existing components and logic remain unchanged.

### **Testing**
- **Service layer**: Test pure functions independently
- **Hook logic**: Test state management separately
- **Components**: Test UI in isolation by mocking the hook

---

## Example: Changing the UI Layout

**Scenario:** You want to change from side-by-side to a mobile-friendly vertical layout.

**Current:** `TextTranslation.tsx` (3-column grid)
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* source, swap, target */}
</div>
```

**Change to:** Vertical stack
```tsx
<div className="space-y-4">
  {/* source section */}
  {/* swap button */}
  {/* target section */}
</div>
```

**What stays the same:**
- `state.sourceLanguage`, `state.targetLanguage`, `state.translatedText`, `state.loading`, `state.error`
- `actions.translateTextInput()`, `actions.swapLanguages()`, `actions.setSourceLanguage()`
- API structure and response format
- Server-side translation logic

**Result:** Complete redesign with zero changes to business logic.

---

## File Organization

```
translation-app/
├── app/
│   ├── page.tsx                    # Home page (uses TranslationInterface)
│   └── api/
│       └── translate/
│           └── route.ts             # API endpoint (server-side logic)
├── components/
│   ├── TranslationInterface.tsx    # Main component (uses hook)
│   ├── TranslationTabs.tsx         # Tab navigation
│   ├── TextTranslation.tsx         # Text UI (presentational)
│   ├── JsonTranslation.tsx         # JSON UI (presentational)
│   ├── LanguageSelector.tsx        # Reusable language dropdown
│   └── ProviderSelector.tsx        # Reusable provider dropdown
├── hooks/
│   └── useTranslation.ts           # State & orchestration logic
├── lib/
│   ├── translationService.ts       # Business logic & API client
│   └── languages.ts                # Language constants
```

---

## Next Steps

### **Implementing Server-Side Translation**
The hook and service are ready. You only need to update `app/api/translate/route.ts`:

```typescript
// Current: Returns placeholder
// TODO: Use OpenAI/Anthropic SDKs to translate actual content

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

if (provider === 'openai') {
  const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.PROXY_TOKEN,
  });
  // Call openai.chat.completions.create(...)
}

if (provider === 'anthropic') {
  const anthropic = new Anthropic({
    baseURL: process.env.ANTHROPIC_BASE_URL,
    apiKey: process.env.PROXY_TOKEN,
  });
  // Call anthropic.messages.create(...)
}
```

The UI components will automatically work once the API returns real translations.

---

## Summary

This architecture ensures:
✅ **Logic & UI are completely decoupled**
✅ **Easy to change UI without touching business logic**
✅ **Easy to add new providers or translation methods**
✅ **Easy to test each layer independently**
✅ **Easy to reuse logic in other apps or platforms**

All translation state and logic flows through `useTranslation()` hook, making it a single source of truth for the entire translation workflow.
