
import { LibraryBook } from './types';

// Helper to assign colors based on category
const getCategoryColor = (cat: string) => {
  switch (cat) {
    case 'Primary Texts': return 'from-amber-200 to-orange-400';
    case 'Secondary Texts': return 'from-stone-200 to-stone-400';
    case 'Commentaries': return 'from-slate-200 to-slate-400';
    case 'Philosophy': return 'from-purple-200 to-indigo-400';
    case 'Arts': return 'from-rose-200 to-pink-400';
    case 'Science & Technology': return 'from-cyan-200 to-blue-400';
    case 'Ayurveda & Medicine': return 'from-green-200 to-emerald-400';
    case 'Mathematics & Astronomy': return 'from-blue-200 to-sky-400';
    case 'Śāstra': return 'from-red-200 to-red-400';
    case 'Archaeology & Epigraphy': return 'from-yellow-700 to-yellow-900'; // Darker for stone/earth
    default: return 'from-gray-200 to-gray-400';
  }
};

export const LIBRARY_CATEGORIES = [
  "All",
  "Primary Texts",
  "Secondary Texts",
  "Commentaries",
  "Grammar & Linguistics",
  "Philosophy",
  "Science & Technology",
  "Ayurveda & Medicine",
  "Mathematics & Astronomy",
  "Arts",
  "Śāstra",
  "Archaeology & Epigraphy",
  "Ancient Travellers",
  "Foreign Travellers",
  "Modern Indian Thinkers",
  "Modern Research",
  "Digital Repositories"
];

