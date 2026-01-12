import { useState, useEffect } from 'react'
import '../styles/pages/Fighters.css'
import FighterStats from '../components/FighterStats'
import FighterPhoto from '../components/FighterPhoto'

/**
 * Fighters Page Component
 * Search and view individual fighter statistics
 * 
 * @returns {JSX.Element} Fighters page component
 */
function Fighters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [allFighters, setAllFighters] = useState([])
  const [selectedFighter, setSelectedFighter] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Fetch all fighters on component mount
  useEffect(() => {
    const fetchFighters = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/fighters')
        if (!res.ok) {
          throw new Error('Failed to fetch fighters')
        }
        const data = await res.json()
        if (data.fighters && Array.isArray(data.fighters)) {
          setAllFighters(data.fighters)
        }
      } catch (err) {
        console.error('Error fetching fighters:', err)
        setError('Failed to load fighters. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFighters()
  }, [])

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setSelectedFighter(null)
    setError(null)

    if (value.trim().length > 0) {
      // Show suggestions based on search term
      const filtered = allFighters
        .filter(fighter => 
          fighter.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10) // Limit to 10 suggestions
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      setError('Please enter a fighter name')
      return
    }

    const found = allFighters.find(fighter =>
      fighter.name.toLowerCase() === searchTerm.toLowerCase().trim()
    )

    if (found) {
      setSelectedFighter(found)
      setError(null)
      setShowSuggestions(false)
    } else {
      setError(`Fighter "${searchTerm}" not found. Try searching for a different name.`)
      setSelectedFighter(null)
      setShowSuggestions(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (fighter) => {
    setSearchTerm(fighter.name)
    setSelectedFighter(fighter)
    setError(null)
    setShowSuggestions(false)
  }

  // Handle clicking outside suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="fighters-page">
      <header className="fighters-header">
        <h1>Fighter Database</h1>
        <p>Search for any fighter to view their detailed statistics and performance metrics</p>
      </header>

      <div className="fighters-content">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Enter fighter name (e.g., Jon Jones, Islam Makhachev)..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm && setShowSuggestions(true)}
              />
              <button type="submit" className="search-button">
                <span className="search-icon">🔍</span>
                Search
              </button>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((fighter) => (
                  <div
                    key={`${fighter.id}-${fighter.name}`}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(fighter)}
                  >
                    <FighterPhoto 
                      fighterName={fighter.name} 
                      fighterImageUrl={fighter.imageUrl} 
                      size="small" 
                    />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{fighter.name}</span>
                      <span className="suggestion-details">
                        {fighter.weightClass} • {fighter.wins}-{fighter.losses}
                        {fighter.organization && fighter.organization !== 'UFC' && (
                          <span className="suggestion-org"> • {fighter.organization}</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="loading-message">
              Loading fighters database...
            </div>
          )}
        </div>

        {/* Fighter Stats Display */}
        {selectedFighter && (
          <div className="fighter-display">
            <div className="fighter-header-card">
              <FighterPhoto 
                fighterName={selectedFighter.name} 
                fighterImageUrl={selectedFighter.imageUrl} 
                size="xlarge" 
              />
              <div className="fighter-header-info">
                <h2>{selectedFighter.name}</h2>
                <div className="fighter-meta">
                  <span className="fighter-weight-class">{selectedFighter.weightClass}</span>
                  {selectedFighter.organization && selectedFighter.organization !== 'UFC' && (
                    <span className="fighter-organization">{selectedFighter.organization}</span>
                  )}
                  {selectedFighter.status && (
                    <span className={`fighter-status ${selectedFighter.status.toLowerCase()}`}>
                      {selectedFighter.status}
                    </span>
                  )}
                </div>
                <div className="fighter-record-large">
                  <span className="record-label">Record:</span>
                  <span className="record-value">
                    {selectedFighter.wins}-{selectedFighter.losses}
                  </span>
                </div>
              </div>
            </div>

            <FighterStats fighter={selectedFighter} />
          </div>
        )}

        {/* Empty state */}
        {!selectedFighter && !isLoading && !error && searchTerm === '' && (
          <div className="empty-state">
            <div className="empty-state-icon">🥊</div>
            <h3>Search for a Fighter</h3>
            <p>Enter a fighter's name in the search bar above to view their detailed statistics</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Fighters

