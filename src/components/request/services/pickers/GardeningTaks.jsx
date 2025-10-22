// import { useState } from "react";
import { Card, CardContent } from '../../../sub/ui/card';
import { Checkbox } from '../../../sub/ui/checkbox';
import { Button } from '../../../sub/ui/button';

import GardeningTasksData from '../../../../data/tasks/gardening.json';

export default function GardeningTasks({ selectedTasks, setSelectedTasks }) {
  const handleCheckboxChange = (task) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter((t) => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  return (
    <div className="cleaning-container">
      <div className="cleaning-card">
        <div>
          <div className="cleaning-grid">
            {Object.entries(GardeningTasksData).map(([category, tasks]) => (
              <div key={category} className="cleaning-category">
                <h3 className="cleaning-category-title">{category}</h3>
                <div className="cleaning-tasks">
                  {tasks.map((task) => (
                    <label key={task} className="cleaning-task">
                      <Checkbox
                        className="custom-checkbox" // Apply custom styles
                        checked={selectedTasks.includes(task)}
                        onCheckedChange={() => handleCheckboxChange(task)}
                      />
                      {task}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
