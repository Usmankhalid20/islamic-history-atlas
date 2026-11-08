export interface DiscrepancyPerspective {
  sourceOrScholar: string;
  traditionOrSchool:
    | "early_arabic_chronicle"
    | "byzantine_chronicle"
    | "latin_western"
    | "modern_peer_reviewed";
  claimSummary: string;
  sourceTextExcerpt: string;
  citation: string;
}

export interface HistoricalDiscrepancy {
  id: string;
  title: string;
  category:
    | "boundary_dispute"
    | "dating_variance"
    | "chronicle_conflict"
    | "sovereignty_ambiguity";
  confidenceRating: "disputed" | "approximate" | "inferred" | "conjectural";
  activeFromYear: number;
  activeToYear: number;
  regionName: string;
  geographicScopeDescription: string;
  historiographicalSummary: string;
  perspectives: DiscrepancyPerspective[];
  cartographicImpact: string;
  consensusRecommendation: string;
  geometryGeojson: GeoJSON.Geometry;
}

export const initialHistoricalDiscrepancies: HistoricalDiscrepancy[] = [
  {
    id: "disc_byzantine_abbasid_awasim",
    title: "The Al-Awasim / Thaghr Frontier Zone",
    category: "boundary_dispute",
    confidenceRating: "disputed",
    activeFromYear: 750,
    activeToYear: 969,
    regionName: "Cilicia & Taurus Mountains (Al-Thughur)",
    geographicScopeDescription:
      "Militarized buffer corridor stretching from Tarsus and Adana across the Taurus passes to Mar'ash (Germanikeia) and Malatya (Melitene).",
    historiographicalSummary:
      "Modern maps frequently draw a solid border line between the Abbasid Caliphate and the Byzantine Empire. Primary sources show there was no fixed border; rather, the region was an expansive, deeply fortified march zone (the Awasim and Thughur) characterized by seasonal raids (sayfa in summer, shatiya in winter), fluctuating garrisons, and dual-taxed populations.",
    perspectives: [
      {
        sourceOrScholar: "al-Baladhuri (d. 892 CE)",
        traditionOrSchool: "early_arabic_chronicle",
        claimSummary:
          "Records the formal establishment of the Awasim by Caliph Harun al-Rashid in 786 CE to shield inland Syria.",
        sourceTextExcerpt:
          "Harun al-Rashid separated the frontier fortresses of northern Syria and Mesopotamia into an administrative entity named al-Awasim, stationing paid regular troops and granting hereditary estates (qata'i) to defenders.",
        citation: "al-Baladhuri, Futuh al-Buldan, ed. de Goeje (Leiden 1866), pp. 163-172.",
      },
      {
        sourceOrScholar: "Theophanes the Confessor (d. 818 CE)",
        traditionOrSchool: "byzantine_chronicle",
        claimSummary:
          "Depicts Cilicia not as a recognized sovereign province of the Caliphate, but as an unstable, depopulated contested combat zone.",
        sourceTextExcerpt:
          "The Saracens repeatedly invaded the Cilician gates and ravaged the borderlands, yet the thematic armies struck back, carrying away captives and rendering the mountain passes unnavigable.",
        citation: "The Chronicle of Theophanes Confessor, trans. Mango & Scott (Oxford 1997), AM 6270-6295.",
      },
      {
        sourceOrScholar: "John F. Haldon & Hugh Kennedy (1980 / 2004)",
        traditionOrSchool: "modern_peer_reviewed",
        claimSummary:
          "The frontier was a dynamic semi-autonomous ecological zone with its own military culture, rather than a linear frontier.",
        sourceTextExcerpt:
          "Neither empire possessed the logistical apparatus to permanently annex the high Anatolian plateau or the Cilician littoral until Nikephoros Phokas's campaigns of the 960s. Representing this boundary as a single line is historically inaccurate.",
        citation:
          "Haldon & Kennedy, 'The Arab-Byzantine Frontier in the Eighth and Ninth Centuries', Travaux et Mémoires 7 (1980), pp. 79-116.",
      },
    ],
    cartographicImpact:
      "Rendered as a dashed, semi-transparent hatched buffer zone rather than a solid polity polygon to represent contested sovereignty.",
    consensusRecommendation:
      "Treat as a shared contested zone in educational visualizers; avoid attributing sole sovereignty to either empire.",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [34.5, 36.5],
          [36.5, 36.5],
          [38.5, 38.0],
          [37.5, 38.8],
          [35.0, 37.8],
          [34.5, 36.5],
        ],
      ],
    },
  },
  {
    id: "disc_maghreb_umayyad_fatimid",
    title: "Western Maghreb: Umayyad vs. Fatimid Hegemony Over Fez",
    category: "sovereignty_ambiguity",
    confidenceRating: "disputed",
    activeFromYear: 920,
    activeToYear: 975,
    regionName: "Northern Morocco & Fez (Al-Maghrib al-Aqsa)",
    geographicScopeDescription:
      "The Sebou River basin, Fez metropolis, and the surrounding Zenata and Sanhaja tribal domains.",
    historiographicalSummary:
      "Throughout the 10th century, the city of Fez and northern Morocco changed allegiances dozens of times between the Umayyad Caliphate of Córdoba (ruling through Zenata Berber proxies like the Maghrawa) and the Fatimid Caliphate of Ifriqiya (ruling through generals like Jawhar and Ziri ibn Manad).",
    perspectives: [
      {
        sourceOrScholar: "Ibn Khaldun (1332–1406 CE)",
        traditionOrSchool: "early_arabic_chronicle",
        claimSummary:
          "Tribal loyalty shifted according to gold subsidies and immediate military pressure, making static dynastic boundaries illusory.",
        sourceTextExcerpt:
          "The Zenata of the Maghrib recognized the Umayyad caliph when Andalusi ships landed with subsidies, and transferred the Friday khutba to the Fatimid Imam whenever an imperial Fatimid army crossed the Moulouya.",
        citation: "Ibn Khaldun, Kitab al-'Ibar, Vol. 6 (History of the Berbers).",
      },
      {
        sourceOrScholar: "al-Bakri (d. 1094 CE)",
        traditionOrSchool: "early_arabic_chronicle",
        claimSummary:
          "Documents that Fez itself was physically divided: the Karawiyyin quarter and Andalusian quarter supported rival caliphal claimants simultaneously.",
        sourceTextExcerpt:
          "The people of the Andalusi quarter struck dirhams for the Umayyads, while across the river in the Qarawiyyin quarter, prayers were read for the Fatimid banner.",
        citation: "al-Bakri, Kitab al-Masalik wa'l-Mamalik, trans. de Slane (Algiers 1913).",
      },
      {
        sourceOrScholar: "Michael Brett (2001)",
        traditionOrSchool: "modern_peer_reviewed",
        claimSummary:
          "The Western Maghreb was a multi-polar frontier where caliphal authority was ideological and symbolic rather than administrative.",
        sourceTextExcerpt:
          "Neither Córdoba nor Mahdia held institutional bureaucratic control over the inland Maghrib. Sovereignty was exercised through monetary allegiance and matrimonial alliances with Berber clans.",
        citation: "Michael Brett, The Rise of the Fatimids (Brill 2001), pp. 180-215.",
      },
    ],
    cartographicImpact:
      "Overlapping transparent boundaries indicating alternating suzerainty and autonomous tribal confederacies.",
    consensusRecommendation:
      "Show dual-colored stripe hatch or disputed marker indicating contested protectorate status.",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [-6.5, 33.5],
          [-3.5, 33.5],
          [-3.0, 35.8],
          [-5.5, 36.0],
          [-6.5, 33.5],
        ],
      ],
    },
  },
  {
    id: "disc_tours_poitiers_extent",
    title: "Battle of Tours / Poitiers & the Septimanian Frontier",
    category: "chronicle_conflict",
    confidenceRating: "approximate",
    activeFromYear: 732,
    activeToYear: 759,
    regionName: "Septimania & Aquitaine (Southern Gaul)",
    geographicScopeDescription:
      "Corridor between Narbonne (Arbuna), Bordeaux, Poitiers, and the Pyrenees.",
    historiographicalSummary:
      "The nature, size, and strategic objective of Abd al-Rahman al-Ghafiqi's expedition in 732 CE remain one of the most sharply debated episodes in early medieval historiography. Western tradition viewed it as a world-deciding defense of Christendom, while early Muslim chroniclers treated it as a seasonal raiding expedition for booty that was checked by Frankish forces.",
    perspectives: [
      {
        sourceOrScholar: "Mozarabic Chronicle of 754",
        traditionOrSchool: "latin_western",
        claimSummary:
          "Contemporary 8th-century Iberian Christian record noting a fierce clash where northern forces ('Europenses') held like an immovable wall of ice.",
        sourceTextExcerpt:
          "The people of the north remained motionless like a wall, holding together like a glacier of ice, yet in the morning when they prepared for battle, they found the Saracen tents deserted and their forces vanished.",
        citation: "Chronica Muzarabica (754 CE), ed. Lopez Pereira (Zaragoza 1980).",
      },
      {
        sourceOrScholar: "Ibn Abd al-Hakam (d. 871 CE)",
        traditionOrSchool: "early_arabic_chronicle",
        claimSummary:
          "Briefly records the expedition as the 'Balat al-Shuhada' (Pavement of the Martyrs), attributing defeat to over-encumbered spoils.",
        sourceTextExcerpt:
          "Abd al-Rahman and many of his men were martyred on the Balat. The army had accumulated excessive plunder, which hindered their tactical mobility when the enemy attacked.",
        citation: "Ibn Abd al-Hakam, Futuh Misr wa-Akhbaruha, ed. Torrey (New Haven 1922).",
      },
      {
        sourceOrScholar: "David Levering Lewis & Bernard Lewis (modern)",
        traditionOrSchool: "modern_peer_reviewed",
        claimSummary:
          "The long-term frontier of Islamic rule was anchored at Narbonne in Septimania until 759 CE; the raid to Poitiers was an exploratory probe rather than an imperial army of occupation.",
        sourceTextExcerpt:
          "The real historical boundary was the Pyrenees-Septimanian frontier where Muslims ruled Narbonne for forty years, not the northernmost point reached by a cavalry vanguard.",
        citation: "David Levering Lewis, God's Crucible: Islam and the Making of Europe (2008).",
      },
    ],
    cartographicImpact:
      "Distinct vector for the raiding thrust from Narbonne toward Poitiers, with Septimania shown as a 40-year administered province (719–759 CE).",
    consensusRecommendation:
      "Differentiate the permanent governorship of Narbonne from the episodic raid to Poitiers.",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [1.5, 42.5],
          [3.5, 42.5],
          [4.0, 44.0],
          [1.0, 44.5],
          [1.5, 42.5],
        ],
      ],
    },
  },
  {
    id: "disc_buyid_abbasid_sovereignty",
    title: "The Buyid Protectorate: Dual Sovereignty in Baghdad",
    category: "sovereignty_ambiguity",
    confidenceRating: "disputed",
    activeFromYear: 945,
    activeToYear: 1055,
    regionName: "Iraq & Western Persia (Sawad & Rayy)",
    geographicScopeDescription:
      "The central Abbasid metropolitan province of Iraq and Western Iran under the Daylamite Buyid amirs.",
    historiographicalSummary:
      "Following the entry of Ahmad ibn Buya (Mu'izz al-Dawla) into Baghdad in 945 CE, the Buyid dynasty exercised absolute military, fiscal, and administrative control, yet preserved the Sunni Abbasid Caliph as a theological figurehead whose name remained on coins and in the khutba.",
    perspectives: [
      {
        sourceOrScholar: "Miskawayh (d. 1030 CE)",
        traditionOrSchool: "early_arabic_chronicle",
        claimSummary:
          "Chronicles the daily reality where the Buyid amir dictated imperial policy, deposed recalcitrant caliphs, yet preserved caliphal insignia for legitimacy.",
        sourceTextExcerpt:
          "Mu'izz al-Dawla assigned the Caliph al-Muti a daily stipend of four hundred dirhams and seized the crown lands, leaving the caliph no authority except religious decrees.",
        citation: "Miskawayh, Tajarib al-Umam (The Eclipse of the Abbasid Caliphate), ed. Amedroz & Margoliouth.",
      },
      {
        sourceOrScholar: "C.E. Bosworth (1996)",
        traditionOrSchool: "modern_peer_reviewed",
        claimSummary:
          "Categorizes this as a constitutional dyarchy: de jure caliphal empire vs. de facto Buyid confederation.",
        sourceTextExcerpt:
          "The Buyids were Shi'is of Daylamite origin who ruled as 'Amir al-Umara' and revived the ancient Persian title 'Shahanshah', while maintaining the Sunni caliph as an essential source of legal investiture.",
        citation: "C.E. Bosworth, The New Islamic Dynasties (Edinburgh 1996), pp. 154-157.",
      },
    ],
    cartographicImpact:
      "Sub-divided territorial styling: Abbasid Caliphate shown with Buyid military protectorate overlay.",
    consensusRecommendation:
      "Visualizers should represent the region with secondary cross-hatching or co-sovereignty indicators rather than solely 'Abbasid' or 'Buyid'.",
    geometryGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [42.0, 31.0],
          [48.5, 30.0],
          [48.0, 35.5],
          [43.0, 36.0],
          [42.0, 31.0],
        ],
      ],
    },
  },
];