// The Mega Catalog A-Z
export const LIBRARY_BOOKS: LibraryBook[] = [
  // A
  { id: 'a1', title: 'Aitareya Brahmana', category: 'Primary Texts', subCategory: 'Vedic Literature', description: 'Ritual explanations; connected with Rigveda.', color: getCategoryColor('Primary Texts') },
  { id: 'a2', title: 'Aitareya Upanishad', category: 'Philosophy', subCategory: 'Upanishad', description: 'Discusses consciousness, creation, Self.', color: getCategoryColor('Philosophy') },
  { id: 'a3', title: 'Ajanta Cave Paintings', category: 'Arts', subCategory: 'Archaeology', description: 'Buddhist murals, frescoes; key for art history (2nd BCE – 480 CE).', color: getCategoryColor('Arts') },
  { id: 'a4', title: 'Akbar-Nama', author: 'Abul Fazl', category: 'Primary Texts', subCategory: 'Medieval History', description: 'Court history of Akbar, Mughal governance.', color: getCategoryColor('Primary Texts') },
  { id: 'a5', title: 'Akkadian–Indian Trade Records', category: 'Archaeology & Epigraphy', description: 'Mesopotamian references to Meluhha (Indus region).', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'a6', title: 'Al-Biruni’s India', category: 'Foreign Travellers', description: 'Detailed scientific study of India (1030 CE).', color: getCategoryColor('Foreign Travellers') },
  { id: 'a7', title: 'Amarakosha', author: 'Amarasimha', category: 'Grammar & Linguistics', description: 'Sanskrit Thesaurus (Tri-Kanda).', color: getCategoryColor('Grammar & Linguistics') },
  { id: 'a8', title: 'Amaravati Sculptures', category: 'Arts', subCategory: 'Archaeology', description: 'Andhra region, key Buddhist stupa artworks.', color: getCategoryColor('Arts') },
  { id: 'a9', title: 'Amritakunda', category: 'Philosophy', subCategory: 'Sufi-Hindu', description: 'Discusses yogic practices in Islamic framework.', color: getCategoryColor('Philosophy') },
  { id: 'a10', title: 'Dhvanyāloka', author: 'Anandavardhana', category: 'Arts', subCategory: 'Poetics', description: 'Foundational theory of dhvani (suggestion).', color: getCategoryColor('Arts') },
  { id: 'a11', title: 'An Introduction to Indian Philosophy', author: 'S. Chatterjee & D. Datta', category: 'Modern Research', description: 'Standard undergraduate text.', color: getCategoryColor('Modern Research') },
  { id: 'a12', title: 'Angkor–India Cultural Exchanges', category: 'Archaeology & Epigraphy', description: 'Hindu-Buddhist influence in Southeast Asia.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'a13', title: 'Aṅguttara Nikāya', category: 'Primary Texts', subCategory: 'Buddhist Canon', description: 'Collection of suttas grouped numerically.', color: getCategoryColor('Primary Texts') },
  { id: 'a14', title: 'Annapoorna Shastra', category: 'Śāstra', subCategory: 'Living Traditions', description: 'Representations of prasadam, temple kitchens.', color: getCategoryColor('Śāstra') },
  { id: 'a15', title: 'Anuyoga Dwara Sutra', category: 'Primary Texts', subCategory: 'Jain Literature', description: 'Jain canonical text.', color: getCategoryColor('Primary Texts') },
  { id: 'a16', title: 'Aranyakas', category: 'Primary Texts', subCategory: 'Vedic Literature', description: 'Forest treatises; transition from ritual to philosophy.', color: getCategoryColor('Primary Texts') },
  { id: 'a17', title: 'ASI Reports', category: 'Archaeology & Epigraphy', description: 'Annual reports, site excavations, epigraphical series.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'a18', title: 'Arthaśāstra', author: 'Kauṭilya', category: 'Śāstra', subCategory: 'Political Philosophy', description: 'Economics, statecraft, espionage (Mauryan).', color: getCategoryColor('Śāstra') },
  { id: 'a19', title: 'Aryabhatiya', author: 'Aryabhata', category: 'Mathematics & Astronomy', description: 'Place value, pi approximations, trigonometric tables.', color: getCategoryColor('Mathematics & Astronomy') },
  { id: 'a20', title: 'Yogācāra Texts', author: 'Asanga', category: 'Philosophy', subCategory: 'Buddhist', description: 'Yogācārabhūmi, Mahāyāna-sūtrālaṃkāra.', color: getCategoryColor('Philosophy') },
  { id: 'a21', title: 'Ashoka Edicts', category: 'Archaeology & Epigraphy', description: 'Earliest decipherable Indian inscriptions (Brahmi/Kharosthi).', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'a22', title: 'Aṣṭādhyāyī', author: 'Pāṇini', category: 'Grammar & Linguistics', description: 'Foundation of generative grammar; metalanguage.', color: getCategoryColor('Grammar & Linguistics') },
  { id: 'a23', title: 'Atharva Veda', category: 'Primary Texts', subCategory: 'Vedic', description: 'Spells, rituals, health, and societal reflections.', color: getCategoryColor('Primary Texts') },
  { id: 'a24', title: 'Complete Works', author: 'Sri Aurobindo', category: 'Modern Indian Thinkers', description: 'Integral Yoga, national regeneration.', color: getCategoryColor('Modern Indian Thinkers') },
  { id: 'a25', title: 'Agni Purana', category: 'Primary Texts', subCategory: 'Puranic', description: 'Encyclopedic Mahapurana covering law, politics, and medicine.', color: getCategoryColor('Primary Texts') },
  { id: 'a26', title: 'Amuktamalyada', author: 'Krishnadevaraya', category: 'Primary Texts', subCategory: 'Telugu Epic', description: 'Masterpiece of Telugu literature on Goda Devi.', color: getCategoryColor('Primary Texts') },
  { id: 'a27', title: 'Ashtavakra Gita', category: 'Philosophy', subCategory: 'Advaita', description: 'Pure non-dualistic dialogue between Janaka and Ashtavakra.', color: getCategoryColor('Philosophy') },
  { id: 'a28', title: 'Avadhuta Gita', author: 'Dattatreya', category: 'Philosophy', subCategory: 'Advaita', description: 'Song of the free soul.', color: getCategoryColor('Philosophy') },

  // B
  { id: 'b1', title: 'Bakhshali Manuscript', category: 'Mathematics & Astronomy', description: 'Contains early use of zero symbol.', color: getCategoryColor('Mathematics & Astronomy') },
  { id: 'b2', title: 'Balinese Agama Hindu Dharma', category: 'Primary Texts', description: 'Indian influence in Southeast Asian Hinduism.', color: getCategoryColor('Primary Texts') },
  { id: 'b3', title: 'Harshacharita & Kadambari', author: 'Bana', category: 'Primary Texts', subCategory: 'Literature', description: 'Classical Sanskrit Prose.', color: getCategoryColor('Primary Texts') },
  { id: 'b4', title: 'Barhut Stupa Sculptures', category: 'Archaeology & Epigraphy', subCategory: 'Buddhist Art', description: 'Early Buddhist relief sculpture.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'b5', title: 'Vachanas', author: 'Basava', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Kannada Bhakti literature.', color: getCategoryColor('Primary Texts') },
  { id: 'b6', title: 'The Wonder That Was India', author: 'A.L. Basham', category: 'Modern Research', description: 'Classic academic history.', color: getCategoryColor('Modern Research') },
  { id: 'b7', title: 'Baudhāyana Sulba Sūtra', category: 'Mathematics & Astronomy', description: 'Geometric constructions; proto-Pythagorean triples.', color: getCategoryColor('Mathematics & Astronomy') },
  { id: 'b8', title: 'Nāṭyaśāstra', author: 'Bharata Muni', category: 'Arts', description: 'Rasa theory, stagecraft, music, gestures.', color: getCategoryColor('Arts') },
  { id: 'b9', title: 'Kirātārjunīya', author: 'Bharavi', category: 'Primary Texts', subCategory: 'Epic Poetry', description: 'Classical Sanskrit Epic.', color: getCategoryColor('Primary Texts') },
  { id: 'b10', title: 'Bhāgavata Purāṇa', category: 'Primary Texts', subCategory: 'Puranic', description: 'Central text of Krishna Bhakti.', color: getCategoryColor('Primary Texts') },
  { id: 'b11', title: 'Lilavati & Bījagaṇita', author: 'Bhāskara II', category: 'Mathematics & Astronomy', description: 'Algebra and Arithmetic.', color: getCategoryColor('Mathematics & Astronomy') },
  { id: 'b12', title: 'Brahma Sutra', author: 'Bādarāyaṇa', category: 'Philosophy', subCategory: 'Vedanta', description: 'Foundational text of Vedanta schools.', color: getCategoryColor('Philosophy') },
  { id: 'b13', title: 'Brahmi Script Corpus', category: 'Archaeology & Epigraphy', description: 'Primary source for early Indian writing.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'b14', title: 'Bṛhadāraṇyaka Upanishad', category: 'Philosophy', subCategory: 'Vedic', description: 'One of the oldest Upanishads.', color: getCategoryColor('Philosophy') },
  { id: 'b15', title: 'Bṛhat Saṃhitā', author: 'Varahamihira', category: 'Science & Technology', description: 'Encyclopedic work on astronomy, architecture, etc.', color: getCategoryColor('Science & Technology') },
  { id: 'b16', title: 'Visuddhimagga', author: 'Buddhaghosa', category: 'Commentaries', subCategory: 'Buddhist', description: 'The Path of Purification.', color: getCategoryColor('Commentaries') },
  { id: 'b17', title: 'Bhakti Sutras', author: 'Narada', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Aphorisms on the nature of devotion.', color: getCategoryColor('Primary Texts') },
  { id: 'b18', title: 'Buddhacarita', author: 'Ashvaghosha', category: 'Primary Texts', subCategory: 'Buddhist', description: 'Epic poem on the life of Buddha.', color: getCategoryColor('Primary Texts') },

  // C
  { id: 'c1', title: 'Cārvāka / Lokayata Texts', category: 'Philosophy', subCategory: 'Materialist', description: 'Reconstructed materialist philosophy.', color: getCategoryColor('Philosophy') },
  { id: 'c2', title: 'Cave Temples (Ajanta/Ellora)', category: 'Archaeology & Epigraphy', description: 'Hindu, Buddhist, Jain trinity of rock-cut architecture.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'c3', title: 'Cāṇakya Nīti', category: 'Śāstra', subCategory: 'Ethics', description: 'Aphorisms on ethics and statecraft.', color: getCategoryColor('Śāstra') },
  { id: 'c4', title: 'Caraka Saṃhitā', category: 'Ayurveda & Medicine', description: 'Internal medicine, dosha theory.', color: getCategoryColor('Ayurveda & Medicine') },
  { id: 'c5', title: 'Chaitanya Charitamrita', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Gaudiya Vaishnavism source.', color: getCategoryColor('Primary Texts') },
  { id: 'c6', title: 'Chandogya Upanishad', category: 'Philosophy', subCategory: 'Vedic', description: 'Key Vedantic concepts (Tat Tvam Asi).', color: getCategoryColor('Philosophy') },
  { id: 'c7', title: 'Chitrasutra', category: 'Arts', description: 'Section of Vishnudharmottara Purana on painting.', color: getCategoryColor('Arts') },
  { id: 'c8', title: 'Chola Bronzes', category: 'Arts', description: 'Archaeological corpus of bronze sculpture.', color: getCategoryColor('Arts') },
  { id: 'c9', title: 'Corpus Inscriptionum Indicarum', category: 'Archaeology & Epigraphy', description: 'Critical epigraphic master corpus.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'c10', title: 'ASI Reports', author: 'Alexander Cunningham', category: 'Archaeology & Epigraphy', description: 'Foundational work for archaeological survey.', color: getCategoryColor('Archaeology & Epigraphy') },

  // D
  { id: 'd1', title: 'Kavyadarsha & Dashakumaracharita', author: 'Daṇḍin', category: 'Arts', subCategory: 'Poetics', description: 'Treatise on poetics and prose romance.', color: getCategoryColor('Arts') },
  { id: 'd2', title: 'Anandamath', author: 'Bankim Chandra', category: 'Modern Indian Thinkers', description: 'Bengal Renaissance literature.', color: getCategoryColor('Modern Indian Thinkers') },
  { id: 'd3', title: 'Dattatreya Samhita', category: 'Philosophy', subCategory: 'Tantra', description: 'Tantric/Avadhuta tradition.', color: getCategoryColor('Philosophy') },
  { id: 'd4', title: 'Darshana (Ṣaḍdarśana)', category: 'Philosophy', description: 'Six orthodox systems: Sāṃkhya, Yoga, Nyāya, Vaiśeṣika, Mīmāṃsā, Vedānta.', color: getCategoryColor('Philosophy') },
  { id: 'd5', title: 'Dhammapada', category: 'Primary Texts', subCategory: 'Buddhist', description: 'Canonical verses; key for comparative studies.', color: getCategoryColor('Primary Texts') },
  { id: 'd6', title: 'Dharmashastra Corpus', category: 'Śāstra', description: 'Manu, Yajnavalkya, Narada legal texts.', color: getCategoryColor('Śāstra') },
  { id: 'd7', title: 'Dholavira Reports', category: 'Archaeology & Epigraphy', description: 'Major Harappan urban site records.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'd8', title: 'Dīgha Nikāya', category: 'Primary Texts', subCategory: 'Buddhist', description: 'Long discourses of the Buddha.', color: getCategoryColor('Primary Texts') },
  { id: 'd9', title: 'Mahavamsa', category: 'Primary Texts', subCategory: 'Chronicle', description: 'Chronicles of Sri Lankan Buddhism.', color: getCategoryColor('Primary Texts') },
  { id: 'd10', title: 'Devi Mahatmya', category: 'Primary Texts', subCategory: 'Shakta', description: 'Durga Saptashati; key Goddess text.', color: getCategoryColor('Primary Texts') },
  { id: 'd11', title: 'Dasbodh', author: 'Samarth Ramdas', category: 'Philosophy', subCategory: 'Bhakti', description: 'Manual on Advaita and worldly duties.', color: getCategoryColor('Philosophy') },

  // E
  { id: 'e1', title: 'Edicts of Ashoka', category: 'Archaeology & Epigraphy', description: 'Moral-political guidelines, Mauryan history.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'e2', title: 'Early Tamil-Brahmi Inscriptions', category: 'Archaeology & Epigraphy', description: 'Crucial for dating Tamil traditions.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'e3', title: 'Etymological Studies', author: 'Monier-Williams', category: 'Grammar & Linguistics', description: 'Foundational Sanskrit dictionaries.', color: getCategoryColor('Grammar & Linguistics') },

  // F
  { id: 'f1', title: 'Records of Buddhist Kingdoms', author: 'Fa-Hien', category: 'Ancient Travellers', description: '5th century Chinese pilgrim account.', color: getCategoryColor('Ancient Travellers') },
  { id: 'f2', title: 'Fathpur Sikri Inscriptions', category: 'Archaeology & Epigraphy', description: 'Mughal architecture and urban planning.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'f3', title: 'Folk Epics', category: 'Primary Texts', subCategory: 'Oral Tradition', description: 'Bhil epics, Gond narratives.', color: getCategoryColor('Primary Texts') },

  // G
  { id: 'g1', title: 'Gandhara Art', category: 'Arts', subCategory: 'Archaeology', description: 'Greco-Buddhist art (1st-5th c. CE).', color: getCategoryColor('Arts') },
  { id: 'g2', title: 'Gāndhārī Manuscripts', category: 'Archaeology & Epigraphy', description: 'Oldest surviving Buddhist manuscripts.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'g3', title: 'Ganita Kaumudi', author: 'Narayan Pandit', category: 'Mathematics & Astronomy', description: 'Algebraic problem sets; combinatorics.', color: getCategoryColor('Mathematics & Astronomy') },
  { id: 'g4', title: 'Garuda Purana', category: 'Primary Texts', subCategory: 'Puranic', description: 'Rituals, afterlife, medicine, gemology.', color: getCategoryColor('Primary Texts') },
  { id: 'g5', title: 'Gathas', category: 'Primary Texts', subCategory: 'Jain', description: 'Jain Agamas early verses.', color: getCategoryColor('Primary Texts') },
  { id: 'g6', title: 'Geet Govind', author: 'Jayadeva', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Sanskrit devotional poetry for Krishna.', color: getCategoryColor('Primary Texts') },
  { id: 'g7', title: 'Gita Press Editions', category: 'Digital Repositories', description: 'Encyclopedic corpus of Hindu scriptures.', color: getCategoryColor('Digital Repositories') },
  { id: 'g8', title: 'Gupta Inscriptions', category: 'Archaeology & Epigraphy', description: 'Allahabad Pillar, Bhitari Seal.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'g9', title: 'Gheranda Samhita', category: 'Philosophy', subCategory: 'Yoga', description: 'Seven-limb yoga manual.', color: getCategoryColor('Philosophy') },
  { id: 'g10', title: 'Guru Granth Sahib', category: 'Primary Texts', subCategory: 'Sikh', description: 'Primary scripture of Sikhism.', color: getCategoryColor('Primary Texts') },

  // H
  { id: 'h1', title: 'Gāthā Saptashati', author: 'Hala', category: 'Primary Texts', subCategory: 'Prakrit', description: 'Classical Prakrit lyrical poetry.', color: getCategoryColor('Primary Texts') },
  { id: 'h2', title: 'Harappan Script Corpus', category: 'Archaeology & Epigraphy', description: 'Seals, tablets, sign-lists.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'h3', title: 'Harṣacarita', author: 'Bāṇa', category: 'Primary Texts', subCategory: 'Literature', description: 'Biography of King Harsha.', color: getCategoryColor('Primary Texts') },
  { id: 'h4', title: 'Hatha Yoga Pradipika', category: 'Philosophy', subCategory: 'Yoga', description: 'Medieval hatha yoga manual.', color: getCategoryColor('Philosophy') },
  { id: 'h5', title: 'Siddha-Hema-Śabdanuśāsana', author: 'Hemachandra', category: 'Grammar & Linguistics', description: 'Jain polymath grammar works.', color: getCategoryColor('Grammar & Linguistics') },
  { id: 'h6', title: 'Great Tang Records', author: 'Hiuen Tsang', category: 'Ancient Travellers', description: 'Description of 7th-century India.', color: getCategoryColor('Ancient Travellers') },
  { id: 'h7', title: 'Hitopadesha', category: 'Primary Texts', subCategory: 'Niti', description: 'Ethical tales; Panchatantra lineage.', color: getCategoryColor('Primary Texts') },

  // I
  { id: 'i1', title: 'Rehla', author: 'Ibn Battuta', category: 'Foreign Travellers', description: 'Travels in Delhi Sultanate period.', color: getCategoryColor('Foreign Travellers') },
  { id: 'i2', title: 'IGNCA Repositories', category: 'Digital Repositories', description: 'Indira Gandhi National Centre for the Arts archives.', color: getCategoryColor('Digital Repositories') },
  { id: 'i3', title: 'Silappadikaram', author: 'Ilango Adigal', category: 'Primary Texts', subCategory: 'Tamil Epic', description: 'Classical Tamil Epic.', color: getCategoryColor('Primary Texts') },
  { id: 'i4', title: 'Indica', author: 'Megasthenes', category: 'Foreign Travellers', description: 'Greek ethnographic description of Mauryan India.', color: getCategoryColor('Foreign Travellers') },
  { id: 'i5', title: 'Indian Archaeology — A Review', category: 'Archaeology & Epigraphy', description: 'ASI Annual Reports.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'i6', title: 'Sangeet Ratnakara', category: 'Arts', subCategory: 'Music', description: 'Classical Music Treatise.', color: getCategoryColor('Arts') },
  { id: 'i7', title: 'Nyāya Sutra', category: 'Philosophy', subCategory: 'Logic', description: 'Foundational text of Indian Logic.', color: getCategoryColor('Philosophy') },
  { id: 'i8', title: 'Isha Upanishad', category: 'Philosophy', subCategory: 'Vedic', description: 'Key Upanishad on renunciation and action.', color: getCategoryColor('Philosophy') },

  // J
  { id: 'j1', title: 'Mimamsa Sutra', author: 'Jaimini', category: 'Philosophy', description: 'Ritual Hermeneutics.', color: getCategoryColor('Philosophy') },
  { id: 'j2', title: 'Jaina Agamas', category: 'Primary Texts', subCategory: 'Jain', description: 'Śvetāmbara and Digambara canons.', color: getCategoryColor('Primary Texts') },
  { id: 'j3', title: 'Jatakas', category: 'Primary Texts', subCategory: 'Buddhist', description: 'Buddhist Narrative Literature.', color: getCategoryColor('Primary Texts') },
  { id: 'j4', title: 'Discovery of India', author: 'Jawaharlal Nehru', category: 'Modern Indian Thinkers', description: 'Historical and cultural analysis.', color: getCategoryColor('Modern Indian Thinkers') },

  // K
  { id: 'k1', title: 'Kabir Granthavali', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Poems of Kabir.', color: getCategoryColor('Primary Texts') },
  { id: 'k2', title: 'Rajatarangini', author: 'Kalhana', category: 'Primary Texts', subCategory: 'History', description: 'History of Kashmir.', color: getCategoryColor('Primary Texts') },
  { id: 'k3', title: 'Kalidasa Complete Works', author: 'Kalidasa', category: 'Primary Texts', subCategory: 'Literature', description: 'Shakuntalam, Meghaduta, etc.', color: getCategoryColor('Primary Texts') },
  { id: 'k4', title: 'Kanheri & Karle Caves', category: 'Archaeology & Epigraphy', description: 'Buddhist Monastic Sites.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'k5', title: 'Sāṃkhya Darshana', author: 'Kapila', category: 'Philosophy', description: 'Sāṃkhya Philosophy.', color: getCategoryColor('Philosophy') },
  { id: 'k6', title: 'Tantraloka', author: 'Abhinavagupta', category: 'Philosophy', subCategory: 'Kashmir Shaivism', description: 'Key text of Kashmir Shaivism.', color: getCategoryColor('Philosophy') },
  { id: 'k7', title: 'Vartikas', author: 'Katyayana', category: 'Grammar & Linguistics', description: 'Supplementary rules to Pāṇini.', color: getCategoryColor('Grammar & Linguistics') },
  { id: 'k8', title: 'Khajuraho Temples', category: 'Arts', subCategory: 'Architecture', description: 'Nagara architecture; sculptural corpus.', color: getCategoryColor('Arts') },
  { id: 'k9', title: 'Kharavela Hathigumpha', category: 'Archaeology & Epigraphy', description: 'Epigraphy / Political History.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'k10', title: 'Kamba Ramayanam', author: 'Kambar', category: 'Primary Texts', subCategory: 'Tamil Epic', description: 'Tamil retelling of Ramayana.', color: getCategoryColor('Primary Texts') },
  { id: 'k11', title: 'Kathasaritsagara', author: 'Somadeva', category: 'Primary Texts', subCategory: 'Literature', description: 'Ocean of the Streams of Stories.', color: getCategoryColor('Primary Texts') },
  { id: 'k12', title: 'Katha Upanishad', category: 'Philosophy', subCategory: 'Vedic', description: 'Dialogue between Nachiketa and Yama.', color: getCategoryColor('Philosophy') },
  { id: 'k13', title: 'Kumarasambhava', author: 'Kalidasa', category: 'Primary Texts', subCategory: 'Poetry', description: 'Epic on the birth of Kumara.', color: getCategoryColor('Primary Texts') },

  // L
  { id: 'l1', title: 'Laghu Yoga Vasistha', category: 'Philosophy', subCategory: 'Advaita', description: 'Philosophy of Advaita.', color: getCategoryColor('Philosophy') },
  { id: 'l2', title: 'Lalita Sahasranama', category: 'Primary Texts', subCategory: 'Shakta', description: 'Devotional / Śākta texts.', color: getCategoryColor('Primary Texts') },
  { id: 'l3', title: 'Lankavatara Sutra', category: 'Philosophy', subCategory: 'Buddhist', description: 'Yogācāra–tathāgatagarbha affiliations.', color: getCategoryColor('Philosophy') },
  { id: 'l4', title: 'Lothal Excavation Reports', category: 'Archaeology & Epigraphy', description: 'Harappan dockyard, seals.', color: getCategoryColor('Archaeology & Epigraphy') },

  // M
  { id: 'm1', title: 'Madhava of Sangamagrama Works', category: 'Mathematics & Astronomy', description: 'Infinite series for π, calculus precursors.', color: getCategoryColor('Mathematics & Astronomy') },
  { id: 'm2', title: 'MūlaMadhyamakaKārikā', author: 'Nāgārjuna', category: 'Philosophy', subCategory: 'Buddhist', description: 'Sunyata theory; Madhyamaka.', color: getCategoryColor('Philosophy') },
  { id: 'm3', title: 'Mahabharata', category: 'Primary Texts', subCategory: 'Epic', description: 'BORI Critical Edition. Paramount source.', color: getCategoryColor('Primary Texts') },
  { id: 'm4', title: 'Mahabodhi Temple Records', category: 'Archaeology & Epigraphy', description: 'Bodh Gaya history.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'm5', title: 'Majjhima Nikāya', category: 'Primary Texts', subCategory: 'Buddhist', description: 'Middle Length Discourses.', color: getCategoryColor('Primary Texts') },
  { id: 'm6', title: 'Mandukya Upanishad', category: 'Philosophy', subCategory: 'Vedic', description: 'With Gaudapada Kārikā.', color: getCategoryColor('Philosophy') },
  { id: 'm7', title: 'Manimekalai', category: 'Primary Texts', subCategory: 'Tamil Epic', description: 'Buddhist Tamil Epic.', color: getCategoryColor('Primary Texts') },
  { id: 'm8', title: 'Manu Smriti', category: 'Śāstra', subCategory: 'Law', description: 'Manava Dharmashastra.', color: getCategoryColor('Śāstra') },
  { id: 'm9', title: 'Meghaduta', author: 'Kalidasa', category: 'Primary Texts', subCategory: 'Poetry', description: 'Sanskrit lyric poetry.', color: getCategoryColor('Primary Texts') },
  { id: 'm10', title: 'Mehrauli Iron Pillar', category: 'Science & Technology', description: 'Corrosion-resistant iron metallurgy.', color: getCategoryColor('Science & Technology') },
  { id: 'm11', title: 'Mīmāṃsā Sutras', category: 'Philosophy', description: 'Ritual Hermeneutics.', color: getCategoryColor('Philosophy') },
  { id: 'm12', title: 'Mohanjo-daro Reports', category: 'Archaeology & Epigraphy', description: 'Indus Valley excavation reports.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'm13', title: 'Mudrarakshasa', author: 'Visakhadatta', category: 'Arts', subCategory: 'Drama', description: 'Mauryan political intrigue play.', color: getCategoryColor('Arts') },
  { id: 'm14', title: 'Mahabhasya', author: 'Patanjali', category: 'Grammar & Linguistics', description: 'Great Commentary on Panini.', color: getCategoryColor('Grammar & Linguistics') },
  { id: 'm15', title: 'Mahabharata Tatparya Nirnaya', author: 'Madhvacharya', category: 'Commentaries', subCategory: 'Dvaita', description: 'Dvaita interpretation of the Epic.', color: getCategoryColor('Commentaries') },
  { id: 'm16', title: 'Milinda Panha', category: 'Philosophy', subCategory: 'Buddhist', description: 'Questions of King Milinda.', color: getCategoryColor('Philosophy') },
  { id: 'm17', title: 'Mundaka Upanishad', category: 'Philosophy', subCategory: 'Vedic', description: 'Source of Satyameva Jayate.', color: getCategoryColor('Philosophy') },

  // N
  { id: 'n1', title: 'Nagarjunakonda', category: 'Archaeology & Epigraphy', description: 'Buddhist Art and Inscriptions.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'n2', title: 'Nalanda Mahavihara Reports', category: 'Archaeology & Epigraphy', description: 'Excavations of the ancient university.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'n3', title: 'Namdev Abhangs', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Marathi devotional poetry.', color: getCategoryColor('Primary Texts') },
  { id: 'n4', title: 'Natya Shastra', category: 'Arts', subCategory: 'Theatre', description: 'Treatise on performing arts.', color: getCategoryColor('Arts') },
  { id: 'n5', title: 'Tattvacintāmaṇi', author: 'Gangeśa', category: 'Philosophy', subCategory: 'Logic', description: 'Navya-Nyāya logic.', color: getCategoryColor('Philosophy') },
  { id: 'n6', title: 'Neelakantha Commentary', category: 'Commentaries', description: 'Traditional commentary on Mahabharata.', color: getCategoryColor('Commentaries') },
  { id: 'n7', title: 'Nirukta', author: 'Yaska', category: 'Grammar & Linguistics', description: 'Etymological treatise.', color: getCategoryColor('Grammar & Linguistics') },

  // O
  { id: 'o1', title: 'Odissi Dance Treatises', category: 'Arts', subCategory: 'Dance', description: 'Classical dance texts.', color: getCategoryColor('Arts') },
  { id: 'o2', title: 'Orissan Temple Architecture', category: 'Arts', subCategory: 'Architecture', description: 'Temple architecture corpus.', color: getCategoryColor('Arts') },

  // P
  { id: 'p1', title: 'Padma Purana', category: 'Primary Texts', subCategory: 'Puranic', description: 'Major Purana.', color: getCategoryColor('Primary Texts') },
  { id: 'p2', title: 'Panchatantra', category: 'Primary Texts', subCategory: 'Niti', description: 'Fables and Nīti Literature.', color: getCategoryColor('Primary Texts') },
  { id: 'p3', title: 'Yoga Sutra', author: 'Patanjali', category: 'Philosophy', subCategory: 'Yoga', description: 'With Vyasa Bhashya.', color: getCategoryColor('Philosophy') },
  { id: 'p4', title: 'Pattadakal Temples', category: 'Archaeology & Epigraphy', description: 'Chalukyan art site.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'p5', title: 'Padārthadharmasaṁgraha', author: 'Prashastapada', category: 'Philosophy', subCategory: 'Vaisheshika', description: 'Vaisheshika Philosophy.', color: getCategoryColor('Philosophy') },
  { id: 'p6', title: 'Pṛthivīraj Rāso', author: 'Chand Bardai', category: 'Primary Texts', subCategory: 'Epic', description: 'Medieval Hindi Epic.', color: getCategoryColor('Primary Texts') },
  { id: 'p7', title: 'Pancadasi', author: 'Vidyaranya', category: 'Philosophy', subCategory: 'Advaita', description: 'Comprehensive manual of Advaita Vedanta.', color: getCategoryColor('Philosophy') },
  { id: 'p8', title: 'Periya Puranam', category: 'Primary Texts', subCategory: 'Tamil Bhakti', description: 'Lives of the 63 Nayanars.', color: getCategoryColor('Primary Texts') },
  { id: 'p9', title: 'Prashna Upanishad', category: 'Philosophy', subCategory: 'Vedic', description: 'The six questions on life and prana.', color: getCategoryColor('Philosophy') },

  // R
  { id: 'r1', title: 'Raghuvamsha', author: 'Kalidasa', category: 'Primary Texts', subCategory: 'Literature', description: 'Sanskrit Epic.', color: getCategoryColor('Primary Texts') },
  { id: 'r2', title: 'Rajaraja Chola Inscriptions', category: 'Archaeology & Epigraphy', description: 'Chola history and epigraphy.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'r3', title: 'Ramacharitmanas', author: 'Tulsidas', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Awadhi Ramayana.', color: getCategoryColor('Primary Texts') },
  { id: 'r4', title: 'Sri Bhashya', author: 'Ramanuja', category: 'Philosophy', subCategory: 'Vedanta', description: 'Vishishtadvaita commentary.', color: getCategoryColor('Philosophy') },
  { id: 'r5', title: 'Rasaratnakara', author: 'Nagarjuna', category: 'Science & Technology', description: 'Chemistry / Metallurgy.', color: getCategoryColor('Science & Technology') },
  { id: 'r6', title: 'Rigveda', category: 'Primary Texts', subCategory: 'Vedic', description: 'The oldest Veda; hymns to deities.', color: getCategoryColor('Primary Texts') },

  // S
  { id: 's1', title: 'Sāhitya Darpaṇa', author: 'Viśvanātha', category: 'Arts', subCategory: 'Poetics', description: 'Aesthetics and poetics.', color: getCategoryColor('Arts') },
  { id: 's2', title: 'Sāṅkhya Kārikā', author: 'Īśvara Kṛṣṇa', category: 'Philosophy', description: 'Classical Sāṅkhya.', color: getCategoryColor('Philosophy') },
  { id: 's3', title: 'Samarangana Sutradhara', author: 'Bhojadeva', category: 'Science & Technology', subCategory: 'Architecture', description: 'Vastu and mechanics.', color: getCategoryColor('Science & Technology') },
  { id: 's4', title: 'Samaveda', category: 'Primary Texts', subCategory: 'Vedic', description: 'The Veda of melodies and chants.', color: getCategoryColor('Primary Texts') },
  { id: 's5', title: 'Sangam Literature', category: 'Primary Texts', subCategory: 'Tamil', description: 'Ettuthokai, Pattupattu.', color: getCategoryColor('Primary Texts') },
  { id: 's6', title: 'Śatapatha Brāhmaṇa', category: 'Primary Texts', subCategory: 'Vedic', description: 'Ritual and cosmology.', color: getCategoryColor('Primary Texts') },
  { id: 's7', title: 'Shiva Purana', category: 'Primary Texts', subCategory: 'Puranic', description: 'Shaiva traditions.', color: getCategoryColor('Primary Texts') },
  { id: 's8', title: 'Siddhanta Kaumudi', author: 'Bhattoji Dikshita', category: 'Grammar & Linguistics', description: 'Paninian Grammar.', color: getCategoryColor('Grammar & Linguistics') },
  { id: 's9', title: 'Surya Siddhanta', category: 'Mathematics & Astronomy', description: 'Ancient Astronomy.', color: getCategoryColor('Mathematics & Astronomy') },
  { id: 's10', title: 'Sushruta Samhita', category: 'Ayurveda & Medicine', description: 'Surgery and Medicine.', color: getCategoryColor('Ayurveda & Medicine') },
  { id: 's11', title: 'Saundarya Lahari', author: 'Adi Shankara', category: 'Primary Texts', subCategory: 'Tantra', description: 'Hymn to the Divine Mother.', color: getCategoryColor('Primary Texts') },
  { id: 's12', title: 'Shiva Sutras', author: 'Vasugupta', category: 'Philosophy', subCategory: 'Kashmir Shaivism', description: 'Foundational text of Trika system.', color: getCategoryColor('Philosophy') },
  { id: 's13', title: 'Spanda Karika', category: 'Philosophy', subCategory: 'Kashmir Shaivism', description: 'The doctrine of vibration.', color: getCategoryColor('Philosophy') },
  { id: 's14', title: 'Svapnavasavadattam', author: 'Bhasa', category: 'Arts', subCategory: 'Drama', description: 'The Dream of Vasavadatta.', color: getCategoryColor('Arts') },

  // T
  { id: 't1', title: 'Taittiriya Samhita', category: 'Primary Texts', subCategory: 'Vedic', description: 'Krishna Yajurveda.', color: getCategoryColor('Primary Texts') },
  { id: 't2', title: 'Tevaram', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Tamil Saiva Hymns.', color: getCategoryColor('Primary Texts') },
  { id: 't3', title: 'Tarkasangraha', author: 'Annaṃbhaṭṭa', category: 'Philosophy', subCategory: 'Logic', description: 'Nyaya-Vaisheshika primer.', color: getCategoryColor('Philosophy') },
  { id: 't4', title: 'Tholkappiyam', category: 'Grammar & Linguistics', description: 'Ancient Tamil Grammar.', color: getCategoryColor('Grammar & Linguistics') },
  { id: 't5', title: 'Tirukkural', author: 'Thiruvalluvar', category: 'Śāstra', subCategory: 'Ethics', description: 'Tamil ethical treatise.', color: getCategoryColor('Śāstra') },
  { id: 't6', title: 'Tripitaka', category: 'Primary Texts', subCategory: 'Buddhist', description: 'Pali Canon.', color: getCategoryColor('Primary Texts') },
  { id: 't7', title: 'Tirumantiram', author: 'Tirumular', category: 'Philosophy', subCategory: 'Tamil Shaivism', description: 'Shaiva Siddhanta and Yoga.', color: getCategoryColor('Philosophy') },
  { id: 't8', title: 'Tiruppavai', author: 'Andal', category: 'Primary Texts', subCategory: 'Bhakti', description: 'Vaishnava devotional hymns.', color: getCategoryColor('Primary Texts') },

  // U
  { id: 'u1', title: 'Udayagiri Caves', category: 'Archaeology & Epigraphy', description: 'Gupta art.', color: getCategoryColor('Archaeology & Epigraphy') },
  { id: 'u2', title: 'Upadesa Sahasri', author: 'Shankaracharya', category: 'Philosophy', subCategory: 'Vedanta', description: 'Advaita Vedanta.', color: getCategoryColor('Philosophy') },
  { id: 'u3', title: 'Upanishads (108)', category: 'Philosophy', subCategory: 'Vedic', description: 'Complete Canon.', color: getCategoryColor('Philosophy') },

  // V
  { id: 'v1', title: 'Vaisheshika Sutra', author: 'Kanada', category: 'Philosophy', description: 'Atomism and Physics.', color: getCategoryColor('Philosophy') },
  { id: 'v2', title: 'Valmiki Ramayana', category: 'Primary Texts', subCategory: 'Epic', description: 'Itihasa.', color: getCategoryColor('Primary Texts') },
  { id: 'v3', title: 'Vastu Shastra Manuals', category: 'Science & Technology', subCategory: 'Architecture', description: 'Mayamata, Manasara.', color: getCategoryColor('Science & Technology') },
  { id: 'v4', title: 'Vedas', category: 'Primary Texts', description: 'Rig, Sama, Yajur, Atharva.', color: getCategoryColor('Primary Texts') },
  { id: 'v5', title: 'Vedanga Texts', category: 'Grammar & Linguistics', description: 'Shiksha, Chandas, Vyakarana, Nirukta, Jyotisha, Kalpa.', color: getCategoryColor('Grammar & Linguistics') },
  { id: 'v6', title: 'Vijnanabhairava Tantra', category: 'Philosophy', subCategory: 'Tantra', description: 'Consciousness Studies.', color: getCategoryColor('Philosophy') },
  { id: 'v7', title: 'Vinaya Pitaka', category: 'Primary Texts', subCategory: 'Buddhist', description: 'Monastic Regulations.', color: getCategoryColor('Primary Texts') },
  { id: 'v8', title: 'Vishnu Purana', category: 'Primary Texts', subCategory: 'Puranic', description: 'Vaishnava traditions.', color: getCategoryColor('Primary Texts') },
  { id: 'v9', title: 'Vivekananda Complete Works', category: 'Modern Indian Thinkers', description: 'Modern Vedanta.', color: getCategoryColor('Modern Indian Thinkers') },
  { id: 'v10', title: 'Vakyapadiya', author: 'Bhartrihari', category: 'Grammar & Linguistics', description: 'Philosophy of language (Sphota theory).', color: getCategoryColor('Grammar & Linguistics') },
  { id: 'v11', title: 'Vikramorvasiyam', author: 'Kalidasa', category: 'Arts', subCategory: 'Drama', description: 'Play regarding Pururavas and Urvashi.', color: getCategoryColor('Arts') },
  { id: 'v12', title: 'Vivekachudamani', author: 'Adi Shankara', category: 'Philosophy', subCategory: 'Advaita', description: 'Crest-Jewel of Discrimination.', color: getCategoryColor('Philosophy') },

  // Y
  { id: 'y1', title: 'Yajurveda', category: 'Primary Texts', subCategory: 'Vedic', description: 'The Veda of rituals (Shukla & Krishna).', color: getCategoryColor('Primary Texts') },
  { id: 'y2', title: 'Yogavasistha', category: 'Philosophy', subCategory: 'Advaita', description: 'Laghu & Brihat versions.', color: getCategoryColor('Philosophy') },
  { id: 'y3', title: 'Yuktikalpataru', category: 'Science & Technology', description: 'Engineering & mechanics.', color: getCategoryColor('Science & Technology') },
  { id: 'y4', title: 'Yogini Hridaya', category: 'Philosophy', subCategory: 'Tantra', description: 'Key text of Sri Vidya Tantra.', color: getCategoryColor('Philosophy') },

  // Z
  { id: 'z1', title: 'Zafar-nama', category: 'Primary Texts', subCategory: 'Persian', description: 'Indo-Persian records.', color: getCategoryColor('Primary Texts') },
  { id: 'z2', title: 'Tuhfat al-Mujahidin', author: 'Zayn al-Din', category: 'Primary Texts', subCategory: 'History', description: 'Kerala Indo-Arabic history.', color: getCategoryColor('Primary Texts') },
];
