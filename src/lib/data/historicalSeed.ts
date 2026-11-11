import type { NewSourceRecord } from "@/lib/db/schema/sources";
import type { NewPolityRecord } from "@/lib/db/schema/polities";
import type { TerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { HistoricalEventRecord } from "@/lib/db/schema/historicalEvents";
import type { NewRulerRecord } from "@/lib/db/schema/rulers";
import type { NewReignRecord } from "@/lib/db/schema/reigns";
import type { TradeRouteRecord } from "@/lib/db/schema/tradeRoutes";
import type { NewMonumentRecord } from "@/lib/db/schema/monuments";
import type { NewScholarRecord } from "@/lib/db/schema/scholars";
import type { NewCampaignRecord } from "@/lib/db/schema/campaigns";

export const initialSources: NewSourceRecord[] = [
  {
    id: "src_kennedy_2004",
    title: "The Prophet and the Age of the Caliphates: The Islamic Near East from the Sixth to the Eleventh Century",
    authorOrOrganization: "Hugh Kennedy",
    publication: "Routledge / Pearson Education (2nd Edition)",
    publicationDate: "2004",
    url: "https://www.routledge.com/9780582405257",
    citationText: "Kennedy, Hugh. The Prophet and the Age of the Caliphates. 2nd ed. London: Routledge, 2004.",
    licenseOrRightsNote: "Academic reference citation for historical facts.",
  },
  {
    id: "src_bosworth_1996",
    title: "The New Islamic Dynasties: A Chronological and Genealogical Manual",
    authorOrOrganization: "Clifford Edmund Bosworth",
    publication: "Edinburgh University Press",
    publicationDate: "1996",
    url: "https://edinburghuniversitypress.com/book-the-new-islamic-dynasties.html",
    citationText: "Bosworth, C. E. The New Islamic Dynasties. Edinburgh: Edinburgh University Press, 1996.",
    licenseOrRightsNote: "Academic reference citation for dynastic dates and reigns.",
  },
  {
    id: "src_encyclopaedia_islam_2",
    title: "Encyclopaedia of Islam, Second Edition (EI2)",
    authorOrOrganization: "Brill Academic Publishers (ed. P. Bearman et al.)",
    publication: "Brill",
    publicationDate: "1960-2005",
    url: "https://referenceworks.brillonline.com/browse/encyclopaedia-of-islam-2",
    citationText: "Encyclopaedia of Islam, Second Edition. Edited by P. Bearman, Th. Bianquis, C.E. Bosworth, E. van Donzel, W.P. Heinrichs. Brill, 1960-2005.",
    licenseOrRightsNote: "Scholarly reference encyclopedia.",
  },
];

export const initialPolities: NewPolityRecord[] = [
  {
    id: "pol_rashidun",
    canonicalName: "Rashidun Caliphate",
    entityType: "caliphate",
    startYear: 632,
    endYear: 661,
    precision: "well-attested",
    overview: "The initial caliphate established following the demise of the Prophet Muhammad, governed successively by Abu Bakr, Umar, Uthman, and Ali.",
    capitalCity: "Medina (later Kufa)",
    reviewStatus: "published",
  },
  {
    id: "pol_umayyad",
    canonicalName: "Umayyad Caliphate",
    entityType: "caliphate",
    startYear: 661,
    endYear: 750,
    precision: "well-attested",
    overview: "The first hereditary Islamic caliphate, founded by Mu'awiya I with its capital in Damascus, spanning from Iberia to the Indus River.",
    capitalCity: "Damascus",
    reviewStatus: "published",
  },
  {
    id: "pol_abbasid_early",
    canonicalName: "Abbasid Caliphate (Early Period)",
    entityType: "caliphate",
    startYear: 750,
    endYear: 945,
    precision: "well-attested",
    overview: "The caliphate originating from the Abbasid Revolution that established Baghdad as the imperial capital and imperial intellectual center.",
    capitalCity: "Baghdad (Samarra 836-892)",
    reviewStatus: "published",
  },
  {
    id: "pol_cordoba_emirate",
    canonicalName: "Emirate of Córdoba",
    entityType: "emirate",
    startYear: 756,
    endYear: 929,
    precision: "well-attested",
    overview: "Independent Umayyad state in Al-Andalus founded by Abd al-Rahman I following the Abbasid overthrow of Damascus.",
    capitalCity: "Córdoba",
    reviewStatus: "published",
  },
  {
    id: "pol_fatimid",
    canonicalName: "Fatimid Caliphate",
    entityType: "caliphate",
    startYear: 909,
    endYear: 1171,
    precision: "well-attested",
    overview: "Isma'ili Shi'i caliphate originating in Ifriqiya (modern Tunisia) and later establishing Cairo as its capital in 969 CE.",
    capitalCity: "Mahdia (later Cairo)",
    reviewStatus: "published",
  },
  {
    id: "pol_cordoba_caliphate",
    canonicalName: "Caliphate of Córdoba",
    entityType: "caliphate",
    startYear: 929,
    endYear: 1031,
    precision: "well-attested",
    overview: "Umayyad caliphate in the Iberian Peninsula proclaimed by Abd al-Rahman III, representing the zenith of Andalusian science, arts, and architectural monumentality.",
    capitalCity: "Córdoba (Madinat al-Zahra)",
    reviewStatus: "published",
  },
  {
    id: "pol_samanid",
    canonicalName: "Samanid Dynasty",
    entityType: "dynasty",
    startYear: 819,
    endYear: 999,
    precision: "well-attested",
    overview: "Persian dynastic realm centered in Transoxiana and Greater Khorasan that fostered the Persian literary renaissance and produced scholars such as Ibn Sina and al-Farabi.",
    capitalCity: "Bukhara (secondary: Samarkand)",
    reviewStatus: "published",
  },
  {
    id: "pol_buyid",
    canonicalName: "Buyid Dynasty",
    entityType: "dynasty",
    startYear: 934,
    endYear: 1062,
    precision: "well-attested",
    overview: "Daylamite Shi'i dynasty originating from northern Iran that established suzerainty over western Iran and assumed de facto military regency over the Abbasid caliphs in Baghdad.",
    capitalCity: "Shiraz (regional: Rayy, Baghdad)",
    reviewStatus: "published",
  },
  {
    id: "pol_ghaznavid",
    canonicalName: "Ghaznavid Empire",
    entityType: "empire",
    startYear: 977,
    endYear: 1186,
    precision: "well-attested",
    overview: "Persianate Turco-Muslim imperial dynasty founded by Sabuktigin and expanded by Mahmud of Ghazna across Khorasan, Afghanistan, and the northwestern Indian subcontinent.",
    capitalCity: "Ghazna (later Lahore)",
    reviewStatus: "published",
  },
  {
    id: "pol_seljuk",
    canonicalName: "Great Seljuk Empire",
    entityType: "empire",
    startYear: 1037,
    endYear: 1194,
    precision: "well-attested",
    overview: "Turco-Persian Sunnite empire founded by Tughril Beg and consolidated under Alp Arslan and Malik Shah I, reviving Sunnite political unity from the Hindu Kush to the Anatolian plateau.",
    capitalCity: "Isfahan (earlier: Nishapur, Rayy)",
    reviewStatus: "published",
  },
  {
    id: "pol_almoravid",
    canonicalName: "Almoravid Dynasty",
    entityType: "dynasty",
    startYear: 1040,
    endYear: 1147,
    precision: "well-attested",
    overview: "Saharan Berber imperial dynasty founded by Abdallah ibn Yasin and Yusuf ibn Tashfin that unified the western Maghreb and halted Christian expansion in Al-Andalus at the Battle of Sagrajas.",
    capitalCity: "Marrakech",
    reviewStatus: "published",
  },
  {
    id: "pol_almohad",
    canonicalName: "Almohad Caliphate",
    entityType: "caliphate",
    startYear: 1121,
    endYear: 1269,
    precision: "well-attested",
    overview: "Masmuda Berber caliphate founded by Ibn Tumart and Abd al-Mu'min that unified the entirety of North Africa (Maghreb and Ifriqiya) and Islamic Iberia under a reformist theological state.",
    capitalCity: "Marrakech (secondary: Seville)",
    reviewStatus: "published",
  },
  {
    id: "pol_ayyubid",
    canonicalName: "Ayyubid Sultanate",
    entityType: "sultanate",
    startYear: 1171,
    endYear: 1260,
    precision: "well-attested",
    overview: "Sunnite Muslim dynasty of Kurdish origin founded by Saladin (Salah al-Din), which unified Egypt, Syria, northern Mesopotamia, and the Hijaz, famously recapturing Jerusalem in 1187 CE.",
    capitalCity: "Cairo (secondary: Damascus)",
    reviewStatus: "published",
  },
  {
    id: "pol_mamluk",
    canonicalName: "Mamluk Sultanate",
    entityType: "sultanate",
    startYear: 1250,
    endYear: 1517,
    precision: "well-attested",
    overview: "Military sultanate governed by military freedmen (Bahri and Burji dynasties) based in Cairo that famously halted the Mongol invasions at Ain Jalut and expelled the Crusader polities from the Levant.",
    capitalCity: "Cairo",
    reviewStatus: "published",
  },
  {
    id: "pol_delhi_sultanate",
    canonicalName: "Delhi Sultanate",
    entityType: "sultanate",
    startYear: 1206,
    endYear: 1526,
    precision: "well-attested",
    overview: "Principal Islamic realm in the Indian subcontinent spanning five dynasties (Mamluk, Khalji, Tughlaq, Sayyid, Lodi), ruling from Delhi across the northern plains to Bengal.",
    capitalCity: "Delhi",
    reviewStatus: "published",
  },
  {
    id: "pol_timurid",
    canonicalName: "Timurid Empire",
    entityType: "empire",
    startYear: 1370,
    endYear: 1507,
    precision: "well-attested",
    overview: "Turco-Mongol empire founded by Timur (Tamerlane) centered in Samarkand and Herat, renowned for monumental architecture, cartography, and the Timurid Renaissance.",
    capitalCity: "Samarkand (later Herat)",
    reviewStatus: "published",
  },
  {
    id: "pol_ottoman",
    canonicalName: "Ottoman Empire",
    entityType: "empire",
    startYear: 1299,
    endYear: 1922,
    precision: "well-attested",
    overview: "Transcontinental imperial realm founded by Osman I, spanning southeastern Europe, western Asia, and northern Africa, maintaining the universal caliphate from Constantinople (Istanbul).",
    capitalCity: "Constantinople / Istanbul (earlier: Söğüt, Bursa, Edirne)",
    reviewStatus: "published",
  },
  {
    id: "pol_safavid",
    canonicalName: "Safavid Empire",
    entityType: "empire",
    startYear: 1501,
    endYear: 1736,
    precision: "well-attested",
    overview: "Imperial dynastic state established by Shah Ismail I that established Twelver Shi'ism as the official state religion, ruling from Isfahan as one of the three Islamic Gunpowder Empires.",
    capitalCity: "Isfahan (earlier: Tabriz, Qazvin)",
    reviewStatus: "published",
  },
  {
    id: "pol_mughal",
    canonicalName: "Mughal Empire",
    entityType: "empire",
    startYear: 1526,
    endYear: 1857,
    precision: "well-attested",
    overview: "Early modern gunpowder empire founded by Babur that governed the vast majority of the Indian subcontinent and Afghanistan, famed for administrative sophistication and architectural wonders like the Taj Mahal.",
    capitalCity: "Agra (also: Delhi, Lahore, Fatehpur Sikri)",
    reviewStatus: "published",
  },
  {
    id: "pol_zengid",
    canonicalName: "Zengid Dynasty",
    entityType: "dynasty",
    startYear: 1127,
    endYear: 1250,
    precision: "well-attested",
    overview: "Oghuz Turkic atabegate founded by Imad al-Din Zengi and expanded under Nur al-Din, unifying Aleppo, Damascus, and Mosul, serving as the foundational spearhead of the Counter-Crusade.",
    capitalCity: "Aleppo (also: Mosul)",
    reviewStatus: "published",
  },
  {
    id: "pol_mongol",
    canonicalName: "Ilkhanate (Mongol Realm in West Asia)",
    entityType: "empire",
    startYear: 1256,
    endYear: 1335,
    precision: "well-attested",
    overview: "Southwestern sector of the Mongol Empire founded by Hulagu Khan following the fall of Baghdad (1258). Later converted to Islam under Ghazan Khan, governing Persia, Iraq, and eastern Anatolia with imperial capitals at Maragheh, Tabriz, and Soltaniyeh.",
    capitalCity: "Tabriz (earlier: Maragheh, later: Soltaniyeh)",
    reviewStatus: "published",
  },
];

export const initialTerritoryPeriods: TerritoryPeriodRecord[] = [
  {
    id: "ter_rashidun_hijaz_levant_632_661",
    polityId: "pol_rashidun",
    regionName: "Arabian Peninsula & Levant (Medina Core)",
    validFromYear: 632,
    validToYear: 661,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [39.15, 21.50], // Jeddah & Red Sea Coast
          [38.06, 24.08], // Yanbu
          [36.45, 26.24], // Al-Wajh
          [35.70, 27.35], // Duba (Northern Hijaz coast)
          [34.98, 29.53], // Gulf of Aqaba (Ayla)
          [34.25, 31.30], // Rafah / Gaza border
          [35.25, 31.78], // Jerusalem / Southern Levant
          [35.85, 32.75], // Yarmouk / Golan
          [36.50, 32.55], // Bosra / Hawran
          [38.20, 30.50], // Wadi Sirhan desert approach
          [40.20, 29.90], // Sakaka / Dumah
          [44.20, 31.50], // Kufa & Najaf ridge
          [47.80, 30.50], // Lower Euphrates & Basra marshlands
          [49.60, 25.40], // Hajar & Al-Ahsa oasis (Persian Gulf littoral)
          [51.00, 24.80], // Eastern Arabia march
          [55.70, 24.20], // Oman oasis frontier
          [53.00, 22.00], // Northern Rub' al-Khali margin
          [46.70, 24.10], // Yamama & Najd plateau
          [44.20, 17.50], // Najran oasis
          [42.55, 16.90], // Jazan / Tihama coast
          [41.08, 19.12], // Al-Qunfudhah
          [40.27, 20.15], // Al-Lith
          [39.15, 21.50], // Closing to Jeddah
        ],
      ],
    },
    explanatoryNote: "Core domain of the Rashidun caliphate radiating from Medina across the Hijaz, Najd, southern Levant, and lower Mesopotamian marches.",
    reviewStatus: "published",
  },
  {
    id: "ter_umayyad_syria_661_750",
    polityId: "pol_umayyad",
    regionName: "Syria & Levant (Bilad al-Sham)",
    validFromYear: 661,
    validToYear: 750,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [34.25, 31.25], // Gaza & Sinai border
          [34.75, 32.05], // Jaffa coast
          [35.07, 32.93], // Acre & Mount Carmel
          [35.50, 33.89], // Beirut & Phoenician coast
          [35.85, 34.89], // Tripoli & Tartus
          [35.78, 35.52], // Latakia
          [36.16, 36.20], // Antioch (Antakiya)
          [37.38, 36.80], // Northern Syrian march (Aintab / Mar'ash)
          [38.10, 36.50], // Manbij & Euphrates crossing
          [39.01, 35.95], // Raqqa (al-Rafiqa)
          [38.75, 35.63], // Resafa (Sergiopolis)
          [38.28, 34.56], // Palmyra (Tadmur)
          [36.31, 33.51], // Damascus & Ghouta oasis
          [36.48, 32.52], // Bosra (Jund Dimashq / Hawran)
          [35.93, 31.95], // Amman & Balqa (Jund al-Urdunn)
          [35.70, 31.18], // Karak & Dead Sea
          [35.73, 30.19], // Ma'an
          [34.98, 29.53], // Gulf of Aqaba (Ayla)
          [34.79, 31.24], // Beersheba / Negev frontier
          [34.25, 31.25], // Closing to Gaza
        ],
      ],
    },
    explanatoryNote: "Metropolitan heartland of the Umayyad caliphs administered directly from Damascus across the five junds of Bilad al-Sham.",
    reviewStatus: "published",
  },
  {
    id: "ter_cordoba_756_929",
    polityId: "pol_cordoba_emirate",
    regionName: "Al-Andalus (Iberian Peninsula)",
    validFromYear: 756,
    validToYear: 929,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [-5.60, 36.01], // Tarifa & Strait of Gibraltar
          [-6.35, 36.78], // Guadalquivir mouth & Cadiz
          [-6.95, 37.26], // Huelva / Odiel estuary
          [-7.93, 37.02], // Faro / Algarve coast
          [-8.44, 37.19], // Silves
          [-8.68, 39.23], // Santarém & Lower Tagus
          [-8.41, 40.21], // Coimbra march
          [-5.20, 40.35], // Sierra de Gredos pass
          [-4.00, 40.70], // Guadarrama frontier
          [-2.43, 41.17], // Medinaceli (Middle March fortress)
          [-0.88, 41.65], // Zaragoza (Upper March capital)
          [0.62, 41.62],  // Lerida (Lleida)
          [0.52, 40.81],  // Tortosa & Ebro delta
          [-0.37, 39.47], // Valencia littoral
          [0.10, 38.84],  // Denia / Cape Nao
          [-0.48, 38.34], // Alicante
          [-1.13, 37.99], // Murcia / Tudmir
          [-0.98, 37.60], // Cartagena
          [-2.46, 36.84], // Almería
          [-4.42, 36.72], // Málaga coast
          [-5.45, 36.13], // Algeciras
          [-5.60, 36.01], // Closing to Tarifa
        ],
      ],
    },
    explanatoryNote: "Territory under the Umayyad Emirate of Córdoba, spanning the southern and central Iberian Peninsula up to the Upper March at Zaragoza.",
    reviewStatus: "published",
  },
  {
    id: "ter_abbasid_iraq_750_945",
    polityId: "pol_abbasid_early",
    regionName: "Iraq & Mesopotamia (Sawad)",
    validFromYear: 750,
    validToYear: 945,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [47.81, 30.50], // Basra & Shatt al-Arab
          [48.30, 30.00], // Abadan & marsh margin
          [48.67, 31.32], // Ahvaz / Khuzestan border
          [45.83, 32.51], // Wasit on the Tigris
          [44.58, 33.09], // Ctesiphon (al-Mada'in)
          [44.36, 33.31], // Baghdad (Round City of Peace)
          [44.64, 33.75], // Diyala River basin
          [43.88, 34.20], // Samarra (Abbasid capital 836–892)
          [43.68, 34.60], // Tikrit
          [43.13, 36.34], // Mosul on the Upper Tigris
          [43.40, 35.90], // Great Zab River confluence
          [41.86, 36.32], // Sinjar plain
          [43.48, 33.35], // Anbar on the Euphrates
          [44.38, 32.03], // Kufa & Najaf ridge
          [44.34, 31.58], // al-Qadisiyyah
          [45.28, 31.31], // Samawah & western desert edge
          [46.26, 31.05], // Nasiriyah (Ur)
          [47.81, 30.50], // Closing to Basra
        ],
      ],
    },
    explanatoryNote: "The central crown province of the Abbasid Caliphate, housing the imperial round city of Baghdad and the agricultural Sawad.",
    reviewStatus: "published",
  },
  {
    id: "ter_abbasid_baghdad_945_1258",
    polityId: "pol_abbasid_early",
    regionName: "Abbasid Caliphal Domain (Baghdad & Central Sawad)",
    validFromYear: 945,
    validToYear: 1258,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [44.00, 33.30], // Baghdad center
          [44.80, 33.70], // Diyala basin
          [44.30, 34.20], // Samarra
          [43.60, 34.00], // Tikrit south margin
          [43.80, 33.30], // Anbar approach
          [44.20, 32.50], // Hillah / Babylon
          [44.60, 32.00], // Kufa northern march
          [45.30, 32.40], // Wasit border
          [44.80, 33.00], // Ctesiphon reach
          [44.00, 33.30], // Closing to Baghdad
        ],
      ],
    },
    explanatoryNote: "Autonomous Abbasid caliphal metropolitan territory centered on Baghdad and the central Sawad during the Buyid and Seljuk protectorate eras up to the Mongol siege of 1258 CE.",
    reviewStatus: "published",
  },
  {
    id: "ter_fatimid_ifriqiya_909_969",
    polityId: "pol_fatimid",
    regionName: "Ifriqiya (Tunisia & Eastern Algeria)",
    validFromYear: 909,
    validToYear: 969,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [5.50, 36.50],  // Ikjan / Little Kabylia (Kutama core)
          [6.61, 36.36],  // Constantine (Qasantina)
          [10.98, 37.05], // Cap Bon peninsula
          [10.18, 36.80], // Tunis & Carthage
          [10.64, 35.83], // Sousse (Hadrumetum)
          [11.06, 35.50], // Mahdia (Fatimid naval capital)
          [10.76, 34.74], // Sfax
          [10.10, 33.88], // Gabes
          [10.85, 33.81], // Djerba island
          [13.19, 32.89], // Tripoli (Tarabulus)
          [12.00, 31.80], // Nafusa Mountains margin
          [8.78, 34.42],  // Gafsa oasis
          [10.10, 35.68], // Kairouan (sacred inland city)
          [8.12, 35.40],  // Tebessa
          [5.50, 36.50],  // Closing to Little Kabylia
        ],
      ],
    },
    explanatoryNote: "Initial stronghold and naval capital of the Fatimid Caliphate at Mahdia prior to the conquest of Egypt.",
    reviewStatus: "published",
  },
  {
    id: "ter_cordoba_caliphate_929_1031",
    polityId: "pol_cordoba_caliphate",
    regionName: "Al-Andalus & Northern Maghreb (Caliphal Realm)",
    validFromYear: 929,
    validToYear: 1031,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "MultiPolygon",
      coordinates: [
        // Polygon 1: Iberian Peninsula (Al-Andalus Core)
        [
          [
            [-8.90, 37.00], // Sagres & Algarve coast
            [-8.70, 39.50], // Lower Tagus / Santarém
            [-6.00, 40.50], // Sierra de Gata march
            [-3.00, 41.50], // Douro-Ebro borderland
            [-0.90, 41.70], // Zaragoza (Upper March)
            [0.60, 41.60],  // Lleida march
            [0.50, 40.80],  // Tortosa coast
            [0.10, 38.80],  // Denia
            [-1.00, 37.50], // Cartagena littoral
            [-2.50, 36.80], // Almería naval base
            [-4.50, 36.70], // Málaga
            [-5.60, 36.00], // Tarifa & Strait
            [-6.30, 36.70], // Cadiz bay
            [-8.90, 37.00], // Closing to Sagres
          ],
        ],
        // Polygon 2: Northern Moroccan Protectorates (Ceuta & Tangier)
        [
          [
            [-5.30, 35.50], // Ceuta (Andalusian African bridgehead)
            [-4.00, 35.20], // Nekor coast
            [-5.00, 34.00], // Fez protectorate margin
            [-6.00, 35.00], // Tangier / Asilah
            [-5.30, 35.50], // Closing to Ceuta
          ],
        ],
      ],
    },
    explanatoryNote: "Apex of the Umayyad Caliphate of Córdoba governing the Iberian Peninsula and holding maritime protectorates across the Strait in northern Morocco.",
    reviewStatus: "published",
  },
  {
    id: "ter_fatimid_egypt_levant_969_1171",
    polityId: "pol_fatimid",
    regionName: "Egypt, Southern Levant & Hijaz Littoral",
    validFromYear: 969,
    validToYear: 1171,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [29.50, 31.50], // Alexandria & Western Delta
          [31.20, 31.50], // Damietta
          [32.50, 31.20], // Port Said / Pelusium
          [34.50, 31.80], // Ascalon & Gaza
          [35.50, 32.50], // Tiberias & Jordan Valley
          [36.00, 31.00], // Transjordan plateau
          [37.50, 28.00], // Tabuk northern desert
          [39.60, 24.50], // Medina (Holy Sanctuary)
          [39.80, 21.40], // Mecca (Sanctuary)
          [40.50, 19.00], // Tihama southern coast
          [38.00, 22.00], // Red Sea transit
          [35.00, 26.00], // Quseir & Upper Egypt eastern desert
          [33.50, 27.50], // Red Sea littoral
          [31.20, 29.00], // Faiyum & Middle Egypt
          [29.50, 31.50], // Closing to Alexandria
        ],
      ],
    },
    explanatoryNote: "The Fatimid imperial core following Jawhar's conquest of Fustat, establishment of Cairo (al-Qahira), and extension of suzerainty over Mecca and Medina.",
    reviewStatus: "published",
  },
  {
    id: "ter_samanid_transoxiana_819_999",
    polityId: "pol_samanid",
    regionName: "Transoxiana & Greater Khorasan (Bukhara & Samarkand)",
    validFromYear: 819,
    validToYear: 999,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [58.00, 35.50], // Nishapur & Sabzevar
          [60.00, 37.50], // Sarakhs
          [62.20, 37.60], // Merv (Marw al-Shahijan)
          [64.40, 39.80], // Bukhara oasis
          [66.90, 39.60], // Samarkand
          [69.00, 41.00], // Tashkent (Shash)
          [71.50, 40.50], // Fergana Valley (Khujand / Kokand)
          [72.50, 41.00], // Osh / Eastern Fergana
          [69.50, 42.50], // Syr Darya middle course
          [64.00, 42.00], // Kyzylkum desert margin
          [60.00, 40.00], // Khwarazm border (Urgench)
          [56.50, 37.00], // Kopet Dag foothills
          [58.00, 35.50], // Closing to Nishapur
        ],
      ],
    },
    explanatoryNote: "The heartland of the Persian Samanid Renaissance governing Mawara al-Nahr (Transoxiana) and Khorasan with twin intellectual capitals at Bukhara and Samarkand.",
    reviewStatus: "published",
  },
  {
    id: "ter_buyid_persia_iraq_934_1062",
    polityId: "pol_buyid",
    regionName: "Western Persia, Jibal & Lower Iraq",
    validFromYear: 934,
    validToYear: 1062,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [44.00, 33.30], // Baghdad (Abbasid Caliphal seat under Buyid Amirate)
          [46.50, 34.50], // Kermanshah / Zagros passes
          [48.50, 35.00], // Hamadan (Ecbatana)
          [51.40, 35.60], // Rayy (near modern Tehran)
          [53.00, 34.00], // Qom & Kashan
          [54.0, 31.50],  // Yazd oasis margin
          [52.60, 29.60], // Shiraz (Fars capital)
          [50.80, 28.90], // Bushehr & Persian Gulf coast
          [48.50, 30.00], // Khuzestan & Ahvaz
          [46.00, 31.50], // Lower Euphrates & marshes
          [44.40, 32.00], // Kufa & Wasit
          [44.00, 33.30], // Closing to Baghdad
        ],
      ],
    },
    explanatoryNote: "Daylamite confederation domain holding Fars, Jibal, and Rayy while exercising direct protectorate over the Abbasid caliphs in Baghdad.",
    reviewStatus: "published",
  },
  {
    id: "ter_ghaznavid_zenith_977_1040",
    polityId: "pol_ghaznavid",
    regionName: "Ghaznavid Imperial Zenith (Khorasan, Zabulistan & Punjab)",
    validFromYear: 977,
    validToYear: 1040,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [58.50, 36.20], // Nishapur & western Khorasan
          [62.20, 35.00], // Murghab river basin
          [65.00, 34.50], // Ghor mountains margin
          [68.40, 33.50], // Ghazna (imperial fortress capital)
          [71.50, 34.00], // Peshawar & Khyber Pass
          [74.30, 31.50], // Lahore (winter capital of Mahmud)
          [73.00, 29.50], // Multan & southern Punjab
          [69.00, 29.00], // Sibi & Bolan Pass
          [64.00, 30.50], // Helmand valley & Bust
          [61.00, 31.50], // Zaranj & Sistan
          [58.50, 36.20], // Closing to Nishapur
        ],
      ],
    },
    explanatoryNote: "Imperial zenith of the Ghaznavid Empire under Mahmud of Ghazna and Mas'ud I, uniting Greater Khorasan, the Afghan Hindu Kush, and the northern Indian subcontinent.",
    reviewStatus: "published",
  },
  {
    id: "ter_ghaznavid_lahore_1041_1186",
    polityId: "pol_ghaznavid",
    regionName: "Ghaznavid Realm (Punjab & Eastern Afghanistan)",
    validFromYear: 1041,
    validToYear: 1186,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [67.50, 34.00], // Kabul-Ghazna mountain corridor
          [68.40, 33.50], // Ghazna fortress
          [71.50, 34.00], // Peshawar & Khyber Pass
          [74.30, 32.50], // Sialkot
          [75.00, 31.50], // Beas River margin
          [74.34, 31.52], // Lahore (Ghaznavid dynastic capital)
          [72.50, 29.50], // Multan & southern Punjab
          [70.00, 29.50], // Dera Ghazi Khan / Indus
          [68.50, 31.00], // Sulaiman Range
          [66.50, 32.00], // Zabulistan southern flank
          [67.50, 34.00], // Closing to Ghazna corridor
        ],
      ],
    },
    explanatoryNote: "Later Ghaznavid territory after the loss of Khorasan to the Seljuks at Dandanaqan (1040 CE), centered upon the Punjab with the imperial court seated in Lahore.",
    reviewStatus: "published",
  },
  {
    id: "ter_seljuk_early_1037_1071",
    polityId: "pol_seljuk",
    regionName: "Early Seljuk Realm (Khorasan, Jibal & Baghdad)",
    validFromYear: 1037,
    validToYear: 1071,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [44.00, 33.30], // Baghdad (Tughril Beg recognized as Sultan in 1055)
          [46.50, 35.00], // Hamadan
          [51.40, 35.60], // Rayy (early capital)
          [54.00, 37.00], // Gurgan plain
          [60.00, 37.00], // Nishapur (first capital 1038)
          [62.20, 35.00], // Merv / Khorasan frontier
          [60.00, 32.00], // Kerman march
          [54.00, 30.00], // Isfahan
          [48.50, 30.50], // Khuzestan
          [44.00, 32.50], // Sawad
          [44.00, 33.30], // Closing to Baghdad
        ],
      ],
    },
    explanatoryNote: "Initial expansion of the Great Seljuks under Tughril Beg and early Alp Arslan, consolidating Khorasan and Iran and liberating the Abbasid Caliph in Baghdad from Buyid control.",
    reviewStatus: "published",
  },
  {
    id: "ter_seljuk_zenith_1072_1092",
    polityId: "pol_seljuk",
    regionName: "Great Seljuk Empire (Imperial Apex under Malik Shah I)",
    validFromYear: 1072,
    validToYear: 1092,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [32.00, 39.50], // Central Anatolia (post-Manzikert march)
          [36.50, 36.20], // Aleppo & northern Syria
          [36.30, 33.50], // Damascus
          [38.50, 37.50], // Edessa / Urfa
          [42.00, 38.00], // Lake Van & Armenia
          [46.00, 38.50], // Tabriz / Azerbaijan
          [50.00, 37.50], // Gilan / Caspian coast
          [54.00, 37.00], // Gurgan
          [62.20, 37.60], // Merv (administrative center)
          [64.00, 39.50], // Bukhara frontier
          [63.00, 35.00], // Herat
          [54.00, 30.00], // Isfahan (imperial capital of Malik Shah)
          [48.50, 30.50], // Khuzestan & Basra
          [44.00, 32.50], // Baghdad (seat of the Caliph and Sultan)
          [38.00, 32.00], // Syrian desert border
          [32.00, 39.50], // Closing to Anatolia
        ],
      ],
    },
    explanatoryNote: "Apex of the Great Seljuk Empire under Sultan Malik Shah I and Vizier Nizam al-Mulk, spanning from the Aegean fringes of Anatolia to the borders of China.",
    reviewStatus: "published",
  },
  {
    id: "ter_seljuk_late_1093_1194",
    polityId: "pol_seljuk",
    regionName: "Later Seljuk Realm (Western Iran & Khorasan)",
    validFromYear: 1093,
    validToYear: 1194,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [46.50, 35.00], // Hamadan (Iraqi Seljuk seat)
          [48.50, 37.50], // Azerbaijan border
          [54.00, 37.00], // Gurgan
          [60.00, 37.00], // Nishapur
          [62.20, 37.60], // Merv (seat of Sultan Sanjar)
          [60.00, 34.00], // Khorasan south march
          [54.00, 32.00], // Isfahan
          [49.00, 32.00], // Zagros passes
          [46.50, 35.00], // Closing to Hamadan
        ],
      ],
    },
    explanatoryNote: "Later Seljuk realm during the partition into eastern (Khorasan under Sultan Sanjar) and western (Hamadan/Jibal) sultanates preceding the Khwarazmian conquest.",
    reviewStatus: "published",
  },
  {
    id: "ter_almoravid_maghreb_andalus_1040_1147",
    polityId: "pol_almoravid",
    regionName: "Western Maghreb & Southern Al-Andalus",
    validFromYear: 1040,
    validToYear: 1147,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [-9.50, 30.50], // Souss valley & Agadir
          [-8.00, 31.60], // Marrakech (Almoravid founded capital)
          [-5.00, 34.00], // Fez & Meknes
          [-3.00, 35.00], // Rif coast & Melilla
          [-1.00, 37.00], // Almería
          [-0.50, 39.50], // Valencia (reconquered from El Cid)
          [-3.50, 40.00], // Toledo southern frontier
          [-6.00, 37.50], // Seville & Guadalquivir
          [-9.00, 37.00], // Algarve / Silves
          [-6.00, 35.00], // Tangier Strait
          [-8.50, 32.00], // Western plains
          [-10.00, 29.00], // Anti-Atlas Saharan gateways
          [-9.50, 30.50], // Closing to Souss
        ],
      ],
    },
    explanatoryNote: "Saharan Sanhaja Berber realm founded by Yusuf ibn Tashfin uniting Morocco and the Taifa kingdoms of Al-Andalus.",
    reviewStatus: "published",
  },
  {
    id: "ter_almohad_caliphate_1121_1269",
    polityId: "pol_almohad",
    regionName: "Pan-Maghreb & Islamic Iberia",
    validFromYear: 1121,
    validToYear: 1269,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [-9.80, 30.00], // Tinmel / High Atlas sanctuary
          [-7.00, 33.50], // Casablanca / Rabat (Ribat al-Fath)
          [-5.50, 36.00], // Strait of Gibraltar
          [-6.00, 38.00], // Badajoz & Alentejo
          [-3.00, 39.50], // Tagus river frontier
          [-0.50, 38.50], // Denia & Balearic Sea
          [2.00, 36.50],  // Algiers (al-Jaza'ir)
          [10.20, 36.80], // Tunis (Hafsid province)
          [10.50, 34.00], // Sfax & Gabes
          [5.00, 33.00],  // Ziban & Biskra oasis
          [-2.00, 31.50], // Figuig oasis
          [-8.00, 30.50], // Taroudant
          [-9.80, 30.00], // Closing to Tinmel
        ],
      ],
    },
    explanatoryNote: "Unitarian (Muwahhidun) caliphate of Abd al-Mu'min establishing political hegemony across Morocco, Algeria, Tunisia, and southern Spain.",
    reviewStatus: "published",
  },
  {
    id: "ter_ayyubid_sultanate_1171_1260",
    polityId: "pol_ayyubid",
    regionName: "Egypt, Syria, Diyar Bakr & Western Arabia",
    validFromYear: 1171,
    validToYear: 1260,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [29.80, 31.20], // Alexandria & Nile Delta
          [32.30, 31.20], // Damietta naval defense
          [35.00, 33.00], // Acre & Galilee
          [36.20, 35.00], // Hama & Homs
          [37.20, 36.50], // Aleppo (Halab citadel)
          [40.00, 37.50], // Mayyafariqin & Diyar Bakr
          [41.50, 36.50], // Sinjar & Upper Jazira
          [38.50, 34.00], // Palmyra desert route
          [36.30, 31.00], // Karak & Transjordan
          [39.60, 24.50], // Medina
          [39.80, 21.40], // Mecca
          [34.90, 27.50], // Sinai Peninsula
          [31.20, 28.50], // Middle Egypt
          [29.80, 31.20], // Closing to Alexandria
        ],
      ],
    },
    explanatoryNote: "Sultanate founded by Salah al-Din (Saladin) unifying Egypt and Bilad al-Sham, victor at Hattin and liberator of Jerusalem (1187 CE).",
    reviewStatus: "published",
  },
  {
    id: "ter_zengid_aleppo_mosul_1127_1174",
    polityId: "pol_zengid",
    regionName: "Zengid Atabegate (Aleppo, Mosul & Al-Jazira)",
    validFromYear: 1127,
    validToYear: 1174,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [36.20, 36.20], // Antioch march
          [37.16, 36.20], // Aleppo (capital of Nur al-Din)
          [38.00, 36.90], // Aintab / Edessa march
          [38.75, 37.15], // Urfa (captured by Zengi in 1144)
          [40.00, 37.00], // Upper Khabur basin
          [42.00, 37.20], // Nisibis (Nusaybin)
          [43.13, 36.34], // Mosul on the Tigris (Zengid foundation seat)
          [43.50, 35.80], // Erbil frontier
          [42.50, 34.50], // Sinjar & middle Euphrates
          [40.50, 35.00], // Deir ez-Zor
          [38.50, 34.80], // Palmyra march
          [36.80, 34.73], // Homs
          [36.71, 35.13], // Hama (Zengid citadel)
          [36.20, 36.20], // Closing to Antioch march
        ],
      ],
    },
    explanatoryNote: "The unified Syrian-Mesopotamian realm of Imad al-Din Zengi and Nur al-Din spanning Aleppo, Mosul, Edessa, Hama, and Homs, spearheading resistance against the Crusader states.",
    reviewStatus: "published",
  },
  {
    id: "ter_mamluk_sultanate_1250_1517",
    polityId: "pol_mamluk",
    regionName: "Egypt, Bilad al-Sham & Holy Sanctuaries",
    validFromYear: 1250,
    validToYear: 1517,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [29.00, 31.50], // Rosetta & Alexandria
          [32.00, 31.50], // Port Said
          [35.50, 33.00], // Tyre & Sidon
          [36.00, 36.00], // Antioch / Cilician Gates border
          [37.00, 37.00], // Aintab (Gaziantep) northern march
          [38.50, 36.50], // Birecik on the Euphrates
          [38.00, 34.50], // Tadmur (Palmyra)
          [36.00, 31.50], // Jordan valley & Dead Sea
          [39.60, 24.50], // Medina sanctuary
          [39.80, 21.40], // Mecca sanctuary
          [35.00, 27.50], // Gulf of Suez & Sinai
          [31.50, 27.00], // Asyut & Upper Egypt
          [29.00, 31.50], // Closing to Rosetta
        ],
      ],
    },
    explanatoryNote: "Imperial Sultanate of Cairo governing the Nile Valley, Syria, and the Hijaz, defenders of Sunnism against the Ilkhanate and Crusaders.",
    reviewStatus: "published",
  },
  {
    id: "ter_ilkhanate_realm_1258_1335",
    polityId: "pol_mongol",
    regionName: "Ilkhanate of Greater Iran & Mesopotamia",
    validFromYear: 1258,
    validToYear: 1335,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [38.00, 38.00], // Eastern Anatolia / Erzurum border
          [43.00, 39.50], // Kars & Caucasus march
          [48.00, 41.50], // Derbent / Caspian Gate
          [50.00, 40.50], // Baku & Shirvan
          [53.00, 37.50], // Asterabad / Caspian southern shore
          [60.00, 37.50], // Khorasan / Nishapur & Tus
          [62.50, 34.50], // Herat border
          [61.00, 31.00], // Sistan
          [56.50, 27.50], // Persian Gulf / Hormuz
          [50.00, 29.50], // Fars / Shiraz
          [48.00, 31.00], // Khuzestan
          [44.50, 32.50], // Lower Iraq & Kufa
          [43.50, 34.50], // Tikrit / Mosul
          [40.50, 36.50], // Jazira / Diyarbakir
          [38.00, 38.00], // Closing to Erzurum
        ],
      ],
    },
    explanatoryNote: "Southwestern sector of the Mongol Empire governed by the Ilkhans from Tabriz and Soltaniyeh, stretching from the Amu Darya to the borders of Mamluk Syria.",
    reviewStatus: "published",
  },
  {
    id: "ter_ilkhanate_anatolia_vassal_1260_1335",
    polityId: "pol_mongol",
    regionName: "Sultanate of Rum (Ilkhanate Vassal Protectorate)",
    validFromYear: 1260,
    validToYear: 1335,
    controlType: "vassal_state",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [30.50, 40.00], // Bithynia margin
          [32.85, 39.93], // Ankara
          [35.00, 41.00], // Pontic interior
          [37.00, 39.75], // Sivas
          [38.00, 38.00], // Eastern plateau march
          [35.50, 38.70], // Kayseri
          [32.50, 37.87], // Konya (Seljuk capital under Mongol suzerainty)
          [31.00, 38.00], // Lakes region
          [30.50, 40.00], // Closing to Bithynia
        ],
      ],
    },
    explanatoryNote: "The Seljuk Sultanate of Rum reduced to tributary vassalage under the Ilkhanate following the Battle of Köse Dağ (1243 CE).",
    reviewStatus: "published",
  },
  {
    id: "ter_delhi_sultanate_1206_1526",
    polityId: "pol_delhi_sultanate",
    regionName: "Indo-Gangetic Plain & Northern Subcontinent",
    validFromYear: 1206,
    validToYear: 1526,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [71.50, 32.00], // Salt Range / Indus confluence
          [74.50, 32.50], // Sialkot & Lahore
          [77.20, 28.60], // Delhi imperial seat (Qutb complex)
          [82.00, 26.50], // Awadh / Ayodhya
          [88.00, 25.00], // Gaur / Lakhnauti (Bengal)
          [88.50, 22.50], // Ganges Delta
          [82.50, 23.00], // Central provinces
          [77.50, 24.50], // Malwa / Gwalior frontier
          [72.50, 25.50], // Rajasthan borderland
          [70.00, 28.00], // Thar desert boundary
          [71.50, 32.00], // Closing to Salt Range
        ],
      ],
    },
    explanatoryNote: "Dominant Islamic sultanate of Northern India governing the fertile plains from Punjab to the Bay of Bengal through five successive dynasties.",
    reviewStatus: "published",
  },
  {
    id: "ter_timurid_empire_1370_1507",
    polityId: "pol_timurid",
    regionName: "Central Asian Heartland & Greater Iran",
    validFromYear: 1370,
    validToYear: 1507,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [46.50, 38.00], // Tabriz & Azerbaijan
          [50.00, 37.50], // Southern Caspian shore
          [55.00, 38.00], // Asterabad / Gurgan
          [64.50, 41.50], // Kyzylkum margin
          [69.00, 42.00], // Tashkent
          [72.00, 40.00], // Fergana & Tian Shan passes
          [69.00, 34.50], // Kabul
          [62.20, 34.30], // Herat (Timurid cultural metropolis)
          [57.00, 30.00], // Kerman
          [50.00, 30.00], // Shiraz & Fars
          [46.50, 34.00], // Zagros foothills
          [46.50, 38.00], // Closing to Tabriz
        ],
      ],
    },
    explanatoryNote: "The Turco-Mongol empire of Timur and Shah Rukh with monumental architectural centers in Samarkand (Registan) and Herat.",
    reviewStatus: "published",
  },
  {
    id: "ter_ottoman_early_1299_1453",
    polityId: "pol_ottoman",
    regionName: "Early Ottoman Beylik & Rumelia (Bithynia & Balkans)",
    validFromYear: 1299,
    validToYear: 1453,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [20.50, 42.50], // Kosovo & Skopje
          [24.70, 42.15], // Philippopolis (Plovdiv)
          [26.55, 41.67], // Edirne (Adrianople - Ottoman European capital)
          [28.00, 41.20], // Eastern Thrace (surrounding Constantinople)
          [29.00, 40.20], // Bursa (first Ottoman imperial capital 1326)
          [29.70, 40.40], // Nicaea (Iznik)
          [30.00, 40.00], // Söğüt & Bilecik (dynastic cradle)
          [29.00, 39.50], // Phrygia march
          [26.50, 39.50], // Dardanelles / Gallipoli (first European crossing 1354)
          [23.00, 40.50], // Salonica marches
          [21.00, 40.00], // Thessaly
          [20.50, 42.50], // Closing to Kosovo
        ],
      ],
    },
    explanatoryNote: "The emerging Ottoman state during the fourteenth and early fifteenth centuries, expanding from the Bithynian frontier at Söğüt and Bursa across Thrace and the Balkans to Edirne.",
    reviewStatus: "published",
  },
  {
    id: "ter_ottoman_zenith_1453_1683",
    polityId: "pol_ottoman",
    regionName: "Ottoman Empire (Classical Imperial Zenith)",
    validFromYear: 1453,
    validToYear: 1683,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [16.50, 46.50], // Buda & Hungarian plains frontier
          [21.00, 48.00], // Upper Hungary / Carpathia
          [28.50, 45.50], // Moldavia / Black Sea Dobruja
          [35.00, 42.00], // Sinop & Pontic coast
          [42.00, 41.50], // Trabzon & Batumi
          [45.00, 38.00], // Lake Van & Chaldiran frontier
          [48.00, 31.00], // Basra & Shatt al-Arab
          [44.00, 32.00], // Baghdad vilayet
          [37.00, 34.00], // Syrian desert & Damascus
          [35.00, 31.50], // Jerusalem mutasarrifate
          [31.00, 30.00], // Cairo & Nile Valley
          [29.00, 31.50], // Alexandria & Libyan border
          [23.00, 38.00], // Morea / Peloponnese
          [18.00, 42.50], // Dubrovnik / Bosnia march
          [16.50, 46.50], // Closing to Hungary
        ],
      ],
    },
    explanatoryNote: "The classical zenith of the Ottoman Empire under Mehmed II, Selim I, and Suleiman the Magnificent, holding Constantinople, Cairo, Damascus, Baghdad, and the Balkans up to the gates of Vienna.",
    reviewStatus: "published",
  },
  {
    id: "ter_ottoman_late_1684_1922",
    polityId: "pol_ottoman",
    regionName: "Late Ottoman Empire (Anatolia, Levant & Western Arabia)",
    validFromYear: 1684,
    validToYear: 1922,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [26.00, 41.50], // Edirne & Eastern Thrace
          [28.97, 41.00], // Konstantiniyye (Istanbul)
          [35.00, 42.00], // Black Sea Anatolian littoral
          [42.00, 41.50], // Trabzon & Eastern Black Sea
          [44.00, 38.00], // Lake Van eastern border
          [44.00, 33.30], // Baghdad vilayet
          [36.50, 33.50], // Damascus vilayet
          [35.20, 31.78], // Jerusalem mutasarrifate
          [39.60, 24.50], // Medina (Hijaz province)
          [39.82, 21.42], // Mecca sanctuary
          [35.00, 28.00], // Gulf of Aqaba
          [32.00, 31.00], // Suez canal frontier
          [27.00, 37.00], // Aegean Anatolian coast (Izmir)
          [26.00, 40.00], // Dardanelles
          [26.00, 41.50], // Closing to Thrace
        ],
      ],
    },
    explanatoryNote: "The reformed Tanzimat and constitutional-era Ottoman state following European border retrenchments, retaining Anatolia, Eastern Thrace, Syria, Palestine, and the Hijaz until World War I.",
    reviewStatus: "published",
  },
  {
    id: "ter_safavid_empire_1501_1736",
    polityId: "pol_safavid",
    regionName: "Iranian Plateau, Azerbaijan & Khorasan",
    validFromYear: 1501,
    validToYear: 1736,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [46.00, 39.00], // Nakhchivan & Araxes River
          [49.50, 37.50], // Rasht & Gilan coast
          [54.00, 37.00], // Astarabad & Turkmen steppe border
          [60.00, 37.00], // Mashhad & Khorasan shrine city
          [62.50, 35.00], // Hari River & Herat approaches
          [63.00, 31.50], // Sistan
          [60.00, 27.00], // Makran northern border
          [54.00, 27.00], // Bandar Abbas & Strait of Hormuz
          [49.00, 30.00], // Khuzestan / Persian Gulf
          [46.00, 33.50], // Luristan / Ottoman frontier
          [44.50, 36.00], // Kurdistan mountains
          [46.00, 39.00], // Closing to Araxes River
        ],
      ],
    },
    explanatoryNote: "The Twelver Shi'i empire of Shah Ismail I and Shah Abbas the Great with monumental imperial court at Isfahan (Naqsh-e Jahan).",
    reviewStatus: "published",
  },
  {
    id: "ter_mughal_zenith_1526_1707",
    polityId: "pol_mughal",
    regionName: "Mughal Empire (Imperial Subcontinent Zenith)",
    validFromYear: 1526,
    validToYear: 1707,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [69.20, 34.50], // Kabul subah (Babur's gateway)
          [74.30, 33.50], // Kashmir valley & Srinagar
          [77.20, 28.60], // Delhi & Agra imperial centers
          [85.00, 26.00], // Bihar / Patna
          [90.40, 23.70], // Dhaka & Bengal subah (Paradise of Nations)
          [88.00, 21.50], // Bay of Bengal littoral
          [80.00, 16.00], // Deccan / Golconda campaigns
          [76.00, 15.00], // Bijapur southern frontier
          [73.00, 20.00], // Surat & Gujarat trade hub
          [68.50, 25.00], // Sindh & Indus delta (Thatta)
          [66.00, 30.00], // Kandahar borderland
          [69.20, 34.50], // Closing to Kabul
        ],
      ],
    },
    explanatoryNote: "The Mughal Empire during the reigns of Akbar, Jahangir, Shah Jahan, and Aurangzeb, governing one of the wealthiest early modern world empires spanning from Kabul to the Deccan.",
    reviewStatus: "published",
  },
  {
    id: "ter_mughal_late_1708_1857",
    polityId: "pol_mughal",
    regionName: "Later Mughal Domain (Delhi Crown Enclave & Doab)",
    validFromYear: 1708,
    validToYear: 1857,
    controlType: "direct",
    confidence: "well-attested",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [75.50, 29.50], // Haryana northern march
          [77.20, 28.60], // Shahjahanabad / Red Fort (Delhi)
          [78.00, 27.20], // Agra / Doab
          [79.50, 26.50], // Cawnpore borderland
          [78.50, 25.50], // Gwalior approach
          [76.50, 26.50], // Rajputana march
          [75.50, 28.00], // Shekhawati
          [75.50, 29.50], // Closing to Haryana
        ],
      ],
    },
    explanatoryNote: "The later Mughal imperial territory contracted to Delhi (Shahjahanabad) and the surrounding Yamuna-Ganges Doab prior to the 1857 uprising and British direct annexation.",
    reviewStatus: "published",
  },
];

