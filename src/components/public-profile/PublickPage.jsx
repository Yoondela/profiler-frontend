'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProviderPublicPage() {
  const provider = fakeProvider; // later: replace with API call

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
        {/* LEFT: GALLERY */}
        <div className="space-y-4">
          <h1 className="text-xl font-semibold">{provider.name} Portfolio</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {provider.galleryPhotos.map((img, i) => (
              <div
                key={i}
                className="relative w-full h-40 rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={img}
                  alt={`gallery ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: STICKY PROFILE CARD */}
        <Card className="h-fit md:sticky md:top-6">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
            <img
              src={provider.photo}
              alt={provider.name}
              className="w-24 h-24 rounded-full object-cover"
            />

            <h2 className="text-lg font-semibold">{provider.name}</h2>

            <p className="text-sm text-muted-foreground">{provider.location}</p>

            <p className="text-sm leading-relaxed">{provider.bio}</p>

            <Button className="w-full">Request Service</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- FAKE DATA ----
const fakeProvider = {
  id: '12345',
  name: 'Nomusa M.',
  photo: 'https://via.placeholder.com/200',
  location: 'Durban, South Africa',
  bio: 'Experienced house cleaner with 3+ years in residential and Airbnb cleaning.',
  galleryPhotos: [
    'https://picsum.photos/400?random=1',
    'https://picsum.photos/400?random=2',
    'https://picsum.photos/400?random=3',
    'https://picsum.photos/400?random=4',
    'https://picsum.photos/400?random=5',
  ],
};
