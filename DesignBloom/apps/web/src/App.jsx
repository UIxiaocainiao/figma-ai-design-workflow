import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useDeployVersionRefresh } from "./hooks/useDeployVersionRefresh";
import { getAuthModeFromLocation } from "./utils/authView";

function App() {
  useDeployVersionRefresh();
  const authMode = getAuthModeFromLocation();

  return authMode ? <AuthPage initialMode={authMode} /> : <HomePage />;
}

export default App;
