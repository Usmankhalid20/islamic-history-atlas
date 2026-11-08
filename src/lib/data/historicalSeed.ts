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
];

export const initialTerritoryPeriods: TerritoryPeriodRecord[] = [
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
          [35.0, 31.0],
          [39.0, 31.0],
          [40.0, 36.5],
          [36.0, 37.0],
          [35.0, 33.0],
          [35.0, 31.0],
        ],
      ],
    },
    explanatoryNote: "Core metropolitan territory of the Umayyad caliphs administered directly from Damascus.",
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
          [-8.5, 36.5],
          [-1.5, 36.5],
          [1.0, 41.0],
          [-4.0, 42.0],
          [-8.5, 39.0],
          [-8.5, 36.5],
        ],
      ],
    },
    explanatoryNote: "Territory under the Umayyad Emirate of Córdoba, excluding northern Christian kingdoms.",
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
          [41.5, 31.0],
          [48.0, 30.0],
          [47.5, 35.5],
          [43.0, 36.5],
          [41.5, 31.0],
        ],
      ],
    },
    explanatoryNote: "The central crown province of the Abbasid Caliphate, housing the Round City of Baghdad.",
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
          [5.0, 32.0],
          [12.0, 32.0],
          [11.5, 37.5],
          [6.0, 37.0],
          [5.0, 32.0],
        ],
      ],
    },
    explanatoryNote: "Initial stronghold and naval capital of the Fatimid Caliphate at Mahdia prior to the conquest of Egypt.",
    reviewStatus: "published",
  },
];

export const initialHistoricalEvents: HistoricalEventRecord[] = [
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
        [48.51, 34.79], // Hamadan
        [51.43, 35.59], // Rayy (Tehran)
        [58.79, 36.21], // Nishapur
        [62.19, 37.60], // Merv Oasis
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
        [52.34, 27.67], // Siraf
        [56.74, 24.36], // Sohar (Oman)
        [58.59, 23.61], // Muscat
        [45.03, 12.78], // Aden
        [42.95, 14.80], // al-Hudaydah
        [39.19, 21.54], // Jeddah
        [32.55, 29.96], // al-Qulzum (Suez)
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





