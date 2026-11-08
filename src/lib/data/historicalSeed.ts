import type { NewSourceRecord } from "@/lib/db/schema/sources";
import type { NewPolityRecord } from "@/lib/db/schema/polities";
import type { NewTerritoryPeriodRecord } from "@/lib/db/schema/territoryPeriods";
import type { NewHistoricalEventRecord } from "@/lib/db/schema/historicalEvents";

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

export const initialTerritoryPeriods: NewTerritoryPeriodRecord[] = [
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

export const initialHistoricalEvents: NewHistoricalEventRecord[] = [
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
];

