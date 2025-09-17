import { useState, useRef } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';

export default function ProfilePictureUpload({ onUploadSuccess }) {
  const [selectedImage, setSelectedImage] = useState(null);
  //   const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    try {
      //   setLoading(true);

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        'http://localhost:3000/api/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const newImgUrl = response.data.url;
      //   setLoading(false);
      onUploadSuccess(newImgUrl);
    } catch (err) {
      console.error('Upload failed', err);
      //   setLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200 hover:cursor-pointer hover:ring-2 hover:ring-primary transition"
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <User className="w-7 h-7 text-gray-400" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      <p className="mt-2 text-xs text-gray-600">Click to upload</p>
    </div>
  );
}
