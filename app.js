// Icon — single-file static app. No build step: this runs directly in the browser
// via Babel standalone (see index.html) and imports React/Firebase/icons from a CDN.

import { useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Eye, EyeOff, Check, X, ShieldCheck, ArrowRight, Mail, Lock, User, Heart, MessageCircle,
  Repeat2, Bookmark, Search, Home, PlusSquare, ShoppingBag, Sparkles, BadgeCheck, MapPin,
  SlidersHorizontal, Grid3x3, List, Globe, Star, ArrowLeft, Share2, Wand2, Camera, MapPinned,
  Tags, Send, Megaphone, Plus, MousePointerClick, DollarSign, Pause, Play, TrendingUp,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// ---------------------------------------------------------------------------
// Auth helpers — these replace the fake login/signup from the prototype.
// Real password hashing, tokens, and sessions are handled entirely by
// Firebase; nothing sensitive ever touches your own code.
// ---------------------------------------------------------------------------

export async function signUp(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  return cred.user;
}

export async function logIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logOut() {
  await signOut(auth);
}

// Call this once when the app loads to track whether someone's logged in.
// Returns an unsubscribe function — call it on cleanup.
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// ---------------------------------------------------------------------------
// Posts — the home feed, backed by a real Firestore collection instead of
// the hardcoded POSTS array in App.jsx.
// ---------------------------------------------------------------------------

export async function createPost(user, text, tag = null) {
  return addDoc(collection(db, "posts"), {
    authorId: user.uid,
    name: user.displayName || "Anonymous",
    text,
    tag,
    likes: 0,
    comments: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getRecentPosts(max = 30) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function likePost(postId) {
  await updateDoc(doc(db, "posts", postId), { likes: increment(1) });
}

// ---------------------------------------------------------------------------
// Marketplace listings — same pattern as posts, its own collection.
// ---------------------------------------------------------------------------

export async function createListing(user, { title, price, category }) {
  return addDoc(collection(db, "listings"), {
    sellerId: user.uid,
    seller: user.displayName || "Anonymous",
    title,
    price,
    category,
    createdAt: serverTimestamp(),
  });
}

export async function getListings(max = 50) {
  const q = query(collection(db, "listings"), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---------------------------------------------------------------------------
// Subscriptions — one doc per user, in a "subscriptions" collection keyed
// by their uid. Real billing (charging a card) still requires Stripe or
// Apple/Google in-app purchase — this only tracks which plan they're on.
// ---------------------------------------------------------------------------

export async function setSubscription(user, planId, trialDays) {
  const trialEndsAt = trialDays ? Date.now() + trialDays * 24 * 60 * 60 * 1000 : null;
  await setDoc(doc(db, "subscriptions", user.uid), {
    planId,
    trialEndsAt,
    startedAt: serverTimestamp(),
  });
}

export async function getSubscription(user) {
  const snap = await getDoc(doc(db, "subscriptions", user.uid));
  return snap.exists() ? snap.data() : { planId: "free", trialEndsAt: null };
}

// ---------------------------------------------------------------------------
// Ad campaigns — one collection, each campaign tagged with the business
// owner's uid so a real app could scope "my campaigns" per business.
// ---------------------------------------------------------------------------

export async function createCampaign(user, { name, budget }) {
  return addDoc(collection(db, "campaigns"), {
    ownerId: user.uid,
    name,
    budget,
    spend: 0,
    impressions: 0,
    clicks: 0,
    status: "active",
    createdAt: serverTimestamp(),
  });
}

export async function getCampaigns(user) {
  const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => c.ownerId === user.uid);
}

export async function toggleCampaignStatus(campaignId, newStatus) {
  await updateDoc(doc(db, "campaigns", campaignId), { status: newStatus });
}



/* ---------- shared tokens ---------- */
const BG = "#0F0F17";
const CARD = "#17171F";
const ACCENT = "#7C5CFF";
const TEAL = "#2DD4BF";
const AMBER = "#F5A623";
const RED = "#FF5470";
const TEXT_MUTED = "#8B8B99";
const BORDER = "#23232F";
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* ---------- shared data ---------- */
const POSTS = [
  { id: 1, name: "Mara Ortiz", handle: "@mara.makes", verified: true, business: false, time: "2h", text: "Finished the walnut side table today. Six coats of oil, no stain.", likes: 284, comments: 19, tag: null, grad: ["#7C5CFF", "#2DD4BF"] },
  { id: 2, name: "Fernway Coffee", handle: "@fernwayco", verified: true, business: true, time: "4h", text: "New single-origin from Huila just landed.", likes: 96, comments: 8, tag: "Sponsored", grad: ["#F5A623", "#FF5470"] },
  { id: 3, name: "Devon Blake", handle: "@devblake", verified: false, business: false, time: "6h", text: "Asked Icon AI to turn my trip notes into an itinerary — nailed the pacing.", likes: 512, comments: 41, tag: "AI-assisted", grad: ["#2DD4BF", "#7C5CFF"] },
  { id: 4, name: "Nadia Petrov", handle: "@nadia.p", verified: false, business: false, time: "9h", text: "Selling my film camera collection this week.", likes: 73, comments: 12, tag: null, grad: ["#FF5470", "#F5A623"] },
];

const LISTINGS = [
  { id: 1, title: "Walnut side table, handmade", price: 220, seller: "Mara Ortiz", loc: "Portland, OR", grad: ["#7C5CFF", "#2DD4BF"], cat: "Furniture" },
  { id: 2, title: "Film camera bundle, 4 bodies", price: 340, seller: "Nadia Petrov", loc: "Austin, TX", grad: ["#FF5470", "#F5A623"], cat: "Cameras" },
  { id: 3, title: "Mechanical keyboard, hot-swap", price: 95, seller: "Jonas Weld", loc: "Denver, CO", grad: ["#5B3FE0", "#2DD4BF"], cat: "Electronics" },
  { id: 4, title: "Vintage denim jacket, M", price: 48, seller: "Lena Ashford", loc: "Chicago, IL", grad: ["#7C5CFF", "#FF5470"], cat: "Clothing" },
  { id: 5, title: "Ceramic table lamp", price: 60, seller: "Priya Nair", loc: "Seattle, WA", grad: ["#F5A623", "#7C5CFF"], cat: "Home" },
  { id: 6, title: "Road bike, 54cm frame", price: 410, seller: "Rivertown Bikes", loc: "Boulder, CO", grad: ["#2DD4BF", "#F5A623"], cat: "Electronics" },
];

const CATEGORIES = ["All", "Furniture", "Electronics", "Clothing", "Cameras", "Home"];

const BUSINESS = {
  name: "Fernway Coffee", handle: "@fernwayco", category: "Coffee roaster · Local business",
  loc: "Seattle, WA", site: "fernwaycoffee.com", rating: 4.8, reviews: 312, followers: "8.4K",
  bio: "Small-batch roaster sourcing direct from growers. New drops every Friday.", grad: ["#F5A623", "#FF5470"],
};

const TOOLS = [
  { id: "caption", label: "Write a caption", icon: Wand2, desc: "Turn a rough idea into a post" },
  { id: "photo", label: "Enhance a photo", icon: Camera, desc: "Clean up lighting and crop" },
  { id: "trip", label: "Plan an itinerary", icon: MapPinned, desc: "From notes to a day-by-day plan" },
  { id: "listing", label: "Write a listing", icon: Tags, desc: "Title, price hint, description" },
];

const DEMO_REPLIES = {
  caption: (i) => `Caption draft: "${i.slice(0, 60) || "Made this over the weekend"} — small details, slow process, worth it." Want it more casual or more polished?`,
  photo: () => `I'd crop tighter on the subject and lift the shadows a touch. Want exact adjustments for your editor?`,
  trip: (i) => `Rough plan: mornings for museums, afternoons for walking, evenings for food, starting with "${i.slice(0, 40) || "your first stop"}". Want a full day-by-day?`,
  listing: (i) => `Draft listing: "${i.slice(0, 50) || "Item"} — good condition, open to reasonable offers." Want a price suggestion?`,
};

const INITIAL_CAMPAIGNS = [
  { id: 1, name: "Huila drop launch", status: "active", spend: 84, budget: 150, impressions: 12400, clicks: 312, grad: ["#F5A623", "#FF5470"] },
  { id: 2, name: "Weekend tasting flight", status: "active", spend: 22, budget: 40, impressions: 3100, clicks: 58, grad: ["#7C5CFF", "#2DD4BF"] },
];

const PLANS = [
  { id: "free", name: "Free", price: 0, period: "", features: ["Home feed & marketplace browsing", "3 AI tool uses per day", "Standard listing visibility"] },
  { id: "plus", name: "Icon Plus", price: 6.99, period: "/mo", trialDays: 10, highlight: true, features: ["Unlimited AI tool uses", "Ad-free browsing", "Boosted marketplace listings", "Early access to new features"] },
  { id: "business", name: "Icon Business", price: 24, period: "/mo", trialDays: 10, features: ["Everything in Plus", "Business page + verified badge", "Ad campaign manager", "Sales analytics dashboard"] },
];

/* ---------- small shared components ---------- */
function TopBar({ title, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 14px", borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={19} color={TEXT_MUTED} />
          </button>
        )}
        <span style={{ fontSize: 17, fontWeight: 700, color: "#F5F5F7", letterSpacing: -0.3 }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { id: "home", icon: Home },
    { id: "marketplace", icon: ShoppingBag },
    { id: "ai", icon: Sparkles },
    { id: "profile", icon: User },
  ];
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${BORDER}`, background: CARD, paddingBottom: 6 }}>
      {items.map(({ id, icon: Icon }) => (
        <button key={id} onClick={() => setTab(id)} style={{ display: "flex", flex: 1, justifyContent: "center", padding: "10px 0", background: "none", border: "none", cursor: "pointer" }}>
          <Icon size={23} color={tab === id ? "#F5F5F7" : TEXT_MUTED} fill={tab === id ? "#F5F5F7" : "none"} strokeWidth={tab === id ? 1.5 : 1.8} />
        </button>
      ))}
    </div>
  );
}

/* ---------- Auth screen ---------- */
function scorePassword(pw) {
  const checks = [
    { label: "8+ characters", pass: pw.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(pw) },
    { label: "Number", pass: /[0-9]/.test(pw) },
    { label: "Symbol", pass: /[^A-Za-z0-9]/.test(pw) },
  ];
  return { checks, score: checks.filter((c) => c.pass).length };
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { checks, score } = useMemo(() => scorePassword(password), [password]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmitSignup = name.trim().length > 1 && emailValid && score === 4 && passwordsMatch;
  const canSubmitLogin = emailValid && password.length >= 8;
  const strengthColor = [RED, RED, AMBER, TEAL, TEAL][score];

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setAuthError("");
    const ready = mode === "signup" ? canSubmitSignup : canSubmitLogin;
    if (!ready) return;
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(name, email, password);
      } else {
        await logIn(email, password);
      }
      onLogin();
    } catch (err) {
      // Firebase's error codes are technical — map the common ones to plain language
      const messages = {
        "auth/email-already-in-use": "That email is already registered — try logging in instead.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/weak-password": "Password is too weak.",
        "auth/too-many-requests": "Too many attempts — try again in a few minutes.",
      };
      setAuthError(messages[err.code] || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 30% 0%, #1C1C2E 0%, ${BG} 55%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: FONT }}>
      <div style={{ width: "100%", maxWidth: 380, background: CARD, borderRadius: 28, border: `1px solid ${BORDER}`, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${ACCENT}, #5B3FE0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#fff", fontWeight: 700 }}>i</span>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F5F5F7", letterSpacing: -0.3 }}>Icon</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>{mode === "signup" ? "Create your account" : "Welcome back"}</div>
          </div>
        </div>

        <div style={{ display: "flex", background: "#1F1F2A", borderRadius: 12, padding: 4, marginBottom: 22 }}>
          {["signup", "login"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setSubmitted(false); }} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: mode === m ? "#0F0F17" : TEXT_MUTED, background: mode === m ? "#F5F5F7" : "transparent" }}>
              {m === "signup" ? "Sign up" : "Log in"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div style={{ position: "relative", marginBottom: 12 }}>
              <User size={17} color={TEXT_MUTED} style={{ position: "absolute", left: 14, top: 14 }} />
              <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
          )}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Mail size={17} color={TEXT_MUTED} style={{ position: "absolute", left: 14, top: 14 }} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            {submitted && !emailValid && <div style={{ color: RED, fontSize: 12, marginTop: 6 }}>Enter a valid email address</div>}
          </div>
          <div style={{ position: "relative", marginBottom: mode === "signup" ? 10 : 6 }}>
            <Lock size={17} color={TEXT_MUTED} style={{ position: "absolute", left: 14, top: 14 }} />
            <input type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 12, top: 12, background: "none", border: "none", cursor: "pointer" }}>
              {showPw ? <EyeOff size={17} color={TEXT_MUTED} /> : <Eye size={17} color={TEXT_MUTED} />}
            </button>
          </div>

          {mode === "signup" && password.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {[0, 1, 2, 3].map((i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < score ? strengthColor : "#2A2A38" }} />)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {checks.map((c) => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {c.pass ? <Check size={13} color={TEAL} /> : <X size={13} color={TEXT_MUTED} />}
                    <span style={{ fontSize: 11.5, color: c.pass ? "#F5F5F7" : TEXT_MUTED }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div style={{ marginBottom: 6 }}>
              <div style={{ position: "relative" }}>
                <Lock size={17} color={TEXT_MUTED} style={{ position: "absolute", left: 14, top: 14 }} />
                <input type={showPw ? "text" : "password"} placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} />
              </div>
              {submitted && confirm.length > 0 && !passwordsMatch && <div style={{ color: RED, fontSize: 12, marginTop: 6 }}>Passwords don't match</div>}
            </div>
          )}

          {authError && <div style={{ color: RED, fontSize: 12.5, marginTop: 10, textAlign: "center" }}>{authError}</div>}

          <button type="submit" disabled={loading} style={{ width: "100%", marginTop: 8, padding: "13px 0", borderRadius: 12, border: "none", background: loading ? "#3A3A46" : `linear-gradient(135deg, ${ACCENT}, #5B3FE0)`, color: "#fff", fontWeight: 600, fontSize: 14.5, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {loading ? "Please wait..." : <>{mode === "signup" ? "Create account" : "Log in"} <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${BORDER}`, fontSize: 11, color: TEXT_MUTED, lineHeight: 1.5, display: "flex", gap: 8 }}>
          <ShieldCheck size={26} color={TEXT_MUTED} style={{ flexShrink: 0 }} />
          <span>Real accounts now — password hashing, sessions, and rate limiting are handled by Firebase Auth.</span>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", background: "#1F1F2A", border: "1px solid #2A2A38", borderRadius: 12, padding: "13px 14px 13px 40px", color: "#F5F5F7", fontSize: 15, outline: "none", boxSizing: "border-box" };

/* ---------- Home / feed screen ---------- */
function TagPill({ tag }) {
  if (!tag) return null;
  const isAI = tag === "AI-assisted";
  return (
    <span style={{ fontSize: 10.5, fontWeight: 600, color: isAI ? "#0F0F17" : TEXT_MUTED, background: isAI ? TEAL : "transparent", border: isAI ? "none" : `1px solid ${BORDER}`, borderRadius: 6, padding: "2px 7px", display: "inline-flex", alignItems: "center", gap: 3 }}>
      {isAI && <Sparkles size={10} />}{tag}
    </span>
  );
}

function PostRow({ post, onLike }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(post.likes || 0);
  function handleLike() {
    setLiked((l) => !l);
    setCount((c) => (liked ? c - 1 : c + 1));
    if (!liked && onLike) onLike(post.id);
  }
  return (
    <div style={{ padding: "16px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", gap: 11 }}>
      <div style={{ width: 42, height: 42, borderRadius: post.business ? 12 : 21, background: `linear-gradient(135deg, ${post.grad?.[0] || ACCENT}, ${post.grad?.[1] || TEAL})`, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#F5F5F7" }}>{post.name}</span>
          {post.verified && <BadgeCheck size={14} color={ACCENT} />}
          <span style={{ fontSize: 12.5, color: TEXT_MUTED }}>{post.handle || ""} {post.time ? `· ${post.time}` : ""}</span>
        </div>
        {post.tag && <div style={{ marginTop: 4 }}><TagPill tag={post.tag} /></div>}
        <div style={{ fontSize: 14.5, color: "#E4E4E9", lineHeight: 1.5, marginTop: 8 }}>{post.text}</div>
        <div style={{ display: "flex", gap: 22, marginTop: 12 }}>
          <button onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer" }}>
            <Heart size={17} color={liked ? RED : TEXT_MUTED} fill={liked ? RED : "none"} />
            <span style={{ fontSize: 12.5, color: liked ? RED : TEXT_MUTED }}>{count}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}><MessageCircle size={17} color={TEXT_MUTED} /><span style={{ fontSize: 12.5, color: TEXT_MUTED }}>{post.comments || 0}</span></div>
          <Repeat2 size={17} color={TEXT_MUTED} />
          <Bookmark size={17} color={TEXT_MUTED} style={{ marginLeft: "auto" }} />
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ onOpenBusiness, user }) {
  const [view, setView] = useState("list");
  const [posts, setPosts] = useState(POSTS); // seeded with demo posts until real ones load
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  async function loadPosts() {
    setLoading(true);
    try {
      const real = await getRecentPosts();
      // Show real posts first, demo posts underneath so the feed never looks empty
      setPosts(real.length ? [...real, ...POSTS] : POSTS);
    } catch (err) {
      // Firestore not configured yet, or offline — fall back to demo posts silently
      setPosts(POSTS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPosts(); }, []); // load real posts once when the screen mounts

  async function handlePost() {
    if (!draft.trim() || !user) return;
    setPosting(true);
    try {
      await createPost(user, draft.trim());
      setDraft("");
      setComposing(false);
      await loadPosts();
    } catch (err) {
      // Keep it simple in the UI; real error detail is in the console for debugging
      console.error(err);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar
        title="Icon"
        right={
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <button onClick={() => setComposing((c) => !c)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <PlusSquare size={19} color={TEXT_MUTED} />
            </button>
            <button onClick={() => setView(view === "list" ? "grid" : "list")} style={{ background: "none", border: "none", cursor: "pointer" }}>
              {view === "list" ? <Grid3x3 size={19} color={TEXT_MUTED} /> : <List size={19} color={TEXT_MUTED} />}
            </button>
            <Search size={19} color={TEXT_MUTED} />
          </div>
        }
      />

      {composing && (
        <div style={{ padding: 14, borderBottom: `1px solid ${BORDER}` }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What's happening?"
            rows={3}
            style={{ width: "100%", background: "#1F1F2A", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12, color: "#F5F5F7", fontSize: 13.5, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button onClick={() => setComposing(false)} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${BORDER}`, background: "none", color: TEXT_MUTED, fontSize: 12.5, cursor: "pointer" }}>Cancel</button>
            <button onClick={handlePost} disabled={!draft.trim() || posting} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: draft.trim() ? `linear-gradient(135deg, ${ACCENT}, #5B3FE0)` : "#3A3A46", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: draft.trim() ? "pointer" : "not-allowed" }}>
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        {view === "list" ? (
          posts.map((p, i) => <PostRow key={p.id || i} post={p} onLike={p.id && !p.grad ? likePost : undefined} />)
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, padding: 2 }}>
            {posts.map((p, i) => (
              <button key={p.id || i} onClick={() => p.business && onOpenBusiness()} style={{ position: "relative", aspectRatio: "1/1", border: "none", cursor: "pointer", padding: 0, background: `linear-gradient(135deg, ${p.grad?.[0] || ACCENT}, ${p.grad?.[1] || TEAL})` }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,23,0.75) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 6, left: 7, right: 7, textAlign: "left" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff" }}>{p.name}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        <div style={{ padding: "22px 18px", textAlign: "center", fontSize: 12, color: TEXT_MUTED }}>
          {loading ? "Loading..." : "You're caught up"}
        </div>
      </div>
    </div>
  );
}

/* ---------- Marketplace screen ---------- */
function MarketplaceScreen({ user }) {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [listings, setListings] = useState(LISTINGS);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [posting, setPosting] = useState(false);

  async function loadListings() {
    setLoading(true);
    try {
      const real = await getListings();
      setListings(real.length ? [...real, ...LISTINGS] : LISTINGS);
    } catch (err) {
      setListings(LISTINGS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadListings(); }, []);

  async function handleCreateListing() {
    if (!title.trim() || !price || !user) return;
    setPosting(true);
    try {
      await createListing(user, { title: title.trim(), price: Number(price), category: category === "All" ? "Home" : category });
      setTitle("");
      setPrice("");
      setShowNew(false);
      await loadListings();
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  }

  const filtered = category === "All" ? listings : listings.filter((l) => (l.cat || l.category) === category);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <div style={{ padding: "18px 18px 12px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 19, fontWeight: 700, color: "#F5F5F7" }}>Marketplace</span>
          <button onClick={() => setShowNew(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: ACCENT, fontSize: 12.5, fontWeight: 600 }}>
            <Plus size={16} /> Sell
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={16} color={TEXT_MUTED} style={{ position: "absolute", left: 12, top: 11 }} />
          <input placeholder="Search listings" style={{ width: "100%", background: "#1F1F2A", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px 10px 34px", color: "#F5F5F7", fontSize: 13.5, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto" }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 999, border: `1px solid ${category === c ? ACCENT : BORDER}`, background: category === c ? ACCENT : "transparent", color: category === c ? "#fff" : TEXT_MUTED, fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map((item, i) => (
            <button key={item.id || i} onClick={() => setSelected(item)} style={{ textAlign: "left", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", padding: 0 }}>
              <div style={{ aspectRatio: "1/1", background: `linear-gradient(135deg, ${item.grad?.[0] || ACCENT}, ${item.grad?.[1] || TEAL})` }} />
              <div style={{ padding: "10px 11px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F7" }}>${item.price}</div>
                <div style={{ fontSize: 12, color: "#C9C9D1", marginTop: 2 }}>{item.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 6 }}><MapPin size={11} color={TEXT_MUTED} /><span style={{ fontSize: 10.5, color: TEXT_MUTED }}>{item.loc || item.seller || "Icon marketplace"}</span></div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: 11.5, color: TEXT_MUTED, marginTop: 14 }}>{loading ? "Loading..." : ""}</div>
      </div>
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "absolute", inset: 0, background: "rgba(15,15,23,0.85)", display: "flex", alignItems: "flex-end", zIndex: 10 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: CARD, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ aspectRatio: "16/9", background: `linear-gradient(135deg, ${selected.grad?.[0] || ACCENT}, ${selected.grad?.[1] || TEAL})`, borderTopLeftRadius: 22, borderTopRightRadius: 22 }} />
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#F5F5F7" }}>${selected.price}</div>
              <div style={{ fontSize: 14, color: "#E4E4E9", marginTop: 4 }}>{selected.title}</div>
              <div style={{ fontSize: 12.5, color: TEXT_MUTED, marginTop: 8 }}>{selected.loc || ""} {selected.loc ? "·" : ""} sold by {selected.seller}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${ACCENT}, #5B3FE0)`, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Message seller</button>
                <button style={{ padding: "13px 18px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "none", color: "#F5F5F7", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Buy</button>
              </div>
              <div style={{ fontSize: 10.5, color: TEXT_MUTED, marginTop: 12, lineHeight: 1.5 }}>
                Real checkout needs Stripe Connect wired in — "Buy" is a placeholder until that's added.
              </div>
            </div>
          </div>
        </div>
      )}
      {showNew && (
        <div onClick={() => setShowNew(false)} style={{ position: "absolute", inset: 0, background: "rgba(15,15,23,0.85)", display: "flex", alignItems: "flex-end", zIndex: 10 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: CARD, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTop: `1px solid ${BORDER}`, padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F5F5F7", marginBottom: 14 }}>New listing</div>
            <div style={{ fontSize: 11.5, color: TEXT_MUTED, marginBottom: 6 }}>Title</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Walnut side table" style={{ width: "100%", background: "#1F1F2A", border: `1px solid ${BORDER}`, borderRadius: 11, padding: "12px 14px", color: "#F5F5F7", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14 }} />
            <div style={{ fontSize: 11.5, color: TEXT_MUTED, marginBottom: 6 }}>Price ($)</div>
            <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" style={{ width: "100%", background: "#1F1F2A", border: `1px solid ${BORDER}`, borderRadius: 11, padding: "12px 14px", color: "#F5F5F7", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 18 }} />
            <button onClick={handleCreateListing} disabled={!title.trim() || !price || posting} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: title.trim() && price ? `linear-gradient(135deg, ${ACCENT}, #5B3FE0)` : "#3A3A46", color: "#fff", fontWeight: 700, fontSize: 14, cursor: title.trim() && price ? "pointer" : "not-allowed" }}>
              {posting ? "Publishing..." : "Publish listing"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Business page screen ---------- */
function BusinessScreen({ onBack, onOpenAds }) {
  const [tab, setTab] = useState("posts");
  const [following, setFollowing] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ position: "relative" }}>
        <div style={{ height: 100, background: `linear-gradient(135deg, ${BUSINESS.grad[0]}, ${BUSINESS.grad[1]})` }} />
        <button onClick={onBack} style={{ position: "absolute", top: 12, left: 12, background: "rgba(15,15,23,0.55)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><ArrowLeft size={18} color="#fff" /></button>
        <button style={{ position: "absolute", top: 12, right: 12, background: "rgba(15,15,23,0.55)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}><Share2 size={16} color="#fff" /></button>
        <div style={{ position: "absolute", bottom: -24, left: 18, width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${BUSINESS.grad[1]}, ${BUSINESS.grad[0]})`, border: `3px solid ${BG}` }} />
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        <div style={{ padding: "34px 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F5F5F7" }}>{BUSINESS.name}</span>
            <BadgeCheck size={15} color={ACCENT} />
          </div>
          <div style={{ fontSize: 12.5, color: TEXT_MUTED, marginTop: 2 }}>{BUSINESS.handle} · {BUSINESS.category}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
            <Star size={13} color={AMBER} fill={AMBER} />
            <span style={{ fontSize: 12.5, color: "#F5F5F7", fontWeight: 600 }}>{BUSINESS.rating}</span>
            <span style={{ fontSize: 12, color: TEXT_MUTED }}>({BUSINESS.reviews} reviews) · {BUSINESS.followers} followers</span>
          </div>
          <div style={{ fontSize: 13.5, color: "#E4E4E9", marginTop: 10, lineHeight: 1.5 }}>{BUSINESS.bio}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={13} color={TEXT_MUTED} /><span style={{ fontSize: 12.5, color: TEXT_MUTED }}>{BUSINESS.loc}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Globe size={13} color={TEXT_MUTED} /><span style={{ fontSize: 12.5, color: ACCENT }}>{BUSINESS.site}</span></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => setFollowing((f) => !f)} style={{ flex: 1, padding: "11px 0", borderRadius: 11, border: following ? `1px solid ${BORDER}` : "none", background: following ? "none" : `linear-gradient(135deg, ${ACCENT}, #5B3FE0)`, color: following ? "#F5F5F7" : "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
              {following ? "Following" : "Follow"}
            </button>
            <button style={{ padding: "11px 16px", borderRadius: 11, border: `1px solid ${BORDER}`, background: "none", color: "#F5F5F7", cursor: "pointer" }}><MessageCircle size={16} /></button>
          </div>
          <button onClick={onOpenAds} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 10, padding: "10px 0", borderRadius: 11, border: `1px solid ${BORDER}`, background: "none", color: TEXT_MUTED, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
            <Megaphone size={14} /> Manage ads
          </button>
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, borderTop: `1px solid ${BORDER}` }}>
          {["posts", "shop"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "11px 0", background: "none", border: "none", borderBottom: `2px solid ${tab === t ? ACCENT : "transparent"}`, cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: tab === t ? "#F5F5F7" : TEXT_MUTED }}>
              {t === "posts" ? "Posts" : "Shop"}
            </button>
          ))}
        </div>
        {tab === "posts" ? (
          <div style={{ padding: "14px 18px", fontSize: 13.5, color: "#E4E4E9", lineHeight: 1.5 }}>New single-origin from Huila just landed. Cupping notes: stone fruit, brown sugar.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 14 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ aspectRatio: "1/1", background: `linear-gradient(135deg, ${ACCENT}, ${TEAL})` }} />
              <div style={{ padding: "9px 10px" }}><div style={{ fontSize: 13.5, fontWeight: 700, color: "#F5F5F7" }}>$18</div><div style={{ fontSize: 11.5, color: "#C9C9D1" }}>Huila single-origin, 12oz</div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- AI screen ---------- */
function AIScreen() {
  const [activeTool, setActiveTool] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [usesLeft, setUsesLeft] = useState(3);

  function handleSend() {
    if (!input.trim() || !activeTool || usesLeft <= 0) return;
    setMessages((m) => [...m, { role: "user", text: input }, { role: "ai", text: DEMO_REPLIES[activeTool](input) }]);
    setInput("");
    setUsesLeft((u) => u - 1);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={activeTool ? TOOLS.find((t) => t.id === activeTool).label : "Icon AI"} onBack={activeTool ? () => { setActiveTool(null); setMessages([]); } : null} />
      {!activeTool ? (
        <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTool(t.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD, cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1F1F2A", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={17} color={TEXT_MUTED} /></div>
                  <div><div style={{ fontSize: 13.5, fontWeight: 600, color: "#F5F5F7" }}>{t.label}</div><div style={{ fontSize: 11.5, color: TEXT_MUTED }}>{t.desc}</div></div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 20, padding: "12px 14px", borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD, fontSize: 11.5, color: TEXT_MUTED }}>
            Free plan: {usesLeft} AI uses left today. Premium removes the daily limit.
          </div>
          <div style={{ marginTop: 10, padding: "12px 14px", borderRadius: 14, border: `1px dashed ${BORDER}`, fontSize: 11, color: TEXT_MUTED, lineHeight: 1.5 }}>
            These replies are simulated for the demo. Real AI replies need a small server to hold
            your API key safely — it can't be called directly from a free static site without
            exposing that key to anyone who opens the page.
          </div>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: m.role === "user" ? ACCENT : CARD, border: m.role === "ai" ? `1px solid ${BORDER}` : "none", borderRadius: 14, padding: "10px 13px", color: m.role === "user" ? "#fff" : "#E4E4E9", fontSize: 13.5 }}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ padding: 14, borderTop: `1px solid ${BORDER}`, display: "flex", gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type here..." disabled={usesLeft <= 0} style={{ flex: 1, background: "#1F1F2A", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "11px 14px", color: "#F5F5F7", fontSize: 13.5, outline: "none" }} />
            <button onClick={handleSend} disabled={usesLeft <= 0} style={{ width: 42, height: 42, borderRadius: 12, border: "none", background: usesLeft <= 0 ? "#3A3A46" : `linear-gradient(135deg, ${ACCENT}, #5B3FE0)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Send size={16} color="#fff" /></button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Profile / subscriptions screen ---------- */
function ProfileScreen({ onOpenBusiness, onLogout, user }) {
  const [selected, setSelected] = useState("plus");
  const [subscribed, setSubscribed] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSubscription(user)
      .then((sub) => setCurrentPlan(sub.planId))
      .catch(() => setCurrentPlan("free"));
  }, []);

  async function handleSubscribe() {
    const plan = PLANS.find((p) => p.id === selected);
    setSaving(true);
    try {
      await setSubscription(user, plan.id, plan.trialDays);
      setCurrentPlan(plan.id);
      setSubscribed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (subscribed) {
    const plan = PLANS.find((p) => p.id === selected);
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${ACCENT}, ${TEAL})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Sparkles size={26} color="#0F0F17" /></div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#F5F5F7" }}>You're on {plan.name}</div>
        <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 8, lineHeight: 1.5 }}>
          {plan.trialDays ? `Your ${plan.trialDays}-day free trial has started — saved to your account.` : "You're all set."} Real billing still needs Stripe or App Store/Play Store in-app purchase wired in.
        </div>
        <button onClick={() => setSubscribed(false)} style={{ marginTop: 18, background: "none", border: `1px solid ${BORDER}`, color: TEXT_MUTED, borderRadius: 10, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Back to plans</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="Profile & plans" />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px 24px" }}>
        {currentPlan && (
          <div style={{ fontSize: 11.5, color: TEXT_MUTED, marginBottom: 12 }}>
            Current plan: <span style={{ color: "#F5F5F7", fontWeight: 600 }}>{PLANS.find((p) => p.id === currentPlan)?.name || "Free"}</span>
          </div>
        )}
        <button onClick={onOpenBusiness} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 12, marginBottom: 18, cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${BUSINESS.grad[0]}, ${BUSINESS.grad[1]})` }} />
          <div><div style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F7" }}>View business page demo</div><div style={{ fontSize: 11, color: TEXT_MUTED }}>{BUSINESS.name}</div></div>
        </button>

        <div style={{ fontSize: 18, fontWeight: 700, color: "#F5F5F7", marginBottom: 14 }}>Plans</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PLANS.map((plan) => (
            <button key={plan.id} onClick={() => setSelected(plan.id)} style={{ width: "100%", textAlign: "left", background: plan.highlight ? "#1F1A33" : CARD, border: `1.5px solid ${selected === plan.id ? ACCENT : plan.highlight ? "#3A2E66" : BORDER}`, borderRadius: 16, padding: 16, cursor: "pointer", position: "relative" }}>
              {plan.highlight && <span style={{ position: "absolute", top: -10, left: 16, background: `linear-gradient(135deg, ${ACCENT}, #5B3FE0)`, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 8px" }}>MOST POPULAR</span>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F7" }}>{plan.name}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#F5F5F7" }}>{plan.price === 0 ? "Free" : `$${plan.price}`}<span style={{ fontSize: 12, color: TEXT_MUTED }}>{plan.period}</span></span>
              </div>
              {plan.trialDays && <div style={{ fontSize: 11.5, color: TEAL, fontWeight: 600, marginTop: 4 }}>{plan.trialDays}-day free trial, then ${plan.price}{plan.period}</div>}
              <div style={{ marginTop: 10 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 8, padding: "4px 0" }}><Check size={14} color={TEAL} style={{ marginTop: 2, flexShrink: 0 }} /><span style={{ fontSize: 12.5, color: "#E4E4E9" }}>{f}</span></div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: 16, borderTop: `1px solid ${BORDER}` }}>
        <button onClick={handleSubscribe} disabled={saving} style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${ACCENT}, #5B3FE0)`, color: "#fff", fontWeight: 700, fontSize: 14.5, cursor: "pointer" }}>
          {saving ? "Saving..." : (() => { const p = PLANS.find((x) => x.id === selected); if (p.id === "free") return "Continue with Free"; return p.trialDays ? `Start ${p.trialDays}-day free trial` : `Subscribe to ${p.name}`; })()}
        </button>
        <button onClick={onLogout} style={{ width: "100%", marginTop: 10, padding: "11px 0", borderRadius: 12, border: `1px solid ${BORDER}`, background: "none", color: TEXT_MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          Log out
        </button>
      </div>
    </div>
  );
}

/* ---------- Ad manager screen ---------- */
function AdManagerScreen({ onBack, user }) {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("50");
  const [loading, setLoading] = useState(true);

  async function loadCampaigns() {
    setLoading(true);
    try {
      const real = await getCampaigns(user);
      setCampaigns(real.length ? real : INITIAL_CAMPAIGNS);
    } catch (err) {
      setCampaigns(INITIAL_CAMPAIGNS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCampaigns(); }, []);

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  async function toggle(id) {
    const current = campaigns.find((c) => c.id === id);
    const newStatus = current.status === "active" ? "paused" : "active";
    setCampaigns((cs) => cs.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    try {
      await toggleCampaignStatus(id, newStatus);
    } catch (err) {
      // Demo campaigns (numeric ids) aren't real Firestore docs — that's expected, ignore
    }
  }

  async function create() {
    if (!name.trim() || !user) return;
    try {
      await createCampaign(user, { name, budget: Number(budget) });
      setName("");
      setShowNew(false);
      await loadCampaigns();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <TopBar title="Ad manager" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 16, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Megaphone size={15} color={ACCENT} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F7" }}>This week</span>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F7" }}>${totalSpend}</div><div style={{ fontSize: 10, color: TEXT_MUTED }}>Spend</div></div>
            <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F7" }}>{totalClicks}</div><div style={{ fontSize: 10, color: TEXT_MUTED }}>Clicks</div></div>
            <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F7" }}>{activeCount}</div><div style={{ fontSize: 10, color: TEXT_MUTED }}>Active</div></div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F7" }}>Campaigns</span>
          <button onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: ACCENT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}><Plus size={15} /> New</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {campaigns.map((c) => {
            const pct = Math.min(100, Math.round((c.spend / c.budget) * 100));
            return (
              <div key={c.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#F5F5F7" }}>{c.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 3, background: c.status === "active" ? TEAL : TEXT_MUTED }} />
                      <span style={{ fontSize: 11, color: c.status === "active" ? TEAL : TEXT_MUTED, fontWeight: 600, textTransform: "capitalize" }}>{c.status}</span>
                    </div>
                  </div>
                  <button onClick={() => toggle(c.id)} style={{ background: "#1F1F2A", border: `1px solid ${BORDER}`, borderRadius: 9, padding: 8, cursor: "pointer" }}>
                    {c.status === "active" ? <Pause size={14} color={TEXT_MUTED} /> : <Play size={14} color={TEAL} />}
                  </button>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: TEXT_MUTED, marginBottom: 5 }}>
                    <span>${c.spend} spent</span><span>${c.budget} budget</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: "#1F1F2A", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct >= 95 ? RED : `linear-gradient(90deg, ${ACCENT}, ${TEAL})`, borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ display: "flex", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                  <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F7" }}>{c.impressions.toLocaleString()}</div><div style={{ fontSize: 10, color: TEXT_MUTED }}>Impressions</div></div>
                  <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F7" }}>{c.clicks}</div><div style={{ fontSize: 10, color: TEXT_MUTED }}>Clicks</div></div>
                  <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F7" }}>{((c.clicks / c.impressions) * 100).toFixed(1)}%</div><div style={{ fontSize: 10, color: TEXT_MUTED }}>CTR</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showNew && (
        <div onClick={() => setShowNew(false)} style={{ position: "absolute", inset: 0, background: "rgba(15,15,23,0.85)", display: "flex", alignItems: "flex-end", zIndex: 10 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: CARD, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTop: `1px solid ${BORDER}`, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#F5F5F7" }}>New campaign</span>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={19} color={TEXT_MUTED} /></button>
            </div>
            <div style={{ fontSize: 11.5, color: TEXT_MUTED, marginBottom: 6 }}>Campaign name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spring menu launch" style={{ width: "100%", background: "#1F1F2A", border: `1px solid ${BORDER}`, borderRadius: 11, padding: "12px 14px", color: "#F5F5F7", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
            <div style={{ fontSize: 11.5, color: TEXT_MUTED, marginBottom: 6 }}>Daily budget</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {["25", "50", "100"].map((b) => (
                <button key={b} onClick={() => setBudget(b)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${budget === b ? ACCENT : BORDER}`, background: budget === b ? ACCENT : "transparent", color: budget === b ? "#fff" : TEXT_MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>${b}/day</button>
              ))}
            </div>
            <button onClick={create} disabled={!name.trim()} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: name.trim() ? `linear-gradient(135deg, ${ACCENT}, #5B3FE0)` : "#3A3A46", color: "#fff", fontWeight: 700, fontSize: 14, cursor: name.trim() ? "pointer" : "not-allowed" }}>
              Launch campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- App shell ---------- */
function IconApp() {
  const [user, setUser] = useState(undefined); // undefined = still checking, null = logged out
  const [tab, setTab] = useState("home");
  const [overlay, setOverlay] = useState(null); // null | "business" | "ads"

  useEffect(() => {
    // Firebase restores the session automatically on refresh — this is what
    // makes "stay logged in" work without any code of your own.
    const unsubscribe = watchAuthState((firebaseUser) => setUser(firebaseUser));
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: TEXT_MUTED, fontFamily: FONT, fontSize: 13 }}>
        Loading...
      </div>
    );
  }

  if (!user) return <AuthScreen onLogin={() => {}} />;

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          {overlay === "business" ? (
            <BusinessScreen onBack={() => setOverlay(null)} onOpenAds={() => setOverlay("ads")} />
          ) : overlay === "ads" ? (
            <AdManagerScreen onBack={() => setOverlay("business")} user={user} />
          ) : tab === "home" ? (
            <HomeScreen onOpenBusiness={() => setOverlay("business")} user={user} />
          ) : tab === "marketplace" ? (
            <MarketplaceScreen user={user} />
          ) : tab === "ai" ? (
            <AIScreen />
          ) : (
            <ProfileScreen onOpenBusiness={() => setOverlay("business")} onLogout={logOut} user={user} />
          )}
        </div>
        {!overlay && <BottomNav tab={tab} setTab={setTab} />}
      </div>
    </div>
  );
}


const root = createRoot(document.getElementById('root'));
root.render(<IconApp />);
