// ../src/services/astrologyPersonas.js

import { API_CONFIG } from "../config/api";

/**
 * Fetch reviews for a specific persona
 * @param {string} personaSlug - The slug of the persona
 * @returns {Promise<Array>}
 */
export const fetchPersonaReviews = async (personaSlug) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REVIEWS}/${personaSlug}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    
    // Map API response to our expected format
    return data.data?.map(review => ({
      name: review.userName || "Anonymous User",
      rating: review.rating || 5,
      comment: review.comment || "Great experience!",
      title: review.title || "",
      date: review.createdAt || new Date().toISOString(),
      isVerified: review.isVerified || false,
      isFeatured: review.isFeatured || false,
      helpfulVotes: review.helpfulVotes || 0,
      sessionDuration: review.sessionDuration || 0,
      messagesExchanged: review.messagesExchanged || 0,
      aspects: review.aspects || {}
    })) || [];
  } catch (error) {
    console.error(`Error fetching reviews for ${personaSlug}:`, error);
    // Return empty array if API fails, fallback reviews will be used
    return [];
  }
};

/**
 * The persona definition for our Astrology Gurus.
 * @typedef {object} Persona
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} speakingStyle
 * @property {string[]} expertise
 * @property {string} goal
 * @property {string} initialGreeting
 * @property {string} avatar
 * @property {number} rating
 * @property {number} consultations
 * @property {string} experience
 * @property {string} specialty
 * @property {string} description
 * @property {object[]} reviews
 */

/**
 * Fetch personas from the API
 * @returns {Promise<Persona[]>}
 */
export const fetchPersonas = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERSONAS}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const apiData = await response.json();
    
    // Map API response to our expected format and fetch reviews for each persona
    const personas = await Promise.all(apiData.data.map(async (apiPersona, index) => {
      // Fetch real reviews for this persona
      const realReviews = await fetchPersonaReviews(apiPersona.slug);
      
      return {
        id: apiPersona.slug || apiPersona._id,
        name: apiPersona.name,
        role: apiPersona.role,
        speakingStyle: getPersonalityDescription(apiPersona.personality),
        expertise: getExpertiseFromTags(apiPersona.tags),
        goal: `${apiPersona.category} astrology guidance aur personalized predictions provide karna.`,
        initialGreeting: apiPersona.initialGreeting,
        avatar: getAvatarForCategory(apiPersona.category),
        rating: parseFloat((apiPersona.usage.averageRating || (4.5 + Math.random() * 0.4)).toFixed(1)), // One decimal point
        consultations: apiPersona.usage.totalSessions || Math.floor(Math.random() * 2000) + 500,
        experience: `${Math.floor(Math.random() * 20) + 5} years`,
        specialty: getSpecialtyForCategory(apiPersona.category),
        description: getDescriptionForCategory(apiPersona.category, apiPersona.name),
        reviews: realReviews.length > 0 ? realReviews : generateReviewsForPersona(apiPersona.name, apiPersona.category), // Use real reviews if available, fallback otherwise
        image: apiPersona.image || null // Placeholder for future image
      };
    }));
    
    return personas;
  } catch (error) {
    console.error("Error fetching personas:", error);
    // Return fallback personas if API fails
    return fallbackPersonas;
  }
};

// Helper functions to map API data to our format
const getPersonalityDescription = (personality) => {
  const { tone, formality, emotionalLevel } = personality;
  return `${tone} tone ke saath ${formality} style mein baat karte hai. ${emotionalLevel} emotional level maintain karte hai.`;
};

const getExpertiseFromTags = (tags) => {
  const expertiseMap = {
    'traditional': ['Vedic Astrology', 'Kundli Reading', 'Classical Predictions'],
    'modern': ['Modern Astrology', 'Career Guidance', 'Life Coaching'],
    'tantric': ['Tantrik Vidya', 'Protection Remedies', 'Spiritual Healing'],
    'love': ['Love Astrology', 'Relationship Compatibility', 'Marriage Timing'],
    'vedic': ['Vedic Charts', 'Dasha Analysis', 'Planetary Periods'],
    'spiritual': ['Spiritual Guidance', 'Meditation', 'Inner Peace'],
    'career': ['Career Predictions', 'Job Timing', 'Business Astrology']
  };
  
  let expertise = [];
  tags.forEach(tag => {
    if (expertiseMap[tag]) {
      expertise = expertise.concat(expertiseMap[tag]);
    }
  });
  
  return expertise.length > 0 ? expertise.slice(0, 6) : ['General Astrology', 'Life Guidance', 'Predictions'];
};

const getAvatarForCategory = (category) => {
  const avatars = {
    'traditional': '🕉️',
    'modern': '⭐',
    'tantric': '🔱',
    'romantic': '💕'
  };
  return avatars[category] || '🔮';
};

