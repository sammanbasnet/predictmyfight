import '../styles/components/FighterPhoto.css'
import { getFighterInitials } from '../utils/fighterImages'

/**
 * FighterPhoto Component
 * Displays fighter initials in a styled circle
 * 
 * @param {Object} props - Component props
 * @param {string} props.fighterName - Fighter's name
 * @param {string} props.size - Size of the photo ('small', 'medium', 'large')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Fighter photo component
 */
function FighterPhoto({ fighterName, size = 'medium', className = '' }) {
  const initials = getFighterInitials(fighterName)

  return (
    <div className={`fighter-photo fighter-photo-${size} ${className}`}>
      <div className="fighter-photo-initials">
        {initials}
      </div>
    </div>
  )
}

export default FighterPhoto
