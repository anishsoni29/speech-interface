import React from 'react';
import { Card, CardContent } from './Card';

const ImageGallery = ({ images, response, language, setLanguage }) => {
  // Function to get image URL from the backend
  const getImageUrl = (filename) => {
    return `http://localhost:5002/api/image/${filename}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Captures</h2>
      
      <div className="text-sm text-gray-600">
        Selected Language: {language}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images && images.length > 0 ? (
          images.map((image, index) => (
            <Card key={image.id || index} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Image display */}
                <img
                  src={getImageUrl(image.filename)}
                  alt={`Captured at ${image.timestamp}`}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'placeholder.jpg'; // Add a placeholder image
                  }}
                />
                
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Prompt:</span> {image.prompt}
                  </div>
                  <div>
                    <span className="font-semibold">Response:</span> {image.response}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">Time:</span> {image.timestamp}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No images available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;