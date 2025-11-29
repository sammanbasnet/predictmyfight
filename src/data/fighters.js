// Current UFC fighters database organized by weight class
export const WEIGHT_CLASSES = [
  'Heavyweight',
  'Light Heavyweight',
  'Middleweight',
  'Welterweight',
  'Lightweight',
  'Featherweight',
  'Bantamweight',
  'Flyweight'
]

export const UFC_FIGHTERS = [
  // Heavyweight
  {
    id: 1,
    name: 'Jon Jones',
    weightClass: 'Heavyweight',
    wins: 27,
    losses: 1,
    knockouts: 10,
    submissions: 6,
    strikingAccuracy: 58,
    takedownAccuracy: 34,
    image: '🥊'
  },
  {
    id: 2,
    name: 'Tom Aspinall',
    weightClass: 'Heavyweight',
    wins: 14,
    losses: 3,
    knockouts: 11,
    submissions: 2,
    strikingAccuracy: 62,
    takedownAccuracy: 50,
    image: '🥊'
  },
  {
    id: 3,
    name: 'Curtis Blaydes',
    weightClass: 'Heavyweight',
    wins: 18,
    losses: 4,
    knockouts: 12,
    submissions: 0,
    strikingAccuracy: 52,
    takedownAccuracy: 45,
    image: '🥊'
  },
  {
    id: 4,
    name: 'Sergei Pavlovich',
    weightClass: 'Heavyweight',
    wins: 18,
    losses: 2,
    knockouts: 15,
    submissions: 0,
    strikingAccuracy: 55,
    takedownAccuracy: 0,
    image: '🥊'
  },
  
  // Light Heavyweight
  {
    id: 5,
    name: 'Alex Pereira',
    weightClass: 'Light Heavyweight',
    wins: 10,
    losses: 2,
    knockouts: 7,
    submissions: 0,
    strikingAccuracy: 61,
    takedownAccuracy: 0,
    image: '🥋'
  },
  {
    id: 6,
    name: 'Jamahal Hill',
    weightClass: 'Light Heavyweight',
    wins: 12,
    losses: 1,
    knockouts: 7,
    submissions: 0,
    strikingAccuracy: 54,
    takedownAccuracy: 25,
    image: '🥋'
  },
  {
    id: 7,
    name: 'Jiri Prochazka',
    weightClass: 'Light Heavyweight',
    wins: 29,
    losses: 4,
    knockouts: 25,
    submissions: 3,
    strikingAccuracy: 59,
    takedownAccuracy: 40,
    image: '🥋'
  },
  {
    id: 8,
    name: 'Magomed Ankalaev',
    weightClass: 'Light Heavyweight',
    wins: 18,
    losses: 1,
    knockouts: 10,
    submissions: 0,
    strikingAccuracy: 57,
    takedownAccuracy: 38,
    image: '🥋'
  },
  
  // Middleweight
  {
    id: 9,
    name: 'Israel Adesanya',
    weightClass: 'Middleweight',
    wins: 24,
    losses: 3,
    knockouts: 16,
    submissions: 0,
    strikingAccuracy: 50,
    takedownAccuracy: 80,
    image: '👊'
  },
  {
    id: 10,
    name: 'Dricus Du Plessis',
    weightClass: 'Middleweight',
    wins: 21,
    losses: 2,
    knockouts: 9,
    submissions: 10,
    strikingAccuracy: 49,
    takedownAccuracy: 42,
    image: '👊'
  },
  {
    id: 11,
    name: 'Sean Strickland',
    weightClass: 'Middleweight',
    wins: 28,
    losses: 6,
    knockouts: 11,
    submissions: 4,
    strikingAccuracy: 42,
    takedownAccuracy: 65,
    image: '👊'
  },
  {
    id: 12,
    name: 'Robert Whittaker',
    weightClass: 'Middleweight',
    wins: 25,
    losses: 7,
    knockouts: 9,
    submissions: 5,
    strikingAccuracy: 44,
    takedownAccuracy: 38,
    image: '👊'
  },
  
  // Welterweight
  {
    id: 13,
    name: 'Leon Edwards',
    weightClass: 'Welterweight',
    wins: 22,
    losses: 3,
    knockouts: 7,
    submissions: 3,
    strikingAccuracy: 49,
    takedownAccuracy: 70,
    image: '🥊'
  },
  {
    id: 14,
    name: 'Kamaru Usman',
    weightClass: 'Welterweight',
    wins: 20,
    losses: 4,
    knockouts: 9,
    submissions: 1,
    strikingAccuracy: 52,
    takedownAccuracy: 45,
    image: '🥊'
  },
  {
    id: 15,
    name: 'Shavkat Rakhmonov',
    weightClass: 'Welterweight',
    wins: 18,
    losses: 0,
    knockouts: 8,
    submissions: 10,
    strikingAccuracy: 48,
    takedownAccuracy: 50,
    image: '🥊'
  },
  {
    id: 16,
    name: 'Belal Muhammad',
    weightClass: 'Welterweight',
    wins: 23,
    losses: 3,
    knockouts: 5,
    submissions: 1,
    strikingAccuracy: 41,
    takedownAccuracy: 33,
    image: '🥊'
  },
  
  // Lightweight
  {
    id: 17,
    name: 'Islam Makhachev',
    weightClass: 'Lightweight',
    wins: 25,
    losses: 1,
    knockouts: 5,
    submissions: 11,
    strikingAccuracy: 59,
    takedownAccuracy: 65,
    image: '🥋'
  },
  {
    id: 18,
    name: 'Charles Oliveira',
    weightClass: 'Lightweight',
    wins: 34,
    losses: 9,
    knockouts: 9,
    submissions: 20,
    strikingAccuracy: 53,
    takedownAccuracy: 35,
    image: '🥋'
  },
  {
    id: 19,
    name: 'Justin Gaethje',
    weightClass: 'Lightweight',
    wins: 25,
    losses: 4,
    knockouts: 20,
    submissions: 1,
    strikingAccuracy: 60,
    takedownAccuracy: 0,
    image: '🥋'
  },
  {
    id: 20,
    name: 'Arman Tsarukyan',
    weightClass: 'Lightweight',
    wins: 21,
    losses: 3,
    knockouts: 9,
    submissions: 5,
    strikingAccuracy: 51,
    takedownAccuracy: 48,
    image: '🥋'
  },
  
  // Featherweight
  {
    id: 21,
    name: 'Alexander Volkanovski',
    weightClass: 'Featherweight',
    wins: 26,
    losses: 3,
    knockouts: 13,
    submissions: 3,
    strikingAccuracy: 57,
    takedownAccuracy: 34,
    image: '👊'
  },
  {
    id: 22,
    name: 'Ilia Topuria',
    weightClass: 'Featherweight',
    wins: 15,
    losses: 0,
    knockouts: 5,
    submissions: 8,
    strikingAccuracy: 49,
    takedownAccuracy: 42,
    image: '👊'
  },
  {
    id: 23,
    name: 'Max Holloway',
    weightClass: 'Featherweight',
    wins: 26,
    losses: 7,
    knockouts: 11,
    submissions: 2,
    strikingAccuracy: 48,
    takedownAccuracy: 83,
    image: '👊'
  },
  {
    id: 24,
    name: 'Yair Rodriguez',
    weightClass: 'Featherweight',
    wins: 16,
    losses: 4,
    knockouts: 11,
    submissions: 3,
    strikingAccuracy: 50,
    takedownAccuracy: 50,
    image: '👊'
  },
  
  // Bantamweight
  {
    id: 25,
    name: 'Sean O\'Malley',
    weightClass: 'Bantamweight',
    wins: 18,
    losses: 1,
    knockouts: 12,
    submissions: 1,
    strikingAccuracy: 61,
    takedownAccuracy: 0,
    image: '🥊'
  },
  {
    id: 26,
    name: 'Merab Dvalishvili',
    weightClass: 'Bantamweight',
    wins: 17,
    losses: 4,
    knockouts: 3,
    submissions: 1,
    strikingAccuracy: 38,
    takedownAccuracy: 48,
    image: '🥊'
  },
  {
    id: 27,
    name: 'Aljamain Sterling',
    weightClass: 'Bantamweight',
    wins: 23,
    losses: 4,
    knockouts: 3,
    submissions: 8,
    strikingAccuracy: 42,
    takedownAccuracy: 40,
    image: '🥊'
  },
  {
    id: 28,
    name: 'Cory Sandhagen',
    weightClass: 'Bantamweight',
    wins: 17,
    losses: 4,
    knockouts: 7,
    submissions: 3,
    strikingAccuracy: 52,
    takedownAccuracy: 25,
    image: '🥊'
  },
  
  // Flyweight
  {
    id: 29,
    name: 'Alexandre Pantoja',
    weightClass: 'Flyweight',
    wins: 27,
    losses: 5,
    knockouts: 8,
    submissions: 10,
    strikingAccuracy: 47,
    takedownAccuracy: 35,
    image: '🥋'
  },
  {
    id: 30,
    name: 'Brandon Royval',
    weightClass: 'Flyweight',
    wins: 15,
    losses: 6,
    knockouts: 4,
    submissions: 9,
    strikingAccuracy: 43,
    takedownAccuracy: 28,
    image: '🥋'
  },
  {
    id: 31,
    name: 'Brandon Moreno',
    weightClass: 'Flyweight',
    wins: 21,
    losses: 7,
    knockouts: 5,
    submissions: 11,
    strikingAccuracy: 45,
    takedownAccuracy: 32,
    image: '🥋'
  },
  {
    id: 32,
    name: 'Amir Albazi',
    weightClass: 'Flyweight',
    wins: 17,
    losses: 1,
    knockouts: 5,
    submissions: 4,
    strikingAccuracy: 44,
    takedownAccuracy: 38,
    image: '🥋'
  }
]

// Export for backward compatibility
export const SAMPLE_FIGHTERS = UFC_FIGHTERS
