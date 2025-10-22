import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import CleaningTasksChecklist from '../pickers/CleaningTasks';

export default function ExPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
      >
        Open Popup
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 rounded-2xl shadow-2xl max-w-screen-md w-[130%] max-h-[90vh] overflow-auto relative"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold">Modern Popup</h2>
            <CleaningTasksChecklist />
          </motion.div>
        </div>
      )}
    </div>
  );
}
