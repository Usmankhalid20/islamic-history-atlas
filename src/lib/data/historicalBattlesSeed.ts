/**
 * Historical Battles Seed Dataset for Islamic Historical Atlas
 * Comprehensive registry of major military engagements across Islamic history (624–1761 CE).
 * Each record includes belligerents, field commanders, strategic outcomes, geographical coordinates,
 * and historiographical significance.
 */

export interface HistoricalBattle {
  id: string;
  name: string;
  nativeName?: string;
  year: number;
  belligerentA: {
    name: string;
    polityId?: string;
    commanders: string[];
    role: "attacker" | "defender" | "coalition";
  };
  belligerentB: {
    name: string;
    polityId?: string;
    commanders: string[];
    role: "attacker" | "defender" | "coalition";
  };
  outcome: string;
  victor: "belligerentA" | "belligerentB" | "stalemate" | "inconclusive";
  historicalSignificance: string;
  tacticalSummary: string;
  locationName: string;
  coordinates: [number, number]; // [lng, lat] GeoJSON standard
  campaignId?: string;
  sourceCitation: string;
}

export const HISTORICAL_BATTLES: HistoricalBattle[] = [
  {
    id: "bat_badr_624",
    name: "Battle of Badr",
    nativeName: "غَزْوَةُ بَدْر",
    year: 624,
    belligerentA: {
      name: "Muslim Community of Medina",
      commanders: ["Prophet Muhammad ﷺ", "Hamza ibn Abd al-Muttalib", "Ali ibn Abi Talib"],
      role: "defender",
    },
    belligerentB: {
      name: "Quraysh of Mecca",
      commanders: ["Amr ibn Hisham (Abu Jahl) †", "Utba ibn Rabi'a †", "Umayya ibn Khalaf †"],
      role: "attacker",
    },
    outcome: "Decisive Muslim Victory",
    victor: "belligerentA",
    historicalSignificance:
      "First major military engagement in Islamic history. Despite being outnumbered three-to-one (313 vs 1,000), the Muslim victory solidified the embryonic Medina state and broke the aura of Meccan invincibility.",
    tacticalSummary:
      "The Muslim forces secured the water wells of Badr, forcing the Meccan cavalry into narrow, muddy defiles. Following single combats won by Hamza and Ali, a disciplined general assault shattered the Meccan ranks.",
    locationName: "Badr, Hijaz (Western Arabia)",
    coordinates: [38.79, 23.78],
    sourceCitation: "Ibn Hisham, al-Sirah al-Nabawiyya; al-Tabari, Tarikh al-Rusul wa'l-Muluk.",
  },
  {
    id: "bat_uhud_625",
    name: "Battle of Uhud",
    nativeName: "غَزْوَةُ أُحُد",
    year: 625,
    belligerentA: {
      name: "Muslim Community of Medina",
      commanders: ["Prophet Muhammad ﷺ", "Hamza ibn Abd al-Muttalib †", "Ali ibn Abi Talib"],
      role: "defender",
    },
    belligerentB: {
      name: "Quraysh Confederacy",
      commanders: ["Abu Sufyan ibn Harb", "Khalid ibn al-Walid (pre-conversion)", "Ikrimah ibn Abi Jahl"],
      role: "attacker",
    },
    outcome: "Tactical Meccan Success; Strategic Stalemate",
    victor: "belligerentB",
    historicalSignificance:
      "The Quraysh sought retribution for Badr with an army of 3,000. Despite initial Muslim success, an archer abandonment of Mount Ruma enabled Khalid's cavalry flanking maneuver, teaching profound tactical lessons on command discipline.",
    tacticalSummary:
      "Muslim infantry held the foothills of Mount Uhud, but when archers left their flanking positions to collect spoils, Khalid led Meccan cavalry around the ridge, surrounding the Muslim rear and inflicting severe casualties.",
    locationName: "Mount Uhud, north of Medina",
    coordinates: [39.61, 24.5],
    sourceCitation: "al-Waqidi, Kitab al-Maghazi; Ibn Kathir, al-Bidayah wa'n-Nihayah.",
  },
  {
    id: "bat_khandaq_627",
    name: "Battle of the Trench (al-Khandaq)",
    nativeName: "غَزْوَةُ الخَنْدَق",
    year: 627,
    belligerentA: {
      name: "Muslim Defenders of Medina",
      commanders: ["Prophet Muhammad ﷺ", "Salman al-Farsi", "Ali ibn Abi Talib"],
      role: "defender",
    },
    belligerentB: {
      name: "Confederate Army (al-Ahzab)",
      commanders: ["Abu Sufyan ibn Harb", "Huyayy ibn Akhtab", "Tulayha al-Asadi"],
      role: "attacker",
    },
    outcome: "Decisive Muslim Defensive Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Medina successfully repelled an unprecedented coalition of 10,000 confederates (Quraysh, Ghatafan, and Banu Nadir) through Salman al-Farsi's Persian siege-trench engineering, permanently ending Meccan offensive capability.",
    tacticalSummary:
      "A deep, wide trench dug across the vulnerable northern plain of Medina nullified the enemy's superior cavalry. After a grueling month-long winter siege and psychological warfare, severe storms destroyed the confederate camp.",
    locationName: "Northern outskirts of Medina, Hijaz",
    coordinates: [39.6, 24.48],
    sourceCitation: "al-Tabari, Tarikh; Montgomery Watt, Muhammad at Medina (Oxford).",
  },
  {
    id: "bat_yarmouk_636",
    name: "Battle of Yarmouk",
    nativeName: "مَعْرَكَةُ اليَرْمُوك",
    year: 636,
    belligerentA: {
      name: "Rashidun Caliphate",
      polityId: "pol_rashidun",
      commanders: ["Khalid ibn al-Walid", "Abu Ubaidah ibn al-Jarrah", "Amr ibn al-As"],
      role: "attacker",
    },
    belligerentB: {
      name: "Byzantine Empire",
      commanders: ["Theodore Trithyrius", "Vahan of Armenia †", "Gregory †"],
      role: "defender",
    },
    outcome: "Decisive Rashidun Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Considered one of the most decisive battles in world military history. Ended Byzantine imperial rule in Roman Syria and Palestine, opening the Levant permanently to Islamic civilization.",
    tacticalSummary:
      "Over six intense days along the Yarmouk River ravines, Khalid out-maneuvered a larger imperial army. On the final day, Khalid's mobile guard cavalry severed the Roman retreat bridge at Wadi al-Raqqad, trapping the Byzantine legions against sheer precipices.",
    locationName: "Yarmouk River Gorge, Jordan/Syria frontier",
    coordinates: [35.95, 32.81],
    campaignId: "camp_yarmouk_634_636",
    sourceCitation: "al-Baladhuri, Futuh al-Buldan; A.I. Akram, The Sword of Allah.",
  },
  {
    id: "bat_qadisiyyah_636",
    name: "Battle of al-Qadisiyyah",
    nativeName: "مَعْرَكَةُ القَادِسِيَّة",
    year: 636,
    belligerentA: {
      name: "Rashidun Caliphate",
      polityId: "pol_rashidun",
      commanders: ["Sa'd ibn Abi Waqqas", "al-Qa'qa' ibn Amr al-Tamimi", "Tulayha"],
      role: "attacker",
    },
    belligerentB: {
      name: "Sasanian Empire",
      commanders: ["Rostam Farrokhzad †", "Bahman Jadhuyih †", "Jalinus †"],
      role: "defender",
    },
    outcome: "Decisive Rashidun Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Shattered the main royal army of the Sasanian Empire and captured the imperial standard Derafsh Kaviani. Led directly to the capture of the imperial capital Ctesiphon (al-Mada'in) and the annexation of Mesopotamia.",
    tacticalSummary:
      "Fought across four brutal days featuring Sasanian war elephants on the first two days. On the third day (Yawm al-Amas), Arab archers blinded the lead elephant, routing the beast back through Sasanian lines. On the fourth day, a desert sandstorm favored the Muslim assault, during which Rostam was slain.",
    locationName: "al-Qadisiyyah, south-west of Kufa, Iraq",
    coordinates: [44.34, 31.58],
    campaignId: "camp_qadisiyyah_636",
    sourceCitation: "al-Tabari, Tarikh; Hugh Kennedy, The Great Arab Conquests.",
  },
  {
    id: "bat_jalula_637",
    name: "Battle of Jalula",
    nativeName: "مَعْرَكَةُ جَلُولَاء",
    year: 637,
    belligerentA: {
      name: "Rashidun Caliphate",
      polityId: "pol_rashidun",
      commanders: ["Hashim ibn Utba", "al-Qa'qa' ibn Amr al-Tamimi"],
      role: "attacker",
    },
    belligerentB: {
      name: "Sasanian Empire",
      commanders: ["Mihran Razi", "Khurrazad"],
      role: "defender",
    },
    outcome: "Decisive Rashidun Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Secured central and northern Iraq, capturing the vital defensive passes leading into the Zagros Mountains and preventing Sasanian counter-offensives from the Iranian plateau.",
    tacticalSummary:
      "The Sasanians heavily fortified Jalula with caltrops and trenches. Hashim conducted a feigned retreat that lured the Sasanian garrisons into the open field, where Qa'qa's cavalry executed a deep flanking march behind the defenses.",
    locationName: "Jalula, Diyala Governorate, Iraq",
    coordinates: [45.16, 34.28],
    sourceCitation: "al-Dhahabi, Siyar A'lam al-Nubala; al-Tabari, Tarikh.",
  },
  {
    id: "bat_nahavand_642",
    name: "Battle of Nahavand (Victory of Victories)",
    nativeName: "مَعْرَكَةُ نَهَاوَنْد (فَتْحُ الفُتُوح)",
    year: 642,
    belligerentA: {
      name: "Rashidun Caliphate",
      polityId: "pol_rashidun",
      commanders: ["al-Nu'man ibn Muqarrin †", "Hudhayfah ibn al-Yaman", "al-Qa'qa'"],
      role: "attacker",
    },
    belligerentB: {
      name: "Sasanian Empire",
      commanders: ["Piruzan †", "Bahman"],
      role: "defender",
    },
    outcome: "Decisive Rashidun Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Celebrated as 'Fath al-Futuh' (The Victory of Victories). Total dissolution of the centralized Sasanian imperial military; Emperor Yazdegerd III became a fugitive, opening all of Persia to Islamic administration.",
    tacticalSummary:
      "Sasanian general Piruzan fortified the hill passes of Nahavand behind iron caltrops. Qa'qa' executed a false rumor retreat, drawing the Persians out into a narrow valley where Nu'man's main army launched a crushing counter-charge.",
    locationName: "Nahavand, Hamadan Province, Iran",
    coordinates: [48.37, 34.19],
    sourceCitation: "Ibn al-Athir, al-Kamil fi al-Tarikh; Abd al-Husayn Zarrinkub, Two Centuries of Silence.",
  },
  {
    id: "bat_masts_654",
    name: "Battle of the Masts (Dhat al-Sawari)",
    nativeName: "مَعْرَكَةُ ذَاتِ الصَّوَارِي",
    year: 654,
    belligerentA: {
      name: "Rashidun Caliphate Navy",
      polityId: "pol_rashidun",
      commanders: ["Abdullah ibn Sa'd ibn Abi Sarh", "Busr ibn Abi Artat"],
      role: "attacker",
    },
    belligerentB: {
      name: "Byzantine Imperial Navy",
      commanders: ["Emperor Constans II"],
      role: "defender",
    },
    outcome: "Decisive Muslim Naval Victory",
    victor: "belligerentA",
    historicalSignificance:
      "The first major fleet engagement fought by an Islamic navy. Crushed Byzantine naval hegemony in the eastern Mediterranean and proved the newly constructed Arab shipyards in Alexandria and Acre could rival Constantinople at sea.",
    tacticalSummary:
      "Facing over 500 Byzantine galleys with 200 Egyptian and Syrian ships, the Muslim commanders lashed their ships together with grappling hooks, turning the naval encounter into a series of ferocious hand-to-hand infantry assaults on deck.",
    locationName: "Off the coast of Phoenix, Lycia (modern Finike, Turkey)",
    coordinates: [30.25, 36.25],
    sourceCitation: "Theophanes the Confessor, Chronicle; al-Tabari, Tarikh.",
  },
  {
    id: "bat_siffin_657",
    name: "Battle of Siffin",
    nativeName: "مَعْرَكَةُ صِفِّين",
    year: 657,
    belligerentA: {
      name: "Caliphal Forces of Ali ibn Abi Talib",
      polityId: "pol_rashidun",
      commanders: ["Caliph Ali ibn Abi Talib", "Malik al-Ashtar", "Ammar ibn Yasir †"],
      role: "coalition",
    },
    belligerentB: {
      name: "Syrian Army of Mu'awiya",
      polityId: "pol_umayyad",
      commanders: ["Mu'awiya ibn Abi Sufyan", "Amr ibn al-As"],
      role: "coalition",
    },
    outcome: "Military Stalemate; Arbitration Treaty",
    victor: "stalemate",
    historicalSignificance:
      "Pivotal crisis of the First Fitna. Malik al-Ashtar was on the verge of breaking the Syrian lines when Mu'awiya's troops raised Qurans on lance-points calling for arbitration (tahkim), leading to profound factional divisions and the emergence of the Kharijites.",
    tacticalSummary:
      "Fought on the banks of the Euphrates. Multiple days of skirmishing culminated in the 'Night of Clangour' (Laylat al-Harir), marked by ferocious close-quarters infantry fighting until the arbitration call halted combat.",
    locationName: "Siffin on the Euphrates River, near Raqqa, Syria",
    coordinates: [39.02, 35.95],
    sourceCitation: "Nasr ibn Muzahim, Waq'at Siffin; Wilferd Madelung, The Succession to Muhammad.",
  },
  {
    id: "bat_karbala_680",
    name: "Battle of Karbala",
    nativeName: "مَعْرَكَةُ كَرْبَلَاء",
    year: 680,
    belligerentA: {
      name: "Companions & Household of Husayn ibn Ali",
      commanders: ["Husayn ibn Ali †", "Abbas ibn Ali †", "Habib ibn Muzahir †"],
      role: "defender",
    },
    belligerentB: {
      name: "Umayyad Caliphal Army",
      polityId: "pol_umayyad",
      commanders: ["Umar ibn Sa'd", "Shimr ibn Dhi al-Jawshan"],
      role: "attacker",
    },
    outcome: "Umayyad Tactical Victory; Eternal Moral Watershed",
    victor: "belligerentB",
    historicalSignificance:
      "The martyrdom of Husayn ibn Ali, the grandson of the Prophet, alongside 72 kin and companions. Defined the moral consciousness of Shi'ism and crystallized irrevocable opposition to Umayyad imperial tyranny.",
    tacticalSummary:
      "Husayn's small caravan was surrounded on the arid plains of Karbala and cut off from the Euphrates River for three days. After refusing unconditional surrender to Yazid I, Husayn and his companions were slain in a final, defiant stand on Ashura (10 Muharram 61 AH).",
    locationName: "Karbala, near the Euphrates, Iraq",
    coordinates: [44.03, 32.61],
    sourceCitation: "Abu Mikhnaf, Maqtal al-Husayn; al-Tabari, Tarikh.",
  },
  {
    id: "bat_guadalete_711",
    name: "Battle of Guadalete",
    nativeName: "مَعْرَكَةُ وَادِي لَكَّة",
    year: 711,
    belligerentA: {
      name: "Umayyad Expeditionary Force",
      polityId: "pol_umayyad",
      commanders: ["Tariq ibn Ziyad"],
      role: "attacker",
    },
    belligerentB: {
      name: "Visigothic Kingdom",
      commanders: ["King Roderic †"],
      role: "defender",
    },
    outcome: "Decisive Umayyad Victory",
    victor: "belligerentA",
    historicalSignificance:
      "The collapse of the Visigothic monarchy. Opened the entire Iberian Peninsula to rapid Islamic integration and established the foundation of al-Andalus.",
    tacticalSummary:
      "Tariq's 12,000 Berber and Arab cavalry confronted King Roderic's army of 30,000 near the Guadalete River. Treason on the Visigothic wings by rival nobles left Roderic's royal center vulnerable to Tariq's charge, where Roderic was killed.",
    locationName: "Rio Barbate / Guadalete, Cadiz Province, Spain",
    coordinates: [-5.85, 36.55],
    campaignId: "camp_conquest_andalus_711_714",
    sourceCitation: "Ibn Abd al-Hakam, Futuh Misr wa'l-Maghrib; Chronicle of 754.",
  },
  {
    id: "bat_tours_732",
    name: "Battle of Tours / Poitiers",
    nativeName: "مَعْرَكَةُ بَلَاطِ الشُّهَدَاءِ",
    year: 732,
    belligerentA: {
      name: "Umayyad Caliphal Army of al-Andalus",
      polityId: "pol_umayyad",
      commanders: ["Abd al-Rahman ibn Abd Allah al-Ghafiqi †"],
      role: "attacker",
    },
    belligerentB: {
      name: "Frankish & Aquitainian Forces",
      commanders: ["Charles Martel", "Odo the Great of Aquitaine"],
      role: "defender",
    },
    outcome: "Frankish Victory; Umayyad Withdrawal",
    victor: "belligerentB",
    historicalSignificance:
      "Known in Arabic chronicles as 'Balat al-Shuhada' (Court of the Martyrs). Halted the northern expansion of Umayyad forces into Western Europe and consolidated the Pyrenees as the northern frontier of al-Andalus.",
    tacticalSummary:
      "Charles Martel deployed a disciplined, heavy infantry phalanx on elevated, forested ground between Tours and Poitiers. Umayyad cavalry repeatedly charged the shield wall but could not breach it. When al-Ghafiqi was killed trying to reorganize his men, the army withdrew south under cover of night.",
    locationName: "Between Tours and Poitiers, Nouvelle-Aquitaine, France",
    coordinates: [0.35, 46.58],
    campaignId: "camp_tours_poitiers_732",
    sourceCitation: "Chronicle of 754; Ibn Hayyan, al-Muqtabis; Edward Gibbon, Decline and Fall.",
  },
  {
    id: "bat_zab_750",
    name: "Battle of the Zab",
    nativeName: "مَعْرَكَةُ الزَّابِ الأَعْلَى",
    year: 750,
    belligerentA: {
      name: "Abbasid Revolutionary Army",
      polityId: "pol_abbasid_early",
      commanders: ["Abdullah ibn Ali", "Abu Muslim al-Khurasani (strategist)"],
      role: "attacker",
    },
    belligerentB: {
      name: "Umayyad Caliphate",
      polityId: "pol_umayyad",
      commanders: ["Caliph Marwan II al-Himar"],
      role: "defender",
    },
    outcome: "Decisive Abbasid Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Ended 89 years of Umayyad Caliphal rule in Damascus. Established the Abbasid Caliphate under Abu al-Abbas al-Saffah, inaugurating the Islamic Golden Age centered in Iraq.",
    tacticalSummary:
      "The Abbasid troops, fighting under the Black Banners of Khurasan, formed a disciplined wall of spears. Marwan's Syrian cavalry charged directly into the spear ranks and broke in panic, drowning by thousands in the torrential swollen currents of the Great Zab River.",
    locationName: "Great Zab River, northern Iraq",
    coordinates: [43.4, 35.9],
    sourceCitation: "al-Tabari, Tarikh; al-Mas'udi, Muruj al-Dhahab.",
  },
  {
    id: "bat_talas_751",
    name: "Battle of Talas",
    nativeName: "مَعْرَكَةُ نَهْرِ طَلَاس",
    year: 751,
    belligerentA: {
      name: "Abbasid Caliphate & Karluk Coalition",
      polityId: "pol_abbasid_early",
      commanders: ["Ziyad ibn Salih", "Yabghu of the Karluks"],
      role: "attacker",
    },
    belligerentB: {
      name: "Tang Dynasty of China",
      commanders: ["Gao Xianzhi (Go Seonji)", "Li Siye"],
      role: "defender",
    },
    outcome: "Decisive Abbasid Victory",
    victor: "belligerentA",
    historicalSignificance:
      "The only major military collision between the Islamic Caliphate and Imperial China. Halted Chinese westward expansion into Central Asia, consolidated Islamic civilization in Transoxiana, and facilitated the historic transmission of Chinese papermaking technology to Samarkand and Baghdad.",
    tacticalSummary:
      "The battle raged for five days along the Talas River between Abbasid heavy infantry and Tang elite archers. The turning point arrived when Karluk Turkish mercenaries defected to the Abbasids, striking Gao Xianzhi's rear and routing the Tang army.",
    locationName: "Talas River Valley, modern Kazakhstan/Kyrgyzstan border",
    coordinates: [71.72, 42.52],
    sourceCitation: "Ibn al-Athir, al-Kamil; Old Book of Tang; S.A.M. Adshead, T'ang China.",
  },
  {
    id: "bat_simancas_939",
    name: "Battle of Simancas",
    nativeName: "مَعْرَكَةُ الخَنْدَق (شَمَنْكَش)",
    year: 939,
    belligerentA: {
      name: "Caliphate of Córdoba",
      polityId: "pol_cordoba",
      commanders: ["Caliph Abd al-Rahman III al-Nasir"],
      role: "attacker",
    },
    belligerentB: {
      name: "Christian Coalition of León & Navarra",
      commanders: ["King Ramiro II of León", "Queen Toda of Pamplona"],
      role: "defender",
    },
    outcome: "Christian Tactical Victory",
    victor: "belligerentB",
    historicalSignificance:
      "Checked the northern expansion of Caliph Abd al-Rahman III at the zenith of Córdoba's power. Demonstrated that Christian monarchies of northern Iberia could unite effectively against the southern Caliphate.",
    tacticalSummary:
      "A massive Andalusi army clashed with allied Leonese-Navarrese forces at the Pisuerga River gorge. A sudden solar eclipse unnerved the combatants, and during the ensuing combat, Andalusi troops were forced into a precipitous ravine (al-Khandaq).",
    locationName: "Simancas, Valladolid, Castile, Spain",
    coordinates: [-4.82, 41.59],
    sourceCitation: "Ibn Hayyan, al-Muqtabis; Roger Collins, Caliphs and Kings: Spain 796–1031.",
  },
  {
    id: "bat_dandanaqan_1040",
    name: "Battle of Dandanaqan",
    nativeName: "مَعْرَكَةُ دَنْدَانَقَان",
    year: 1040,
    belligerentA: {
      name: "Great Seljuk Empire",
      polityId: "pol_seljuk",
      commanders: ["Tughril Beg", "Chaghri Beg"],
      role: "attacker",
    },
    belligerentB: {
      name: "Ghaznavid Empire",
      polityId: "pol_ghaznavid",
      commanders: ["Sultan Mas'ud I of Ghazna"],
      role: "defender",
    },
    outcome: "Decisive Seljuk Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Foundational battle of the Great Seljuk Empire. Shattered Ghaznavid supremacy over Khurasan and Iran, reducing Ghaznavid authority to Afghanistan and Punjab while elevating the Seljuks to master Islamic Western Asia.",
    tacticalSummary:
      "The Seljuk Turkmen horse archers harassed Mas'ud's ponderous elephant-supported army across waterless desert expanses for weeks. When the parched Ghaznavid troops reached the ruined fortress of Dandanaqan, the Seljuks launched an ambush that completely disintegrated Mas'ud's army.",
    locationName: "Dandanaqan, near Merv (modern Turkmenistan)",
    coordinates: [61.85, 37.38],
    sourceCitation: "Abu'l-Fadl Bayhaqi, Tarikh-i Bayhaqi; C.E. Bosworth, The Ghaznavids.",
  },
  {
    id: "bat_manzikert_1071",
    name: "Battle of Manzikert",
    nativeName: "مَعْرَكَةُ مَلَاذْكِرْد",
    year: 1071,
    belligerentA: {
      name: "Great Seljuk Empire",
      polityId: "pol_seljuk",
      commanders: ["Sultan Alp Arslan"],
      role: "attacker",
    },
    belligerentB: {
      name: "Byzantine Empire",
      commanders: ["Emperor Romanos IV Diogenes (captured)"],
      role: "defender",
    },
    outcome: "Decisive Seljuk Victory; Capture of Byzantine Emperor",
    victor: "belligerentA",
    historicalSignificance:
      "Watershed event in Middle Eastern and European history. Opened Anatolia permanently to Turkish settlement and Islamization, led to the establishment of the Sultanate of Rum, and prompted the Byzantine appeals to Western Europe that sparked the Crusades.",
    tacticalSummary:
      "Alp Arslan deployed classic nomadic crescent feigned retreat tactics. As the heavy Byzantine line advanced into the empty steppe, Seljuk wings enveloped Romanos' flanks. Treason by Andronikos Doukas, who abandoned the imperial rear guard, sealed Romanos' encirclement and capture.",
    locationName: "Malazgirt (Manzikert), eastern Anatolia, Turkey",
    coordinates: [42.54, 39.14],
    sourceCitation: "Ibn al-Athir, al-Kamil; Michael Attaleiates, History; Carole Hillenbrand, Turkish Myth.",
  },
  {
    id: "bat_zallaqa_1086",
    name: "Battle of Zallaqa (Sagrajas)",
    nativeName: "مَعْرَكَةُ الزَّلَّاقَة",
    year: 1086,
    belligerentA: {
      name: "Almoravid & Andalusi Coalition",
      polityId: "pol_almoravid",
      commanders: ["Yusuf ibn Tashfin", "al-Mu'tamid ibn Abbad of Seville"],
      role: "defender",
    },
    belligerentB: {
      name: "Kingdom of Castile and León",
      commanders: ["King Alfonso VI of Castile"],
      role: "attacker",
    },
    outcome: "Decisive Almoravid-Andalusi Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Saved Islamic Al-Andalus from imminent Christian conquest following the fall of Toledo (1085). Established Almoravid imperial dominance over Muslim Iberia for the next half-century.",
    tacticalSummary:
      "Alfonso's heavy knights struck the Andalusi vanguard at dawn, inflicting heavy casualties. Yusuf ibn Tashfin held his Black Guard and seasoned Saharan Berber troops in reserve, outflanking the Castilian camp and burning it, turning the battle into an encirclement.",
    locationName: "Sagrajas / Zallaqa, near Badajoz, Extremadura, Spain",
    coordinates: [-6.89, 38.93],
    sourceCitation: "Ibn Idhari, al-Bayan al-Mughrib; Richard Fletcher, Moorish Spain.",
  },
  {
    id: "bat_hattin_1187",
    name: "Battle of Hattin",
    nativeName: "مَعْرَكَةُ حِطِّين",
    year: 1187,
    belligerentA: {
      name: "Ayyubid Sultanate",
      polityId: "pol_ayyubid",
      commanders: ["Salah al-Din al-Ayyubi (Saladin)", "al-Afdal", "Taqi al-Din"],
      role: "attacker",
    },
    belligerentB: {
      name: "Crusader Kingdom of Jerusalem",
      commanders: ["King Guy of Lusignan (captured)", "Raynald of Châtillon †", "Raymond III of Tripoli"],
      role: "defender",
    },
    outcome: "Decisive Ayyubid Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Annihilated the field army of the Crusader states and led directly to Saladin's triumphant liberation of Jerusalem (al-Quds) after 88 years of Crusader occupation, triggering the Third Crusade.",
    tacticalSummary:
      "Saladin baited the Crusader army away from water sources at Sepphoris onto the scorching, arid plateau of Hattin. Surrounding them overnight, Muslim forces lit brush fires to choke the armored knights with smoke and thirst, overrunning their desperate defense around the True Cross relic on the Horns of Hattin.",
    locationName: "Horns of Hattin, west of Tiberias, Palestine",
    coordinates: [35.45, 32.8],
    sourceCitation: "Baha al-Din Ibn Shaddad, al-Nawadir al-Sultaniyya; Imad al-Din al-Isfahani, al-Fath al-Qussi.",
  },
  {
    id: "bat_alarcos_1195",
    name: "Battle of Alarcos",
    nativeName: "مَعْرَكَةُ الأَرَك",
    year: 1195,
    belligerentA: {
      name: "Almohad Caliphate",
      polityId: "pol_almohad",
      commanders: ["Caliph Abu Ya'qub Yusuf al-Mansur"],
      role: "attacker",
    },
    belligerentB: {
      name: "Kingdom of Castile",
      commanders: ["King Alfonso VIII of Castile"],
      role: "defender",
    },
    outcome: "Decisive Almohad Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Shattered the Castilian offensive in central Iberia, earning the Caliph the epithet 'al-Mansur' (The Victorious) and inaugurating construction of the monumental Giralda minaret in Seville.",
    tacticalSummary:
      "Alfonso launched an impetuous uphill cavalry charge against the Almohad center. Abu Ya'qub absorbed the blow with his Andalusi volunteers and then counter-attacked with his mobile Berber and Arab wings, driving Alfonso into flight.",
    locationName: "Alarcos, near Ciudad Real, Castile-La Mancha, Spain",
    coordinates: [-3.99, 38.95],
    sourceCitation: "al-Marrakushi, al-Mu'jib fi Talkhis Akhbar al-Maghrib; Ambrosio Huici Miranda, Las Grandes Batallas.",
  },
  {
    id: "bat_ain_jalut_1260",
    name: "Battle of Ain Jalut",
    nativeName: "مَعْرَكَةُ عَيْنِ جَالُوت",
    year: 1260,
    belligerentA: {
      name: "Mamluk Sultanate of Cairo",
      polityId: "pol_mamluk",
      commanders: ["Sultan Sayf al-Din Qutuz", "Emir Rukn al-Din Baybars al-Bunduqdari"],
      role: "defender",
    },
    belligerentB: {
      name: "Mongol Ilkhanate",
      polityId: "pol_mongol",
      commanders: ["Kitbuqa Noyan †"],
      role: "attacker",
    },
    outcome: "Decisive Mamluk Victory",
    victor: "belligerentA",
    historicalSignificance:
      "One of the landmark battles in world history. Halted the seemingly unstoppable westward juggernaut of the Mongol Empire after the sack of Baghdad (1258), preserving Egypt, the Levant, and Islamic culture from annihilation.",
    tacticalSummary:
      "Baybars led the Mamluk vanguard into the Jezreel Valley, executing a feigned retreat that drew Kitbuqa's Mongol cavalry into an ambush ringed by hills. Qutuz threw off his helmet shouting 'Wa Islamah!' and charged with his heavy armored reserves, routing the Mongols and executing Kitbuqa.",
    locationName: "Spring of Goliath (Ain Jalut), Jezreel Valley, Palestine",
    coordinates: [35.37, 32.55],
    sourceCitation: "al-Maqrizi, Kitab al-Suluk; Reuven Amitai-Preiss, Mongols and Mamluks (Cambridge).",
  },
  {
    id: "bat_marj_al_saffar_1303",
    name: "Battle of Marj al-Saffar (Shaqhab)",
    nativeName: "مَعْرَكَةُ شَقْحَب (مَرْجُ الصُّفَّر)",
    year: 1303,
    belligerentA: {
      name: "Mamluk Sultanate",
      polityId: "pol_mamluk",
      commanders: ["Sultan al-Nasir Muhammad", "Emir Baybars al-Jashnakir", "Ibn Taymiyyah (ideologue)"],
      role: "defender",
    },
    belligerentB: {
      name: "Mongol Ilkhanate",
      polityId: "pol_mongol",
      commanders: ["Qutlugh Shah", "Chupan"],
      role: "attacker",
    },
    outcome: "Decisive Mamluk Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Permanently ended Mongol Ilkhanate invasions of Syria and established enduring Mamluk sovereignty over the Levant.",
    tacticalSummary:
      "Fought on the plain of Shaqhab south of Damascus. Fired by fatwas issued on the battlefield by scholar Ibn Taymiyyah, Mamluk heavy cavalry broke the Mongol center and chased the remnants into the mountains.",
    locationName: "Marj al-Saffar, south of Damascus, Syria",
    coordinates: [36.15, 33.3],
    sourceCitation: "Ibn Kathir, al-Bidayah wa'n-Nihayah; al-Maqrizi, al-Suluk.",
  },
  {
    id: "bat_kosovo_1389",
    name: "Battle of Kosovo",
    nativeName: "مَعْرَكَةُ قَوْسُوه",
    year: 1389,
    belligerentA: {
      name: "Ottoman Empire",
      polityId: "pol_ottoman",
      commanders: ["Sultan Murad I †", "Prince Bayezid (Yıldırım)", "Prince Yakub"],
      role: "attacker",
    },
    belligerentB: {
      name: "Serbian-led Balkan Coalition",
      commanders: ["Prince Lazar of Serbia †", "Vuk Branković", "Vlatko Vuković"],
      role: "defender",
    },
    outcome: "Decisive Ottoman Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Secured Ottoman dominance in the Balkans. Both Sultan Murad I and Prince Lazar perished on the field; Bayezid I assumed the sultanate, turning Serbia into an Ottoman tributary state.",
    tacticalSummary:
      "Fought on the Field of Blackbirds. A ferocious Serbian heavy knight assault was blunted by Ottoman archery and Janissary defense. Bayezid counter-attacked with devastating lightning speed, breaking the coalition center.",
    locationName: "Kosovo Polje (Field of Blackbirds), Pristina",
    coordinates: [21.12, 42.63],
    sourceCitation: "Aşıkpaşazade, Tevarih-i Al-i Osman; Halil Inalcik, The Ottoman Empire: The Classical Age.",
  },
  {
    id: "bat_ankara_1402",
    name: "Battle of Ankara",
    nativeName: "مَعْرَكَةُ أَنْقَرَة",
    year: 1402,
    belligerentA: {
      name: "Timurid Empire",
      polityId: "pol_timurid",
      commanders: ["Amir Timur (Tamerlane)", "Shah Rukh", "Mirza Miran Shah"],
      role: "attacker",
    },
    belligerentB: {
      name: "Ottoman Empire & Serbian Auxiliaries",
      polityId: "pol_ottoman",
      commanders: ["Sultan Bayezid I (captured)", "Stefan Lazarević of Serbia"],
      role: "defender",
    },
    outcome: "Decisive Timurid Victory; Capture of Ottoman Sultan",
    victor: "belligerentA",
    historicalSignificance:
      "The only occasion where an Ottoman Sultan was taken captive in battle. Plunged the Ottoman Empire into an eleven-year civil war (Ottoman Interregnum) and delayed the fall of Constantinople by fifty years.",
    tacticalSummary:
      "Timur diverted the Çubuk River, depriving Bayezid's parched army of water. During the heat of battle, Anatolian Turkmen beylik contingents defected from Bayezid to Timur, leaving only the Janissaries and Serbian knights to mount a heroic but doomed rearguard defense.",
    locationName: "Çubuk plain near Ankara, Central Anatolia, Turkey",
    coordinates: [32.85, 40.0],
    sourceCitation: "Ibn Arabshah, Aja'ib al-Maqdur fi Nawa'ib Timur; Sharaf al-Din Ali Yazdi, Zafarnama.",
  },
  {
    id: "bat_constantinople_1453",
    name: "Siege & Fall of Constantinople",
    nativeName: "فَتْحُ القُسْطَنْطِينِيَّة",
    year: 1453,
    belligerentA: {
      name: "Ottoman Empire",
      polityId: "pol_ottoman",
      commanders: ["Sultan Mehmed II (al-Fatih / The Conqueror)", "Zaganos Pasha", "Candarlı Halil Pasha"],
      role: "attacker",
    },
    belligerentB: {
      name: "Byzantine Empire & Venetian/Genoese Allies",
      commanders: ["Emperor Constantine XI Palaiologos †", "Giovanni Giustiniani Longo †"],
      role: "defender",
    },
    outcome: "Decisive Ottoman Victory; End of Byzantine Empire",
    victor: "belligerentA",
    historicalSignificance:
      "Epochal event marking the end of the Middle Ages. The conquest of the Queen of Cities fulfilled the famous Prophetic narration, transformed the Ottoman state into an undisputed transcontinental empire, and made Istanbul its imperial capital.",
    tacticalSummary:
      "Mehmed II deployed super-heavy siege cannons designed by Orban to smash the ancient Theodosian Walls. In a brilliant logistical feat, he transported 70 warships overland on greased logs across Galata hill into the Golden Horn. On 29 May 1453, the final assault breached the Romanus gate.",
    locationName: "Constantinople (Istanbul), Bosporus frontier",
    coordinates: [28.97, 41.01],
    sourceCitation: "Kritovoulos of Imbros, History of Mehmed the Conqueror; Steven Runciman, Fall of Constantinople.",
  },
  {
    id: "bat_chaldiran_1514",
    name: "Battle of Chaldiran",
    nativeName: "مَعْرَكَةُ جَالْدِيرَان",
    year: 1514,
    belligerentA: {
      name: "Ottoman Empire",
      polityId: "pol_ottoman",
      commanders: ["Sultan Selim I Yavuz (The Resolute)", "Hadim Sinan Pasha"],
      role: "attacker",
    },
    belligerentB: {
      name: "Safavid Empire of Iran",
      polityId: "pol_safavid",
      commanders: ["Shah Ismail I Khatai", "Muhammad Khan Ustajlu †"],
      role: "defender",
    },
    outcome: "Decisive Ottoman Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Defined the boundary between Ottoman Sunni hegemony and Safavid Shi'i Persia that endures in modern Iran-Turkey and Iraq-Iran borders today. Proved the decisive supremacy of gunpowder artillery over traditional cavalry.",
    tacticalSummary:
      "Shah Ismail's fanatical Qizilbash cavalry charged the Ottoman lines with suicidal bravery. Selim deployed 200 cannons chained together behind wagons (the tabur cengi system) alongside matchlock-armed Janissaries, decimating the Safavid cavalry.",
    locationName: "Chaldiran Plain, north-west of Tabriz, Iran",
    coordinates: [44.38, 39.08],
    sourceCitation: "Celalzade Mustafa Çelebi, Selimname; Eskandar Beg Monshi, History of Shah Abbas.",
  },
  {
    id: "bat_marj_dabiq_1516",
    name: "Battle of Marj Dabiq",
    nativeName: "مَعْرَكَةُ مَرْجِ دَابِق",
    year: 1516,
    belligerentA: {
      name: "Ottoman Empire",
      polityId: "pol_ottoman",
      commanders: ["Sultan Selim I"],
      role: "attacker",
    },
    belligerentB: {
      name: "Mamluk Sultanate of Cairo",
      polityId: "pol_mamluk",
      commanders: ["Sultan al-Ashraf Qansuh al-Ghawri †", "Khayr Baig (defector)"],
      role: "defender",
    },
    outcome: "Decisive Ottoman Victory",
    victor: "belligerentA",
    historicalSignificance:
      "Opened all of Syria to Ottoman rule and doomed the Mamluk Sultanate. Following victory, Selim took Damascus and marched into Egypt, transferring the Caliphal mantle to the House of Osman.",
    tacticalSummary:
      "The aging Mamluk Sultan relied on traditional knightly cavalry maneuvers, refusing firearm technology. The defection of Khayr Baig on the Mamluk left wing and Selim's artillery salvoes broke the Mamluk army; Sultan al-Ghawri died of apoplexy on the field.",
    locationName: "Dabiq, north of Aleppo, Syria",
    coordinates: [37.22, 36.53],
    sourceCitation: "Ibn Iyas, Bada'i' al-Zuhur fi Waqa'i' al-Duhur; P.M. Holt, The Age of the Crusades.",
  },
  {
    id: "bat_panipat_1_1526",
    name: "First Battle of Panipat",
    nativeName: "پانی پت کی پہلی لڑائی",
    year: 1526,
    belligerentA: {
      name: "Mughal Expeditionary Army",
      polityId: "pol_mughal",
      commanders: ["Zahir al-Din Muhammad Babur", "Humayun Mirza"],
      role: "attacker",
    },
    belligerentB: {
      name: "Delhi Sultanate (Lodi Dynasty)",
      polityId: "pol_delhi_sultanate",
      commanders: ["Sultan Ibrahim Lodi †"],
      role: "defender",
    },
    outcome: "Decisive Mughal Victory; Founding of Mughal Empire",
    victor: "belligerentA",
    historicalSignificance:
      "Established the Mughal Empire in India. Babur's 12,000 disciplined troops shattered Ibrahim Lodi's army of 100,000 and 1,000 war elephants using field guns and Ottoman tactics.",
    tacticalSummary:
      "Babur employed the Ottoman araba (cart barricade) formation with matchlocks and matchlock gunners, flanked by mounted horse archers utilizing tulughma (enveloping flank attacks). The sonic explosions of Babur's cannons panicked the Delhi war elephants, which trampled their own infantry.",
    locationName: "Panipat, Haryana, northern India",
    coordinates: [76.97, 29.39],
    sourceCitation: "Zahir al-Din Babur, Baburnama; Jadunath Sarkar, Military History of India.",
  },
  {
    id: "bat_mohacs_1526",
    name: "Battle of Mohács",
    nativeName: "مَعْرَكَةُ مُوهَاج",
    year: 1526,
    belligerentA: {
      name: "Ottoman Empire",
      polityId: "pol_ottoman",
      commanders: ["Sultan Suleiman I (The Magnificent / Kanuni)", "Pargalı Ibrahim Pasha"],
      role: "attacker",
    },
    belligerentB: {
      name: "Kingdom of Hungary",
      commanders: ["King Louis II of Hungary †", "Pál Tomori †"],
      role: "defender",
    },
    outcome: "Decisive Ottoman Victory; Collapse of Hungarian Kingdom",
    victor: "belligerentA",
    historicalSignificance:
      "Ended centuries of Hungarian independence and partitioned Hungary between the Ottoman Empire and Habsburg Austria. Brought Ottoman frontiers to the gates of Central Europe and Vienna.",
    tacticalSummary:
      "King Louis' heavy knights charged the Ottoman center in a desperate attempt to slay Suleiman directly. Suleiman's Janissaries and 300 cannons opened point-blank canister fire, annihilating the knight formations. King Louis drowned in the Csele brook during the flight.",
    locationName: "Mohács, Danube River, southern Hungary",
    coordinates: [18.68, 45.99],
    sourceCitation: "Kemalpaşazade, Mohaçname; Géza Perjés, The Fall of the Medieval Kingdom of Hungary.",
  },
  {
    id: "bat_panipat_2_1556",
    name: "Second Battle of Panipat",
    nativeName: "پانی پت کی دوسری لڑائی",
    year: 1556,
    belligerentA: {
      name: "Mughal Empire",
      polityId: "pol_mughal",
      commanders: ["Bairam Khan (Regent for young Akbar)", "Ali Quli Khan Shaibani"],
      role: "attacker",
    },
    belligerentB: {
      name: "Suri Dynasty & Hemu",
      commanders: ["Hemu (Vikramaditya) (captured)"],
      role: "defender",
    },
    outcome: "Decisive Mughal Victory; Restoration of Akbar's Empire",
    victor: "belligerentA",
    historicalSignificance:
      "Restored Mughal rule in Delhi and Agra for the thirteen-year-old Emperor Akbar, beginning his legendary half-century golden reign over Hindustan.",
    tacticalSummary:
      "Hemu's 1,500 armored war elephants initially battered the Mughal wings. As Hemu commanded from atop his elephant Hawaii, a Mughal archer struck him in the eye with an arrow. Deprived of their commander, Hemu's army collapsed in panic.",
    locationName: "Panipat, Haryana, northern India",
    coordinates: [76.97, 29.39],
    sourceCitation: "Abu'l-Fazl, Akbarnama; Vincent Smith, Akbar the Great Mogul.",
  },
  {
    id: "bat_three_kings_1578",
    name: "Battle of the Three Kings (Wadi al-Makhazin)",
    nativeName: "مَعْرَكَةُ وَادِي المَخَازِن (المُلُوكِ الثَّلَاثَة)",
    year: 1578,
    belligerentA: {
      name: "Saadi Sultanate of Morocco",
      commanders: ["Sultan Abd al-Malik I †", "Ahmad al-Mansur al-Dhahabi"],
      role: "defender",
    },
    belligerentB: {
      name: "Kingdom of Portugal & Allied Exiles",
      commanders: ["King Sebastian of Portugal †", "Deposed Sultan Muhammad al-Mutawakkil †"],
      role: "attacker",
    },
    outcome: "Decisive Moroccan Victory; Death of All Three Monarchs",
    victor: "belligerentA",
    historicalSignificance:
      "Known as the 'Battle of the Three Kings' because King Sebastian, Sultan Abd al-Malik, and al-Mutawakkil all died. Led directly to the Portuguese dynastic crisis of 1580 (Iberian Union under Spain) and the golden age of Ahmad al-Mansur.",
    tacticalSummary:
      "Moroccan cavalry flanked the Portuguese forces along the marshy banks of the Loukkos River. Sebastian's elite crusader army was encircled; King Sebastian perished and his army was utterly destroyed.",
    locationName: "Ksar el-Kebir / Wadi al-Makhazin, northern Morocco",
    coordinates: [-5.95, 35.02],
    sourceCitation: "al-Ifrani, Nuzhat al-Hadi; E.W. Bovill, The Battle of Alcazar.",
  },
  {
    id: "bat_vienna_1683",
    name: "Battle & Siege of Vienna",
    nativeName: "حِصَارُ فِيِينَّا الثَّانِي",
    year: 1683,
    belligerentA: {
      name: "Ottoman Empire",
      polityId: "pol_ottoman",
      commanders: ["Grand Vizier Kara Mustafa Pasha †"],
      role: "attacker",
    },
    belligerentB: {
      name: "Holy Roman Empire & Polish Coalition",
      commanders: ["King Jan III Sobieski of Poland", "Duke Charles V of Lorraine", "Count Ernst Rüdiger von Starhemberg"],
      role: "defender",
    },
    outcome: "Holy League Coalition Victory; Ottoman Siege Broken",
    victor: "belligerentB",
    historicalSignificance:
      "The high-water mark of Ottoman expansion into Central Europe. Marked the start of the Great Turkish War and the subsequent Ottoman territorial retreat in Hungary and the Balkans.",
    tacticalSummary:
      "Kara Mustafa besieged Vienna for two months, driving mines beneath the Burg bastion. On 12 September, King Jan Sobieski led the largest cavalry charge in European history (20,000 horsemen including Winged Hussars) down the slopes of Kahlenberg, shattering the Ottoman siege camps.",
    locationName: "Vienna, Austria",
    coordinates: [16.37, 48.21],
    sourceCitation: "Silahdar Findiklili Mehmed Agha, Silahdar Tarihi; John Stoye, The Siege of Vienna.",
  },
  {
    id: "bat_karnal_1739",
    name: "Battle of Karnal",
    nativeName: "مَعْرَكَةُ كَرْنَاق (نادر شاه)",
    year: 1739,
    belligerentA: {
      name: "Afsharid Persian Empire",
      commanders: ["Nader Shah Afshar (The Sword of Persia)"],
      role: "attacker",
    },
    belligerentB: {
      name: "Mughal Empire",
      polityId: "pol_mughal",
      commanders: ["Emperor Muhammad Shah", "Nizam al-Mulk", "Khan-i Dauran †"],
      role: "defender",
    },
    outcome: "Decisive Afsharid Victory; Sack of Delhi",
    victor: "belligerentA",
    historicalSignificance:
      "Mortally weakened the late Mughal Empire. Nader Shah captured Delhi, plundered the imperial treasury including the Peacock Throne and the Koh-i-Noor diamond, leaving northern India fragmented.",
    tacticalSummary:
      "Nader Shah utilized camel-mounted swivel guns (zamburak) and disciplined musketeers behind trenches. He lured the heavy Mughal elephant corps into an ambush where incendiary camel projectiles terrified the elephants into trampling the Mughal lines.",
    locationName: "Karnal, Haryana, northern India",
    coordinates: [76.98, 29.68],
    sourceCitation: "Mirza Mahdi Khan Astarabadi, Tarikh-i Jahangushay-i Naderi; Michael Axworthy, The Sword of Persia.",
  },
];

