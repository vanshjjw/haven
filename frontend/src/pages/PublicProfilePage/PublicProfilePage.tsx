import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Placeholder for fetched public profile data
interface PublicProfileData {
  username: string;
  // Add other public fields later, e.g., publicBookCount, bio?
}

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>(); // Get username from URL param
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      if (!username) {
        setError('Username not provided.');
        setIsLoading(false);
        return;
      }
      try {
        // TODO: Implement backend call to fetch public profile data
        console.log(`Fetching public profile for: ${username}`);
        // const data = await profileService.getPublicProfile(username);
        // setProfileData(data);
        
        // Placeholder data for now
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setProfileData({ username: username }); 

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]); // Re-fetch if username param changes

  return (
    // Basic layout - might need its own simple header/layout later
    <div className="container mx-auto p-8 bg-background min-h-screen">
      {isLoading && <p className="text-center text-foreground-secondary">Loading profile...</p>}
      {error && <p className="text-center text-error">Error: {error}</p>}
      {profileData && (
        <div>
          <h1 className="text-4xl font-bold text-primary mb-4">{profileData.username}'s Public Profile</h1>
          <p className="text-foreground-secondary">Public library details will go here.</p>
          {/* TODO: Display public library sections/gallery */} 
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage; 