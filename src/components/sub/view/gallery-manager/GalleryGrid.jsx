'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { X, Grip, Star } from 'lucide-react';

function SortableImage({ image, onDelete, onSetPrimary }) {
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
      className="relative aspect-square overflow-hidden group rounded-lg"
    >
      <img
        src={image.url}
        alt="Gallery"
        className="w-full h-full object-cover"
      />

      {/* Delete */}
      <button
        onClick={() => onDelete(image)}
        className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
      >
        <X size={16} />
      </button>

      {/* Primary */}
      <button
        onClick={() => onSetPrimary(image)}
        className="absolute top-2 left-2 text-white p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <Star
          size={16}
          className={image.isPrimary ? 'fill-yellow-300 text-yellow-300' : ''}
        />
      </button>

      {/* Always show primary label */}
      {image.isPrimary && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Cover
        </div>
      )}

      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute bottom-2 right-2 bg-black/70 p-1 rounded cursor-grab opacity-0 group-hover:opacity-100"
      >
        <Grip size={16} className="text-white" />
      </div>
    </div>
  );
}


export const GalleryGrid = ({ images, setImages, onDelete, onSetPrimary }) => {
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
            <SortableImage
              key={image._id}
              image={image}
              onDelete={onDelete}
              onSetPrimary={onSetPrimary}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
