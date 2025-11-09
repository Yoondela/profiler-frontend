import { useState, useRef } from 'react';
import { Building2 } from 'lucide-react';
import { Switch } from '@headlessui/react';
import axios from 'axios';
import { useUserContext } from '@/api/context/userContext.jsx';

// import { updateProfile } from '../../api/sync/SyncProfile.jsx';

export default function LogoUpload({ logoUrl, onUploadSuccess }) {
  const [selectedImage, setSelectedImage] = useState(null);
  //   const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { logoUrlCtx } = useUserContext();

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
        `${import.meta.env.VITE_API_URL}/upload`,
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
        className="relative flex flex-col items-center justify-center h-30 w-30 rounded-full overflow-hidden bg-pink-100 hover:cursor-pointer hover:ring-2 hover:ring-primary transition"
      >
        {logoUrl || selectedImage ? (
          <img
            src={logoUrlCtx || selectedImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Building2 className="w-15 h-15 text-gray-400" />
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

      {/* <p className="mt-2 text-xs text-gray-600">Click to upload</p> */}
    </div>
  );
}
