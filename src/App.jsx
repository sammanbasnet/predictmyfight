import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import Fighters from './pages/Fighters'
import Footer from './components/Footer'
import BackgroundImages from './components/BackgroundImages'

/**
 * Main App Component with Routing
 * 
 * PredictMyFight - A web application for predicting MMA fight outcomes
 * using historical fighter statistics and weighted algorithms.
 * 
 * @returns {JSX.Element} Main application component with routes
 */
function App() {
  return (
    <div className="app">
      <BackgroundImages />
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/fighters" element={<Fighters />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App

