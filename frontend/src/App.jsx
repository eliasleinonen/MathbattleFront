
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlayRandom from './pages/PlayRandom';
import PlayFriend from './pages/PlayFriend';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SetUsername from './pages/SetUsername';
import DailyChallenge from './pages/DailyChallenge';
import HowToDerivate from './pages/HowToDerivate';
import TermsAndServices from './pages/TermsAndServices';
import About from './pages/About';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="bg-white min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/set-username" element={<SetUsername />} />
        <Route path="/" element={<Home />} />
        <Route path="/play/random" element={<PlayRandom />} />
        <Route path="/play/random/:matchCode" element={<PlayRandom />} />
        <Route path="/play/friend" element={<PlayFriend />} />
        <Route path="/play/friend/:matchCode" element={<PlayFriend />} />
        <Route path="/game/:matchCode" element={<Game />} />
        <Route path="/daily-challenge" element={<DailyChallenge />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/how-to-derivate" element={<HowToDerivate />} />
        <Route path="/terms-and-services" element={<TermsAndServices />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
