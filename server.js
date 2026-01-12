import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const UFC_STATS_BASE = 'http://ufcstats.com/statistics/fighters'

let fightersCache = null
let lastFetched = 0
const CACHE_TTL = 1000 * 60 * 60 * 6 // 6 hours

/**
 * Normalize name from "LASTNAME, FIRSTNAME" to "Firstname Lastname"
 */
function normalizeName(raw) {
  if (!raw) return ''
  const parts = raw.split(',').map(p => p.trim())
  if (parts.length === 2) {
    const [last, first] = parts
    const cap = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    return `${cap(first)} ${cap(last)}`
  }
  return raw.trim()
}

/**
 * Normalize weight class to match frontend exactly
 */
function normalizeWeightClass(raw) {
  if (!raw) return 'Unknown'
  const t = raw.trim().replace(/\s*Division\s*/i, '').trim()
  const normalizedLower = t.toLowerCase()
  
  // Must match frontend: Heavyweight, Light Heavyweight, Middleweight, Welterweight, 
  //                     Lightweight, Featherweight, Bantamweight, Flyweight
  
  if (normalizedLower.includes('light heavyweight') || normalizedLower === 'lightheavyweight') {
    return 'Light Heavyweight'
  }
  if (normalizedLower.includes('heavyweight') && !normalizedLower.includes('light')) {
    return 'Heavyweight'
  }
  if (normalizedLower.includes('middleweight')) {
    return 'Middleweight'
  }
  if (normalizedLower.includes('welterweight')) {
    return 'Welterweight'
  }
  if (normalizedLower.includes('lightweight') && !normalizedLower.includes('heavy')) {
    return 'Lightweight'
  }
  if (normalizedLower.includes('featherweight') && !normalizedLower.includes('women')) {
    return 'Featherweight'
  }
  if (normalizedLower.includes('bantamweight') && !normalizedLower.includes('women')) {
    return 'Bantamweight'
  }
  if (normalizedLower.includes('flyweight') && !normalizedLower.includes('women')) {
    return 'Flyweight'
  }
  
  return 'Unknown'
}

/**
 * Parse record string like "21-3-0" → { wins, losses }
 */
function parseRecord(raw) {
  const result = { wins: 0, losses: 0 }
  if (!raw) return result
  const match = raw.trim().match(/(\d+)-(\d+)-(\d+)/)
  if (match) {
    result.wins = parseInt(match[1], 10)
    result.losses = parseInt(match[2], 10)
  }
  return result
}

// Map of known UFC fighter image URLs
const KNOWN_FIGHTER_IMAGES = {
  'Jon Jones': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/JONES_JON_L_07-29-23.png',
  'Tom Aspinall': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-11/ASPINALL_TOM_L_11-11-23.png',
  'Curtis Blaydes': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/BLAYDES_CURTIS_L_07-22-23.png',
  'Sergei Pavlovich': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-06/PAVLOVICH_SERGEI_L_06-10-23.png',
  'Stipe Miocic': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2021-09/MIOCIC_STIPE_L_09-25-21.png',
  'Ciryl Gane': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-03/GANE_CIRYL_L_03-04-23.png',
  'Alex Pereira': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-11/PEREIRA_ALEX_L_11-11-23.png',
  'Jamahal Hill': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-01/HILL_JAMAHAL_L_01-21-23.png',
  'Jiri Prochazka': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2022-06/PROCHAZKA_JIRI_L_06-11-22.png',
  'Magomed Ankalaev': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-10/ANKALAEV_MAGOMED_L_10-21-23.png',
  'Jan Blachowicz': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/BLACHOWICZ_JAN_L_07-29-23.png',
  'Dricus Du Plessis': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-01/DUPLESSIS_DRICUS_L_01-20-24.png',
  'Israel Adesanya': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-09/ADESANYA_ISRAEL_L_09-09-23.png',
  'Sean Strickland': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-01/STRICKLAND_SEAN_L_01-20-24.png',
  'Robert Whittaker': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-09/WHITTAKER_ROBERT_L_09-09-23.png',
  'Khamzat Chimaev': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-10/CHIMAEV_KHAMZAT_L_10-21-23.png',
  'Paulo Costa': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/COSTA_PAULO_L_08-19-23.png',
  'Leon Edwards': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/EDWARDS_LEON_L_12-16-23.png',
  'Kamaru Usman': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-10/USMAN_KAMARU_L_10-21-23.png',
  'Shavkat Rakhmonov': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/RAKHMONOV_SHAVKAT_L_12-16-23.png',
  'Belal Muhammad': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-10/MUHAMMAD_BELAL_L_10-21-23.png',
  'Colby Covington': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/COVINGTON_COLBY_L_12-16-23.png',
  'Gilbert Burns': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-05/BURNS_GILBERT_L_05-06-23.png',
  'Islam Makhachev': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-10/MAKHACHEV_ISLAM_L_10-21-23.png',
  'Charles Oliveira': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-06/OLIVEIRA_CHARLES_L_06-10-23.png',
  'Justin Gaethje': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/GAETHJE_JUSTIN_L_07-29-23.png',
  'Arman Tsarukyan': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/TSARUKYAN_ARMAN_L_12-16-23.png',
  'Dustin Poirier': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/PORIER_DUSTIN_L_07-29-23.png',
  'Beneil Dariush': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-05/DARIUSH_BENEIL_L_05-06-23.png',
  'Ilia Topuria': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-02/TOPURIA_ILIA_L_02-17-24.png',
  'Alexander Volkanovski': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-02/VOLKANOVSKI_ALEXANDER_L_02-17-24.png',
  'Max Holloway': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-04/HOLLOWAY_MAX_L_04-13-24.png',
  'Yair Rodriguez': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/RODRIGUEZ_YAIR_L_07-08-23.png',
  'Brian Ortega': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2022-07/ORTEGA_BRIAN_L_07-16-22.png',
  'Sean O\'Malley': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/OMALLEY_SEAN_L_08-19-23.png',
  'Merab Dvalishvili': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-02/DVALISHVILI_MERAB_L_02-17-24.png',
  'Aljamain Sterling': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/STERLING_ALJAMAIN_L_08-19-23.png',
  'Cory Sandhagen': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/SANDHAGEN_CORY_L_08-05-23.png',
  'Petr Yan': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-03/YAN_PETR_L_03-11-23.png',
  'Marlon Vera': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/VERA_MARLON_L_08-19-23.png',
  'Alexandre Pantoja': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/PANTOJA_ALEXANDRE_L_07-08-23.png',
  'Brandon Royval': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/ROYVAL_BRANDON_L_12-16-23.png',
  'Brandon Moreno': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/MORENO_BRANDON_L_07-08-23.png'
}

