import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlineFunnel,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineXMark,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineBolt,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import './Tasks.css';

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export default function Tasks() {
  const location = useLocation();
  const navigate = useNavigate();
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  const [calendarLinked, setCalendarLinked] = useState(false);

  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', deadline: '', category: 'study', tags: '', syncCalendar: false,
  });

  useEffect(() => {
    fetchTasks();
    checkCalendarStatus();
  }, []);

  const checkCalendarStatus = async () => {
    try {
      const { data } = await api.get('/calendar/status');
      setCalendarLinked(data.isLinked);
    } catch (error) {
      console.error('Failed to fetch calendar status:', error);
    }
  };

  useEffect(() => {
    if (location.state?.openModal) {
      setShowModal(true);
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks');
      setTaskList(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = taskList
    .filter((t) => filter === 'all' || t.status === filter)
    .sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      return 0;
    });

  const kanbanColumns = {
    todo: { title: 'To Do', color: '#6366f1', tasks: taskList.filter(t => t.status === 'todo') },
    'in-progress': { title: 'In Progress', color: '#f59e0b', tasks: taskList.filter(t => t.status === 'in-progress') },
    done: { title: 'Done', color: '#10b981', tasks: taskList.filter(t => t.status === 'done') },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(s => s.trim()).filter(Boolean);
      
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, { ...formData, tags: tagsArray });
        setTaskList(prev => prev.map(t => t._id === editingTask._id ? data : t));
        toast.success('Task updated');
      } else {
        const { data } = await api.post('/tasks', { ...formData, tags: tagsArray });
        setTaskList(prev => [...prev, data]);
        toast.success('Task created');
        
        // Sync to calendar if checked
        if (formData.syncCalendar && data._id) {
          try {
            toast.loading('Syncing to calendar...', { id: 'sync' });
            await api.post(`/calendar/sync/${data._id}`);
            toast.success('Synced to Google Calendar!', { id: 'sync' });
          } catch (syncError) {
            toast.error('Failed to sync. Please try again from the Calendar page.', { id: 'sync' });
          }
        }
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save task: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', priority: 'medium', deadline: '', category: 'study', tags: '', syncCalendar: false });
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title, description: task.description || '', priority: task.priority || 'medium',
      deadline: task.deadline ? task.deadline.split('T')[0] : '', category: task.category || 'study', tags: task.tags?.join(', ') || '',
      syncCalendar: false,
    });
    setShowModal(true);
  };

  const changeStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/tasks/${id}/status`, { status });
      setTaskList(prev => prev.map(t => t._id === id ? data : t));
      if (status === 'done') toast.success('Task completed! +5 Score');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const postponeTask = async (task) => {
    try {
      const newDate = new Date(task.deadline || new Date());
      newDate.setDate(newDate.getDate() + 2);
      const isoDate = newDate.toISOString().split('T')[0];
      
      const { data } = await api.put(`/tasks/${task._id}`, { deadline: isoDate });
      setTaskList(prev => prev.map(t => t._id === task._id ? data : t));
      toast.success('Task postponed by 2 days');
    } catch (error) {
      toast.error('Failed to postpone task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTaskList(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const priorityConfig = {
    critical: { label: 'Critical', class: 'priority-critical' },
    high: { label: 'High', class: 'priority-high' },
    medium: { label: 'Medium', class: 'priority-medium' },
    low: { label: 'Low', class: 'priority-low' },
  };

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: 8 }}>
        <div>
          <h1 className="page-title">Task Manager</h1>
          <p className="page-subtitle">Organize, prioritize, and conquer your tasks</p>
        </div>
        <motion.button
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
        >
          <HiOutlinePlus /> Add Task
        </motion.button>
      </div>

      {/* View Toggle & Filters */}
      <div className="task-controls">
        <div className="tabs">
          <button className={`tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
            List View
          </button>
          <button className={`tab ${activeTab === 'kanban' ? 'active' : ''}`} onClick={() => setActiveTab('kanban')}>
            Board View
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="task-filters">
            <div className="filter-group">
              <HiOutlineFunnel className="filter-icon" />
              {['all', 'todo', 'in-progress', 'done'].map((f) => (
                <button
                  key={f}
                  className={`filter-chip ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : 'Done'}
                </button>
              ))}
            </div>
            <select
              className="input sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="priority">Sort by Priority</option>
              <option value="deadline">Sort by Deadline</option>
            </select>
          </div>
        )}
      </div>

      {/* List View */}
      {activeTab === 'list' && (
        <motion.div className="task-list" layout>
          {loading && <p>Loading tasks...</p>}
          {!loading && taskList.length === 0 && <p className="text-muted text-center" style={{ padding: 40 }}>No tasks found. Create one!</p>}
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                className="task-card card"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="task-card-top">
                  <div className="task-card-left">
                    <span className={`badge ${(priorityConfig[task.priority] || priorityConfig['medium']).class}`}>
                      {(priorityConfig[task.priority] || priorityConfig['medium']).label}
                    </span>
                    <h3 className="task-card-title">{task.title}</h3>
                    <p className="task-card-desc">{task.description}</p>
                  </div>
                  <div className="task-card-right">
                    <span className="task-xp"><HiOutlineBolt /> XP</span>
                  </div>
                </div>

                <div className="task-card-bottom">
                  <div className="task-card-meta">
                    <span className="task-meta-item">
                      <HiOutlineCalendar /> {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}
                    </span>
                    <div className="task-tags">
                      {task.tags?.map((tag, i) => (
                        <span key={i} className="task-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="task-card-actions">
                    {task.status !== 'done' && (
                      <>
                        <button className="btn btn-ghost btn-sm" title="Postpone" onClick={() => postponeTask(task)}>
                          <HiOutlineClock /> Postpone
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => changeStatus(task._id, task.status === 'todo' ? 'in-progress' : 'done')}
                        >
                          <HiOutlineArrowPath />
                          {task.status === 'todo' ? 'Start' : 'Complete'}
                        </button>
                      </>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(task)}>
                      <HiOutlinePencil />
                    </button>
                    <button className="btn btn-ghost btn-sm danger" onClick={() => deleteTask(task._id)}>
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Kanban Board View */}
      {activeTab === 'kanban' && (
        <div className="kanban-board">
          {Object.entries(kanbanColumns).map(([status, col]) => (
            <div key={status} className="kanban-column">
              <div className="kanban-header" style={{ borderColor: col.color }}>
                <span className="kanban-title">{col.title}</span>
                <span className="kanban-count">{col.tasks.length}</span>
              </div>
              <div className="kanban-cards">
                {col.tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    className="kanban-card card"
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className={`badge ${(priorityConfig[task.priority] || priorityConfig['medium']).class}`} style={{ marginBottom: 8 }}>
                      {(priorityConfig[task.priority] || priorityConfig['medium']).label}
                    </span>
                    <h4 className="kanban-card-title">{task.title}</h4>
                    <p className="kanban-card-desc">{task.description}</p>
                    <div className="kanban-card-footer">
                      <span className="task-meta-item">
                        <HiOutlineCalendar /> {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline'}
                      </span>
                      <span className="task-xp-small"><HiOutlineBolt /> XP</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Task Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={resetForm}>
                  <HiOutlineXMark />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    className="input"
                    placeholder="What needs to be done?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="input textarea"
                    placeholder="Add details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      className="input select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="input select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="study">📖 Study</option>
                      <option value="assignment">📝 Assignment</option>
                      <option value="project">💻 Project</option>
                      <option value="practice">🏋️ Practice</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                      className="input"
                      placeholder="React, Frontend..."
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                </div>

                {calendarLinked && !editingTask && (
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'var(--space-sm)' }}>
                    <input 
                      type="checkbox" 
                      id="syncCalendar"
                      checked={formData.syncCalendar}
                      onChange={(e) => setFormData({ ...formData, syncCalendar: e.target.checked })}
                    />
                    <label htmlFor="syncCalendar" style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <HiOutlineCalendar style={{ verticalAlign: 'middle', marginRight: 4, color: 'var(--color-primary)' }}/>
                      Sync this task to Google Calendar
                    </label>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
