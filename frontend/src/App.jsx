import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Button } from './components/common/Button';
import { DailyGoals } from './components/DailyGoals';
import { ProjectMarathon } from './components/ProjectMarathon';
import { TeamOverview } from './components/TeamOverview';
import { MeetingNotes } from './components/MeetingNotes';
import { NewProjectModal } from './components/board/NewProjectModal';
import { ProjectDetailModal } from './components/board/ProjectDetailModal';

function App() {
  const [activeTab, setActiveTab] = useState('projectMarathon');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dailyGoals': return <DailyGoals />;
      case 'projectMarathon': return <ProjectMarathon />;
      case 'teamOverview': return <TeamOverview />;
      case 'meetingNotes': return <MeetingNotes />;
      default: return <ProjectMarathon />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <nav className="px-8 border-b border-gray-200">
        <div className="flex space-x-2">
          <Button onClick={() => setActiveTab('dailyGoals')} variant="none" className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'dailyGoals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Daily Goals 🎯</Button>
          <Button onClick={() => setActiveTab('projectMarathon')} variant="none" className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'projectMarathon' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Project Marathon 🏃</Button>
          <Button onClick={() => setActiveTab('teamOverview')} variant="none" className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'teamOverview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Team Overview 🧑‍🤝‍🧑</Button>
          <Button onClick={() => setActiveTab('meetingNotes')} variant="none" className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'meetingNotes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Meeting Notes 📝</Button>
        </div>
      </nav>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {renderActiveTab()}
      </main>

      <NewProjectModal />
      <ProjectDetailModal />
    </div>
  );
}

export default App;
