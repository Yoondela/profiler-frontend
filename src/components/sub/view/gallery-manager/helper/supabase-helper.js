import { supabase } from '@/lib/supabaseClient';

const getPathFromUrl = (url) => {
  const parts = url.split('/user-galleries/');
  return parts[1];
};

export const deleteAtGallery = async (imageUrl) => {
  const filePath = getPathFromUrl(imageUrl);

  const { error } = await supabase.storage
    .from('user-galleries')
    .remove([filePath]);

  if (error) throw error;

  return true;
};