// Legendary fighters
const LEGENDARY_FIGHTERS = [
  { id: 1000, name: 'Chuck Liddell', weightClass: 'Light Heavyweight', wins: 21, losses: 9, knockouts: 13, submissions: 1, strikingAccuracy: 48, takedownAccuracy: 60, status: 'Legendary', organization: 'UFC' },
  { id: 1001, name: 'Anderson Silva', weightClass: 'Middleweight', wins: 34, losses: 11, knockouts: 20, submissions: 6, strikingAccuracy: 61, takedownAccuracy: 70, status: 'Legendary', organization: 'UFC' },
  { id: 1002, name: 'Randy Couture', weightClass: 'Light Heavyweight', wins: 19, losses: 11, knockouts: 7, submissions: 4, strikingAccuracy: 45, takedownAccuracy: 75, status: 'Legendary', organization: 'UFC' },
  { id: 1003, name: 'Matt Hughes', weightClass: 'Welterweight', wins: 45, losses: 9, knockouts: 18, submissions: 18, strikingAccuracy: 50, takedownAccuracy: 65, status: 'Legendary', organization: 'UFC' },
  { id: 1004, name: 'BJ Penn', weightClass: 'Lightweight', wins: 16, losses: 14, knockouts: 7, submissions: 6, strikingAccuracy: 52, takedownAccuracy: 55, status: 'Legendary', organization: 'UFC' },
  { id: 1005, name: 'Tito Ortiz', weightClass: 'Light Heavyweight', wins: 21, losses: 12, knockouts: 10, submissions: 2, strikingAccuracy: 44, takedownAccuracy: 68, status: 'Legendary', organization: 'UFC' },
  { id: 1006, name: 'Ken Shamrock', weightClass: 'Light Heavyweight', wins: 28, losses: 17, knockouts: 2, submissions: 23, strikingAccuracy: 40, takedownAccuracy: 72, status: 'Legendary', organization: 'UFC' },
  { id: 1007, name: 'Royce Gracie', weightClass: 'Middleweight', wins: 15, losses: 2, knockouts: 0, submissions: 11, strikingAccuracy: 35, takedownAccuracy: 80, status: 'Legendary', organization: 'UFC' },
  { id: 1008, name: 'Mark Coleman', weightClass: 'Heavyweight', wins: 16, losses: 10, knockouts: 6, submissions: 4, strikingAccuracy: 42, takedownAccuracy: 78, status: 'Legendary', organization: 'UFC' },
  { id: 1009, name: 'Dan Henderson', weightClass: 'Middleweight', wins: 32, losses: 15, knockouts: 16, submissions: 2, strikingAccuracy: 49, takedownAccuracy: 65, status: 'Legendary', organization: 'UFC' },
  { id: 1010, name: 'Wanderlei Silva', weightClass: 'Light Heavyweight', wins: 35, losses: 14, knockouts: 27, submissions: 1, strikingAccuracy: 54, takedownAccuracy: 50, status: 'Legendary', organization: 'UFC' },
  { id: 1011, name: 'Fedor Emelianenko', weightClass: 'Heavyweight', wins: 40, losses: 6, knockouts: 16, submissions: 15, strikingAccuracy: 58, takedownAccuracy: 70, status: 'Legendary', organization: 'Pride' },
  { id: 1012, name: 'Georges St-Pierre', weightClass: 'Welterweight', wins: 26, losses: 2, knockouts: 8, submissions: 6, strikingAccuracy: 59, takedownAccuracy: 74, status: 'Legendary', organization: 'UFC' },
  { id: 1013, name: 'Lyoto Machida', weightClass: 'Light Heavyweight', wins: 26, losses: 11, knockouts: 11, submissions: 2, strikingAccuracy: 57, takedownAccuracy: 62, status: 'Legendary', organization: 'UFC' },
  { id: 1014, name: 'Quinton Jackson', weightClass: 'Light Heavyweight', wins: 38, losses: 14, knockouts: 20, submissions: 4, strikingAccuracy: 51, takedownAccuracy: 58, status: 'Legendary', organization: 'UFC' }
]

