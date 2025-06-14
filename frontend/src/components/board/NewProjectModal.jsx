import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { createProject } from '../../api';
import Modal from '../common/Modal';

const StepCounter = ({ current, total }) => (
  <div className="flex justify-center items-center gap-2 mb-4">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < current ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
    ))}
  </div>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IgnitionSequenceModal = () => {
  const { isModalOpen, modalType, closeModal } = useUiStore();
  const [step, setStep] = useState(1);
  
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [emotionalTag, setEmotionalTag] = useState('🤔 Curious');
  const [roughIdeas, setRoughIdeas] = useState('');
  const [experiments, setExperiments] = useState([]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (projectData) => createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeModal();
      setTimeout(() => {
        setStep(1);
        setTitle('');
        setGoal('');
        setEmotionalTag('🤔 Curious');
        setRoughIdeas('');
        setExperiments([]);
      }, 300);
    },
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handleGeneratePlan = () => {
    const generatedExperiments = [
      { id: 1, hypothesis: 'A baseline Logistic Regression model can achieve >75% accuracy.', risk: 'Low' },
      { id: 2, hypothesis: 'Feature engineering on time-series data will improve performance.', risk: 'Medium' },
      { id: 3, hypothesis: 'An LSTM model will outperform the baseline by at least 10%.', risk: 'High' },
    ];
    setExperiments(generatedExperiments);
    handleNext();
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = { title, goal, emotional_tag: emotionalTag, rough_ideas_dump: roughIdeas, experiments };
    mutation.mutate(projectData);
  };

  if (modalType !== 'IGNITION_SEQUENCE') return null;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="p-8 bg-gray-50 rounded-lg max-w-2xl w-full">
        <StepCounter current={step} total={4} />
        {step === 1 && (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Let's start with the "Why".</h2>
                <div className="space-y-5 mt-6">
                     <div>
                        <label className="font-semibold text-gray-700">Project Title</label>
                        <input type="text" placeholder="e.g., Predict patient sepsis risk..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 mt-1 border rounded-md" required />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Primary Goal</label>
                        <textarea placeholder="e.g., This will help ICU doctors by providing an early warning..." value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full p-3 mt-1 border rounded-md" rows="3" required />
                    </div>
                     <div>
                        <label className="font-semibold text-gray-700">Right now, this project feels...</label>
                        <select value={emotionalTag} onChange={(e) => setEmotionalTag(e.target.value)} className="w-full p-3 mt-1 border rounded-md bg-white">
                            <option>🚀 Exciting</option>
                            <option>🌪️ Overwhelming</option>
                            <option>🤔 Curious</option>
                            <option>🧠 Challenging</option>
                        </select>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button onClick={handleNext} disabled={!title || !goal} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md disabled:bg-gray-300">Continue</button>
                </div>
            </div>
        )}
        {step === 2 && (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Rough Ideas Dump</h2>
                <p className="text-gray-500 mb-6 text-center">Capture every raw idea. No judgment.</p>
                <textarea 
                    placeholder={`# Possible Approaches...`}
                    value={roughIdeas} 
                    onChange={(e) => setRoughIdeas(e.target.value)} 
                    className="w-full p-4 border rounded-md font-mono text-sm" 
                    rows="10" 
                />
                 <div className="mt-8 flex justify-between">
                    <button onClick={handleBack} className="px-6 py-3 text-gray-700">Back</button>
                    <button onClick={handleGeneratePlan} disabled={!roughIdeas} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md disabled:bg-gray-300">Generate Plan</button>
                </div>
            </div>
        )}
        {step === 3 && (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Initial Plan</h2>
                <p className="text-gray-500 mb-6 text-center">AI-suggested experiments based on your ideas. You can edit these later.</p>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 bg-white p-4 rounded-md border">
                  {experiments.map(exp => (
                    <div key={exp.id} className="flex items-center p-3 bg-gray-50 border rounded-md">
                      <CheckIcon />
                      <div>
                          <p className="font-semibold text-gray-800">{exp.hypothesis}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${exp.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{exp.risk} Risk</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                    <button onClick={handleBack} className="px-6 py-3 text-gray-700">Back</button>
                    <button onClick={handleNext} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md">Looks Good</button>
                </div>
            </div>
        )}
        {step === 4 && (
             <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Launch Plan</h2>
                <p className="text-gray-500 mb-6 text-center">You've defined the purpose and designed the experiments. Ready to launch?</p>
                 <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{goal}</p>
                    <div className="mt-3 text-sm font-semibold">{emotionalTag}</div>
                 </div>
                <div className="mt-8 flex justify-between">
                    <button onClick={handleBack} className="px-6 py-3 text-gray-700">Back</button>
                    <button onClick={handleSubmit} className="px-6 py-3 bg-green-600 text-white font-bold rounded-md" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Create Project'}
                    </button>
                </div>
            </div>
        )}
      </div>
    </Modal>
  );
};

export default IgnitionSequenceModal;
