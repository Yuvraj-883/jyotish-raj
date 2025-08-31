import { Star, Users, Award, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function PersonaDetail({ persona, onBack, onStartChat }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "text-yellow-400 fill-current" : "text-gray-400"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shadow-lg border-b border-slate-700">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            {persona.image ? (
              <img 
                src={persona.image} 
                alt={persona.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full persona-placeholder flex items-center justify-center text-xl">
                {persona.avatar}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{persona.name}</h1>
              <p className="text-indigo-300">{persona.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Persona Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-white">About {persona.name}</h2>
              <p className="text-gray-300 mb-4">{persona.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                    <Star size={20} fill="currentColor" />
                    <span className="font-bold text-lg">{persona.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-400">Rating</p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <Users size={20} />
                    <span className="font-bold text-lg">{persona.consultations.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-400">Consultations</p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                    <Award size={20} />
                    <span className="font-bold text-lg">{persona.experience}</span>
                  </div>
                  <p className="text-sm text-gray-400">Experience</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white mb-3">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {persona.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-600 bg-opacity-30 text-indigo-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-white">Client Reviews</h2>
              <div className="space-y-4">
                {persona.reviews.map((review, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <span className="font-medium text-white">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Action Panel */}
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-6">
              <div className="text-center mb-6">
                {persona.image ? (
                  <img 
                    src={persona.image} 
                    alt={persona.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 mx-auto mb-3"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full persona-placeholder flex items-center justify-center text-4xl mx-auto mb-3">
                    {persona.avatar}
                  </div>
                )}
                <h3 className="text-lg font-bold text-white">{persona.name}</h3>
                <p className="text-indigo-300 text-sm">{persona.specialty}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(Math.floor(persona.rating))}
                  <span className="ml-2 text-yellow-400 font-bold">{persona.rating.toFixed(1)}</span>
                </div>
                <p className="text-center text-gray-400 text-sm">
                  Based on {persona.consultations.toLocaleString()} consultations
                </p>
              </div>

              <Button
                onClick={() => onStartChat(persona)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 text-lg transition-all duration-300 shadow-lg"
              >
                <MessageCircle size={20} className="mr-2" />
                Start Consultation
              </Button>

              <div className="mt-4 text-center">
                <p className="text-gray-400 text-xs">
                  ✨ Free to start • Personalized readings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