// PFL (Professional Fighters League) fighters
const PFL_FIGHTERS = [
  // Heavyweight
  { id: 2000, name: 'Antonio Carlos Junior', weightClass: 'Heavyweight', wins: 15, losses: 5, knockouts: 1, submissions: 9, strikingAccuracy: 45, takedownAccuracy: 55, status: 'Active', organization: 'PFL' },
  { id: 2001, name: 'Valentin Moldavsky', weightClass: 'Heavyweight', wins: 13, losses: 4, knockouts: 4, submissions: 2, strikingAccuracy: 48, takedownAccuracy: 42, status: 'Active', organization: 'PFL' },
  { id: 2002, name: 'Alexandr Romanov', weightClass: 'Heavyweight', wins: 18, losses: 3, knockouts: 6, submissions: 10, strikingAccuracy: 50, takedownAccuracy: 65, status: 'Active', organization: 'PFL' },
  { id: 2003, name: 'Oleg Popov', weightClass: 'Heavyweight', wins: 17, losses: 2, knockouts: 8, submissions: 4, strikingAccuracy: 52, takedownAccuracy: 50, status: 'Active', organization: 'PFL' },
  
  // Light Heavyweight
  { id: 2004, name: 'Impa Kasanganay', weightClass: 'Light Heavyweight', wins: 18, losses: 5, knockouts: 5, submissions: 3, strikingAccuracy: 46, takedownAccuracy: 38, status: 'Active', organization: 'PFL' },
  { id: 2005, name: 'Josh Silveira', weightClass: 'Light Heavyweight', wins: 13, losses: 2, knockouts: 4, submissions: 6, strikingAccuracy: 49, takedownAccuracy: 52, status: 'Active', organization: 'PFL' },
  { id: 2006, name: 'Rob Wilkinson', weightClass: 'Light Heavyweight', wins: 17, losses: 2, knockouts: 10, submissions: 2, strikingAccuracy: 54, takedownAccuracy: 40, status: 'Active', organization: 'PFL' },
  
  // Middleweight
  { id: 2007, name: 'Fabian Edwards', weightClass: 'Middleweight', wins: 13, losses: 4, knockouts: 6, submissions: 1, strikingAccuracy: 51, takedownAccuracy: 35, status: 'Active', organization: 'PFL' },
  { id: 2008, name: 'Brendan Loughnane', weightClass: 'Middleweight', wins: 28, losses: 5, knockouts: 14, submissions: 2, strikingAccuracy: 53, takedownAccuracy: 30, status: 'Active', organization: 'PFL' },
  
  // Welterweight
  { id: 2009, name: 'Magomed Magomedkerimov', weightClass: 'Welterweight', wins: 34, losses: 7, knockouts: 8, submissions: 18, strikingAccuracy: 47, takedownAccuracy: 58, status: 'Active', organization: 'PFL' },
  { id: 2010, name: 'Sadibou Sy', weightClass: 'Welterweight', wins: 17, losses: 7, knockouts: 8, submissions: 1, strikingAccuracy: 52, takedownAccuracy: 25, status: 'Active', organization: 'PFL' },
  { id: 2011, name: 'Thad Jean', weightClass: 'Welterweight', wins: 14, losses: 2, knockouts: 7, submissions: 3, strikingAccuracy: 50, takedownAccuracy: 45, status: 'Active', organization: 'PFL' },
  
  // Lightweight
  { id: 2012, name: 'Clay Collard', weightClass: 'Lightweight', wins: 24, losses: 12, knockouts: 12, submissions: 1, strikingAccuracy: 55, takedownAccuracy: 20, status: 'Active', organization: 'PFL' },
  { id: 2013, name: 'Shane Burgos', weightClass: 'Lightweight', wins: 16, losses: 4, knockouts: 5, submissions: 5, strikingAccuracy: 48, takedownAccuracy: 35, status: 'Active', organization: 'PFL' },
  { id: 2014, name: 'Alfie Davis', weightClass: 'Lightweight', wins: 16, losses: 5, knockouts: 4, submissions: 3, strikingAccuracy: 46, takedownAccuracy: 40, status: 'Active', organization: 'PFL' },
  { id: 2015, name: 'Gadzhi Rabadanov', weightClass: 'Lightweight', wins: 24, losses: 4, knockouts: 8, submissions: 6, strikingAccuracy: 49, takedownAccuracy: 48, status: 'Active', organization: 'PFL' },
  
  // Featherweight
  { id: 2016, name: 'Movlid Khaybulaev', weightClass: 'Featherweight', wins: 21, losses: 1, knockouts: 4, submissions: 8, strikingAccuracy: 48, takedownAccuracy: 55, status: 'Active', organization: 'PFL' },
  { id: 2017, name: 'Gabriel Braga', weightClass: 'Featherweight', wins: 13, losses: 1, knockouts: 6, submissions: 2, strikingAccuracy: 51, takedownAccuracy: 38, status: 'Active', organization: 'PFL' },
  
  // Bantamweight
  { id: 2018, name: 'Marcirley Alves', weightClass: 'Bantamweight', wins: 12, losses: 2, knockouts: 3, submissions: 6, strikingAccuracy: 45, takedownAccuracy: 50, status: 'Active', organization: 'PFL' },
  { id: 2019, name: 'Raush Manfio', weightClass: 'Lightweight', wins: 18, losses: 5, knockouts: 7, submissions: 2, strikingAccuracy: 49, takedownAccuracy: 35, status: 'Active', organization: 'PFL' },
  { id: 2020, name: 'Natan Schulte', weightClass: 'Lightweight', wins: 24, losses: 6, knockouts: 4, submissions: 12, strikingAccuracy: 46, takedownAccuracy: 55, status: 'Active', organization: 'PFL' },
  { id: 2021, name: 'Olivier Aubin-Mercier', weightClass: 'Lightweight', wins: 21, losses: 6, knockouts: 5, submissions: 8, strikingAccuracy: 48, takedownAccuracy: 52, status: 'Active', organization: 'PFL' },
  { id: 2022, name: 'Ray Cooper III', weightClass: 'Welterweight', wins: 25, losses: 9, knockouts: 18, submissions: 2, strikingAccuracy: 56, takedownAccuracy: 30, status: 'Active', organization: 'PFL' },
  { id: 2023, name: 'Rory MacDonald', weightClass: 'Welterweight', wins: 23, losses: 10, knockouts: 7, submissions: 9, strikingAccuracy: 50, takedownAccuracy: 48, status: 'Active', organization: 'PFL' },
  { id: 2024, name: 'Jarrah Al-Silawi', weightClass: 'Welterweight', wins: 18, losses: 5, knockouts: 9, submissions: 3, strikingAccuracy: 52, takedownAccuracy: 32, status: 'Active', organization: 'PFL' },
  { id: 2025, name: 'Bruno Cappelozza', weightClass: 'Heavyweight', wins: 15, losses: 6, knockouts: 12, submissions: 1, strikingAccuracy: 55, takedownAccuracy: 25, status: 'Active', organization: 'PFL' },
  { id: 2026, name: 'Renan Ferreira', weightClass: 'Heavyweight', wins: 12, losses: 3, knockouts: 10, submissions: 1, strikingAccuracy: 58, takedownAccuracy: 20, status: 'Active', organization: 'PFL' },
  { id: 2027, name: 'Denis Goltsov', weightClass: 'Heavyweight', wins: 32, losses: 8, knockouts: 18, submissions: 5, strikingAccuracy: 54, takedownAccuracy: 45, status: 'Active', organization: 'PFL' },
  { id: 2028, name: 'Omari Akhmedov', weightClass: 'Middleweight', wins: 24, losses: 8, knockouts: 10, submissions: 6, strikingAccuracy: 51, takedownAccuracy: 42, status: 'Active', organization: 'PFL' },
  { id: 2029, name: 'Derek Brunson', weightClass: 'Middleweight', wins: 24, losses: 9, knockouts: 12, submissions: 4, strikingAccuracy: 48, takedownAccuracy: 50, status: 'Active', organization: 'PFL' },
  { id: 2030, name: 'Marcelo Nunes', weightClass: 'Heavyweight', wins: 10, losses: 2, knockouts: 3, submissions: 6, strikingAccuracy: 45, takedownAccuracy: 60, status: 'Active', organization: 'PFL' },
  { id: 2031, name: 'Tyrell Fortune', weightClass: 'Heavyweight', wins: 12, losses: 3, knockouts: 6, submissions: 2, strikingAccuracy: 50, takedownAccuracy: 55, status: 'Active', organization: 'PFL' },
  { id: 2032, name: 'Marcin Held', weightClass: 'Lightweight', wins: 28, losses: 9, knockouts: 2, submissions: 20, strikingAccuracy: 40, takedownAccuracy: 65, status: 'Active', organization: 'PFL' },
  { id: 2033, name: 'Dakota Ditcheva', weightClass: 'Flyweight', wins: 11, losses: 0, knockouts: 7, submissions: 2, strikingAccuracy: 58, takedownAccuracy: 30, status: 'Active', organization: 'PFL' }
]