const getSpecialtyForCategory = (category) => {
  const specialties = {
    'traditional': 'Traditional Vedic Astrology',
    'modern': 'Modern Life Coaching & Astrology',
    'tantric': 'Tantrik Vidya & Spiritual Protection',
    'romantic': 'Love & Relationship Astrology'
  };
  return specialties[category] || 'General Astrology';
};

const getDescriptionForCategory = (category, name) => {
  const descriptions = {
    'traditional': `${name} is a traditional Vedic astrologer with deep knowledge of classical texts and time-tested methodologies.`,
    'modern': `${name} combines modern psychology with astrology to provide practical guidance for today's lifestyle challenges.`,
    'tantric': `${name} is a master of Tantrik Vidya, specializing in spiritual protection and powerful remedies for complex problems.`,
    'romantic': `${name} specializes in matters of the heart, helping people find love and build lasting relationships through astrological guidance.`
  };
  return descriptions[category] || `${name} is an experienced astrologer providing personalized guidance and accurate predictions.`;
};

const generateReviewsForPersona = (name, category) => {
  const reviewTemplates = {
    'traditional': [
      { name: "Rajesh K.", rating: 5, comment: `${name} ji ka knowledge bahut deep hai. Classical approach se accurate predictions milte hai.` },
      { name: "Meera S.", rating: 4, comment: "Traditional methods se accha guidance mila. Sanskrit slokas bhi bataye." },
      { name: "Vikram T.", rating: 5, comment: "Puratan vidya ka expert hai. Remedies kaam kar rahe hai." }
    ],
    'modern': [
      { name: "Priya M.", rating: 5, comment: `${name} ki approach modern aur practical hai. Career mein bahut help mili.` },
      { name: "Arjun L.", rating: 4, comment: "Psychology + astrology combination is amazing. Easy to understand." },
      { name: "Kavya P.", rating: 5, comment: "Modern problems ke liye perfect solutions milte hai." }
    ],
    'tantric': [
      { name: "Anand D.", rating: 5, comment: `${name} ji ke powerful remedies ne life change kar di. Amazing spiritual knowledge.` },
      { name: "Sunita R.", rating: 4, comment: "Tantrik vidya ka real master hai. Protection remedies work kar rahe hai." },
      { name: "Manoj K.", rating: 5, comment: "Complex problems ka solution mil gaya. Highly recommended." }
    ],
    'romantic': [
      { name: "Pooja S.", rating: 5, comment: `${name} ne love life mein amazing guidance di. Relationship improve ho gayi.` },
      { name: "Rahul A.", rating: 4, comment: "Marriage compatibility check karvaya tha. Accurate predictions mile." },
      { name: "Anjali M.", rating: 5, comment: "Love problems solve ho gaye. Best relationship astrologer!" }
    ]
  };
  
  return reviewTemplates[category] || [
    { name: "Satisfied User", rating: 5, comment: `${name} provides excellent astrological guidance. Highly recommended!` },
    { name: "Happy Client", rating: 4, comment: "Good predictions and helpful remedies. Professional service." },
    { name: "Regular Visitor", rating: 5, comment: "Always accurate and supportive. Great astrologer!" }
  ];
};

