import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

import gardeningTasks from '../../../data/tasks/gardening.json';
import cleaningTasks from '../../../data/tasks/cleaning.json';
import carWashTasks from '../../../data/tasks/car-wash.json';

export default function SelectTasksPopup({
  service,
  selectedTasks = {},
  setSelectedTasks,
  onConfirm,
  onCancel,
}) {
  const [tasks, setTasks] = useState({});

  const serviceTasks =
    service === 'Gardening'
      ? gardeningTasks
      : service === 'Cleaning'
        ? cleaningTasks
        : service === 'Car Wash'
          ? carWashTasks
          : {};

  useEffect(() => {
    const initial = {};
    Object.entries(serviceTasks).forEach(([category, items]) => {
      initial[category] = {
        checked: category === 'General',
        tasks: items.map((task) => ({
          name: task,
          checked: category === 'General',
        })),
      };
    });
    setTasks(initial);
  }, [serviceTasks]);

  const toggleCategory = (category) => {
    setTasks((prev) => {
      const updated = { ...prev };
      const cat = updated[category];
      const newChecked = !cat.checked;
      updated[category] = {
        ...cat,
        checked: newChecked,
        tasks: cat.tasks.map((t) => ({ ...t, checked: newChecked })),
      };
      return updated;
    });
  };

  const toggleTask = (category, taskName) => {
    setTasks((prev) => {
      const updated = { ...prev };
      updated[category].tasks = updated[category].tasks.map((t) =>
        t.name === taskName ? { ...t, checked: !t.checked } : t
      );
      const anyChecked = updated[category].tasks.some((t) => t.checked);
      updated[category].checked = anyChecked;
      return updated;
    });
  };

  const handleConfirm = () => {
    const selected = {};
    Object.entries(tasks).forEach(([category, data]) => {
      const chosen = data.tasks.filter((t) => t.checked).map((t) => t.name);
      if (chosen.length > 0) selected[category] = chosen;
    });
    setSelectedTasks(selected);
    onConfirm();
  };

  if (!serviceTasks || Object.keys(serviceTasks).length === 0) return null;

  return (
    <div className="popup-overlay">
      <motion.div
        className="popup tasks-popup"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="closer">
          <X size={18} className="popup-close" onClick={onCancel} />
        </div>

        <div className="popup-sub-title">
          <h2 className="popup-title">
            Select <strong>tasks</strong>
          </h2>
        </div>

        <div className="task-categories">
          {Object.entries(tasks).map(([category, data]) => (
            <div
              key={category}
              className={`task-category ${data.checked ? 'selected' : ''}`}
            >
              <div
                className="category-header"
                onClick={() => toggleCategory(category)}
              >
                <span>{category}</span>
              </div>

              <div className="task-list">
                {data.tasks.map((task) => (
                  <div
                    key={task.name}
                    className={`task-chip ${task.checked ? 'active' : ''}`}
                    onClick={() => toggleTask(category, task.name)}
                  >
                    {task.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="remove-or-cancel">
          <button className="cancel-remove" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}
