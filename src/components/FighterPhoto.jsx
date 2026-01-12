import { useState, useEffect } from 'react'
import '../styles/components/FighterPhoto.css'
import { getFighterInitials, getDirectFighterImageUrl } from '../utils/fighterImages'

/**
 * FighterPhoto Component
 * Displays fighter photo with multiple fallback strategies
 * 
 * @param {Object} props - Component props
 * @param {string} props.fighterName - Fighter's name
 * @param {string} props.fighterImageUrl - Optional: Direct image URL from API
 * @param {string} props.size - Size of the photo ('small', 'medium', 'large')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Fighter photo component
 */
function FighterPhoto({ fighterName, fighterImageUrl = null, size = 'medium', className = '' }) {
  const [imgLoading, setImgLoading] = useState(true)
  const [imgError, setImgError] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [fallbackStage, setFallbackStage] = useState(0) // 0: actual image, 1: DiceBear, 2: text initials
  const initials = getFighterInitials(fighterName)

  useEffect(() => {
    // Reset state when fighter changes
    setImgLoading(true)
    setImgError(false)
    setFallbackStage(0)
    
    // Priority order:
    // 1. Image URL from API (scraped from ufcstats.com)
    // 2. Known UFC CDN URL (via proxy)
    // 3. DiceBear avatar
    
    if (fighterImageUrl) {
      // Use image from API through proxy
      setCurrentImageUrl(`/api/fighter-image?url=${encodeURIComponent(fighterImageUrl)}`)
    } else {
      const knownImageUrl = getDirectFighterImageUrl(fighterName)
      if (knownImageUrl) {
        // Use known UFC CDN image through proxy
        setCurrentImageUrl(`/api/fighter-image?url=${encodeURIComponent(knownImageUrl)}`)
      } else {
        // Fallback to DiceBear avatar
        const encodedName = encodeURIComponent(fighterName)
        const dicebearUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=1a1a1a&textColor=ffffff&fontSize=40&fontWeight=700&radius=50`
        setCurrentImageUrl(dicebearUrl)
        setFallbackStage(1)
      }
    }
  }, [fighterName, fighterImageUrl])

  const handleImageLoad = () => {
    setImgLoading(false)
    setImgError(false)
  }

  const handleImageError = () => {
    // If we tried a real image and it failed, fall back to DiceBear
    if (fallbackStage === 0) {
      const encodedName = encodeURIComponent(fighterName)
      const dicebearUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=1a1a1a&textColor=ffffff&fontSize=40&fontWeight=700&radius=50`
      setCurrentImageUrl(dicebearUrl)
      setFallbackStage(1)
      setImgLoading(true)
    } else {
      // DiceBear failed (very unlikely), show text initials
      setImgError(true)
      setImgLoading(false)
    }
  }

  return (
    <div className={`fighter-photo fighter-photo-${size} ${className}`}>
      {!imgError && currentImageUrl && (
        <img
          src={currentImageUrl}
          alt={fighterName}
          className="fighter-photo-image"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imgLoading ? 'none' : 'block' }}
          loading="lazy"
        />
      )}
      {(imgError || imgLoading) && (
        <div className="fighter-photo-initials" style={{ display: 'flex' }}>
          {initials}
        </div>
      )}
    </div>
  )
}

export default FighterPhoto
