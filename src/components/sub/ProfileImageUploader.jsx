import { useState, useRef } from 'react';
import { User } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import axios from 'axios';
import { useUserContext } from '@/api/context/userContext.jsx';

import { updateProfile } from '../../api/sync/SyncProfile.jsx';

export default function ProfilePictureUpload({ onUploadSuccess }) {
  const [selectedImage, setSelectedImage] = useState(null);
  //   const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { avatarUrlCtx, setAvatarUrlCtx, profileCtx } = useUserContext();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    try {
      setIsUploading(true);

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
      setIsUploading(false);
      onUploadSuccess(newImgUrl);
    } catch (err) {
      console.error('Upload failed', err);
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        className="relative flex flex-col items-center justify-center h-20 w-20 rounded-full overflow-hidden bg-pink-100 hover:cursor-pointer hover:ring-2 hover:ring-primary transition"
      >
        <Avatar className={'w-full h-full'}>
          <AvatarImage src={selectedImage || avatarUrlCtx}></AvatarImage>
          <AvatarFallback>
            <User />
          </AvatarFallback>
          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-b-md">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </Avatar>
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