// ONE Championship fighters
const ONE_CHAMPIONSHIP_FIGHTERS = [
  // Heavyweight
  { id: 3000, name: 'Arjan Bhullar', weightClass: 'Heavyweight', wins: 12, losses: 2, knockouts: 6, submissions: 1, strikingAccuracy: 52, takedownAccuracy: 45, status: 'Active', organization: 'ONE' },
  { id: 3001, name: 'Anatoly Malykhin', weightClass: 'Heavyweight', wins: 14, losses: 0, knockouts: 10, submissions: 2, strikingAccuracy: 58, takedownAccuracy: 50, status: 'Active', organization: 'ONE' },
  { id: 3002, name: 'Marcus Almeida', weightClass: 'Heavyweight', wins: 5, losses: 1, knockouts: 0, submissions: 5, strikingAccuracy: 35, takedownAccuracy: 75, status: 'Active', organization: 'ONE' },
  
  // Light Heavyweight
  { id: 3003, name: 'Aung La N Sang', weightClass: 'Light Heavyweight', wins: 29, losses: 14, knockouts: 16, submissions: 6, strikingAccuracy: 54, takedownAccuracy: 40, status: 'Active', organization: 'ONE' },
  { id: 3004, name: 'Reinier de Ridder', weightClass: 'Light Heavyweight', wins: 16, losses: 2, knockouts: 0, submissions: 12, strikingAccuracy: 42, takedownAccuracy: 70, status: 'Active', organization: 'ONE' },
  
  // Middleweight
  { id: 3005, name: 'Vitaly Bigdash', weightClass: 'Middleweight', wins: 12, losses: 3, knockouts: 5, submissions: 4, strikingAccuracy: 50, takedownAccuracy: 48, status: 'Active', organization: 'ONE' },
  { id: 3006, name: 'Kiamrian Abbasov', weightClass: 'Middleweight', wins: 24, losses: 6, knockouts: 8, submissions: 6, strikingAccuracy: 49, takedownAccuracy: 42, status: 'Active', organization: 'ONE' },
  
  // Welterweight
  { id: 3007, name: 'Christian Lee', weightClass: 'Welterweight', wins: 17, losses: 4, knockouts: 9, submissions: 6, strikingAccuracy: 55, takedownAccuracy: 50, status: 'Active', organization: 'ONE' },
  { id: 3008, name: 'Kiamrian Abbasov', weightClass: 'Welterweight', wins: 24, losses: 6, knockouts: 8, submissions: 6, strikingAccuracy: 49, takedownAccuracy: 42, status: 'Active', organization: 'ONE' },
  { id: 3009, name: 'Zebaztian Kadestam', weightClass: 'Welterweight', wins: 15, losses: 7, knockouts: 10, submissions: 1, strikingAccuracy: 53, takedownAccuracy: 30, status: 'Active', organization: 'ONE' },
  
  // Lightweight
  { id: 3010, name: 'Ok Rae Yoon', weightClass: 'Lightweight', wins: 17, losses: 4, knockouts: 5, submissions: 2, strikingAccuracy: 48, takedownAccuracy: 38, status: 'Active', organization: 'ONE' },
  { id: 3011, name: 'Saygid Izagakhmaev', weightClass: 'Lightweight', wins: 22, losses: 3, knockouts: 4, submissions: 10, strikingAccuracy: 46, takedownAccuracy: 58, status: 'Active', organization: 'ONE' },
  { id: 3012, name: 'Halil Amir', weightClass: 'Lightweight', wins: 10, losses: 1, knockouts: 7, submissions: 1, strikingAccuracy: 56, takedownAccuracy: 35, status: 'Active', organization: 'ONE' },
  
  // Featherweight
  { id: 3013, name: 'Tang Kai', weightClass: 'Featherweight', wins: 15, losses: 3, knockouts: 8, submissions: 2, strikingAccuracy: 54, takedownAccuracy: 32, status: 'Active', organization: 'ONE' },
  { id: 3014, name: 'Thanh Le', weightClass: 'Featherweight', wins: 14, losses: 3, knockouts: 12, submissions: 1, strikingAccuracy: 57, takedownAccuracy: 25, status: 'Active', organization: 'ONE' },
  { id: 3015, name: 'Garry Tonon', weightClass: 'Featherweight', wins: 8, losses: 2, knockouts: 0, submissions: 7, strikingAccuracy: 38, takedownAccuracy: 65, status: 'Active', organization: 'ONE' },
  
  // Bantamweight
  { id: 3016, name: 'Fabricio Andrade', weightClass: 'Bantamweight', wins: 10, losses: 2, knockouts: 6, submissions: 2, strikingAccuracy: 56, takedownAccuracy: 40, status: 'Active', organization: 'ONE' },
  { id: 3017, name: 'John Lineker', weightClass: 'Bantamweight', wins: 36, losses: 10, knockouts: 18, submissions: 4, strikingAccuracy: 55, takedownAccuracy: 30, status: 'Active', organization: 'ONE' },
  { id: 3018, name: 'Stephen Loman', weightClass: 'Bantamweight', wins: 17, losses: 2, knockouts: 6, submissions: 4, strikingAccuracy: 50, takedownAccuracy: 45, status: 'Active', organization: 'ONE' },
  { id: 3019, name: 'Kwon Won Il', weightClass: 'Bantamweight', wins: 12, losses: 5, knockouts: 8, submissions: 1, strikingAccuracy: 53, takedownAccuracy: 28, status: 'Active', organization: 'ONE' },
  
  // Flyweight
  { id: 3020, name: 'Demetrious Johnson', weightClass: 'Flyweight', wins: 25, losses: 4, knockouts: 5, submissions: 8, strikingAccuracy: 57, takedownAccuracy: 68, status: 'Active', organization: 'ONE' },
  { id: 3021, name: 'Adriano Moraes', weightClass: 'Flyweight', wins: 20, losses: 5, knockouts: 3, submissions: 10, strikingAccuracy: 45, takedownAccuracy: 55, status: 'Active', organization: 'ONE' },
  { id: 3022, name: 'Kairat Akhmetov', weightClass: 'Flyweight', wins: 30, losses: 2, knockouts: 8, submissions: 5, strikingAccuracy: 49, takedownAccuracy: 52, status: 'Active', organization: 'ONE' },
  { id: 3023, name: 'Reece McLaren', weightClass: 'Flyweight', wins: 16, losses: 8, knockouts: 2, submissions: 10, strikingAccuracy: 42, takedownAccuracy: 58, status: 'Active', organization: 'ONE' },
  { id: 3024, name: 'Danny Kingad', weightClass: 'Flyweight', wins: 15, losses: 3, knockouts: 2, submissions: 3, strikingAccuracy: 46, takedownAccuracy: 48, status: 'Active', organization: 'ONE' },
  { id: 3025, name: 'Yuya Wakamatsu', weightClass: 'Flyweight', wins: 16, losses: 6, knockouts: 10, submissions: 1, strikingAccuracy: 54, takedownAccuracy: 28, status: 'Active', organization: 'ONE' },
  { id: 3026, name: 'Eko Roni Saputra', weightClass: 'Flyweight', wins: 8, losses: 2, knockouts: 1, submissions: 5, strikingAccuracy: 38, takedownAccuracy: 62, status: 'Active', organization: 'ONE' },
  { id: 3027, name: 'Tatsumitsu Wada', weightClass: 'Flyweight', wins: 24, losses: 12, knockouts: 4, submissions: 8, strikingAccuracy: 44, takedownAccuracy: 50, status: 'Active', organization: 'ONE' },
  { id: 3028, name: 'Hu Yong', weightClass: 'Flyweight', wins: 10, losses: 2, knockouts: 5, submissions: 2, strikingAccuracy: 51, takedownAccuracy: 40, status: 'Active', organization: 'ONE' },
  { id: 3029, name: 'Joshua Pacio', weightClass: 'Flyweight', wins: 21, losses: 5, knockouts: 7, submissions: 4, strikingAccuracy: 50, takedownAccuracy: 45, status: 'Active', organization: 'ONE' },
  { id: 3030, name: 'Jarred Brooks', weightClass: 'Flyweight', wins: 20, losses: 2, knockouts: 2, submissions: 9, strikingAccuracy: 42, takedownAccuracy: 68, status: 'Active', organization: 'ONE' },
  { id: 3031, name: 'Bokang Masunyane', weightClass: 'Flyweight', wins: 9, losses: 1, knockouts: 2, submissions: 4, strikingAccuracy: 45, takedownAccuracy: 58, status: 'Active', organization: 'ONE' },
  { id: 3032, name: 'Gustavo Balart', weightClass: 'Flyweight', wins: 12, losses: 5, knockouts: 1, submissions: 5, strikingAccuracy: 40, takedownAccuracy: 60, status: 'Active', organization: 'ONE' },
  { id: 3033, name: 'Mansur Malachiev', weightClass: 'Flyweight', wins: 11, losses: 1, knockouts: 2, submissions: 7, strikingAccuracy: 43, takedownAccuracy: 65, status: 'Active', organization: 'ONE' },
  { id: 3034, name: 'Shinya Aoki', weightClass: 'Lightweight', wins: 47, losses: 11, knockouts: 4, submissions: 30, strikingAccuracy: 38, takedownAccuracy: 72, status: 'Active', organization: 'ONE' },
  { id: 3035, name: 'Eduard Folayang', weightClass: 'Lightweight', wins: 22, losses: 13, knockouts: 8, submissions: 2, strikingAccuracy: 49, takedownAccuracy: 30, status: 'Active', organization: 'ONE' },
  { id: 3036, name: 'Timofey Nastyukhin', weightClass: 'Lightweight', wins: 15, losses: 7, knockouts: 11, submissions: 1, strikingAccuracy: 56, takedownAccuracy: 25, status: 'Active', organization: 'ONE' },
  { id: 3037, name: 'Amir Khan', weightClass: 'Lightweight', wins: 14, losses: 8, knockouts: 8, submissions: 2, strikingAccuracy: 52, takedownAccuracy: 28, status: 'Active', organization: 'ONE' },
  { id: 3038, name: 'Pieter Buist', weightClass: 'Lightweight', wins: 17, losses: 5, knockouts: 6, submissions: 4, strikingAccuracy: 48, takedownAccuracy: 38, status: 'Active', organization: 'ONE' },
  { id: 3039, name: 'Martin Nguyen', weightClass: 'Featherweight', wins: 15, losses: 6, knockouts: 10, submissions: 2, strikingAccuracy: 55, takedownAccuracy: 32, status: 'Active', organization: 'ONE' },
  { id: 3040, name: 'Ilya Freymanov', weightClass: 'Featherweight', wins: 12, losses: 2, knockouts: 7, submissions: 2, strikingAccuracy: 54, takedownAccuracy: 40, status: 'Active', organization: 'ONE' },
  { id: 3041, name: 'Shamil Gasanov', weightClass: 'Featherweight', wins: 14, losses: 1, knockouts: 1, submissions: 11, strikingAccuracy: 40, takedownAccuracy: 70, status: 'Active', organization: 'ONE' },
  { id: 3042, name: 'Akbar Abdullaev', weightClass: 'Featherweight', wins: 10, losses: 0, knockouts: 6, submissions: 2, strikingAccuracy: 57, takedownAccuracy: 35, status: 'Active', organization: 'ONE' },
  { id: 3043, name: 'Tye Ruotolo', weightClass: 'Welterweight', wins: 3, losses: 0, knockouts: 0, submissions: 3, strikingAccuracy: 30, takedownAccuracy: 80, status: 'Active', organization: 'ONE' },
  { id: 3044, name: 'Kiamrian Abbasov', weightClass: 'Welterweight', wins: 24, losses: 6, knockouts: 8, submissions: 6, strikingAccuracy: 49, takedownAccuracy: 42, status: 'Active', organization: 'ONE' },
  { id: 3045, name: 'Murad Ramazanov', weightClass: 'Welterweight', wins: 12, losses: 2, knockouts: 1, submissions: 8, strikingAccuracy: 41, takedownAccuracy: 65, status: 'Active', organization: 'ONE' },
  { id: 3046, name: 'Roberto Soldic', weightClass: 'Welterweight', wins: 20, losses: 4, knockouts: 17, submissions: 1, strikingAccuracy: 60, takedownAccuracy: 30, status: 'Active', organization: 'ONE' },
  { id: 3047, name: 'Ruslan Emilbek Uulu', weightClass: 'Welterweight', wins: 20, losses: 4, knockouts: 5, submissions: 8, strikingAccuracy: 47, takedownAccuracy: 55, status: 'Active', organization: 'ONE' },
  { id: 3048, name: 'Jake Peacock', weightClass: 'Bantamweight', wins: 13, losses: 1, knockouts: 8, submissions: 2, strikingAccuracy: 56, takedownAccuracy: 32, status: 'Active', organization: 'ONE' },
  { id: 3049, name: 'Artem Belakh', weightClass: 'Bantamweight', wins: 11, losses: 2, knockouts: 4, submissions: 4, strikingAccuracy: 49, takedownAccuracy: 48, status: 'Active', organization: 'ONE' }
]

