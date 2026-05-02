import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Mail,
  Lock,
  User,
} from "lucide-react";
import "./Auth.css";
import logoBanner from "./assets/PromptixGPT_transparentb.png";
import toast from "react-hot-toast";

// --- Custom Typewriter Hook ---
const useTypewriter = (
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delay = 2000,
) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const currentWord = words[loopNum % words.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setText((prev) => prev.substring(0, prev.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && text === "") {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, delay]);

  return text;
};

function Auth({ setToken }) {
  // --- State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Auth Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Typewriter words
  const phrases = [
    "Your AI workspace + community.",
    "Think. Create. Collaborate.",
  ];
  const typingText = useTypewriter(phrases);

  // --- Handlers ---
  const openModal = (mode = "login") => {
    setIsLogin(mode === "login");
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset fields on close
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const url = isLogin
      ? `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`
      : `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`;

    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Auth response:", data);

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);

        // ✅ store user safely
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setToken(data.token); // triggers dashboard

        // For preview purposes, we'll just show success
        setIsModalOpen(false);
        toast.success(
          isLogin ? "Logged in successfully!" : "Account created successfully!",
        );
      } else {
        // If signup requires login next
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* --- Background Elements --- */}
      <div className="bg-grid-layer bg-grid" />
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      {/* --- Navbar --- */}
      <nav className="navbar-l">
        <div className="logo-container">
          <img src={logoBanner} alt="" />
        </div>

        <div className="nav-actions">
          <button onClick={() => openModal("login")} className="btn-nav-login">
            Log in
          </button>
          <button
            onClick={() => openModal("signup")}
            className="btn-nav-signup"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* --- Main Hero Section --- */}
      <main className="hero-section">
        {/* Badge */}
        <div className="hero-badge">
          <Sparkles />
          <span>Introducing PromptixGPT</span>
        </div>

        {/* Dynamic Heading */}
        <h1 className="hero-heading">
          <span className="heading-text">{typingText}</span>
          <span className="cursor-blink"></span>
        </h1>

        {/* Subtext */}
        <p className="hero-subtext">
          The World's <b>1st AI Tool</b> with a <b>Community Feature</b>— all in
          one powerful AI workspace designed for speed and collaboration.
        </p>

        {/* Hero CTAs */}
        <div className="hero-ctas">
          <button onClick={() => openModal("signup")} className="btn-primary">
            <div className="btn-primary-bg"></div>
            <span>Get Started for Free</span>
            <ArrowRight />
          </button>

          <button onClick={() => openModal("login")} className="btn-secondary">
            Sign In to Dashboard
          </button>
        </div>
      </main>

      {/* --- Auth Modal --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          {/* Overlay */}
          <div className="modal-backdrop" onClick={closeModal} />

          {/* Modal Container */}
          <div className="glass-panel modal-enter">
            {/* Modal Ambient Glow */}
            <div className="modal-glow" />

            <button onClick={closeModal} className="modal-close">
              <X />
            </button>

            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <BrainCircuit />
              </div>
              <h2 className="modal-title">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="modal-subtitle">
                {isLogin
                  ? "Enter your details to access your workspace."
                  : "Join PromptixGPT to start building."}
              </p>
            </div>

            <form onSubmit={handleAuth} className="auth-form">
              {/* Error Message */}
              {error && <div className="error-msg">{error}</div>}

              {!isLogin && (
                <div className="input-group">
                  <User className="input-icon" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>

              <button type="submit" disabled={isLoading} className="btn-submit">
                <div className="btn-shimmer"></div>
                {isLoading ? (
                  <span className="loading-content">
                    <svg
                      className="loading-spinner"
                      xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="modal-footer">
              <p className="flex">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => openModal(isLogin ? "signup" : "login")}
                  className="btn-toggle"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;
