import { supabase } from '@/lib/supabaseClient';
import { v4 as uuid } from 'uuid';

export async function uploadGalleryImage(file, onProgress) {
  const ext = file.name.split('.').pop();
  const fileName = `${uuid()}.${ext}`;
  const filePath = `providers/${fileName}`;

  // Create the upload URL using Supabase’s internal endpoint
  const { data: signed } = await supabase.storage
    .from('user-galleries')
    .createSignedUploadUrl(filePath);

  if (!signed) throw new Error('Could not create signed URL');

  // Stream upload:
  const chunkSize = 64 * 1024; // 64KB chunks
  const fileSize = file.size;
  let uploaded = 0;

  const stream = new ReadableStream({
    start(controller) {
      const reader = file.stream().getReader();

      function push() {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }

          uploaded += value.length;
          const percent = Math.round((uploaded / fileSize) * 100);
          onProgress(percent);

          controller.enqueue(value);
          push();
        });
      }

      push();
    },
  });

  const uploadRes = await fetch(signed.signedUrl, {
    method: 'PUT',
    body: stream,
    headers: {
      'Content-Type': file.type,
      'x-upsert': 'false',
    },
  });

  if (!uploadRes.ok) throw new Error('Upload failed');

  const publicUrlObject = supabase.storage
    .from('user-galleries')
    .getPublicUrl(filePath);

  return publicUrlObject.data.publicUrl;
}
