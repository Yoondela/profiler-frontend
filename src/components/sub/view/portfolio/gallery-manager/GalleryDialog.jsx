'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { uploadGalleryImages } from './GalleryUploader';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import { updatePortfolio } from '@/api/sync/SyncPortfolio';
import { sendGalleryUrlsToApp } from '@/api/sync/SyncGallery';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

export default function GalleryDialog({ trigger, open, onOpenChange }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { user, getAccessTokenSilently, isLoading } = useAuth0();

  const fileInputRef = useRef(null);

  function handleFilesSelected(e) {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...mapped]);
  }

  function openFilePicker() {
    fileInputRef.current.click();
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const mapped = droppedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...mapped]);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  const handleUpload = async () => {
    console.log('we are uploading at point 1');

    if (!images.length) {
      toast.error('No images to upload.');
      return;
    }

    try {
      setUploading(true);

      // Extract File objects only
      const files = images.map((img) => img.file);

      console.log('Uploading files:', files);

      const urls = await uploadGalleryImages(files);

      console.log('Finished upload', urls);

      const userId = await getUserID(getAccessTokenSilently, user?.email);
      await sendGalleryUrlsToApp(userId, urls);

      toast.success('Gallery updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="
          bg-white text-black
          max-w-[600px] w-[90%] max-h-[85vh]
          p-4 overflow-y-auto
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Manage Gallery
          </DialogTitle>
          <DialogDescription>
            Upload and organize your portfolio images.
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="mt-4 space-y-4">
          {/* Upload Zone */}
          <div
            className="
              border-2 border-dashed border-gray-300
              rounded-md p-6 text-center cursor-pointer
              hover:border-gray-400 transition
            "
            onClick={openFilePicker}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="text-sm text-gray-600">Click or drag images here</p>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFilesSelected}
              className="hidden"
            />
          </div>

          {/* Preview Grid */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.preview}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-md"
                />

                {/* Remove button */}
                <button
                  type="button"
                  className="
                    absolute top-1 right-1
                    bg-black/70 text-white text-xs
                    px-2 py-1 rounded opacity-0
                    group-hover:opacity-100 transition
                  "
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
