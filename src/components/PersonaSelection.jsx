import { Star, Users, Award } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { fetchPersonas } from "../services/astrologyPersonas";
import { astrologyPersonas } from "../services/astrologyPersonas"; // Fallback data

export default function PersonaSelection({ onPersonaSelect }) {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPersonas = async () => {
      try {
        setLoading(true);
        const fetchedPersonas = await fetchPersonas();
        setPersonas(fetchedPersonas);
      } catch (error) {
        console.error("Failed to fetch personas from API, using fallback data:", error);
        setError("Failed to load personas from server. Using cached data.");
        setPersonas(astrologyPersonas); // Use fallback data
      } finally {
        setLoading(false);
      }
    };

    loadPersonas();
  }, []);

  const handlePersonaClick = (persona) => {
    onPersonaSelect(persona);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold mb-2">Loading Cosmic Guides...</h2>
          <p className="text-gray-400">Connecting to the astral realm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      {/* Header */}
      <div className="bg-gray-800 text-white p-6 text-center shadow-lg border-b border-slate-700">
        <h1 className="text-3xl font-bold mb-2">🔮 Divine Astrology</h1>
        <p className="text-gray-300">Choose your cosmic guide for personalized astrological insights</p>
        {error && (
          <div className="mt-3 p-2 bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded text-yellow-300 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Persona Grid */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl"
            >
              {/* Persona Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  {persona.image ? (
                    <img 
                      src={persona.image} 
                      alt={persona.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full persona-placeholder flex items-center justify-center text-2xl">
                      {persona.avatar}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{persona.name}</h3>
                  <p className="text-indigo-300 text-sm">{persona.role}</p>
                  <p className="text-gray-400 text-sm mt-1">{persona.specialty}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold">{persona.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <Users size={16} />
                    <span className="font-bold">{persona.consultations.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400">Consultations</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                    <Award size={16} />
                    <span className="font-bold">{persona.experience}</span>
                  </div>
                  <p className="text-xs text-gray-400">Experience</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {persona.description}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {persona.expertise.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-indigo-600 bg-opacity-30 text-indigo-300 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {persona.expertise.length > 3 && (
                  <span className="px-2 py-1 bg-gray-600 bg-opacity-30 text-gray-400 text-xs rounded-full">
                    +{persona.expertise.length - 3} more
                  </span>
                )}
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handlePersonaClick(persona)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 transition-colors"
              >
                View Profile & Reviews
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">🌟 All our astrologers are verified and experienced 🌟</p>
      </div>
    </div>
  );
}