// Rizin Fighting Federation fighters
const RIZIN_FIGHTERS = [
  // Light Heavyweight
  { id: 4000, name: 'Jiri Prochazka', weightClass: 'Light Heavyweight', wins: 29, losses: 4, knockouts: 25, submissions: 3, strikingAccuracy: 59, takedownAccuracy: 40, status: 'Active', organization: 'Rizin' },
  { id: 4001, name: 'Khalid Murtazaliev', weightClass: 'Light Heavyweight', wins: 16, losses: 3, knockouts: 8, submissions: 3, strikingAccuracy: 52, takedownAccuracy: 45, status: 'Active', organization: 'Rizin' },
  
  // Lightweight
  { id: 4002, name: 'Roberto de Souza', weightClass: 'Lightweight', wins: 15, losses: 2, knockouts: 1, submissions: 12, strikingAccuracy: 40, takedownAccuracy: 70, status: 'Active', organization: 'Rizin' },
  { id: 4003, name: 'Tofiq Musayev', weightClass: 'Lightweight', wins: 20, losses: 5, knockouts: 12, submissions: 2, strikingAccuracy: 54, takedownAccuracy: 35, status: 'Active', organization: 'Rizin' },
  { id: 4004, name: 'Johnny Case', weightClass: 'Lightweight', wins: 28, losses: 7, knockouts: 15, submissions: 4, strikingAccuracy: 51, takedownAccuracy: 38, status: 'Active', organization: 'Rizin' },
  
  // Featherweight
  { id: 4005, name: 'Kleber Koike Erbst', weightClass: 'Featherweight', wins: 32, losses: 6, knockouts: 4, submissions: 24, strikingAccuracy: 43, takedownAccuracy: 65, status: 'Active', organization: 'Rizin' },
  { id: 4006, name: 'Yutaka Saito', weightClass: 'Featherweight', wins: 22, losses: 6, knockouts: 8, submissions: 3, strikingAccuracy: 50, takedownAccuracy: 40, status: 'Active', organization: 'Rizin' },
  { id: 4007, name: 'Vugar Karamov', weightClass: 'Featherweight', wins: 18, losses: 5, knockouts: 5, submissions: 6, strikingAccuracy: 48, takedownAccuracy: 50, status: 'Active', organization: 'Rizin' },
  
  // Bantamweight
  { id: 4008, name: 'Kai Asakura', weightClass: 'Bantamweight', wins: 20, losses: 4, knockouts: 10, submissions: 2, strikingAccuracy: 55, takedownAccuracy: 35, status: 'Active', organization: 'Rizin' },
  { id: 4009, name: 'Hiromasa Ougikubo', weightClass: 'Bantamweight', wins: 27, losses: 6, knockouts: 3, submissions: 8, strikingAccuracy: 44, takedownAccuracy: 55, status: 'Active', organization: 'Rizin' },
  { id: 4010, name: 'Yuki Motoya', weightClass: 'Bantamweight', wins: 33, losses: 12, knockouts: 8, submissions: 10, strikingAccuracy: 47, takedownAccuracy: 48, status: 'Active', organization: 'Rizin' },
  
  // Flyweight
  { id: 4011, name: 'Kyoji Horiguchi', weightClass: 'Flyweight', wins: 31, losses: 5, knockouts: 15, submissions: 3, strikingAccuracy: 58, takedownAccuracy: 45, status: 'Active', organization: 'Rizin' },
  { id: 4012, name: 'Makoto Shinryu', weightClass: 'Flyweight', wins: 16, losses: 2, knockouts: 4, submissions: 8, strikingAccuracy: 46, takedownAccuracy: 52, status: 'Active', organization: 'Rizin' },
  { id: 4013, name: 'Jose Torres', weightClass: 'Flyweight', wins: 11, losses: 2, knockouts: 3, submissions: 4, strikingAccuracy: 48, takedownAccuracy: 50, status: 'Active', organization: 'Rizin' },
  { id: 4014, name: 'Yamato Fujita', weightClass: 'Flyweight', wins: 10, losses: 1, knockouts: 5, submissions: 2, strikingAccuracy: 51, takedownAccuracy: 38, status: 'Active', organization: 'Rizin' },
  { id: 4015, name: 'Hiromasa Ougikubo', weightClass: 'Flyweight', wins: 27, losses: 6, knockouts: 3, submissions: 8, strikingAccuracy: 44, takedownAccuracy: 55, status: 'Active', organization: 'Rizin' },
  { id: 4016, name: 'Shintaro Ishiwatari', weightClass: 'Bantamweight', wins: 28, losses: 9, knockouts: 12, submissions: 4, strikingAccuracy: 52, takedownAccuracy: 35, status: 'Active', organization: 'Rizin' },
  { id: 4017, name: 'Takeshi Kasugai', weightClass: 'Bantamweight', wins: 20, losses: 5, knockouts: 8, submissions: 3, strikingAccuracy: 50, takedownAccuracy: 40, status: 'Active', organization: 'Rizin' },
  { id: 4018, name: 'Kenta Takizawa', weightClass: 'Bantamweight', wins: 14, losses: 3, knockouts: 6, submissions: 2, strikingAccuracy: 51, takedownAccuracy: 38, status: 'Active', organization: 'Rizin' },
  { id: 4019, name: 'Kazumasa Majima', weightClass: 'Bantamweight', wins: 16, losses: 3, knockouts: 5, submissions: 5, strikingAccuracy: 48, takedownAccuracy: 45, status: 'Active', organization: 'Rizin' },
  { id: 4020, name: 'Yuki Motoya', weightClass: 'Bantamweight', wins: 33, losses: 12, knockouts: 8, submissions: 10, strikingAccuracy: 47, takedownAccuracy: 48, status: 'Active', organization: 'Rizin' },
  { id: 4021, name: 'Naoki Inoue', weightClass: 'Bantamweight', wins: 17, losses: 4, knockouts: 3, submissions: 8, strikingAccuracy: 44, takedownAccuracy: 52, status: 'Active', organization: 'Rizin' },
  { id: 4022, name: 'Tatsuki Saomoto', weightClass: 'Flyweight', wins: 20, losses: 3, knockouts: 4, submissions: 9, strikingAccuracy: 45, takedownAccuracy: 55, status: 'Active', organization: 'Rizin' },
  { id: 4023, name: 'Shinobu Ota', weightClass: 'Flyweight', wins: 4, losses: 1, knockouts: 0, submissions: 3, strikingAccuracy: 35, takedownAccuracy: 75, status: 'Active', organization: 'Rizin' },
  { id: 4024, name: 'Yuki Ito', weightClass: 'Flyweight', wins: 12, losses: 4, knockouts: 3, submissions: 5, strikingAccuracy: 43, takedownAccuracy: 50, status: 'Active', organization: 'Rizin' },
  { id: 4025, name: 'Kazuki Tokudome', weightClass: 'Lightweight', wins: 20, losses: 12, knockouts: 8, submissions: 4, strikingAccuracy: 49, takedownAccuracy: 42, status: 'Active', organization: 'Rizin' },
  { id: 4026, name: 'Koji Takeda', weightClass: 'Lightweight', wins: 15, losses: 3, knockouts: 2, submissions: 8, strikingAccuracy: 41, takedownAccuracy: 60, status: 'Active', organization: 'Rizin' },
  { id: 4027, name: 'Yusuke Yachi', weightClass: 'Lightweight', wins: 23, losses: 12, knockouts: 10, submissions: 3, strikingAccuracy: 52, takedownAccuracy: 35, status: 'Active', organization: 'Rizin' },
  { id: 4028, name: 'Luiz Gustavo', weightClass: 'Lightweight', wins: 12, losses: 2, knockouts: 5, submissions: 4, strikingAccuracy: 50, takedownAccuracy: 45, status: 'Active', organization: 'Rizin' },
  { id: 4029, name: 'Satoru Kitaoka', weightClass: 'Lightweight', wins: 35, losses: 20, knockouts: 2, submissions: 25, strikingAccuracy: 38, takedownAccuracy: 68, status: 'Active', organization: 'Rizin' },
  { id: 4030, name: 'Mikuru Asakura', weightClass: 'Featherweight', wins: 16, losses: 4, knockouts: 8, submissions: 2, strikingAccuracy: 54, takedownAccuracy: 32, status: 'Active', organization: 'Rizin' },
  { id: 4031, name: 'Kai Asakura', weightClass: 'Featherweight', wins: 20, losses: 4, knockouts: 10, submissions: 2, strikingAccuracy: 55, takedownAccuracy: 35, status: 'Active', organization: 'Rizin' },
  { id: 4032, name: 'Yutaka Saito', weightClass: 'Featherweight', wins: 22, losses: 6, knockouts: 8, submissions: 3, strikingAccuracy: 50, takedownAccuracy: 40, status: 'Active', organization: 'Rizin' },
  { id: 4033, name: 'Kota Miura', weightClass: 'Featherweight', wins: 1, losses: 1, knockouts: 1, submissions: 0, strikingAccuracy: 55, takedownAccuracy: 20, status: 'Active', organization: 'Rizin' },
  { id: 4034, name: 'Kenta Takashi', weightClass: 'Featherweight', wins: 14, losses: 5, knockouts: 6, submissions: 2, strikingAccuracy: 51, takedownAccuracy: 38, status: 'Active', organization: 'Rizin' },
  { id: 4035, name: 'Tatsuya Kawajiri', weightClass: 'Featherweight', wins: 37, losses: 14, knockouts: 4, submissions: 18, strikingAccuracy: 42, takedownAccuracy: 65, status: 'Active', organization: 'Rizin' },
  { id: 4036, name: 'Takanori Gomi', weightClass: 'Lightweight', wins: 36, losses: 14, knockouts: 13, submissions: 6, strikingAccuracy: 53, takedownAccuracy: 40, status: 'Active', organization: 'Rizin' },
  { id: 4037, name: 'Tatsuya Saito', weightClass: 'Light Heavyweight', wins: 14, losses: 3, knockouts: 6, submissions: 3, strikingAccuracy: 50, takedownAccuracy: 45, status: 'Active', organization: 'Rizin' },
  { id: 4038, name: 'Jiri Prochazka', weightClass: 'Light Heavyweight', wins: 29, losses: 4, knockouts: 25, submissions: 3, strikingAccuracy: 59, takedownAccuracy: 40, status: 'Active', organization: 'Rizin' },
  { id: 4039, name: 'Karl Albrektsson', weightClass: 'Light Heavyweight', wins: 13, losses: 4, knockouts: 5, submissions: 3, strikingAccuracy: 48, takedownAccuracy: 42, status: 'Active', organization: 'Rizin' },
  { id: 4040, name: 'Simon Biyong', weightClass: 'Light Heavyweight', wins: 9, losses: 3, knockouts: 4, submissions: 2, strikingAccuracy: 50, takedownAccuracy: 38, status: 'Active', organization: 'Rizin' }
]

