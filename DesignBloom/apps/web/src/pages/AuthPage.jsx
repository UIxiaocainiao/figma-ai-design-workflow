import { useState } from "react";
import AuthSection from "../components/home/AuthSection";
import { getHomeHref, replaceAuthUrl } from "../utils/authView";

function AuthPage({ initialMode }) {
  const [mode, setMode] = useState(initialMode);
  const homeHref = getHomeHref();

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    replaceAuthUrl(nextMode);
  };

  return (
    <div className="auth-page">
      <header className="auth-page-bar section-shell">
        <a className="brand" href={homeHref}>
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-wordmark">DesignBloom</span>
        </a>

        <a className="auth-page-back" href={homeHref}>
          Back to Home
        </a>
      </header>

      <main className="auth-page-main section-shell">
        <AuthSection mode={mode} onModeChange={handleModeChange} standalone />
      </main>
    </div>
  );
}

export default AuthPage;
