import { useEffect, useState } from 'react'
import '../styles/components/FighterSelector.css'
import { UFC_FIGHTERS } from '../data/fighters'
import FighterPhoto from './FighterPhoto'

function FighterSelector({ selectedFighter, onSelectFighter }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWeightClass, setSelectedWeightClass] = useState('All')
  const [allFighters, setAllFighters] = useState(UFC_FIGHTERS)
  const [weightClasses, setWeightClasses] = useState([
    'Heavyweight',
    'Light Heavyweight',
    'Middleweight',
    'Welterweight',
    'Lightweight',
    'Featherweight',
    'Bantamweight',
    'Flyweight'
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch full fighter list from backend (UFC Stats scraper)
  useEffect(() => {
    const fetchFighters = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Fetching fighters from API...')
        const res = await fetch('/api/fighters')
        if (!res.ok) {
          console.error(`❌ Failed to fetch fighters: ${res.status} ${res.statusText}`)
          // Keep using local fighters as fallback
          console.log('Using local fighters as fallback')
          return
        }
        const data = await res.json()
        console.log('📦 API Response:', { 
          hasFighters: !!data.fighters, 
          isArray: Array.isArray(data.fighters),
          count: data.fighters?.length || 0
        })
        if (!data.fighters || !Array.isArray(data.fighters)) {
          console.error('❌ Invalid API response format:', data)
          return
        }
        if (data.fighters.length === 0) {
          console.warn('⚠️  API returned 0 fighters, using local fighters')
          return
        }

        // Merge backend fighters with local ones (local overrides by name)
        const localByName = new Map(UFC_FIGHTERS.map(f => [f.name.toLowerCase(), f]))
        const merged = []

        data.fighters.forEach((f, index) => {
          const key = (f.name || '').toLowerCase()
          if (localByName.has(key)) {
            // Merge: keep local detailed stats but use API imageUrl if available
            const localFighter = localByName.get(key)
            merged.push({
              ...localFighter,
              imageUrl: localFighter.imageUrl || f.imageUrl || null
            })
            localByName.delete(key)
          } else {
            merged.push({
              id: f.id || index + 1000,
              name: f.name,
              weightClass: f.weightClass || 'Unknown',
              wins: f.wins ?? 0,
              losses: f.losses ?? 0,
              knockouts: f.knockouts ?? 0,
              submissions: f.submissions ?? 0,
              strikingAccuracy: f.strikingAccuracy ?? 50,
              takedownAccuracy: f.takedownAccuracy ?? 50,
              imageUrl: f.imageUrl || null
            })
          }
        })

        // Add any remaining local fighters that weren't in the API
        localByName.forEach((value) => merged.push(value))

        // Dynamically extract weight classes from merged fighters
        const uniqueWeightClasses = [...new Set(merged.map(f => f.weightClass).filter(wc => wc && wc !== 'Unknown'))]
          .sort((a, b) => {
            // Sort in standard weight class order
            const order = ['Heavyweight', 'Light Heavyweight', 'Middleweight', 'Welterweight', 'Lightweight', 'Featherweight', 'Bantamweight', 'Flyweight']
            const aIndex = order.indexOf(a)
            const bIndex = order.indexOf(b)
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
            if (aIndex !== -1) return -1
            if (bIndex !== -1) return 1
            return a.localeCompare(b)
          })
        
        setWeightClasses(uniqueWeightClasses.length > 0 ? uniqueWeightClasses : [
          'Heavyweight', 'Light Heavyweight', 'Middleweight', 'Welterweight', 
          'Lightweight', 'Featherweight', 'Bantamweight', 'Flyweight'
        ])
        setAllFighters(merged)
        
        console.log(`✅ Loaded ${merged.length} fighters with ${uniqueWeightClasses.length} weight classes`)
      } catch (err) {
        console.error('❌ Error loading fighters from API:', err)
        // Keep using local fighters as fallback
        console.log('Using local fighters as fallback')
        // Extract weight classes from local fighters too
        const localWeightClasses = [...new Set(UFC_FIGHTERS.map(f => f.weightClass).filter(wc => wc))]
          .sort((a, b) => {
            const order = ['Heavyweight', 'Light Heavyweight', 'Middleweight', 'Welterweight', 'Lightweight', 'Featherweight', 'Bantamweight', 'Flyweight']
            const aIndex = order.indexOf(a)
            const bIndex = order.indexOf(b)
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
            if (aIndex !== -1) return -1
            if (bIndex !== -1) return 1
            return a.localeCompare(b)
          })
        setWeightClasses(localWeightClasses)
        setAllFighters(UFC_FIGHTERS) // Ensure we keep local fighters
      } finally {
        setIsLoading(false)
      }
    }

    fetchFighters()
  }, [])

  // Filter fighters by weight class and search term
  const filteredFighters = allFighters.filter(fighter => {
    // Exact match for weight class (case-sensitive, trimmed)
    const fighterWC = (fighter.weightClass || '').trim()
    const selectedWC = selectedWeightClass.trim()
    const matchesWeightClass = selectedWeightClass === 'All' || fighterWC === selectedWC
    const matchesSearch = fighter.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Debug logging for weight class filtering (only log first few mismatches)
    if (selectedWeightClass !== 'All' && !matchesWeightClass && matchesSearch) {
      console.log(`[Filter Debug] Fighter "${fighter.name}" has weightClass: "${fighterWC}" (expected: "${selectedWC}")`)
    }
    
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
            <FighterPhoto fighterName={selectedFighter.name} fighterImageUrl={selectedFighter.imageUrl} size="small" />
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
              {weightClasses.map(wc => (
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
            {isLoading && filteredFighters.length === 0 && (
              <div className="no-results">Loading UFC fighters...</div>
            )}
            {!isLoading && filteredFighters.length > 0 ? (
              filteredFighters.map((fighter) => (
                <div
                  key={`${fighter.id}-${fighter.name}-${fighter.weightClass}`}
                  className="fighter-option"
                  onClick={() => handleSelect(fighter)}
                >
                  <FighterPhoto fighterName={fighter.name} fighterImageUrl={fighter.imageUrl} size="small" />
                  <div className="fighter-info">
                    <span className="fighter-name">{fighter.name}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="fighter-weight-class">{fighter.weightClass}</span>
                      {fighter.organization && fighter.organization !== 'UFC' && (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          color: '#d20a0a', 
                          fontWeight: 600,
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          background: 'rgba(210, 10, 10, 0.15)'
                        }}>
                          {fighter.organization}
                        </span>
                      )}
                    </div>
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

