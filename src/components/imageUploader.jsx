import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { apiService } from '../services/api';
import { Upload, X, Camera } from 'lucide-react';

const ImageUploader = ({ formData, setFormData, maxPhotos = 5 }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);

    if (formData.photos.length + files.length > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    setIsUploading(true);

    try {
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          // Compress the image
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
          });
          return compressedFile;
        })
      );

      // Upload each compressed image to IPFS
      const uploadedUrls = [];
      for (const file of compressedFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await apiService.uploadImageToIPFS(uploadFormData);
        const result = await response.json();

        if (!result.IpfsHash) {
          throw new Error('Upload failed');
        }

        const imageUrl = `https://yellow-impossible-catshark-848.mypinata.cloud/ipfs/${result.IpfsHash}`;
        uploadedUrls.push(imageUrl);
      }

      // Update form data with new photo URLs
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls]
      }));

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Your Photos</h3>
        <p className="text-gray-600">Upload up to {maxPhotos} photos to showcase yourself</p>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {formData.photos.map((photo, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {formData.photos.length < maxPhotos && (
          <button
            onClick={triggerFileInput}
            disabled={isUploading}
            className="aspect-square rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50 hover:bg-pink-100 transition-colors flex flex-col items-center justify-center disabled:opacity-50"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
            ) : (
              <>
                <Camera className="w-8 h-8 text-pink-500 mb-2" />
                <span className="text-sm text-pink-600 font-medium">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photo Count */}
      <p className="text-sm text-gray-500 text-center">
        {formData.photos.length} of {maxPhotos} photos uploaded
      </p>
    </div>
  );
};

export default ImageUploader;
