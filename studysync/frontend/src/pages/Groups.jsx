import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineUsers,
  HiOutlineBolt,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXMark,
  HiOutlinePencilSquare,
  HiOutlineArrowRightOnRectangle,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor } from '../constants';

import './Groups.css';

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupTasks, setGroupTasks] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', emails: '' });
  const [taskFormData, setTaskFormData] = useState({
    title: '', description: '', priority: 'medium', deadline: '', assigneeId: ''
  });

  const statusIcon = {
    done: <HiOutlineCheckCircle style={{ color: 'var(--color-success)' }} />,
    'in-progress': <HiOutlineClock style={{ color: 'var(--color-warning)' }} />,
    todo: <HiOutlineClock style={{ color: 'var(--text-muted)' }} />,
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch (error) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/groups', formData);
      setGroups(prev => [...prev, data]);
      toast.success('Group created successfully!');
      setShowCreate(false);
      setFormData({ name: '', description: '', emails: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
    }
  };

  const loadGroupTasks = async (group) => {
    if (selectedGroup?._id === group._id) {
      setSelectedGroup(null);
      return;
    }
    
    setSelectedGroup(group);
    setGroupTasks([]);
    try {
      const { data } = await api.get(`/groups/${group._id}/tasks`);
      setGroupTasks(data);
    } catch (error) {
      toast.error('Failed to load group tasks');
    }
  };

  const handleQuitGroup = async () => {
    if (window.confirm('Are you sure you want to quit this group?')) {
      try {
        await api.post(`/groups/${selectedGroup._id}/quit`);
        setGroups(prev => prev.filter(g => g._id !== selectedGroup._id));
        setSelectedGroup(null);
        toast.success('Successfully left the group');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to quit group');
      }
    }
  };

  const deleteGroupTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this group task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setGroupTasks(prev => prev.filter(t => t._id !== taskId));
        toast.success('Group task deleted');
      } catch (error) {
        toast.error('Failed to delete group task');
      }
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskFormData.assigneeId) {
      toast.error('Please assign the task to someone');
      return;
    }
    
    try {
      const payload = {
        ...taskFormData,
        groupId: selectedGroup._id,
        assignee: taskFormData.assigneeId
      };
      
      const { data } = await api.post('/tasks', payload);
      setGroupTasks(prev => [...prev, data]);
      toast.success('Group task added!');
      setShowAddTask(false);
      setTaskFormData({ title: '', description: '', priority: 'medium', deadline: '', assigneeId: '' });
    } catch (error) {
      toast.error('Failed to add group task: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 8 }}>
        <div>
          <h1 className="page-title">
            <HiOutlineUserGroup style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Group Tasks
          </h1>
          <p className="page-subtitle">Collaborate with friends and study together</p>
        </div>
        <motion.button
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
        >
          <HiOutlinePlus /> Create Group
        </motion.button>
      </div>

      {/* Group Cards */}
      <div className="grid-3">
        {loading && <p>Loading groups...</p>}
        {!loading && groups.length === 0 && (
          <p className="text-muted col-span-3">You aren't in any groups yet. Create one!</p>
        )}
        {groups.map((group, i) => (
          <motion.div
            key={group._id}
            className="card group-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => loadGroupTasks(group)}
            style={{ cursor: 'pointer' }}
          >
            <div className="group-card-header">
              <div className="group-icon" style={{ background: getAvatarColor(i) }}>
                {group.name.charAt(0)}
              </div>
              <div className="group-meta">
                <h3 className="group-name">{group.name}</h3>
                <p className="group-desc">{group.description}</p>
              </div>
            </div>

            <div className="group-stats-row">
              <div className="group-stat">
                <HiOutlineUsers />
                <span>{group.members.length} members</span>
              </div>
              <div className="group-stat">
                <HiOutlineBolt style={{ color: 'var(--text-accent)' }} />
                <span>{group.xp} XP</span>
              </div>
            </div>

            <div className="group-members-avatars">
              {group.members.slice(0, 4).map((member, j) => {
                return (
                  <div
                    key={member._id}
                    className="avatar avatar-sm group-member-avatar"
                    style={{ background: getAvatarColor(j), zIndex: 4 - j }}
                    title={member.name}
                  >
                    {member.initials}
                  </div>
                );
              })}
              {group.members.length > 4 && (
                <span className="more-members">+{group.members.length - 4}</span>
              )}
            </div>

          </motion.div>
        ))}
      </div>

      {/* Expanded Group Detail */}
      {selectedGroup && (
        <motion.div
          className="card group-detail"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              {selectedGroup.name} - Tasks 
              {selectedGroup.leaderId?._id === user?.id && <span className="badge badge-warning" style={{ marginLeft: 8 }}>Leader</span>}
            </h2>
            <div className="flex gap-sm">
              {selectedGroup.leaderId?._id === user?.id && (
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  setTaskFormData({ ...taskFormData, assigneeId: user.id }); // Default to self
                  setShowAddTask(true);
                }}>
                  <HiOutlinePlus /> Add Task
                </button>
              )}
                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--color-danger)' }} onClick={handleQuitGroup}>
                  <HiOutlineArrowRightOnRectangle /> Quit Group
                </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedGroup(null)}>
                <HiOutlineXMark />
              </button>
            </div>
          </div>

          <div className="group-tasks-grid">
            {groupTasks.length === 0 && <p className="text-muted">No tasks in this group yet.</p>}
            {groupTasks.map((task, i) => {
              const assignee = task.assignee;
              return (
                <motion.div
                  key={task._id}
                  className="group-task-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="group-task-status">{statusIcon[task.status]}</div>
                  <div className="group-task-info">
                    <span className="group-task-title">{task.title}</span>
                    <span className="group-task-assignee">
                      Assigned to: {assignee?._id === user?.id ? 'You' : assignee?.name}
                    </span>
                    <span className="group-task-deadline">
                      Due: {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline'}
                    </span>
                  </div>
                  <span className={`badge badge-${task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : 'primary'}`}>
                    {task.status === 'done' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'To Do'}
                  </span>
                  {(selectedGroup.leaderId?._id === user?.id || task.assignee?._id === user?.id) && (
                    <button 
                      className="btn btn-ghost btn-sm" 
                      onClick={(e) => { e.stopPropagation(); deleteGroupTask(task._id); }}
                      style={{ color: 'var(--color-danger)', marginLeft: 8 }}
                      title="Delete Task"
                    >
                      <HiOutlineTrash />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Group Mini Leaderboard */}
          <div className="group-leaderboard">
            <h3 className="section-title" style={{ marginTop: 20 }}>Group Leaderboard</h3>
            <div className="group-leader-list">
              {selectedGroup.members.map((member, i) => {
                return (
                  <div key={member._id} className={`group-leader-row ${member._id === user?.id ? 'is-you' : ''}`}>
                    <span className="leader-pos">#{i + 1}</span>
                    <div className="avatar avatar-sm" style={{ background: getAvatarColor(i) }}>
                      {member.initials}
                    </div>
                    <span className="leader-name">{member._id === user?.id ? 'You' : member.name}</span>
                    <span className="leader-xp">{member.score.toLocaleString()} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Group Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Create New Group</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreate(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleCreate} className="task-form">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  className="input"
                  placeholder="e.g., Code Warriors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="input textarea"
                  placeholder="What is this group about?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Invite Participants (Emails)</label>
                <input
                  className="input"
                  placeholder="friend@example.com, study@user.com"
                  value={formData.emails}
                  onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  Registered users with these emails will be added immediately.
                </small>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Group</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Group Task Modal */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add Task to {selectedGroup.name}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddTask(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="task-form">
              <div className="form-group">
                <label>Task Title</label>
                <input
                  className="input"
                  placeholder="e.g., Complete Project Documentation"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="input textarea"
                  placeholder="Task details..."
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    className="input select"
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                  >
                    <option value="critical">🔴 Critical</option>
                    <option value="high">🟡 High</option>
                    <option value="medium">🔵 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    className="input"
                    value={taskFormData.deadline}
                    onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  className="input select"
                  value={taskFormData.assigneeId}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assigneeId: e.target.value })}
                  required
                >
                  <option value="">Select a member</option>
                  {selectedGroup.members.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} {member._id === user.id ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddTask(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
