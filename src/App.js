import { useState } from 'react';
import './App.css';
import PersonaSelection from './components/PersonaSelection';
import PersonaDetail from './components/PersonaDetail';
import ChatWindow from './components/ChatWindow';

function App() {
  const [currentView, setCurrentView] = useState('selection'); // 'selection', 'detail', 'chat'
  const [selectedPersona, setSelectedPersona] = useState(null);

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setCurrentView('detail');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedPersona(null);
  };

  const handleStartChat = (persona) => {
    setSelectedPersona(persona);
    setCurrentView('chat');
  };

  const handleBackToDetail = () => {
    setCurrentView('detail');
  };

  return (
    <div className="App">
      {currentView === 'selection' && (
        <PersonaSelection onPersonaSelect={handlePersonaSelect} />
      )}
      
      {currentView === 'detail' && selectedPersona && (
        <PersonaDetail 
          persona={selectedPersona}
          onBack={handleBackToSelection}
          onStartChat={handleStartChat}
        />
      )}
      
      {currentView === 'chat' && selectedPersona && (
        <ChatWindow 
          persona={selectedPersona}
          onBack={handleBackToDetail}
        />
      )}
    </div>
  );
}

export default App;