/**
 * Scrape all current active UFC fighters from ufcstats.com
 */
async function scrapeCurrentUfcFighters() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const allFighters = []
  const seen = new Set()
  let totalProcessed = 0

  console.log('🔍 Scraping current active UFC fighters from ufcstats.com...')

  for (const letter of letters) {
    try {
      const url = `${UFC_STATS_BASE}?char=${letter}&page=all`
      console.log(`  Fetching letter: ${letter.toUpperCase()}`)
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (!res.ok) {
        console.error(`    ❌ Failed: ${res.status}`)
        continue
      }
      
      const html = await res.text()
      const $ = cheerio.load(html)

      let letterCount = 0

      // Get all fighter rows (excluding header)
      $('.b-statistics__table-row:not(.b-statistics__table-row_type_head)').each((_, row) => {
        const $row = $(row)
        
        // Get name from first column link
        const nameLink = $row.find('td:nth-child(1) a')
        const nameRaw = nameLink.text().trim()
        if (!nameRaw) return

        const href = nameLink.attr('href') || ''
        const uniqueKey = `${nameRaw.toLowerCase()}-${href}`
        if (seen.has(uniqueKey)) return
        seen.add(uniqueKey)

        // Extract weight class from column 2
        let weightClassRaw = $row.find('td:nth-child(2)').text().trim()
        
        // Extract record from column 4 (format: W-L-D)
        let recordRaw = $row.find('td:nth-child(4)').text().trim()
        
        // If not found, try alternative selectors
        if (!weightClassRaw) {
          const cells = $row.find('td')
          cells.each((index, cell) => {
            const text = $(cell).text().trim()
            if (text.toLowerCase().includes('weight') && !weightClassRaw) {
              weightClassRaw = text
            }
            if (text.match(/^\d+-\d+-\d+$/) && !recordRaw) {
              recordRaw = text
            }
          })
        }

        const name = normalizeName(nameRaw)
        const weightClass = normalizeWeightClass(weightClassRaw)
        const { wins, losses } = parseRecord(recordRaw)

        // Skip if weight class is unknown (likely not a current active fighter)
        if (weightClass === 'Unknown') {
          return
        }

        const fighter = {
          id: allFighters.length + 1,
          name,
          weightClass,
          wins,
          losses,
          knockouts: 0, // Default values - can be enhanced later
          submissions: 0,
          strikingAccuracy: 50,
          takedownAccuracy: 50,
          imageUrl: KNOWN_FIGHTER_IMAGES[name] || null,
          status: 'Active',
          organization: 'UFC'
        }

        allFighters.push(fighter)
        letterCount++
      })
      
      totalProcessed += letterCount
      console.log(`    ✅ Found ${letterCount} fighters (Total: ${totalProcessed})`)
      
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 150))
      
    } catch (err) {
      console.error(`    ❌ Error processing ${letter}:`, err.message)
      continue
    }
  }

  // Group by weight class for summary
  const byWeightClass = {}
  allFighters.forEach(f => {
    byWeightClass[f.weightClass] = (byWeightClass[f.weightClass] || 0) + 1
  })

  console.log(`\n✅ Scraping complete! Found ${allFighters.length} current active fighters`)
  console.log('\n📊 Fighters by weight class:')
  Object.entries(byWeightClass)
    .sort((a, b) => b[1] - a[1])
    .forEach(([wc, count]) => {
      console.log(`   ${wc}: ${count}`)
    })

  return allFighters
}

