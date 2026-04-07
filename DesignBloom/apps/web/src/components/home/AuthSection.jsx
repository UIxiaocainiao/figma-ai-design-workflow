import { useState } from "react";

const loginInitialState = {
  account: "",
  password: "",
};

const registerInitialState = {
  nickname: "",
  username: "",
  email: "",
  avatarUrl: "",
  verificationCode: "",
  password: "",
};

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed.");
  }

  return data;
}

function AuthField({ label, className = "", ...inputProps }) {
  return (
    <label className={`field-card ${className}`.trim()}>
      <span className="field-label">{label}</span>
      <input {...inputProps} />
    </label>
  );
}

function AuthFeedback({ feedback }) {
  if (!feedback?.text) {
    return null;
  }

  return <p className={`auth-feedback is-${feedback.tone}`}>{feedback.text}</p>;
}

function AuthSection({ mode, onModeChange, standalone = false }) {
  const [loginForm, setLoginForm] = useState(loginInitialState);
  const [registerForm, setRegisterForm] = useState(registerInitialState);
  const [loginPending, setLoginPending] = useState(false);
  const [registerPending, setRegisterPending] = useState(false);
  const [codePending, setCodePending] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState(null);
  const [registerFeedback, setRegisterFeedback] = useState(null);
  const [codeFeedback, setCodeFeedback] = useState(null);
  const [devCode, setDevCode] = useState("");

  const updateLoginField = (field) => (event) => {
    const value = event.target.value;
    setLoginForm((current) => ({ ...current, [field]: value }));
  };

  const updateRegisterField = (field) => (event) => {
    const value = event.target.value;
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  const handleSendCode = async () => {
    if (!registerForm.email.trim()) {
      setCodeFeedback({
        tone: "error",
        text: "Enter your email before requesting a verification code.",
      });
      return;
    }

    setCodePending(true);
    setCodeFeedback(null);
    setRegisterFeedback(null);

    try {
      const result = await postJson("/api/auth/send-code", {
        email: registerForm.email,
      });
      setDevCode(result.devCode ?? "");
      setCodeFeedback({
        tone: "success",
        text: result.message ?? "Verification code sent.",
      });
    } catch (error) {
      setCodeFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Failed to send verification code.",
      });
    } finally {
      setCodePending(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginPending(true);
    setLoginFeedback(null);

    try {
      const result = await postJson("/api/auth/login", loginForm);
      setLoginFeedback({
        tone: "success",
        text: result.message ?? "Signed in successfully.",
      });
    } catch (error) {
      setLoginFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Failed to sign in.",
      });
    } finally {
      setLoginPending(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setRegisterPending(true);
    setRegisterFeedback(null);

    try {
      const result = await postJson("/api/auth/register", registerForm);
      setRegisterFeedback({
        tone: "success",
        text: result.message ?? "Account created successfully.",
      });
      setDevCode("");
      setCodeFeedback(null);
      setRegisterForm(registerInitialState);
      setLoginForm((current) => ({
        ...current,
        account: registerForm.email,
        password: "",
      }));
      setLoginFeedback({
        tone: "success",
        text: "Account created. Sign in with your email or username.",
      });
      onModeChange("login");
    } catch (error) {
      setRegisterFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Failed to create account.",
      });
    } finally {
      setRegisterPending(false);
    }
  };

  return (
    <div className={`auth-surface${standalone ? " is-standalone" : " reveal"}`.trim()}>
      {standalone ? null : (
        <div className="auth-copy">
          <p className="section-eyebrow">AUTH / 05</p>
          <h2 className="auth-title">Account access built into the landing page.</h2>
          <p className="section-body auth-body">
            The new auth endpoints are wired into a single surface: request a code,
            create an account, then sign in with your email or username.
          </p>

          <div className="auth-points">
            <div className="bullet-row">
              <span className="bullet-dot" aria-hidden="true" />
              <span>Email verification is required before registration completes.</span>
            </div>
            <div className="bullet-row">
              <span className="bullet-dot" aria-hidden="true" />
              <span>Login accepts either username or email plus password.</span>
            </div>
            <div className="bullet-row">
              <span className="bullet-dot" aria-hidden="true" />
              <span>Until a mail provider is added, the dev code is surfaced here.</span>
            </div>
          </div>
        </div>
      )}

      <div className={`auth-panel${standalone ? " is-standalone" : ""}`.trim()}>
        <div
          className={`auth-tabs${standalone ? " is-standalone" : ""}`.trim()}
          role="tablist"
          aria-label="Authentication"
        >
          <button
            aria-selected={mode === "login"}
            className={`auth-tab ${mode === "login" ? "is-active" : ""}`.trim()}
            onClick={() => onModeChange("login")}
            role="tab"
            type="button"
          >
            Log in
          </button>
          <button
            aria-selected={mode === "register"}
            className={`auth-tab ${mode === "register" ? "is-active" : ""}`.trim()}
            onClick={() => onModeChange("register")}
            role="tab"
            type="button"
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="auth-stack">
              <AuthField
                autoComplete="username"
                label="ACCOUNT"
                onChange={updateLoginField("account")}
                placeholder="Email or username"
                required
                value={loginForm.account}
              />
              <AuthField
                autoComplete="current-password"
                label="PASSWORD"
                minLength={8}
                onChange={updateLoginField("password")}
                placeholder="Enter your password"
                required
                type="password"
                value={loginForm.password}
              />
            </div>

            <AuthFeedback feedback={loginFeedback} />

            <button className="auth-submit" disabled={loginPending} type="submit">
              {loginPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="auth-grid">
              <AuthField
                autoComplete="name"
                label="NICKNAME"
                onChange={updateRegisterField("nickname")}
                placeholder="Display name"
                required
                value={registerForm.nickname}
              />
              <AuthField
                autoComplete="username"
                label="USERNAME"
                minLength={3}
                onChange={updateRegisterField("username")}
                pattern="[A-Za-z0-9._-]{3,24}"
                placeholder="letters, numbers, . _ -"
                required
                value={registerForm.username}
              />
              <AuthField
                autoComplete="email"
                label="EMAIL"
                onChange={updateRegisterField("email")}
                placeholder="you@example.com"
                required
                type="email"
                value={registerForm.email}
              />
              <AuthField
                autoComplete="url"
                label="AVATAR URL"
                onChange={updateRegisterField("avatarUrl")}
                placeholder="Optional image URL"
                type="url"
                value={registerForm.avatarUrl}
              />
              <AuthField
                className="is-code"
                inputMode="numeric"
                label="VERIFICATION CODE"
                maxLength={6}
                onChange={updateRegisterField("verificationCode")}
                pattern="[0-9]{6}"
                placeholder="6 digits"
                required
                value={registerForm.verificationCode}
              />
              <AuthField
                autoComplete="new-password"
                label="PASSWORD"
                minLength={8}
                onChange={updateRegisterField("password")}
                placeholder="Minimum 8 characters"
                required
                type="password"
                value={registerForm.password}
              />
            </div>

            <div className="auth-inline-row">
              <button
                className="auth-secondary-button"
                disabled={codePending}
                onClick={handleSendCode}
                type="button"
              >
                {codePending ? "Sending code..." : "Send code"}
              </button>
              <p className="auth-inline-copy">
                Request a code after entering your email, then paste the 6-digit value here.
              </p>
            </div>

            <AuthFeedback feedback={codeFeedback} />

            {devCode ? (
              <div className="auth-dev-code" role="status">
                <span>DEV CODE</span>
                <strong>{devCode}</strong>
              </div>
            ) : null}

            <AuthFeedback feedback={registerFeedback} />

            <button className="auth-submit" disabled={registerPending} type="submit">
              {registerPending ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthSection;