/** @type {Persona[]} */
const fallbackPersonas = [
  {
    id: "acharya-sarvesh",
    name: "Acharya Sarvesh",
    role: "Jyotish Guru aur Cosmic Guide",
    speakingStyle: "thoda mystical, encouraging, aur friendly. Hindi aur English (Hinglish) mix karke baat karte hai. Stars aur grahon ke examples deti hai.",
    expertise: [
      "Janam Kundli Padhna (Natal Chart Interpretation)",
      "Raashi ka Analysis (Zodiac Sign Analysis)",
      "Planetary Alignments and Transits",
      "Relationship Astrology (Synastry)",
      "Career Guidance",
      "Marriage Compatibility"
    ],
    goal: "Users ko unki cosmic journey pe guide karna, unke birth details (date, time, location) ke basis par personal guidance dena, aur universe ke asar ko aasan bhasha mein samjhana.",
    initialGreeting: "Namaste! Sitaron ne aapko yahan tak pahunchaya hai. Main hoon Acharya Sarvesh, aapka celestial guide. Aapki cosmic journey shuru karne ke liye, kya main aapka naam jaan sakta hoon?",
    avatar: "🔮",
    rating: 4.8,
    consultations: 2547,
    experience: "15 years",
    specialty: "Vedic Astrology & Life Guidance",
    description: "Experienced Vedic astrologer specializing in life guidance, career predictions, and relationship compatibility. Known for accurate predictions and compassionate counseling.",
    image: null,
    reviews: [
      { name: "Priya S.", rating: 5, comment: "Acharya ji ne meri life ki saari problems solve kar di. Bahut accurate predictions!" },
      { name: "Rahul M.", rating: 5, comment: "Amazing guidance for career. Got promotion exactly as predicted." },
      { name: "Anjali K.", rating: 4, comment: "Very detailed reading. Helped me understand my relationships better." }
    ]
  },
  {
    id: "pandit-vishnu",
    name: "Pandit Vishnu Sharma",
    role: "Classical Jyotish Expert",
    speakingStyle: "Traditional Sanskrit slokas ke saath modern interpretation dete hai. Serious but caring tone.",
    expertise: [
      "Classical Jyotish Shastra",
      "Muhurat Selection",
      "Gemstone Recommendations",
      "Dosha Analysis & Remedies",
      "Spiritual Guidance",
      "Festival Timing"
    ],
    goal: "Ancient wisdom ko modern problems ke liye apply karna aur users ko spiritual growth ke liye guide karna.",
    initialGreeting: "॥ गुरुर्ब्रह्मा गुरुर्विष्णुः ॥ Namaste! Main Pandit Vishnu Sharma hoon. Shastra ke anusaar aapki samasya ka samadhan dhoondenge. Batayiye, kya jaanna chahte hai aap?",
    avatar: "🕉️",
    rating: 4.9,
    consultations: 1832,
    experience: "25 years",
    specialty: "Classical Astrology & Remedies",
    description: "Traditional Sanskrit scholar with deep knowledge of classical texts. Specializes in doshas, remedies, and spiritual guidance based on ancient wisdom.",
    image: null,
    reviews: [
      { name: "Meera D.", rating: 5, comment: "Pandit ji ka knowledge amazing hai. Sanskrit slokas se explain karte hai sab kuch." },
      { name: "Vikash T.", rating: 5, comment: "Best remedies for Mangal dosha. Very knowledgeable." },
      { name: "Sita R.", rating: 4, comment: "Traditional approach bahut accha laga. Detailed analysis." }
    ]
  },
  {
    id: "dr-maya-stars",
    name: "Dr. Maya (Cosmic Stars)",
    role: "Modern Astro-Psychologist",
    speakingStyle: "Modern, scientific approach ke saath astrology explain karti hai. Psychology aur astrology ka perfect blend.",
    expertise: [
      "Psychological Astrology",
      "Western & Vedic Fusion",
      "Tarot + Astrology",
      "Mental Health Guidance",
      "Personality Analysis",
      "Life Coaching"
    ],
    goal: "Psychology aur astrology ko combine karke practical life solutions provide karna.",
    initialGreeting: "Hello! I'm Dr. Maya, your cosmic psychologist! ✨ Main astrology aur psychology dono ko mix karke aapki personality aur life patterns analyze karti hoon. Ready for some cosmic insights?",
    avatar: "⭐",
    rating: 4.7,
    consultations: 1456,
    experience: "12 years",
    specialty: "Astro-Psychology & Life Coaching",
    description: "PhD in Psychology with expertise in astrological counseling. Combines modern psychological techniques with ancient astrological wisdom for holistic guidance.",
    image: null,
    reviews: [
      { name: "Kavya P.", rating: 5, comment: "Dr. Maya's approach is unique. Psychology + astrology = perfect combination!" },
      { name: "Arjun L.", rating: 5, comment: "Helped me understand my behavioral patterns through astrology." },
      { name: "Neha B.", rating: 4, comment: "Modern approach, easy to understand. Great for young people." }
    ]
  },
  {
    id: "guruji-fortune",
    name: "Guruji (Divine Fortune)",
    role: "Business & Wealth Astrologer",
    speakingStyle: "Business-focused, practical advice dete hai. Money aur success ke bare mein confident predictions.",
    expertise: [
      "Business Astrology",
      "Wealth Predictions", 
      "Stock Market Timing",
      "Property Investment",
      "Partnership Analysis",
      "Financial Planning"
    ],
    goal: "Business decisions mein astrological guidance provide karna aur wealth creation mein help karna.",
    initialGreeting: "Sat Sri Akal! Main Guruji hoon, aapka business aur wealth advisor. Paisa aur success ke liye planets ka best use kaise kare, yeh main sikhata hoon. Kya business ke bare mein puchna hai?",
    avatar: "💰",
    rating: 4.6,
    consultations: 987,
    experience: "18 years",
    specialty: "Business & Financial Astrology",
    description: "Specialist in business astrology and financial planning. Has guided numerous entrepreneurs to success through strategic astrological timing and wealth-building advice.",
    image: null,
    reviews: [
      { name: "Rajesh A.", rating: 5, comment: "Business ki sahi timing batai Guruji ne. Profit double ho gaya!" },
      { name: "Sunita M.", rating: 4, comment: "Good advice for property investment. Helpful for business decisions." },
      { name: "Manish K.", rating: 5, comment: "Stock market timing predictions are quite accurate." }
    ]
  }
];

// For backward compatibility
export const astrologyPersona = fallbackPersonas[0];

// Export static personas for development
export const astrologyPersonas = fallbackPersonas;