/**
 * Get all fighters (scraped + legendary)
 */
async function getAllFighters() {
  const now = Date.now()
  
  // Use cache if available and fresh
  if (fightersCache && (now - lastFetched < CACHE_TTL)) {
    return fightersCache
  }

  // Scrape current fighters (with error handling)
  let currentFighters = []
  try {
    currentFighters = await scrapeCurrentUfcFighters()
    if (currentFighters.length === 0) {
      console.warn('⚠️  Scraping returned 0 fighters, using fallback data')
    }
  } catch (err) {
    console.error('❌ Error scraping UFC fighters:', err.message)
    console.log('Using fallback: Legendary + PFL + ONE + Rizin fighters only')
  }
  
  // Combine all fighters: UFC current + Legendary + PFL + ONE + Rizin
  const allFighters = [
    ...currentFighters,
    ...LEGENDARY_FIGHTERS.map(legend => ({
      ...legend,
      imageUrl: KNOWN_FIGHTER_IMAGES[legend.name] || null
    })),
    ...PFL_FIGHTERS,
    ...ONE_CHAMPIONSHIP_FIGHTERS,
    ...RIZIN_FIGHTERS
  ]
  
  // Ensure we always have at least some fighters
  if (allFighters.length === 0) {
    console.error('❌ No fighters available! This should not happen.')
    // Return at least legendary fighters as absolute fallback
    return LEGENDARY_FIGHTERS.map(legend => ({
      ...legend,
      imageUrl: KNOWN_FIGHTER_IMAGES[legend.name] || null
    }))
  }

  // Cache the results
  fightersCache = allFighters
  lastFetched = now

  // Summary by organization
  const byOrg = {}
  allFighters.forEach(f => {
    const org = f.organization || 'UFC'
    byOrg[org] = (byOrg[org] || 0) + 1
  })

  console.log(`\n📦 Total fighters: ${allFighters.length}`)
  console.log('📊 By organization:')
  Object.entries(byOrg).forEach(([org, count]) => {
    console.log(`   ${org}: ${count}`)
  })
  
  return allFighters
}

