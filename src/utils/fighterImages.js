/**
 * Get fighter image URL from external source
 * Uses actual fighter photos from UFC with CORS proxy
 * 
 * @param {string} fighterName - Fighter's full name
 * @returns {string} - Fighter image URL
 */
export const getFighterImageUrl = (fighterName) => {
  // Map of fighter names to their UFC image URLs
  const fighterImageMap = {
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
    'Khalil Rountree': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/ROUNTREE_KHALIL_L_12-16-23.png',
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
    'Movsar Evloev': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-11/EVLOEV_MOVSAR_L_11-11-23.png',
    'Sean O\'Malley': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/OMALLEY_SEAN_L_08-19-23.png',
    'Merab Dvalishvili': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-02/DVALISHVILI_MERAB_L_02-17-24.png',
    'Aljamain Sterling': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/STERLING_ALJAMAIN_L_08-19-23.png',
    'Cory Sandhagen': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/SANDHAGEN_CORY_L_08-05-23.png',
    'Petr Yan': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-03/YAN_PETR_L_03-11-23.png',
    'Marlon Vera': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-08/VERA_MARLON_L_08-19-23.png',
    'Alexandre Pantoja': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/PANTOJA_ALEXANDRE_L_07-08-23.png',
    'Brandon Royval': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-12/ROYVAL_BRANDON_L_12-16-23.png',
    'Brandon Moreno': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-07/MORENO_BRANDON_L_07-08-23.png',
    'Amir Albazi': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-06/ALBAZI_AMIR_L_06-03-23.png',
    'Kai Kara-France': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-09/KARA-FRANCE_KAI_L_09-09-23.png',
    'Manel Kape': 'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-09/KAPE_MANEL_L_09-09-23.png'
  }

  if (fighterImageMap[fighterName]) {
    // Use CORS proxy to bypass restrictions and get actual UFC photos
    const originalUrl = fighterImageMap[fighterName]
    // Using corsproxy.io as a reliable CORS proxy for images
    return `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`
  }
  
  // Fallback to avatar service if fighter not found
  const encodedName = encodeURIComponent(fighterName)
  return `https://ui-avatars.com/api/?name=${encodedName}&size=200&background=0a0a0a&color=ffd700&bold=true&font-size=0.4&length=2&uppercase=true`
}

/**
 * Get fighter initials for fallback
 * @param {string} fighterName - Fighter's full name
 * @returns {string} - Initials (e.g., "JJ" for "Jon Jones")
 */
export const getFighterInitials = (fighterName) => {
  const names = fighterName.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return fighterName.substring(0, 2).toUpperCase()
}
