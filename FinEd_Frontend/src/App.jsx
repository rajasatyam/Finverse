import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FinEdLanding from "./LandingPage";
import FeaturesPage from "./FeaturePage";
import CommunityPage from "./features/CommunityPage";
import FinancialSimulatorLanding from "./features/CreditOrLoan";
import CreditCardSimulator from "./features/CreditSimulator";
import CreditCardSimulationExplanation from "./features/CreditSimulatorWorking";
import LoanSimulationExplanation from "./features/LoanSimulationWorking";
import LoanSimulator from "./features/LoanSimulator";
import FinancialChatbot from "./features/FinChatbot";
import FinNews from "./features/finNews";
import StockSimulator from "./features/StockSimulator";
import ScrollToTop from "./features/ScrollToTop";
import { Tracker } from "./features/tracker";
import AuthPage from "./features/SignUpPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import RequireAuth from "./components/RequireAuth";
import ViewOnlyGate from "./components/ViewOnlyGate";
import { LearningPage, VideoPlayerPage } from "./features/learning";

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<FinEdLanding />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/community" element={<CommunityPage/>}/>
        <Route path="/creditOrLoan" element={<FinancialSimulatorLanding/>}/>
        <Route path="/credit" element={<ViewOnlyGate><CreditCardSimulator/></ViewOnlyGate>}/>
        <Route path="/credit!help" element={<CreditCardSimulationExplanation/>}/>
        <Route path="/loan!help" element={<LoanSimulationExplanation/>}/>
        <Route path="/loan" element={<ViewOnlyGate><LoanSimulator/></ViewOnlyGate>}/>
        <Route path="/chatbot" element={<ViewOnlyGate><FinancialChatbot/></ViewOnlyGate>}/>
        <Route path="/news" element={<RequireAuth><FinNews/></RequireAuth>}/>
        <Route path="/learning" element={<LearningPage/>}/>
        <Route path="/learning/watch/:videoId" element={<VideoPlayerPage/>}/>
        <Route path="/learning/watch" element={<VideoPlayerPage/>}/>
        <Route path="/stock" element={<ViewOnlyGate><StockSimulator/></ViewOnlyGate>}/>
        <Route path="/tracker" element={<ViewOnlyGate><Tracker/></ViewOnlyGate>}/>
        <Route path="/login" element={<AuthPage mode="login"/>}/>
        <Route path="/signup" element={<AuthPage mode="signup"/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/help" element={<HelpCenterPage/>}/>
        <Route path="/privacy" element={<PrivacyPolicyPage/>}/>
        <Route path="/terms" element={<TermsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
