import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useApiClient } from '@/api/useApiClient';

const useSupabaseUpload = (options) => {
  const {
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
  } = options;

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [uploadedGallery, setUploadedGallery] = useState(null);

  const api = useApiClient();

  const isSuccess = useMemo(() => {
    return (
      !loading &&
      errors.length === 0 &&
      uploadedGallery !== null
    );
  }, [loading, errors.length, uploadedGallery]);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const validFiles = acceptedFiles
        .filter(
          (file) =>
            !files.find((x) => x.name === file.name)
        )
        .map((file) => {
          file.preview = URL.createObjectURL(file);
          file.errors = [];
          return file;
        });

      const invalidFiles = fileRejections.map(
        ({ file, errors }) => {
          file.preview = URL.createObjectURL(file);
          file.errors = errors;
          return file;
        }
      );

      const newFiles = [
        ...files,
        ...validFiles,
        ...invalidFiles,
      ];

      setFiles(newFiles);
    },
    [files]
  );

  const dropzoneProps = useDropzone({
    onDrop,
    noClick: true,
    accept: allowedMimeTypes.reduce(
      (acc, type) => ({
        ...acc,
        [type]: [],
      }),
      {}
    ),
    maxSize: maxFileSize,
    maxFiles,
    multiple: maxFiles !== 1,
  });

  const onUpload = useCallback(async () => {
    try {
      setLoading(true);
      setErrors([]);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.post(
        '/gallery/upload',
        formData
      );

      setUploadedGallery(
        res.data.galleryPhotos
      );

    } catch (err) {
      setErrors([
        {
          error:
            err.response?.data?.message ||
            'Upload failed',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [files, api]);

  useEffect(() => {
    if (files.length === 0) {
      setErrors([]);
    }

    if (files.length <= maxFiles) {
      let changed = false;

      const newFiles = files.map((file) => {
        if (
          file.errors.some(
            (e) => e.code === 'too-many-files'
          )
        ) {
          file.errors = file.errors.filter(
            (e) => e.code !== 'too-many-files'
          );

          changed = true;
        }

        return file;
      });

      if (changed) {
        setFiles(newFiles);
      }
    }
  }, [files, maxFiles]);

  return {
    files,
    setFiles,

    loading,

    errors,
    setErrors,

    uploadedGallery,

    isSuccess,

    onUpload,

    maxFileSize,
    maxFiles,
    allowedMimeTypes,

    ...dropzoneProps,
  };
};

export { useSupabaseUpload };