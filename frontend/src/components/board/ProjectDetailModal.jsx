import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { 
    fetchTasksForProject, createTask, updateTask, deleteTask, 
    fetchAllUsers, addMemberToProject, removeMemberFromProject, fetchActivitiesForProject
} from '../../api';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';

// Helper function to format timestamps into a user-friendly string
const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now - past) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
};

const ProjectDetailModal = () => {
  const { isProjectDetailModalOpen, closeProjectDetailModal, selectedProject } = useUiStore();
  const currentUser = useAuthStore((state) => state.user);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [userToAdd, setUserToAdd] = useState('');

  const queryClient = useQueryClient();
  const isProjectLead = currentUser?.id === selectedProject?.lead?.id;
  const isMember = selectedProject?.members.some(m => m.id === currentUser?.id);

  // --- DATA FETCHING ---
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', selectedProject?.id],
    queryFn: () => fetchTasksForProject(selectedProject.id),
    enabled: !!selectedProject && isProjectDetailModalOpen, 
  });

  const { data: allUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    enabled: isProjectLead && isProjectDetailModalOpen,
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
      queryKey: ['activities', selectedProject?.id],
      queryFn: () => fetchActivitiesForProject(selectedProject.id),
      enabled: !!selectedProject && isProjectDetailModalOpen
  });

  // --- MUTATIONS ---
  const genericOnSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', selectedProject?.id] });
      queryClient.invalidateQueries({ queryKey: ['activities', selectedProject?.id] });
  };

  const createTaskMutation = useMutation({ mutationFn: (taskData) => createTask(selectedProject.id, taskData), onSuccess: () => { genericOnSuccess(); setNewTaskTitle(''); } });
  const updateTaskMutation = useMutation({ mutationFn: ({ taskId, data }) => updateTask(taskId, data), onSuccess: genericOnSuccess });
  const deleteTaskMutation = useMutation({ mutationFn: (taskId) => deleteTask(taskId), onSuccess: genericOnSuccess });
  const addMemberMutation = useMutation({ mutationFn: (userId) => addMemberToProject(selectedProject.id, userId), onSuccess: () => { genericOnSuccess(); setUserToAdd(''); } });
  const removeMemberMutation = useMutation({ mutationFn: (userId) => removeMemberFromProject(selectedProject.id, userId), onSuccess: genericOnSuccess });

  // --- HANDLERS ---
  const handleCreateTask = (e) => { e.preventDefault(); if (newTaskTitle.trim()) createTaskMutation.mutate({ title: newTaskTitle }); };
  const handleToggleTask = (task) => updateTaskMutation.mutate({ taskId: task.id, data: { completed: !task.completed } });
  const handleAddMember = (e) => { e.preventDefault(); if(userToAdd) addMemberMutation.mutate(userToAdd); };
  const handleAssignTask = (taskId, newAssigneeId) => {
    updateTaskMutation.mutate({ taskId, data: { assignee_id: newAssigneeId ? parseInt(newAssigneeId) : null } });
  };

  if (!selectedProject) return null;
  const availableUsersToAdd = allUsers?.filter(user => !selectedProject.members.some(member => member.id === user.id));

  return (
    <Modal isOpen={isProjectDetailModalOpen} onClose={closeProjectDetailModal}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
        <p className="text-gray-600 mb-4">{selectedProject.description}</p>
        
        {/* --- MEMBERS SECTION --- */}
        <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Members</h3>
            <div className="flex flex-wrap items-center gap-4">
                {selectedProject.members.map(member => (
                    <div key={member.id} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                        <Avatar userId={member.id} />
                        <span>{member.username}</span>
                        {isProjectLead && member.id !== selectedProject.lead.id && (
                            <button onClick={() => removeMemberMutation.mutate(member.id)} className="text-red-500 font-bold ml-2">X</button>
                        )}
                    </div>
                ))}
            </div>
            {isProjectLead && (
                <form onSubmit={handleAddMember} className="mt-4 flex gap-2">
                    <select value={userToAdd} onChange={e => setUserToAdd(e.target.value)} className="flex-grow p-2 border rounded">
                        <option value="">{isLoadingUsers ? 'Loading...' : 'Select user to add'}</option>
                        {availableUsersToAdd?.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={!userToAdd || addMemberMutation.isPending}>Add</button>
                </form>
            )}
        </div>
        
        {/* --- TASKS SECTION --- */}
        <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Tasks</h3>
            <div className="space-y-3 mb-6">
              {isLoadingTasks ? <p>Loading tasks...</p> : tasks?.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center flex-grow">
                    <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task)} className="h-5 w-5 rounded" />
                    <span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {task.assignee ? <Avatar userId={task.assignee.id} /> : <div className="w-8 h-8 rounded-full bg-gray-300" title="Unassigned"></div>}
                    {isMember && (
                      <select
                        value={task.assignee?.id || ''}
                        onChange={(e) => handleAssignTask(task.id, e.target.value)}
                        className="p-1 border rounded text-sm"
                      >
                        <option value="">Unassigned</option>
                        {selectedProject.members.map(member => (
                          <option key={member.id} value={member.id}>{member.username}</option>
                        ))}
                      </select>
                    )}
                    <button onClick={() => deleteTaskMutation.mutate(task.id)} className="text-red-500 font-semibold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {isMember && (
              <form onSubmit={handleCreateTask}>
                <div className="flex gap-2">
                  <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Add a new task..." className="flex-grow p-2 border rounded" />
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add Task</button>
                </div>
              </form>
            )}
        </div>
        
        {/* --- ACTIVITY FEED SECTION --- */}
        <div className="mt-8 border-t pt-6">
            <h3 className="font-bold text-lg mb-4">Project Activity</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
                {isLoadingActivities && <p>Loading activity...</p>}
                {activities?.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3">
                        <Avatar userId={activity.user?.id} />
                        <div>
                            <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: activity.text.replace(activity.user?.username, `<strong>${activity.user?.username}</strong>`) }} />
                            <p className="text-xs text-gray-500 mt-0.5">
                                {formatTimeAgo(activity.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}
                {!isLoadingActivities && activities?.length === 0 && (
                    <p className="text-gray-500">No activity has been recorded for this project yet.</p>
                )}
            </div>
        </div>

      </div>
    </Modal>
  );
};

export default ProjectDetailModal;
