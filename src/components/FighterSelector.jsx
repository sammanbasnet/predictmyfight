import { useState } from 'react'
import '../styles/components/FighterSelector.css'
import { SAMPLE_FIGHTERS } from '../data/fighters'

function FighterSelector({ selectedFighter, onSelectFighter }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFighters = SAMPLE_FIGHTERS.filter(fighter =>
    fighter.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (fighter) => {
    onSelectFighter(fighter)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="fighter-selector">
      <div
        className="selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedFighter ? (
          <div className="selected-fighter">
            <span className="fighter-emoji">{selectedFighter.image}</span>
            <span className="fighter-name">{selectedFighter.name}</span>
          </div>
        ) : (
          <div className="placeholder">Select a fighter...</div>
        )}
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <input
            type="text"
            className="search-input"
            placeholder="Search fighters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="fighter-list">
            {filteredFighters.length > 0 ? (
              filteredFighters.map((fighter) => (
                <div
                  key={fighter.id}
                  className="fighter-option"
                  onClick={() => handleSelect(fighter)}
                >
                  <span className="fighter-emoji">{fighter.image}</span>
                  <span className="fighter-name">{fighter.name}</span>
                  <span className="fighter-record">
                    {fighter.wins}-{fighter.losses}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-results">No fighters found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FighterSelector

