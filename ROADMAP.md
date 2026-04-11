# Roadmap --- Language Learning App (With Writing Engine)

## Phase 0 --- Setup

-   Monorepo
-   Backend + frontend
-   Shared types

------------------------------------------------------------------------

## Phase 1 --- MVP

-   Hiragana
-   Hangeul
-   Basic quiz
-   SRS system

------------------------------------------------------------------------

## Phase 2 --- Writing Engine (NEW)

### Sprint 1

-   Stroke data model
-   SVG integration
-   Canvas setup

### Sprint 2

-   Stroke animation
-   Guided tracing
-   Basic validation

### Sprint 3

-   Free writing mode
-   Score system
-   UX feedback

------------------------------------------------------------------------

## Phase 3 --- Expansion

-   Katakana
-   Vocabulary
-   Audio

------------------------------------------------------------------------

## Phase 4 --- Advanced Learning

-   Kanji
-   Grammar
-   Adaptive learning

------------------------------------------------------------------------

## Phase 5 --- Optimization

-   Performance
-   UX polish
-   Bug fixing

------------------------------------------------------------------------

## Phase 6 --- Differentiation

-   AI features
-   Personalized paths
-   Advanced gamification

------------------------------------------------------------------------

## Future / Nice-to-have

### Handwriting recognition

**Status:** "Option C" is **shipped** via the Google Input Tools public API
(see `composables/useHandwritingRecognizer.ts` + the
`server/api/v1/handwriting/recognize.post.ts` Nitro proxy). When the user
clicks Verify on a drawing exercise, the strokes are sent to Google's CJK
recognizer and the answer is correct iff the target symbol is in the top-N
candidates. The local geometric verifier (`composables/useStrokeVerifier.ts`,
"Option B") is kept around as an offline fallback and runs automatically
when the upstream call fails.

**Future stretch — on-device ML for offline mode**

The Google API is great in connected mode, but a Tauri desktop user with
no internet currently falls back to the geometric matcher. To make
recognition fully offline:

-   Bundle a small CJK handwriting model (ONNX Runtime Web, ~5–15 MB)
    lazy-loaded only when the API is unreachable. Candidates: a fork of
    Tegaki, Zinnia, hanzi-recog, or a custom CRNN trained on Hangeul +
    Kana + common Kanji.
-   Same scoring contract as the API path: rasterize the user's strokes
    → grayscale tensor → model → top-k character predictions → answer is
    correct if the target is in the top-N.
-   Bonus: enables free-form "draw to look up" anywhere in the app,
    independent of the quiz flow.

Trade-offs vs. the current API-based path:

-   Bigger app bundle (mitigated by lazy-loading the model only when
    offline is detected).
-   Real auto-grading for Kanji even without internet.
-   Dependency on a model that needs versioning + retraining if we add
    new scripts.

------------------------------------------------------------------------

## Key Milestones

MVP → Alphabet learning + SRS\
V1 → Writing engine stable\
V2 → Full learning system\
V3 → Differentiated product
