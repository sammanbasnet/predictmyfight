import { useState } from 'react'
import '../styles/components/FighterSelector.css'
import { UFC_FIGHTERS, WEIGHT_CLASSES } from '../data/fighters'

function FighterSelector({ selectedFighter, onSelectFighter }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWeightClass, setSelectedWeightClass] = useState('All')

  // Filter fighters by weight class and search term
  const filteredFighters = UFC_FIGHTERS.filter(fighter => {
    const matchesWeightClass = selectedWeightClass === 'All' || fighter.weightClass === selectedWeightClass
    const matchesSearch = fighter.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesWeightClass && matchesSearch
  })

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
            <div className="selected-fighter-info">
              <span className="fighter-name">{selectedFighter.name}</span>
              <span className="fighter-weight-class-small">{selectedFighter.weightClass}</span>
            </div>
          </div>
        ) : (
          <div className="placeholder">Select a fighter...</div>
        )}
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="filter-controls">
            <select
              className="weight-class-filter"
              value={selectedWeightClass}
              onChange={(e) => {
                setSelectedWeightClass(e.target.value)
                setSearchTerm('')
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="All">All Weight Classes</option>
              {WEIGHT_CLASSES.map(wc => (
                <option key={wc} value={wc}>{wc}</option>
              ))}
            </select>
            <input
              type="text"
              className="search-input"
              placeholder="Search fighters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="fighter-list">
            {filteredFighters.length > 0 ? (
              filteredFighters.map((fighter) => (
                <div
                  key={fighter.id}
                  className="fighter-option"
                  onClick={() => handleSelect(fighter)}
                >
                  <span className="fighter-emoji">{fighter.image}</span>
                  <div className="fighter-info">
                    <span className="fighter-name">{fighter.name}</span>
                    <span className="fighter-weight-class">{fighter.weightClass}</span>
                  </div>
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