export const initialHistoricalEvents: HistoricalEventRecord[] = [
  {
    id: "evt_accession_abu_bakr_632",
    title: "Accession of Abu Bakr al-Siddiq & Founding of the Caliphate",
    eventYear: 632,
    summary: "Following the death of the Prophet Muhammad, Abu Bakr al-Siddiq was pledged allegiance at Saqifah Bani Sa'ida as the first caliph (successor), establishing the Rashidun Caliphate.",
    eventType: "founding",
    locationName: "Medina, Hijaz",
    locationGeojson: {
      type: "Point",
      coordinates: [39.6122, 24.4672],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_conquest_damascus_635",
    title: "Conquest of Damascus",
    eventYear: 635,
    summary: "Muslim forces under Khalid ibn al-Walid took control of Damascus from the Byzantine Empire.",
    eventType: "conquest",
    locationName: "Damascus",
    locationGeojson: {
      type: "Point",
      coordinates: [36.2765, 33.5138],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_battle_of_yarmouk_636",
    title: "Battle of Yarmouk",
    eventYear: 636,
    summary: "Decisive confrontation between the Muslim forces and the Byzantine Empire that ended Byzantine rule in Syria.",
    eventType: "battle",
    locationName: "Yarmouk River, Jordan/Syria border",
    locationGeojson: {
      type: "Point",
      coordinates: [35.8, 32.8],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_founding_fustat_641",
    title: "Founding of Fustat",
    eventYear: 641,
    summary: "The first capital of Islamic Egypt founded by Amr ibn al-As following the conquest of Alexandria and Babylon fortress.",
    eventType: "founding",
    locationName: "Fustat (Old Cairo), Egypt",
    locationGeojson: {
      type: "Point",
      coordinates: [31.23, 30.0],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_landing_gibraltar_711",
    title: "Tariq ibn Ziyad Crosses the Strait",
    eventYear: 711,
    summary: "Umayyad Berber commander Tariq ibn Ziyad landed near Gibraltar, beginning the Islamic era in the Iberian Peninsula.",
    eventType: "conquest",
    locationName: "Gibraltar (Jabal Tariq), Iberia",
    locationGeojson: {
      type: "Point",
      coordinates: [-5.35, 36.14],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_battle_of_zab_750",
    title: "Battle of the Zab",
    eventYear: 750,
    summary: "Decisive battle in northern Iraq where the Abbasid army defeated Marwan II, ending Umayyad rule in the East.",
    eventType: "battle",
    locationName: "Great Zab River, Iraq",
    locationGeojson: {
      type: "Point",
      coordinates: [43.4, 35.9],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_founding_cordoba_756",
    title: "Founding of the Independent Umayyad Emirate of Córdoba",
    eventYear: 756,
    summary: "Abd al-Rahman I established an independent Umayyad emirate in Al-Andalus, breaking away from Abbasid authority.",
    eventType: "founding",
    locationName: "Córdoba, Al-Andalus",
    locationGeojson: {
      type: "Point",
      coordinates: [-4.78, 37.88],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_founding_baghdad_762",
    title: "Founding of the Round City of Baghdad",
    eventYear: 762,
    summary: "Caliph al-Mansur inaugurated the construction of Madinat al-Salam (the City of Peace) as the Abbasid capital.",
    eventType: "founding",
    locationName: "Baghdad, Iraq",
    locationGeojson: {
      type: "Point",
      coordinates: [44.3615, 33.3152],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_proclamation_fatimid_909",
    title: "Proclamation of the Fatimid Caliphate",
    eventYear: 909,
    summary: "Abdallah al-Mahdi Billah was proclaimed caliph in Ifriqiya, establishing the Fatimid counter-caliphate.",
    eventType: "founding",
    locationName: "Mahdia, Tunisia",
    locationGeojson: {
      type: "Point",
      coordinates: [11.06, 35.5],
    },
    reviewStatus: "published",
  },
  {
    id: "evt_founding_cairo_969",
    title: "Fatimid Conquest of Egypt & Founding of Cairo",
    eventYear: 969,
    summary: "Fatimid general Jawhar al-Siqilli conquered Egypt and laid the foundation stones of the new royal capital al-Qahira (Cairo).",
    eventType: "conquest",
    locationName: "Cairo, Egypt",
    locationGeojson: {
      type: "Point",
      coordinates: [31.25, 30.05],
    },
    reviewStatus: "published",
  },
];

export const initialRulers: NewRulerRecord[] = [
  {
    id: "rul_abu_bakr",
    preferredName: "Abu Bakr al-Siddiq",
    birthYear: 573,
    deathYear: 634,
    biography: "The first Rashidun caliph (r. 632–634 CE / 11–13 AH). He consolidated political authority across the Arabian Peninsula during the Ridda Wars and initiated the earliest campaigns into Roman Syria and Sasanian Iraq.",
    reviewStatus: "published",
  },
  {
    id: "rul_umar_ibn_al_khattab",
    preferredName: "Umar ibn al-Khattab",
    birthYear: 584,
    deathYear: 644,
    biography: "The second Rashidun caliph (r. 634–644 CE / 13–23 AH). His reign witnessed monumental territorial expansion including the conquests of Syria, Palestine, Egypt, and Iraq, alongside administrative institutionalization including the Diwan and the Hijri calendar.",
    reviewStatus: "published",
  },
  {
    id: "rul_uthman_ibn_affan",
    preferredName: "Uthman ibn Affan",
    birthYear: 576,
    deathYear: 656,
    biography: "The third Rashidun caliph (r. 644–656 CE / 23–35 AH). Known for overseeing the standardized recension and distribution of the written text of the Qur'an and extending maritime naval expeditions across the Eastern Mediterranean.",
    reviewStatus: "published",
  },
  {
    id: "rul_ali_ibn_abi_talib",
    preferredName: "Ali ibn Abi Talib",
    birthYear: 601,
    deathYear: 661,
    biography: "The fourth Rashidun caliph (r. 656–661 CE / 35–40 AH) and first Shi'a Imam. Governed from Kufa in Iraq during the First Fitna (civil war), confronting challenges to central authority at the Camel and Siffin.",
    reviewStatus: "published",
  },
  {
    id: "rul_muawiya_i",
    preferredName: "Mu'awiya I ibn Abi Sufyan",
    birthYear: 602,
    deathYear: 680,
    biography: "Founder of the Umayyad Dynasty and Caliphate (r. 661–680 CE / 41–60 AH). Transferred the caliphal capital to Damascus in Syria, stabilized imperial administration, and established dynastic succession.",
    reviewStatus: "published",
  },
  {
    id: "rul_abd_al_malik",
    preferredName: "Abd al-Malik ibn Marwan",
    birthYear: 646,
    deathYear: 705,
    biography: "The fifth Umayyad caliph (r. 685–705 CE / 65–86 AH), regarded as the architect of the consolidated imperial state. Reformed monetary coinage into epigraphic Arabic gold dinars, arabized bureaucratic records, and commissioned the Dome of the Rock in Jerusalem.",
    reviewStatus: "published",
  },
  {
    id: "rul_al_walid_i",
    preferredName: "al-Walid I",
    birthYear: 668,
    deathYear: 715,
    biography: "The sixth Umayyad caliph (r. 705–715 CE / 86–96 AH). Presided over the caliphate's peak geographical expansion reaching from the Iberian Peninsula and Transoxiana to the Indus Valley, and patronized monumental architectural feats including the Great Mosque of Damascus and al-Aqsa.",
    reviewStatus: "published",
  },
  {
    id: "rul_umar_ii",
    preferredName: "Umar ibn Abd al-Aziz (Umar II)",
    birthYear: 682,
    deathYear: 720,
    biography: "Eighth Umayyad caliph (r. 717–720 CE / 99–101 AH), celebrated in classical historiography for his personal piety, fiscal tax equity for non-Arab converts (mawali), and peaceful administrative reforms.",
    reviewStatus: "published",
  },
  {
    id: "rul_hisham",
    preferredName: "Hisham ibn Abd al-Malik",
    birthYear: 691,
    deathYear: 743,
    biography: "Tenth Umayyad caliph (r. 724–743 CE / 105–125 AH). A prudent administrator whose lengthy 19-year reign maintained the integrity of the extensive Umayyad imperial boundaries from Spain to Central Asia.",
    reviewStatus: "published",
  },
  {
    id: "rul_al_saffah",
    preferredName: "Abu al-Abbas al-Saffah",
    birthYear: 721,
    deathYear: 754,
    biography: "First Abbasid caliph (r. 750–754 CE / 132–136 AH). Overthrew the Umayyad dynasty with Hashimite revolutionary support in Khurasan and laid the cornerstone of Abbasid caliphal rule in Iraq.",
    reviewStatus: "published",
  },
  {
    id: "rul_al_mansur",
    preferredName: "Abu Ja'far al-Mansur",
    birthYear: 714,
    deathYear: 775,
    biography: "Second Abbasid caliph (r. 754–775 CE / 136–158 AH) and true architect of the Abbasid empire. Founded the imperial capital Baghdad (Madinat al-Salam) in 762 CE and institutionalized centralized imperial bureaucracy.",
    reviewStatus: "published",
  },
  {
    id: "rul_harun_al_rashid",
    preferredName: "Harun al-Rashid",
    birthYear: 766,
    deathYear: 809,
    biography: "Fifth Abbasid caliph (r. 786–809 CE / 170–193 AH). His reign represents the pinnacle of the Islamic Golden Age in Baghdad, characterized by scientific translation, patronized scholarship, and diplomatic relations with Charlemagne and the Tang Empire.",
    reviewStatus: "published",
  },
  {
    id: "rul_al_mamun",
    preferredName: "al-Ma'mun",
    birthYear: 786,
    deathYear: 833,
    biography: "Seventh Abbasid caliph (r. 813–833 CE / 198–218 AH). Renowned patron of science, astronomy, and Greek-to-Arabic translation at the House of Wisdom (Bayt al-Hikma), as well as theological rationalism.",
    reviewStatus: "published",
  },
  {
    id: "rul_abd_al_rahman_i",
    preferredName: "Abd al-Rahman I (al-Dakhil)",
    birthYear: 731,
    deathYear: 788,
    biography: "Founder of the Umayyad Emirate of Córdoba (r. 756–788 CE / 138–172 AH). Sole surviving Umayyad prince who escaped the Abbasid massacre in Syria, crossed North Africa, and established an independent dynasty in Al-Andalus.",
    reviewStatus: "published",
  },
  {
    id: "rul_abd_al_rahman_iii",
    preferredName: "Abd al-Rahman III (al-Nasir)",
    birthYear: 891,
    deathYear: 961,
    biography: "Eighth ruler and first Caliph of Córdoba (r. 912–961 CE / 300–350 AH). United Al-Andalus, proclaimed the Umayyad Caliphate of Córdoba in 929 CE, and constructed the palace-city of Madinat al-Zahra.",
    reviewStatus: "published",
  },
  {
    id: "rul_al_mahdi_billah",
    preferredName: "Abdallah al-Mahdi Billah",
    birthYear: 873,
    deathYear: 934,
    biography: "First Fatimid caliph and Isma'ili Imam (r. 909–934 CE / 297–322 AH). Established the Fatimid Caliphate in Ifriqiya (modern Tunisia), founding the naval capital of Mahdia.",
    reviewStatus: "published",
  },
  {
    id: "rul_al_muizz",
    preferredName: "al-Mu'izz li-Din Allah",
    birthYear: 932,
    deathYear: 975,
    biography: "Fourth Fatimid caliph (r. 953–975 CE / 341–365 AH). Dispatched general Jawhar to conquer Egypt in 969 CE, founded Cairo (al-Qahira) as the new dynastic capital, and inaugurated al-Azhar.",
    reviewStatus: "published",
  },
];

export const initialReigns: NewReignRecord[] = [
  {
    id: "reign_abu_bakr",
    rulerId: "rul_abu_bakr",
    polityId: "pol_rashidun",
    startYear: 632,
    endYear: 634,
    title: "Caliph (Khalifat Rasul Allah)",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_umar",
    rulerId: "rul_umar_ibn_al_khattab",
    polityId: "pol_rashidun",
    startYear: 634,
    endYear: 644,
    title: "Caliph (Amir al-Mu'minin)",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_uthman",
    rulerId: "rul_uthman_ibn_affan",
    polityId: "pol_rashidun",
    startYear: 644,
    endYear: 656,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_ali",
    rulerId: "rul_ali_ibn_abi_talib",
    polityId: "pol_rashidun",
    startYear: 656,
    endYear: 661,
    title: "Caliph / Imam",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_muawiya",
    rulerId: "rul_muawiya_i",
    polityId: "pol_umayyad",
    startYear: 661,
    endYear: 680,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_abd_al_malik",
    rulerId: "rul_abd_al_malik",
    polityId: "pol_umayyad",
    startYear: 685,
    endYear: 705,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_al_walid_i",
    rulerId: "rul_al_walid_i",
    polityId: "pol_umayyad",
    startYear: 705,
    endYear: 715,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_umar_ii",
    rulerId: "rul_umar_ii",
    polityId: "pol_umayyad",
    startYear: 717,
    endYear: 720,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_hisham",
    rulerId: "rul_hisham",
    polityId: "pol_umayyad",
    startYear: 724,
    endYear: 743,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_al_saffah",
    rulerId: "rul_al_saffah",
    polityId: "pol_abbasid_early",
    startYear: 750,
    endYear: 754,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_al_mansur",
    rulerId: "rul_al_mansur",
    polityId: "pol_abbasid_early",
    startYear: 754,
    endYear: 775,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_harun_al_rashid",
    rulerId: "rul_harun_al_rashid",
    polityId: "pol_abbasid_early",
    startYear: 786,
    endYear: 809,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_al_mamun",
    rulerId: "rul_al_mamun",
    polityId: "pol_abbasid_early",
    startYear: 813,
    endYear: 833,
    title: "Caliph",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_abd_al_rahman_i",
    rulerId: "rul_abd_al_rahman_i",
    polityId: "pol_cordoba_emirate",
    startYear: 756,
    endYear: 788,
    title: "Emir of Córdoba",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_abd_al_rahman_iii",
    rulerId: "rul_abd_al_rahman_iii",
    polityId: "pol_cordoba_emirate",
    startYear: 912,
    endYear: 961,
    title: "Emir / Caliph of Córdoba",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_al_mahdi_billah",
    rulerId: "rul_al_mahdi_billah",
    polityId: "pol_fatimid",
    startYear: 909,
    endYear: 934,
    title: "Caliph-Imam",
    isCoRuler: false,
    reviewStatus: "published",
  },
  {
    id: "reign_al_muizz",
    rulerId: "rul_al_muizz",
    polityId: "pol_fatimid",
    startYear: 953,
    endYear: 975,
    title: "Caliph-Imam",
    isCoRuler: false,
    reviewStatus: "published",
  },
];

export const initialTradeRoutes: (Omit<TradeRouteRecord, "createdAt"> & { createdAt?: Date })[] = [
  {
    id: "route_darb_zubaydah",
    name: "Darb Zubaydah (Kufa–Mecca Pilgrim Highway)",
    routeType: "pilgrim_road",
    description: "The premier imperial Abbasid pilgrimage highway engineered under the patronage of Empress Zubaydah bint Ja'far (wife of Harun al-Rashid). Spanning over 1,400 km across the Arabian desert, it featured monumental stone-walled water reservoirs (birak), lined wells, fortified caravanserais, and fire guidance beacons.",
    primaryCommodities: "Pilgrims, Caliphal Mail (Barid), Luxury Goods, Textiles",
    activeFromYear: 750,
    activeToYear: 1258,
    pathGeojson: {
      type: "LineString",
      coordinates: [
        [44.38, 32.03], // Kufa
        [43.60, 30.80], // al-Qadisiyya
        [42.50, 28.00], // al-Tha'labiyya
        [42.18, 27.12], // Fayd
        [41.30, 24.63], // al-Rabadha
        [40.40, 22.80], // al-Dhariba
        [39.82, 21.42], // Mecca
      ],
    },
    reviewStatus: "published",
  },
  {
    id: "route_silk_road_khurasan",
    name: "Great Khurasan Road (Silk Road Western Trunk)",
    routeType: "caravan_route",
    description: "The major arterial overland trunk of the Silk Road connecting Baghdad to Central Asia and China. Documented extensively by postal geographers Ibn Khordadbeh and al-Muqaddasi, passing through the Zagros gates, the Iranian plateau, Merv oasis, and Transoxiana.",
    primaryCommodities: "Chinese Silk, Samarkand Rag Paper, Fergana Horses, Lapis Lazuli, Spices, Ceramics",
    activeFromYear: 632,
    activeToYear: 1500,
    pathGeojson: {
      type: "LineString",
      coordinates: [
        [44.36, 33.31], // Baghdad
        [45.85, 34.46], // Hulwan (Zagros Pass)
        [47.07, 34.31], // Kermanshah
        [48.51, 34.79], // Hamadan
        [51.43, 35.59], // Rayy (Tehran)
        [54.34, 36.17], // Damghan
        [58.79, 36.21], // Nishapur
        [59.60, 36.30], // Tus / Mashhad
        [62.19, 37.60], // Merv Oasis
        [63.60, 39.10], // Amul (Oxus / Amu Darya crossing)
        [64.42, 39.77], // Bukhara
        [66.97, 39.65], // Samarkand
      ],
    },
    reviewStatus: "published",
  },
  {
    id: "route_darb_al_hajj_shami",
    name: "Darb al-Hajj al-Shami (Syrian Pilgrimage Road)",
    routeType: "pilgrim_road",
    description: "The ancient pilgrimage highway connecting Damascus, the Umayyad capital, to the holy sanctuaries of Medina and Mecca. Tracing the historic King's Highway through the desert frontier of the Hawran, Jordan, and the northern Hijaz.",
    primaryCommodities: "Pilgrims, Syrian Olive Oil, Glassware, Damascus Steel, Parchment",
    activeFromYear: 632,
    activeToYear: 1914,
    pathGeojson: {
      type: "LineString",
      coordinates: [
        [36.29, 33.51], // Damascus
        [36.48, 32.52], // Bosra
        [35.93, 31.95], // Amman
        [35.73, 30.19], // Ma'an
        [36.56, 28.38], // Tabuk
        [37.92, 26.61], // al-Ula (Mada'in Salih)
        [39.61, 24.47], // Medina
        [39.82, 21.42], // Mecca
      ],
    },
    reviewStatus: "published",
  },
  {
    id: "route_maritime_spice_incense",
    name: "Indian Ocean & Red Sea Maritime Spice Route",
    routeType: "maritime_lane",
    description: "The maritime monsoon trading network connecting Persian Gulf and Red Sea ports to India and Southeast Asia. Muslim dhows navigated between Siraf, Basra, Sohar, Aden, and Jeddah, trading in frankincense, spices, and porcelain.",
    primaryCommodities: "Frankincense, Myrrh, Black Pepper, Cinnamon, Pearls, Chinese Porcelain",
    activeFromYear: 632,
    activeToYear: 1600,
    pathGeojson: {
      type: "LineString",
      coordinates: [
        [47.81, 30.50], // Basra
        [50.05, 29.25], // Northern Gulf waters
        [52.34, 27.67], // Siraf (Persian Gulf entrepôt)
        [56.27, 26.19], // Strait of Hormuz
        [56.74, 24.36], // Sohar (Oman)
        [58.59, 23.61], // Muscat
        [59.80, 22.50], // Ras al-Hadd (eastern tip of Arabia)
        [58.00, 20.60], // Masirah Island channel
        [54.70, 16.98], // Mirbat / Salalah (Dhofar frankincense coast)
        [49.15, 14.53], // al-Mukalla / al-Shihr (Hadramawt coast)
        [45.03, 12.78], // Aden (Gulf of Aden port)
        [43.40, 12.60], // Bab al-Mandab Strait
        [42.95, 14.80], // al-Hudaydah (Red Sea coast)
        [39.19, 21.54], // Jeddah (Port of Mecca)
        [38.05, 24.09], // Yanbu (Port of Medina)
        [32.55, 29.96], // al-Qulzum (Suez terminal)
      ],
    },
    reviewStatus: "published",
  },
  {
    id: "route_trans_saharan_gold",
    name: "Trans-Saharan Western Gold & Salt Route",
    routeType: "caravan_route",
    description: "The hazardous desert caravan trail connecting the Maghrib and Al-Andalus to West African Sahel kingdoms. Berber caravans navigated camel routes between oasis entrepôts, trading Mediterranean manufactures and Saharan rock salt for sub-Saharan gold and ivory.",
    primaryCommodities: "Bambuk/Bure Gold, Taghaza Rock Salt, Saharan Dates, Books, Textiles",
    activeFromYear: 700,
    activeToYear: 1600,
    pathGeojson: {
      type: "LineString",
      coordinates: [
        [-4.99, 34.03], // Fez
        [-4.27, 31.28], // Sijilmasa
        [-4.98, 23.57], // Taghaza Salt Mines
        [-3.98, 22.67], // Taoudenni
        [-7.02, 17.30], // Walata / Awdaghost
        [-7.97, 15.75], // Koumbi Saleh (Ancient Ghana)
      ],
    },
    reviewStatus: "published",
  },
  {
    id: "route_andalusi_via_cordoba",
    name: "The Caliphal Highway of Al-Andalus",
    routeType: "caravan_route",
    description: "The primary internal Roman-Islamic trunk road linking the Umayyad capital of Córdoba northwards through the Meseta Central to the Upper March (al-Thaghr al-A'la) at Zaragoza and Narbonne.",
    primaryCommodities: "Andalusi Olive Oil, Paper, Toledo Swords, Saffron, Leather",
    activeFromYear: 756,
    activeToYear: 1031,
    pathGeojson: {
      type: "LineString",
      coordinates: [
        [-4.78, 37.88], // Córdoba
        [-3.92, 38.98], // Calatrava
        [-4.02, 39.86], // Toledo
        [-3.16, 40.63], // Guadalajara
        [-2.43, 41.17], // Medinaceli
        [-0.88, 41.65], // Zaragoza
      ],
    },
    reviewStatus: "published",
  },
];

export const initialMonuments: (Omit<NewMonumentRecord, "createdAt"> & { createdAt?: Date })[] = [
  {
    id: "mon_dome_of_the_rock_691",
    name: "Dome of the Rock (Qubbat al-Sakhrah)",
    monumentType: "mosque",
    polityId: "pol_umayyad",
    foundingYear: 691,
    cityName: "Jerusalem",
    locationGeojson: {
      type: "Point",
      coordinates: [35.2354, 31.778],
    },
    architecturalFeatures: "Octagonal ambulatory, gold-gilded wooden dome, earliest surviving monumental epigraphic Qur'anic inscriptions, Byzantine-Sasanian mosaic syntheses.",
    description: "Commissioned by Umayyad Caliph Abd al-Malik ibn Marwan in 691 CE (72 AH). The earliest masterpiece of Islamic monumental architecture, enshrining the Sacred Rock with exquisite mosaic programs.",
    reviewStatus: "published",
  },
  {
    id: "mon_umayyad_mosque_damascus_706",
    name: "Great Mosque of Damascus (Umayyad Mosque)",
    monumentType: "mosque",
    polityId: "pol_umayyad",
    foundingYear: 706,
    cityName: "Damascus",
    locationGeojson: {
      type: "Point",
      coordinates: [36.3065, 33.5119],
    },
    architecturalFeatures: "Triple-aisled prayer hall, monumental transept dome (Dome of the Eagle), Barada River landscape mosaics, square stone minarets.",
    description: "Commissioned by Caliph al-Walid I in 706–715 CE on the site of the ancient Temenos of Damascus. Established the canonical congregational mosque plan with grand courtyard arcades and golden vegetal mosaics.",
    reviewStatus: "published",
  },
  {
    id: "mon_bayt_al_hikma_762",
    name: "House of Wisdom (Bayt al-Hikma)",
    monumentType: "academy_library",
    polityId: "pol_abbasid_early",
    foundingYear: 762,
    cityName: "Baghdad",
    locationGeojson: {
      type: "Point",
      coordinates: [44.3615, 33.3152],
    },
    architecturalFeatures: "Caliphal research institute, scriptorium, astronomical observation stations, multi-language translation bureau, repository of Sanskrit, Persian, and Hellenistic codices.",
    description: "The premier intellectual center of the Islamic Golden Age in Baghdad. Expanded under Caliphs Harun al-Rashid and al-Ma'mun, spearheading the monumental Greco-Arabic translation movement and scientific synthesis.",
    reviewStatus: "published",
  },
  {
    id: "mon_great_mosque_cordoba_785",
    name: "Great Mosque of Córdoba (La Mezquita)",
    monumentType: "mosque",
    polityId: "pol_cordoba_emirate",
    foundingYear: 785,
    cityName: "Córdoba",
    locationGeojson: {
      type: "Point",
      coordinates: [-4.7794, 37.8789],
    },
    architecturalFeatures: "Hypostyle forest of 856 columns, double-tiered horseshoe and polylobed arches in alternating red brick and white stone, ribbed melon domes, octagonal shell-domed mihrab.",
    description: "Founded in 785 CE by Abd al-Rahman I and expanded by subsequent Umayyad emirs and Caliph Abd al-Rahman III. A wonder of medieval architecture synthesizing Hispano-Roman, Visigothic, and Syrian Umayyad motifs.",
    reviewStatus: "published",
  },
  {
    id: "mon_al_qarawiyyin_859",
    name: "University & Mosque of al-Qarawiyyin",
    monumentType: "academy_library",
    polityId: "pol_cordoba_emirate",
    foundingYear: 859,
    cityName: "Fez",
    locationGeojson: {
      type: "Point",
      coordinates: [-4.9734, 34.0649],
    },
    architecturalFeatures: "Central courtyard with Andalusi pavilions, vast hypostyle prayer hall, historic manuscript library housing unique 9th-century parchment Qur'ans, intricate plaster zellij tilework.",
    description: "Founded in 859 CE by the pious benefactor Fatima al-Fihri in Fez, Morocco. Recognized by UNESCO as the oldest continually operating university in the world, becoming a beacon of astronomy, grammar, and Islamic jurisprudence.",
    reviewStatus: "published",
  },
  {
    id: "mon_al_azhar_970",
    name: "Al-Azhar Mosque & Academy",
    monumentType: "academy_library",
    polityId: "pol_fatimid",
    foundingYear: 970,
    cityName: "Cairo",
    locationGeojson: {
      type: "Point",
      coordinates: [31.2625, 30.0457],
    },
    architecturalFeatures: "Fatimid keel-shaped stucco arches, rosette relief carvings, central peristyle sahn, five historical minarets from Fatimid to Mamluk eras.",
    description: "Commissioned by the Fatimid conqueror general Jawhar al-Siqilli in 970 CE and inaugurated by Caliph al-Mu'izz in 972 CE. Rapidly evolved into one of the most prestigious academies of Islamic theology, philosophy, and sciences.",
    reviewStatus: "published",
  },
];

export const initialScholars: (Omit<NewScholarRecord, "createdAt"> & { createdAt?: Date })[] = [
  {
    id: "sch_al_khwarizmi",
    name: "Muhammad ibn Musa al-Khwarizmi",
    birthYear: 780,
    deathYear: 850,
    fieldsOfStudy: "Mathematics, Algebra, Astronomy, Geography",
    primaryCity: "Baghdad",
    patronizedByPolityId: "pol_abbasid_early",
    majorWorks: "al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala (The Compendious Book on Calculation by Completion and Balancing), Kitab Surat al-Ard",
    biography: "Persian polymath at the House of Wisdom in Baghdad. Known as the 'Father of Algebra' (from which the word algebra originates) and author of the text that introduced Hindu-Arabic numerals and positional decimal algorithms to Europe (giving rise to the term algorithm).",
    reviewStatus: "published",
  },
  {
    id: "sch_al_kindi",
    name: "Abu Yusuf Ya'qub ibn Ishaq al-Kindi (Alkindus)",
    birthYear: 801,
    deathYear: 873,
    fieldsOfStudy: "Philosophy, Cryptanalysis, Optics, Music Theory, Chemistry",
    primaryCity: "Baghdad",
    patronizedByPolityId: "pol_abbasid_early",
    majorWorks: "Fi al-Falsafa al-Ula (On First Philosophy), Manuscript on Deciphering Cryptographic Messages",
    biography: "Known as the 'Philosopher of the Arabs'. Pioneered the synthesis of Aristotelian and Neoplatonic philosophy with Islamic theology and authored the earliest known treatise on cryptanalysis and frequency analysis.",
    reviewStatus: "published",
  },
  {
    id: "sch_al_razi",
    name: "Abu Bakr al-Razi (Rhazes)",
    birthYear: 865,
    deathYear: 925,
    fieldsOfStudy: "Clinical Medicine, Chemistry, Experimental Pharmacology, Ophthalmology",
    primaryCity: "Rayy & Baghdad",
    patronizedByPolityId: "pol_abbasid_early",
    majorWorks: "Kitab al-Hawi fi al-Tibb (The Comprehensive Book on Medicine / Continens), Treatise on Smallpox and Measles",
    biography: "One of the greatest clinical physicians of antiquity. Chief physician of the imperial hospitals in Rayy and Baghdad, he was the first to clinically differentiate smallpox from measles and introduced the use of alcohol in antiseptic medicine.",
    reviewStatus: "published",
  },
  {
    id: "sch_al_battani",
    name: "Muhammad ibn Jabir al-Battani (Albatenius)",
    birthYear: 858,
    deathYear: 929,
    fieldsOfStudy: "Astronomy, Trigonometry, Spherical Geometry",
    primaryCity: "al-Raqqa",
    patronizedByPolityId: "pol_abbasid_early",
    majorWorks: "Kitab az-Zij (Book of Astronomical Tables), Treatises on Solar Equations",
    biography: "Renowned astronomer and mathematician based at al-Raqqa on the Euphrates. Calculated the solar year with astonishing precision (365 days, 5 hours, 46 minutes, and 24 seconds, differing by only 2 minutes from modern measurements) and popularized the trigonometric sine, tangent, and secant functions.",
    reviewStatus: "published",
  },
  {
    id: "sch_al_farabi",
    name: "Abu Nasr al-Farabi (Alpharabius)",
    birthYear: 872,
    deathYear: 950,
    fieldsOfStudy: "Political Philosophy, Logic, Metaphysics, Musicology",
    primaryCity: "Damascus & Baghdad",
    patronizedByPolityId: "pol_abbasid_early",
    majorWorks: "al-Madina al-Fadila (The Virtuous City), Kitab al-Musiqa al-Kabir (The Great Book of Music)",
    biography: "Revered in medieval Arabic tradition as 'The Second Teacher' (after Aristotle). Author of foundational works on political ethics, civic order, formal logic, and the physics of acoustics.",
    reviewStatus: "published",
  },
  {
    id: "sch_ibn_al_haytham",
    name: "al-Hasan Ibn al-Haytham (Alhazen)",
    birthYear: 965,
    deathYear: 1040,
    fieldsOfStudy: "Experimental Optics, Visual Perception, Astronomy, Mathematics",
    primaryCity: "Cairo",
    patronizedByPolityId: "pol_fatimid",
    majorWorks: "Kitab al-Manazir (Book of Optics / De Aspectibus), On the Configuration of the World",
    biography: "Pioneering polymath born in Basra who flourished in Fatimid Cairo. Celebrated as the 'Father of Modern Optics' for disproving extramission theory, inventing the camera obscura, and formulating the rigorous experimental scientific method based on falsifiable empirical verification.",
    reviewStatus: "published",
  },
];

export const initialCampaigns: (Omit<NewCampaignRecord, "createdAt"> & { createdAt?: Date })[] = [
  {
    id: "camp_ridda_632_633",
    name: "Abu Bakr's Ridda Consolidation Campaigns",
    startYear: 632,
    endYear: 633,
    polityId: "pol_rashidun",
    commanderName: "Khalid ibn al-Walid & Ikrima ibn Abi Jahl",
    rulerId: "rul_abu_bakr",
    routeGeojson: {
      type: "LineString",
      coordinates: [
        [39.61, 24.47], // Medina
        [41.80, 26.20], // Buzakha (defeat of Tulayha)
        [42.20, 27.10], // Zafar
        [46.70, 24.10], // Yamama / Battle of Aqraba
        [49.60, 25.40], // Hajar (al-Ahsa & Gulf coast)
        [54.37, 24.45], // Dibba (Oman march)
      ],
    },
    keyLocations: "Medina → Buzakha → Yamama (Aqraba) → Hajar → Dibba",
    strategicOutcome: "Decisive Rashidun victory over secessionist tribal coalitions; total political and military unification of the Arabian Peninsula under the Medina Caliphate.",
    description: "Dispatched in eleven corps by Caliph Abu Bakr in 632 CE to suppress widespread tribal insurrections following the Prophet's death. Khalid ibn al-Walid defeated Tulayha at Buzakha and Musaylima at the fateful Battle of the Garden of Death in Yamama, solidifying central governance and mobilizing Arab armies for outward expansion.",
    reviewStatus: "published",
  },
  {
    id: "camp_yarmouk_634_636",
    name: "Khalid ibn al-Walid's Syrian March & Battle of Yarmouk",
    startYear: 634,
    endYear: 636,
    polityId: "pol_rashidun",
    commanderName: "Khalid ibn al-Walid (Sayf Allah al-Maslul)",
    rulerId: "rul_abu_bakr",
    routeGeojson: {
      type: "LineString",
      coordinates: [
        [44.35, 31.88], // al-Hira, Iraq
        [43.48, 32.56], // Ayn al-Tamr
        [39.0, 31.5],   // Suwa / Quraqir Desert Crossing
        [38.28, 34.56], // Tadmur (Palmyra)
        [37.23, 34.23], // al-Qaryatayn
        [36.31, 33.51], // Damascus
        [36.48, 32.52], // Bosra
        [35.68, 32.74], // Yarmouk River Gorge
      ],
    },
    keyLocations: "al-Hira → Suwa Desert Crossing → Palmyra → Damascus → Bosra → Yarmouk Gorge",
    strategicOutcome: "Decisive Rashidun victory over Theodore Trithyrius and Vahan; complete collapse of Byzantine military power in the southern Levant, securing Syria and Palestine.",
    description: "Legendary desert flanking maneuver by Khalid ibn al-Walid, crossing the waterless Syrian desert from southern Iraq in five days to reinforce Abu Ubaidah. Culminated in the six-day Battle of Yarmouk along the deep ravines of the Yarmouk River, breaking the imperial Byzantine field army.",
    reviewStatus: "published",
  },
  {
    id: "camp_qadisiyyah_636",
    name: "Sa'd ibn Abi Waqqas' Mesopotamian Campaign & al-Qadisiyyah",
    startYear: 636,
    endYear: 637,
    polityId: "pol_rashidun",
    commanderName: "Sa'd ibn Abi Waqqas",
    rulerId: "rul_umar_ibn_al_khattab",
    routeGeojson: {
      type: "LineString",
      coordinates: [
        [39.61, 24.47], // Medina
        [43.15, 27.50], // Zarud oasis
        [44.20, 29.80], // Sharaf oasis
        [44.25, 31.60], // al-Udhayb
        [44.34, 31.58], // al-Qadisiyyah
        [44.32, 32.00], // Najaf ridge
        [44.42, 32.54], // Babylon
        [44.58, 33.09], // Ctesiphon (al-Mada'in)
      ],
    },
    keyLocations: "Medina → Zarud → al-Qadisiyyah → Babylon → Ctesiphon (al-Mada'in)",
    strategicOutcome: "Decisive Rashidun victory over the Sasanian field army commanded by Rostam Farrokhzad; capture of the Sasanian royal capital Ctesiphon and annexation of lower and central Mesopotamia.",
    description: "Dispatched by Caliph Umar ibn al-Khattab with an army of 30,000 companions and tribesmen. After four days of savage combat including elephant charges at al-Qadisiyyah, the Sasanian defenses broke. Sa'd subsequently crossed the Tigris and captured the legendary White Palace of Ctesiphon.",
    reviewStatus: "published",
  },
  {
    id: "camp_conquest_egypt_639_642",
    name: "'Amr ibn al-'As' Conquest of Byzantine Egypt",
    startYear: 639,
    endYear: 642,
    polityId: "pol_rashidun",
    commanderName: "'Amr ibn al-'As",
    rulerId: "rul_umar_ibn_al_khattab",
    routeGeojson: {
      type: "LineString",
      coordinates: [
        [33.80, 31.13], // al-Arish
        [32.55, 31.05], // Pelusium (al-Farama)
        [31.56, 30.42], // Bilbeis
        [31.31, 30.13], // Heliopolis (Ayn Shams)
        [31.23, 30.00], // Babylon Fortress (Fustat)
        [30.85, 30.45], // Nikiou
        [29.91, 31.20], // Alexandria
      ],
    },
    keyLocations: "al-Arish → Pelusium → Bilbeis → Heliopolis → Babylon Fortress → Alexandria",
    strategicOutcome: "Complete surrender of Roman Egypt negotiated with Patriarch Cyrus; foundation of Fustat (the embryonic nucleus of Cairo) and the Mosque of Amr.",
    description: "Venturing from Palestine with 4,000 cavalry, reinforced by Zubayr ibn al-Awwam at the siege of the massive Roman Babylon Fortress on the Nile. Following the fall of Babylon, 'Amr captured the imperial metropolis of Alexandria, severing Constantinople from its vital grain basket.",
    reviewStatus: "published",
  },
  {
    id: "camp_conquest_andalus_711_714",
    name: "Tariq ibn Ziyad & Musa ibn Nusayr's Iberian Campaign",
    startYear: 711,
    endYear: 714,
    polityId: "pol_umayyad",
    commanderName: "Tariq ibn Ziyad & Musa ibn Nusayr",
    rulerId: "rul_al_walid_i",
    routeGeojson: {
      type: "LineString",
      coordinates: [
        [-5.32, 35.89], // Ceuta / Tangier
        [-5.35, 36.14], // Gibraltar (Jabal Tariq)
        [-5.45, 36.13], // Algeciras
        [-5.85, 36.55], // Battle of Guadalete (Rio Barbate)
        [-5.64, 37.47], // Carmona
        [-4.78, 37.88], // Córdoba
        [-4.02, 39.86], // Toledo (Visigothic capital)
        [-0.88, 41.65], // Zaragoza / Ebro Valley
      ],
    },
    keyLocations: "Ceuta → Gibraltar → Guadalete → Córdoba → Toledo → Zaragoza",
    strategicOutcome: "Overthrow of the Visigothic Kingdom of King Roderic; establishment of the Umayyad province of al-Andalus stretching to the Pyrenees barrier.",
    description: "In 711 CE, Berber commander Tariq ibn Ziyad crossed the strait from North Africa, entrenching at the landmark rock thereafter bearing his name (Jabal Tariq / Gibraltar). Routing King Roderic at Guadalete, Tariq and Governor Musa swept across the Iberian peninsula to Toledo and the Ebro valley.",
    reviewStatus: "published",
  },
  {
    id: "camp_indus_expedition_711_712",
    name: "Muhammad ibn al-Qasim's Sind & Indus Campaign",
    startYear: 711,
    endYear: 712,
    polityId: "pol_umayyad",
    commanderName: "Muhammad ibn al-Qasim al-Thaqafi",
    rulerId: "rul_al_walid_i",
    routeGeojson: {
      type: "LineString",
      coordinates: [
        [52.53, 29.60], // Shiraz
        [66.30, 26.23], // Armabil / Bela (Makran)
        [67.45, 24.78], // Port of Debal
        [68.37, 25.39], // Nirun (Hyderabad)
        [68.78, 25.88], // Brahmanabad / Mansura
        [68.89, 27.67], // Aror / Rohri
        [71.47, 30.19], // Multan
      ],
    },
    keyLocations: "Shiraz → Makran Coast → Debal → Nirun → Brahmanabad → Aror → Multan",
    strategicOutcome: "Defeat of Raja Dahir; annexation of Sind and southern Punjab into the Umayyad Caliphate, establishing Islamic administration in the Indian subcontinent.",
    description: "The seventeen-year-old general Muhammad ibn al-Qasim led an expedition of 6,000 Syrian horsemen and catapult crews across the arid Makran desert. After taking the fortified port of Debal with the giant mangonel al-Urus, he defeated King Dahir at the Indus River and captured Multan, issuing guarantees of religious toleration documented in the Chach Nama.",
    reviewStatus: "published",
  },
  {
    id: "camp_tours_poitiers_732",
    name: "Abd al-Rahman al-Ghafiqi's Aquitaine & Poitiers Expedition",
    startYear: 732,
    endYear: 732,
    polityId: "pol_umayyad",
    commanderName: "Abd al-Rahman ibn Abd Allah al-Ghafiqi",
    rulerId: "rul_hisham",
    routeGeojson: {
      type: "LineString",
      coordinates: [
        [-1.64, 42.81], // Pamplona
        [-1.32, 43.01], // Roncesvalles Pass
        [-1.05, 43.71], // Dax
        [-0.58, 44.84], // Bordeaux (Battle of River Garonne)
        [0.15, 45.65],  // Angoulême
        [0.34, 46.58],  // Poitiers (Moussais-la-Bataille)
        [0.68, 47.39],  // Tours Approach
      ],
    },
    keyLocations: "Pamplona → Pyrenees Pass → Bordeaux → Angoulême → Poitiers → Tours",
    strategicOutcome: "Umayyad northern offensive checked by Charles Martel's Frankish-Aquitainian infantry phalanx; death of Governor al-Ghafiqi; consolidated Pyrenees as northern frontier of al-Andalus.",
    description: "Governor-General of al-Andalus Abd al-Rahman al-Ghafiqi led a massive cavalry offensive across the Pyrenees into Frankish Gaul, routing Duke Odo at Bordeaux. Marching north along the Roman road towards the rich abbey of St. Martin at Tours, his army collided with the disciplined Frankish forces of Charles Martel between Poitiers and Tours (Ma'rakat Balat al-Shuhada).",
    reviewStatus: "published",
  },
];





