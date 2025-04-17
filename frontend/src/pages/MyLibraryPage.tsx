import React from 'react';

const MyLibraryPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">My Library</h1>
      <p className="text-foreground-secondary">Your collection of saved books will appear here.</p>
      {/* TODO: Implement library grid/list view */}
    </div>
  );
};

export default MyLibraryPage; 