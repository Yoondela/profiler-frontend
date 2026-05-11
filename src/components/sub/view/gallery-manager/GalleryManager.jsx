import { useEffect } from 'react';
import { deleteAtGallery } from './helper/supabase-helper';
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import {
  fetchGalleryImages,
  deleteGalleryImage,
  setPrimaryGalleryImage,
  reorderGalleryPhotos,
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

  const { uploadedGallery, ...props } = useSupabaseUpload({
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
    if (!uploadedGallery) return;

    setGalleryImages(uploadedGallery);
  }, [uploadedGallery]);


  const deleteImage = async (image) => {
    console.log('Deleting image:', image);
    if (!userId) return;

    try {
      const res = await deleteGalleryImage(
        userId,
        image._id
      );

      if (res?.galleryPhotos) {
        setGalleryImages(res.galleryPhotos);
      }

      console.log('Deleted from backend API:', image._id);
      
    } catch (error) {
      console.error('Failed to delete gallery image', error);
    }
  };
  const setPrimary = async (image) => {
    if (!userId) return;

    try {
      const res = await setPrimaryGalleryImage(userId, image._id);

      if (res?.galleryPhotos) {
        setGalleryImages(res.galleryPhotos);
      }
    } catch (err) {
      console.error('Failed to set primary', err);
    }
  };

  const handleReorder = async (
    fromIndex,
    toIndex,
    previousImages
  ) => {

    try {

      const res = await reorderGalleryPhotos(
        userId,
        fromIndex,
        toIndex
      );

      if (res?.galleryPhotos) {
        setGalleryImages(res.galleryPhotos);
      }

    } catch (err) {

      console.error(
        'Failed to reorder gallery',
        err
      );

      // rollback
      setGalleryImages(previousImages);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="gallery-manager">
      <div className="w-[100%] p-6">
        <Dropzone {...props}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
      {galleryImages.length > 0 && (
        <div className="px-10 mb-10">
          <GalleryGrid
            images={galleryImages}
            setImages={setGalleryImages}
            onDelete={deleteImage}
            onSetPrimary={setPrimary}
            onReorder={handleReorder}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
