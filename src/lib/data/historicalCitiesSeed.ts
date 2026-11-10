/**
 * Historical Cities & Imperial Capitals Dataset
 * Anchored to verified geographical coordinates, historical periodizations,
 * and primary caliphal sources (Le Strange, Kennedy, Pitcher).
 */

export interface HistoricalCity {
  id: string;
  name: string;
  historicalNames: {
    arabic?: string;
    persian?: string;
    greek_latin?: string;
  };
  coordinates: [number, number]; // [lng, lat] GeoJSON format
  foundingYear?: number;
  region: string;
  significance: string;
  capitalEras: {
    polityId: string;
    fromYear: number;
    toYear: number;
    capitalTitle: string;
  }[];
  rulingPowers: {
    polityId: string;
    fromYear: number;
    toYear: number;
  }[];
}

export const HISTORICAL_CITIES: HistoricalCity[] = [
  {
    id: "city_medina",
    name: "Medina",
    historicalNames: {
      arabic: "المدينة المنورة / يثرب",
      greek_latin: "Yathrib",
    },
    coordinates: [39.6122, 24.4672],
    foundingYear: 622,
    region: "Hijaz, Arabian Peninsula",
    significance: "First capital of the Islamic state under the Prophet Muhammad and the early Rashidun Caliphs until 656 CE.",
    capitalEras: [
      {
        polityId: "pol_rashidun",
        fromYear: 622,
        toYear: 656,
        capitalTitle: "Primary Imperial Capital of the Early Caliphate",
      },
    ],
    rulingPowers: [
      { polityId: "pol_rashidun", fromYear: 622, toYear: 661 },
      { polityId: "pol_umayyad", fromYear: 661, toYear: 750 },
      { polityId: "pol_abbasid_early", fromYear: 750, toYear: 969 },
      { polityId: "pol_fatimid", fromYear: 969, toYear: 1171 },
      { polityId: "pol_mamluk", fromYear: 1250, toYear: 1517 },
      { polityId: "pol_ottoman", fromYear: 1517, toYear: 1919 },
    ],
  },
  {
    id: "city_kufa",
    name: "Kufa",
    historicalNames: {
      arabic: "الكوفة",
    },
    coordinates: [44.4011, 32.0298],
    foundingYear: 638,
    region: "Lower Mesopotamia, Iraq",
    significance: "Early garrison settlement (amsar) founded by Sa'd ibn Abi Waqqas; caliphal capital of Ali ibn Abi Talib (656–661 CE).",
    capitalEras: [
      {
        polityId: "pol_rashidun",
        fromYear: 656,
        toYear: 661,
        capitalTitle: "Caliphal Residence & Capital under Ali ibn Abi Talib",
      },
    ],
    rulingPowers: [
      { polityId: "pol_rashidun", fromYear: 638, toYear: 661 },
      { polityId: "pol_umayyad", fromYear: 661, toYear: 750 },
      { polityId: "pol_abbasid_early", fromYear: 750, toYear: 945 },
      { polityId: "pol_buyid", fromYear: 945, toYear: 1055 },
    ],
  },
  {
    id: "city_damascus",
    name: "Damascus",
    historicalNames: {
      arabic: "دمشق الشام",
      greek_latin: "Damascus",
    },
    coordinates: [36.2974, 33.5138],
    foundingYear: 635,
    region: "Bilad al-Sham, Levant",
    significance: "Imperial capital of the Umayyad Caliphate (661–750 CE) and later primary Syrian stronghold of the Zengids and Ayyubids under Saladin.",
    capitalEras: [
      {
        polityId: "pol_umayyad",
        fromYear: 661,
        toYear: 750,
        capitalTitle: "Imperial Capital of the Global Umayyad Caliphate",
      },
      {
        polityId: "pol_zengid",
        fromYear: 1154,
        toYear: 1174,
        capitalTitle: "Syrian Seat of Nur al-Din Zengi",
      },
      {
        polityId: "pol_ayyubid",
        fromYear: 1174,
        toYear: 1193,
        capitalTitle: "Primary Residence and Military Capital of Saladin",
      },
    ],
    rulingPowers: [
      { polityId: "pol_rashidun", fromYear: 635, toYear: 661 },
      { polityId: "pol_umayyad", fromYear: 661, toYear: 750 },
      { polityId: "pol_abbasid_early", fromYear: 750, toYear: 969 },
      { polityId: "pol_fatimid", fromYear: 969, toYear: 1076 },
      { polityId: "pol_seljuk", fromYear: 1076, toYear: 1154 },
      { polityId: "pol_zengid", fromYear: 1154, toYear: 1174 },
      { polityId: "pol_ayyubid", fromYear: 1174, toYear: 1260 },
      { polityId: "pol_mamluk", fromYear: 1260, toYear: 1516 },
      { polityId: "pol_ottoman", fromYear: 1516, toYear: 1918 },
    ],
  },
  {
    id: "city_baghdad",
    name: "Baghdad",
    historicalNames: {
      arabic: "بغداد / مدينة السلام",
      persian: "بغداد",
    },
    coordinates: [44.3615, 33.3152],
    foundingYear: 762,
    region: "Mesopotamia, Iraq",
    significance: "The Round City of Peace, imperial capital of the Abbasid Caliphate and global capital of the Islamic Golden Age.",
    capitalEras: [
      {
        polityId: "pol_abbasid_early",
        fromYear: 762,
        toYear: 836,
        capitalTitle: "Imperial Capital of the Early Abbasid Caliphate",
      },
      {
        polityId: "pol_abbasid_early",
        fromYear: 892,
        toYear: 1258,
        capitalTitle: "Restored Abbasid Imperial Capital",
      },
      {
        polityId: "pol_buyid",
        fromYear: 945,
        toYear: 1055,
        capitalTitle: "Amir al-Umara Seat under the Buyid Confederation",
      },
    ],
    rulingPowers: [
      { polityId: "pol_abbasid_early", fromYear: 762, toYear: 1258 },
      { polityId: "pol_buyid", fromYear: 945, toYear: 1055 },
      { polityId: "pol_seljuk", fromYear: 1055, toYear: 1194 },
      { polityId: "pol_mongol", fromYear: 1258, toYear: 1335 },
      { polityId: "pol_timurid", fromYear: 1393, toYear: 1405 },
      { polityId: "pol_safavid", fromYear: 1508, toYear: 1534 },
      { polityId: "pol_ottoman", fromYear: 1534, toYear: 1917 },
    ],
  },
  {
    id: "city_samarra",
    name: "Samarra",
    historicalNames: {
      arabic: "سامراء / سر من رأى",
    },
    coordinates: [43.8761, 34.1983],
    foundingYear: 836,
    region: "Mesopotamia, Iraq",
    significance: "Monumental palatial capital built by Caliph al-Mu'tasim to house imperial Turkic regiments along the Tigris.",
    capitalEras: [
      {
        polityId: "pol_abbasid_early",
        fromYear: 836,
        toYear: 892,
        capitalTitle: "Imperial Abbasid Caliphal Capital (836–892 CE)",
      },
    ],
    rulingPowers: [
      { polityId: "pol_abbasid_early", fromYear: 836, toYear: 1258 },
      { polityId: "pol_seljuk", fromYear: 1055, toYear: 1194 },
    ],
  },
  {
    id: "city_cordoba",
    name: "Córdoba",
    historicalNames: {
      arabic: "قرطبة",
      greek_latin: "Corduba",
    },
    coordinates: [-4.7794, 37.8882],
    foundingYear: 711,
    region: "Andalusia, Iberian Peninsula",
    significance: "Capital of the Umayyad Emirate and Caliphate of al-Andalus, Europe's foremost cultural and intellectual metropolis in the 10th century.",
    capitalEras: [
      {
        polityId: "pol_cordoba_emirate",
        fromYear: 756,
        toYear: 929,
        capitalTitle: "Capital of the Independent Umayyad Emirate of Córdoba",
      },
      {
        polityId: "pol_cordoba_caliphate",
        fromYear: 929,
        toYear: 1031,
        capitalTitle: "Imperial Capital of the Caliphate of Córdoba",
      },
    ],
    rulingPowers: [
      { polityId: "pol_umayyad", fromYear: 711, toYear: 756 },
      { polityId: "pol_cordoba_emirate", fromYear: 756, toYear: 929 },
      { polityId: "pol_cordoba_caliphate", fromYear: 929, toYear: 1031 },
      { polityId: "pol_almoravid", fromYear: 1091, toYear: 1147 },
      { polityId: "pol_almohad", fromYear: 1148, toYear: 1236 },
    ],
  },
  {
    id: "city_cairo",
    name: "Cairo",
    historicalNames: {
      arabic: "القاهرة المعزية",
      greek_latin: "Babylon / Cairo",
    },
    coordinates: [31.2357, 30.0444],
    foundingYear: 969,
    region: "Lower Egypt, Nile Valley",
    significance: "Founded by Fatimid general Jawhar al-Siqilli in 969 CE; imperial capital of the Fatimid, Ayyubid, and Mamluk empires.",
    capitalEras: [
      {
        polityId: "pol_fatimid",
        fromYear: 973,
        toYear: 1171,
        capitalTitle: "Imperial Caliphal Capital of the Fatimid Empire",
      },
      {
        polityId: "pol_ayyubid",
        fromYear: 1171,
        toYear: 1250,
        capitalTitle: "Ayyubid Sultanate Imperial Seat & Citadel",
      },
      {
        polityId: "pol_mamluk",
        fromYear: 1250,
        toYear: 1517,
        capitalTitle: "Imperial Capital of the Mamluk Sultanate",
      },
    ],
    rulingPowers: [
      { polityId: "pol_fatimid", fromYear: 969, toYear: 1171 },
      { polityId: "pol_ayyubid", fromYear: 1171, toYear: 1250 },
      { polityId: "pol_mamluk", fromYear: 1250, toYear: 1517 },
      { polityId: "pol_ottoman", fromYear: 1517, toYear: 1914 },
    ],
  },
  {
    id: "city_mahdia",
    name: "Mahdia",
    historicalNames: {
      arabic: "المهدية",
    },
    coordinates: [11.0622, 35.5047],
    foundingYear: 921,
    region: "Ifriqiya, Modern Tunisia",
    significance: "Fortified naval peninsula founded by Caliph Ubayd Allah al-Mahdi as the initial Fatimid capital.",
    capitalEras: [
      {
        polityId: "pol_fatimid",
        fromYear: 921,
        toYear: 969,
        capitalTitle: "Naval Capital of the Early Fatimid Caliphate in North Africa",
      },
    ],
    rulingPowers: [
      { polityId: "pol_fatimid", fromYear: 921, toYear: 969 },
      { polityId: "pol_almohad", fromYear: 1160, toYear: 1229 },
    ],
  },
  {
    id: "city_bukhara",
    name: "Bukhara",
    historicalNames: {
      arabic: "بخارى",
      persian: "بخارا",
    },
    coordinates: [64.4216, 39.7747],
    foundingYear: 709,
    region: "Transoxiana, Central Asia",
    significance: "Intellectual capital of the Persian Samanid Empire, home of Ibn Sina (Avicenna), al-Bukhari, and classical Persian literature.",
    capitalEras: [
      {
        polityId: "pol_samanid",
        fromYear: 892,
        toYear: 999,
        capitalTitle: "Imperial Capital of the Samanid Dynasty",
      },
    ],
    rulingPowers: [
      { polityId: "pol_umayyad", fromYear: 709, toYear: 750 },
      { polityId: "pol_abbasid_early", fromYear: 750, toYear: 819 },
      { polityId: "pol_samanid", fromYear: 819, toYear: 999 },
      { polityId: "pol_seljuk", fromYear: 1040, toYear: 1141 },
      { polityId: "pol_mongol", fromYear: 1220, toYear: 1370 },
      { polityId: "pol_timurid", fromYear: 1370, toYear: 1500 },
    ],
  },
  {
    id: "city_samarkand",
    name: "Samarkand",
    historicalNames: {
      arabic: "سمرقند",
      persian: "سمرقند",
      greek_latin: "Marakanda",
    },
    coordinates: [66.9749, 39.6542],
    foundingYear: 712,
    region: "Sogdia / Transoxiana, Central Asia",
    significance: "Imperial capital of Timur (Tamerlane) and center of the Timurid Renaissance with monumental madrasas and Ulugh Beg's observatory.",
    capitalEras: [
      {
        polityId: "pol_timurid",
        fromYear: 1370,
        toYear: 1405,
        capitalTitle: "Imperial Capital of the Timurid Empire under Timur",
      },
    ],
    rulingPowers: [
      { polityId: "pol_umayyad", fromYear: 712, toYear: 750 },
      { polityId: "pol_samanid", fromYear: 819, toYear: 999 },
      { polityId: "pol_seljuk", fromYear: 1040, toYear: 1141 },
      { polityId: "pol_mongol", fromYear: 1220, toYear: 1370 },
      { polityId: "pol_timurid", fromYear: 1370, toYear: 1500 },
    ],
  },
  {
    id: "city_ghazna",
    name: "Ghazna",
    historicalNames: {
      arabic: "غزنة",
      persian: "غزنی",
    },
    coordinates: [68.4239, 33.5539],
    foundingYear: 962,
    region: "Zabulistan / Khorasan, Modern Afghanistan",
    significance: "Imperial fortress capital of the Ghaznavid Empire under Mahmud of Ghazna, commanding the mountain passes to the Indus Valley.",
    capitalEras: [
      {
        polityId: "pol_ghaznavid",
        fromYear: 977,
        toYear: 1163,
        capitalTitle: "Imperial Fortress Capital of the Ghaznavid Empire",
      },
    ],
    rulingPowers: [
      { polityId: "pol_samanid", fromYear: 962, toYear: 977 },
      { polityId: "pol_ghaznavid", fromYear: 977, toYear: 1163 },
      { polityId: "pol_mongol", fromYear: 1221, toYear: 1370 },
      { polityId: "pol_timurid", fromYear: 1370, toYear: 1500 },
    ],
  },
  {
    id: "city_isfahan",
    name: "Isfahan",
    historicalNames: {
      arabic: "أصفهان",
      persian: "اصفهان / نصف جهان",
    },
    coordinates: [51.6776, 32.6546],
    foundingYear: 644,
    region: "Central Iranian Plateau, Persia",
    significance: "Grand capital of the Great Seljuks under Sultan Malik Shah and later majestic golden capital of the Safavid Empire under Shah Abbas I.",
    capitalEras: [
      {
        polityId: "pol_seljuk",
        fromYear: 1072,
        toYear: 1118,
        capitalTitle: "Primary Imperial Capital of the Great Seljuk Empire",
      },
      {
        polityId: "pol_safavid",
        fromYear: 1598,
        toYear: 1736,
        capitalTitle: "Imperial Capital of the Safavid Empire (Naqsh-e Jahan)",
      },
    ],
    rulingPowers: [
      { polityId: "pol_rashidun", fromYear: 644, toYear: 661 },
      { polityId: "pol_umayyad", fromYear: 661, toYear: 750 },
      { polityId: "pol_abbasid_early", fromYear: 750, toYear: 935 },
      { polityId: "pol_buyid", fromYear: 935, toYear: 1051 },
      { polityId: "pol_seljuk", fromYear: 1051, toYear: 1194 },
      { polityId: "pol_mongol", fromYear: 1237, toYear: 1335 },
      { polityId: "pol_timurid", fromYear: 1387, toYear: 1502 },
      { polityId: "pol_safavid", fromYear: 1502, toYear: 1736 },
    ],
  },
  {
    id: "city_marrakech",
    name: "Marrakech",
    historicalNames: {
      arabic: "مراكش",
      persian: "مراکش",
    },
    coordinates: [-8.0083, 31.6295],
    foundingYear: 1062,
    region: "Maghreb al-Aqsa, Modern Morocco",
    significance: "Imperial capital founded by Yusuf ibn Tashfin of the Almoravids and expanded as the caliphal capital of the Almohads.",
    capitalEras: [
      {
        polityId: "pol_almoravid",
        fromYear: 1062,
        toYear: 1147,
        capitalTitle: "Imperial Capital of the Almoravid Empire",
      },
      {
        polityId: "pol_almohad",
        fromYear: 1147,
        toYear: 1269,
        capitalTitle: "Imperial Caliphal Capital of the Almohad Empire",
      },
    ],
    rulingPowers: [
      { polityId: "pol_almoravid", fromYear: 1062, toYear: 1147 },
      { polityId: "pol_almohad", fromYear: 1147, toYear: 1269 },
    ],
  },
  {
    id: "city_delhi",
    name: "Delhi",
    historicalNames: {
      arabic: "دلهي",
      persian: "دهلی",
    },
    coordinates: [77.2090, 28.6139],
    foundingYear: 1206,
    region: "Hindustan / Yamuna Valley, India",
    significance: "Imperial capital of the five successive dynasties of the Delhi Sultanate (1206–1526 CE) and later Shahjahanabad under the Mughals.",
    capitalEras: [
      {
        polityId: "pol_delhi_sultanate",
        fromYear: 1206,
        toYear: 1526,
        capitalTitle: "Imperial Capital of the Delhi Sultanate",
      },
      {
        polityId: "pol_mughal",
        fromYear: 1648,
        toYear: 1857,
        capitalTitle: "Imperial Mughal Capital (Shahjahanabad / Red Fort)",
      },
    ],
    rulingPowers: [
      { polityId: "pol_delhi_sultanate", fromYear: 1206, toYear: 1526 },
      { polityId: "pol_mughal", fromYear: 1526, toYear: 1857 },
    ],
  },
  {
    id: "city_istanbul",
    name: "Istanbul / Constantinople",
    historicalNames: {
      arabic: "القسطنطينية / إسلامبول",
      greek_latin: "Constantinopolis / Byzantium",
    },
    coordinates: [28.9784, 41.0082],
    foundingYear: 1453,
    region: "Bosporus / Thrace, Anatolia & Balkans",
    significance: "Imperial capital of the Ottoman Empire (Konstantiniyye / Dersaadet) following its conquest by Sultan Mehmed II in 1453 CE.",
    capitalEras: [
      {
        polityId: "pol_ottoman",
        fromYear: 1453,
        toYear: 1922,
        capitalTitle: "Imperial Seat of the Ottoman Caliphate and Empire",
      },
    ],
    rulingPowers: [
      { polityId: "pol_ottoman", fromYear: 1453, toYear: 1922 },
    ],
  },
  {
    id: "city_agra",
    name: "Agra",
    historicalNames: {
      arabic: "أغرة",
      persian: "اکبرآباد (Akbarabad)",
    },
    coordinates: [78.0081, 27.1767],
    foundingYear: 1556,
    region: "Yamuna Basin, Northern India",
    significance: "Imperial capital of Akbar the Great and Shah Jahan; home of the Taj Mahal and Agra Fort.",
    capitalEras: [
      {
        polityId: "pol_mughal",
        fromYear: 1556,
        toYear: 1648,
        capitalTitle: "Imperial Capital of the Mughal Empire (Akbarabad)",
      },
    ],
    rulingPowers: [
      { polityId: "pol_delhi_sultanate", fromYear: 1504, toYear: 1526 },
      { polityId: "pol_mughal", fromYear: 1526, toYear: 1803 },
    ],
  },
  {
    id: "city_jerusalem",
    name: "Jerusalem",
    historicalNames: {
      arabic: "القدس الشريف / إيلياء",
      greek_latin: "Hierosolyma / Aelia Capitolina",
    },
    coordinates: [35.2137, 31.7683],
    foundingYear: 638,
    region: "Jund Filastin, Levant",
    significance: "Third holiest sanctuary of Islam; location of the Dome of the Rock and al-Aqsa Mosque built under the Umayyads.",
    capitalEras: [],
    rulingPowers: [
      { polityId: "pol_rashidun", fromYear: 638, toYear: 661 },
      { polityId: "pol_umayyad", fromYear: 661, toYear: 750 },
      { polityId: "pol_abbasid_early", fromYear: 750, toYear: 969 },
      { polityId: "pol_fatimid", fromYear: 969, toYear: 1073 },
      { polityId: "pol_seljuk", fromYear: 1073, toYear: 1098 },
      { polityId: "pol_fatimid", fromYear: 1098, toYear: 1099 },
      { polityId: "pol_ayyubid", fromYear: 1187, toYear: 1244 },
      { polityId: "pol_mamluk", fromYear: 1250, toYear: 1516 },
      { polityId: "pol_ottoman", fromYear: 1516, toYear: 1917 },
    ],
  },
  {
    id: "city_mecca",
    name: "Mecca",
    historicalNames: {
      arabic: "مكة المكرمة / بكة",
      greek_latin: "Macoraba",
    },
    coordinates: [39.8262, 21.4225],
    foundingYear: 630,
    region: "Hijaz, Arabian Peninsula",
    significance: "Spiritual epicenter of Islam, site of the Kaaba and annual destination of worldwide Hajj pilgrim caravans.",
    capitalEras: [],
    rulingPowers: [
      { polityId: "pol_rashidun", fromYear: 630, toYear: 661 },
      { polityId: "pol_umayyad", fromYear: 661, toYear: 750 },
      { polityId: "pol_abbasid_early", fromYear: 750, toYear: 969 },
      { polityId: "pol_fatimid", fromYear: 969, toYear: 1171 },
      { polityId: "pol_ayyubid", fromYear: 1171, toYear: 1250 },
      { polityId: "pol_mamluk", fromYear: 1250, toYear: 1517 },
      { polityId: "pol_ottoman", fromYear: 1517, toYear: 1916 },
    ],
  },
];
