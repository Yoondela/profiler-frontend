import { supabase } from '@/lib/supabaseClient';
import { v4 as uuid } from 'uuid';

export async function uploadGalleryImages(files) {
  console.log('uploadGalleryImages called with:', files);

  if (!files) {
    console.error('FILES IS UNDEFINED');
    return;
  }

  if (!Array.isArray(files) && !files.length) {
    console.error('FILES IS EMPTY or NOT iterable:', files);
    return;
  }

  const uploadedUrls = [];

  for (const file of files) {
    const ext = file.name.split('.').pop();
    const fileName = `${uuid()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('user-galleries')
      .upload(`providers/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    console.log('we are at mains 2');

    const { data: publicData } = supabase.storage
      .from('user-galleries')
      .getPublicUrl(`providers/${fileName}`);

    uploadedUrls.push(publicData.publicUrl);
  }

  return uploadedUrls;
}
