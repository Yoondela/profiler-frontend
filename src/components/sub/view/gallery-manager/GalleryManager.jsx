import { useEffect } from 'react';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import {
  sendGalleryUrlsToApp,
  fetchGalleryImages,
  deleteGalleryImage,
} from '@/api/sync/SyncGallery';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import { useState } from 'react';
import { GalleryGrid } from './GalleryGrid';

const GalleryManager = () => {
  const [userId, setUserId] = useState(null);
  const [initialGalleryLoaded, setInitialGalleryLoaded] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  const { user, getAccessTokenSilently } = useAuth0();

  const { uploadedUrls, ...props } = useSupabaseUpload({
    bucketName: 'user-galleries',
    path: 'providers',
    allowedMimeTypes: ['image/*'],
    maxFiles: 10,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

  useEffect(() => {
    if (!user) return;

    async function loadUserId() {
      const id = await getUserID(getAccessTokenSilently, user.email);
      setUserId(id);
    }

    loadUserId();
  }, [user]);

  useEffect(() => {
    if (!userId) return;
    if (initialGalleryLoaded) return;

    const loadInitialGallery = async () => {
      try {
        const existingImages = await fetchGalleryImages(userId);
        console.log('Existing gallery URLs:', existingImages);
        setGalleryImages(existingImages.galleryPhotos);
        setInitialGalleryLoaded(true);
      } catch (error) {
        console.error('Failed to fetch gallery URLs', error);
      }
    };

    loadInitialGallery();
  }, [userId, initialGalleryLoaded]);

  useEffect(() => {
    if (!uploadedUrls.length) return;
    if (!userId) return;

    const syncUrls = async () => {
      try {
        const saved = await sendGalleryUrlsToApp(userId, uploadedUrls);

        if (saved?.galleryPhotos) {
          setGalleryImages(saved.galleryPhotos);
        }

        console.log('URLs sent to backend:', uploadedUrls);
      } catch (error) {
        console.error('Failed to sync gallery URLs', error);
      }
    };

    syncUrls();
  }, [uploadedUrls, userId]);

  const deleteImage = async (img_id) => {
    if (!userId) return;

    try {
      // 1. Delete from backend (Mongo / API)
      await deleteGalleryImage(userId, img_id);

      // 2. Delete from local state (React)
      setGalleryImages((prevImages) =>
        prevImages.filter((img) => img._id !== img_id)
      );
    } catch (error) {
      console.error('Failed to delete gallery image', error);
    }
  };

  return (
    <div className="gallery-manager">
      <div className="w-[100%] p-6">
        <Dropzone {...props}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
      {galleryImages && (
        <div className="px-10">
          <GalleryGrid images={galleryImages} onDelete={deleteImage} />
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
