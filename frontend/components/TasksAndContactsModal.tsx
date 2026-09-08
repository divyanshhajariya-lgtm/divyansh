import {
  AlertCircle,
  Building,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Mail,
  Phone,
  Plus,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { OfficerContact, OfficerTask } from '../types';

interface Props {
  contacts: OfficerContact[];
  onAddTask: (task: Partial<OfficerTask>) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  tasks: OfficerTask[];
}

export const TasksAndContactsModal: React.FC<Props> = ({
  contacts,
  onAddTask,
  onToggleTask,
  tasks,
}) => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'tasks'>('tasks');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<
    'HIGH' | 'LOW' | 'MEDIUM'
  >('HIGH');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      assignedOfficer: 'R. Kalyanasundaram (CGM CPCL)',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      notes: newTaskNotes,
      priority: newTaskPriority,
      tenderId: 'GEM/2026/B/891273',
      title: newTaskTitle,
    });

    setNewTaskTitle('');
    setNewTaskNotes('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tab Switcher */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>
                Committee Tasks ({tasks.filter((t) => !t.completed).length})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Nodal Directory ({contacts.length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'tasks' && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="p-5">
          {isAdding && (
            <form
              onSubmit={handleCreateTask}
              className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs"
            >
              <h4 className="font-bold text-slate-900 text-sm">
                Add New Verification Checklist Item
              </h4>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify UDIN on MII CA Certificate against ICAI database..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="HIGH">High Priority (Urgent)</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority (Post-Evaluation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Audit Notes / CVC Reference
                  </label>
                  <input
                    type="text"
                    placeholder="Rule citation or committee member"
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg"
                >
                  Create Task
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs transition ${
                  task.completed
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleTask(task.id, !task.completed)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition cursor-pointer ${
                      task.completed
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <h5
                      className={`font-bold ${
                        task.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h5>
                    {task.notes && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {task.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-mono">
                      <span>Assigned: {task.assignedOfficer}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    task.priority === 'HIGH'
                      ? 'bg-rose-100 text-rose-800'
                      : task.priority === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">
                    {contact.name}
                  </h5>
                  <p className="text-[11px] text-indigo-700 font-semibold">
                    {contact.role}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    contact.status === 'ONLINE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : contact.status === 'IN_MEETING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {contact.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {contact.organization} ({contact.department})
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1 hover:text-indigo-600"
                >
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[150px]">
                    {contact.email}
                  </span>
                </a>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1 hover:text-indigo-600"
                >
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{contact.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
