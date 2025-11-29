import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import Footer from './components/Footer'

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
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App

