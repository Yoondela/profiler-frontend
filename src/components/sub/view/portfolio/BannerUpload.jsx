import { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useUserContext } from '@/api/context/userContext';
import toast from 'react-hot-toast';

/**
 * BannerUpload component
 *
 * Props:
 *  - currentBannerUrl: string (optional) → existing banner to display
 *  - onUploadSuccess: function(imageUrl: string) → callback after upload success
 *  - uploadEndpoint: string (optional) → backend upload endpoint (default: /api/upload)
 */
export default function BannerUpload({ currentBannerUrl, onUploadSuccess }) {
  const [bannerUrl, setBannerUrl] = useState(currentBannerUrl);
  const [isUploading, setIsUploading] = useState(false);
  const { bannerUrlCtx, setBannerUrlCtx } = useUserContext();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    console.log('imgUrl IDK', imageUrl);

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      console.log('image data', formData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const newImgUrl = response.data.url;
      setIsUploading(false);
      setBannerUrl(newImgUrl);
      setBannerUrlCtx(newImgUrl);
      onUploadSuccess(newImgUrl);
    } catch (err) {
      console.error('Upload failed', err);
      //   setLoading(false);
    }
  };

  return (
    <div className="relative w-full group">
      {/* Mobile ratio */}
      <div className="block md:hidden">
        <AspectRatio ratio={3 / 1}>
          <div
            className="relative w-full h-full bg-center bg-cover rounded-b-md transition-all duration-300"
            style={{ backgroundImage: `url(${bannerUrl || bannerUrlCtx})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 rounded-b-md" />

            {/* Edit Banner Button */}
            <label
              htmlFor="bannerUpload"
              className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <Pencil className="w-4 h-4 text-white" />
              <input
                id="bannerUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {/* Uploading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-b-md">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </AspectRatio>
      </div>

      {/* Desktop ratio */}
      <div className="hidden md:block">
        <AspectRatio ratio={5 / 1}>
          <div
            className="relative w-full h-full bg-center bg-cover rounded-b-md transition-all duration-300"
            style={{ backgroundImage: `url(${bannerUrl || bannerUrlCtx})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 rounded-b-md" />

            {/* Edit Banner Button */}
            <label
              htmlFor="bannerUploadDesktop"
              className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60
                  transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <Pencil className="w-5 h-5 text-white" />
              <input
                id="bannerUploadDesktop"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {/* Uploading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-b-md">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </AspectRatio>
      </div>
    </div>
  );
}