app.get('/api/fighters', async (_req, res) => {
  try {
    const fighters = await getAllFighters()
    res.json({ fighters })
  } catch (err) {
    console.error('❌ Error fetching fighters:', err)
    res.status(500).json({ error: 'Failed to fetch fighters' })
  }
})

app.get('/api/fighter/:name', async (req, res) => {
  try {
    const fighterName = decodeURIComponent(req.params.name)
    const fighters = await getAllFighters()
    const fighter = fighters.find(f => 
      f.name.toLowerCase() === fighterName.toLowerCase()
    )
    
    if (!fighter) {
      return res.status(404).json({ error: 'Fighter not found' })
    }
    
    res.json({ fighter })
  } catch (err) {
    console.error('Error fetching fighter details:', err)
    res.status(500).json({ error: 'Failed to fetch fighter details' })
  }
})

// Image proxy endpoint
app.get('/api/fighter-image', async (req, res) => {
  const imageUrl = req.query.url
  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing image URL' })
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()
    
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.send(Buffer.from(buffer))
  } catch (err) {
    console.error('Error proxying image:', err)
    res.status(500).json({ error: 'Failed to proxy image' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Fighter API server running on http://localhost:${PORT}`)
  console.log(`📡 Ready to serve:`)
  console.log(`   - Current UFC fighters (scraped from ufcstats.com)`)
  console.log(`   - ${LEGENDARY_FIGHTERS.length} Legendary fighters`)
  console.log(`   - ${PFL_FIGHTERS.length} PFL fighters`)
  console.log(`   - ${ONE_CHAMPIONSHIP_FIGHTERS.length} ONE Championship fighters`)
  console.log(`   - ${RIZIN_FIGHTERS.length} Rizin fighters`)
})
