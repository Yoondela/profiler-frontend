export const GalleryGrid = ({ images, onDelete }) => {
  if (!images?.length) return null;

  return (
    <div className="grid grid-cols-5 gap-2">
      {images.map((img) => (
        <div
          key={img._id}
          className="relative aspect-square overflow-hidden group"
        >
          <img
            src={img.url}
            alt="Gallery image"
            className="w-full h-full object-cover"
          />

          {/* Delete button - appears on hover */}
          <button
            onClick={() => onDelete(img._id)}
            className="absolute top-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