/**
 * Resolves a historical battle by its unique ID or by fuzzy title matching
 */
export function getBattleById(idOrTitle: string): HistoricalBattle | undefined {
  if (!idOrTitle) return undefined;
  const normalized = idOrTitle.toLowerCase().trim();
  return HISTORICAL_BATTLES.find(
    (b) =>
      b.id.toLowerCase() === normalized ||
      b.name.toLowerCase() === normalized ||
      normalized.includes(b.name.toLowerCase()) ||
      b.name.toLowerCase().includes(normalized)
  );
}

/**
 * Converts a HistoricalBattle into an RFC-compliant HistoricalEventRecord
 * for seamless integration with the map layers and API
 */
export function convertBattleToEventRecord(battle: HistoricalBattle): {
  id: string;
  title: string;
  eventYear: number;
  summary: string;
  eventType: string;
  locationName: string;
  locationGeojson: {
    type: "Point";
    coordinates: [number, number];
  };
  reviewStatus: string;
} {
  return {
    id: battle.id,
    title: battle.name,
    eventYear: battle.year,
    summary: `${battle.outcome}. ${battle.historicalSignificance}`,
    eventType: "battle",
    locationName: battle.locationName,
    locationGeojson: {
      type: "Point",
      coordinates: battle.coordinates,
    },
    reviewStatus: "published",
  };
}

/**
 * Filters battles active within a given historical tolerance window
 */
export function filterBattlesByYear(year: number, toleranceYears = 25): HistoricalBattle[] {
  return HISTORICAL_BATTLES.filter((b) => Math.abs(b.year - year) <= toleranceYears);
}

/**
 * Finds all battles associated with a specific military campaign
 */
export function getBattlesForCampaign(campaignId: string): HistoricalBattle[] {
  return HISTORICAL_BATTLES.filter((b) => b.campaignId === campaignId);
}

