# Icon — install-to-home-screen app (no coding, no build tools, $0)

This folder is the whole app. There's nothing to install on your computer,
nothing to run in a terminal, no "build" step — just files ready to put
online.

## Step 1 — Connect the free backend (one-time, ~10 minutes)

1. Go to https://console.firebase.google.com and create a project (the free
   "Spark" plan — no credit card asked for).
2. Left sidebar → **Build → Authentication → Get started** → enable
   **Email/Password**.
3. Left sidebar → **Build → Firestore Database → Create database** → choose
   **test mode** for now.
4. Click the ⚙️ gear icon → **Project settings** → scroll to **Your apps** →
   click the `</>` (web) icon → register the app → it'll show you a block of
   code with values like `apiKey`, `authDomain`, etc.
5. Open **`app.js`** in this folder in any text editor (even Notepad or
   TextEdit works) → near the top, find the `firebaseConfig` block → replace
   the placeholder text with your real values from step 4 → save.

## Step 2 — Put it online for free

No account with a coding platform needed — just:

1. Go to **https://app.netlify.com/drop**
2. Drag this whole folder onto the page
3. Netlify gives you a live web address in a few seconds, like
   `https://random-name-123.netlify.app`

That's it — the app is now live on the internet, for free, permanently.

## Step 3 — Put it on your phone's home screen

Open that Netlify address on your phone:

- **iPhone**: open it in **Safari** → tap the Share icon (square with an
  arrow) → **Add to Home Screen**
- **Android**: open it in **Chrome** → tap the ⋮ menu → **Install app** (or
  **Add to Home screen**)

An Icon app icon now sits on your home screen. Tapping it opens full-screen,
no browser bar — indistinguishable from a "real" app to anyone using it.

## What's actually real vs. still a demo

Wired to your real Firebase backend — data actually saves and persists:
- **Sign up / log in** — real accounts, real password security
- **Home feed** — post something, it's saved; refresh and it's still there
- **Marketplace** — "Sell" publishes a real listing to your database
- **Subscriptions** — picking a plan saves your choice to your account
- **Ad manager** — campaigns you create are saved and reloadable

Still an interactive demo, on purpose, with honest reasons why:
- **AI tool replies** — these are simulated. Real AI calls need a small
  server to hold an API key safely; calling an AI API straight from a free
  static site would expose that key to anyone who opens the page. Adding
  this for real is the one piece that requires a (very cheap, e.g. a free
  tier of Vercel/Netlify serverless functions) backend function, not just
  Firebase.
- **Payments** ("Buy" in the marketplace, real subscription billing) —
  needs Stripe (marketplace) or Apple/Google in-app purchase (subscriptions)
  wired in; those move real money, so they're intentionally left as
  placeholders until you're ready to connect them.

## Security note before real strangers use it

"Test mode" in Firestore lets anyone read and write anything — fine while
you're the only one testing, not fine once other people can reach the app.
Before sharing the link widely, go to **Firestore → Rules** in your Firebase
console and use something like this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    match /listings/{listingId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    match /subscriptions/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /campaigns/{campaignId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## If something doesn't load

Open the page, then check the browser's error console (on desktop:
right-click → Inspect → Console tab). The most common issue is a typo in
the `firebaseConfig` values in `app.js` — double check those against your
Firebase project settings.
