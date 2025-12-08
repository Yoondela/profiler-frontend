'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { X, Grip } from 'lucide-react';

function SortableImage({ image, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative aspect-square overflow-hidden group"
    >
      <img
        src={image.url}
        alt="Gallery"
        className="w-full h-full object-cover"
      />

      <button
        onClick={() => onDelete(image)}
        className="absolute top-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded opacity-0 cursor-pointer group-hover:opacity-100 transition"
      >
        <X size={16} />
      </button>

      <div
        {...listeners}
        className="
          absolute bottom-0 left-0
          w-full h-2/7
          bg-black/40
          opacity-0 group-hover:opacity-100
          flex items-center justify-center
          cursor-grab transition
        "
      >
        <Grip size={20} className="text-white" />
      </div>
    </div>
  );
}

export const GalleryGrid = ({ images, setImages, onDelete }) => {
  if (!images?.length) return null;

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setImages((items) => {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={images.map((i) => i._id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-5 gap-2">
          {images.map((image) => (
            <SortableImage key={image._id} image={image} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
