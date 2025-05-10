import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageCaptured: (base64Image: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageCaptured, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Handle file selection from device
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "فایل زۆر گەورەیە",
        description: "تکایە وێنەیەک بنێرە کە قەبارەی کەمتر بێت لە 5MB",
        variant: "destructive",
      });
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      onImageCaptured(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle click on the upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Start camera capture
  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "هەڵە لە بەکارهێنانی کامێرا",
        description: "ناتوانین دەستگەیشتن بە کامێراکەت بکەین، تکایە ڕێگەپێدان بدە یان وێنەیەک دابنێ",
        variant: "destructive",
      });
      setIsCapturing(false);
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreviewUrl(dataUrl);
      onImageCaptured(dataUrl);
      stopCamera();
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCapturing(false);
  };

  // Clear the selected image
  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-uploader mb-4 p-4 bg-violet-50 rounded-xl border border-violet-100" dir="rtl">
      <h3 className="text-lg font-medium text-violet-800 mb-2">شیکردنەوەی وێنە</h3>
      <p className="text-sm text-gray-600 mb-3">وێنەیەک هەڵبژێرە یان وێنەیەک بگرە بۆ دەستکەوتنی فێکتەری شیکردنەوە</p>
      
      {/* Preview area */}
      {previewUrl && (
        <div className="preview-container mb-3 relative">
          <img 
            src={previewUrl} 
            alt="پێشبینی" 
            className="max-h-64 max-w-full mx-auto rounded-lg border border-violet-200"
          />
          <button 
            onClick={clearImage}
            className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            disabled={isLoading}
            aria-label="سڕینەوە"
          >
            <span className="material-icons text-sm">close</span>
          </button>
        </div>
      )}

      {/* Camera capture area */}
      {isCapturing && !previewUrl && (
        <div className="camera-container mb-3 relative">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            className="max-h-64 max-w-full mx-auto rounded-lg border border-violet-200"
          />
          <div className="camera-controls flex justify-center mt-2 gap-2">
            <Button 
              onClick={captureImage}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              <span className="material-icons ml-1 text-sm">photo_camera</span> وێنە بگرە
            </Button>
            <Button 
              onClick={stopCamera} 
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <span className="material-icons ml-1 text-sm">close</span> داخستن
            </Button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!isCapturing && !previewUrl && (
        <div className="upload-options flex flex-wrap gap-2 justify-center">
          <Button 
            onClick={handleUploadClick} 
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            <span className="material-icons ml-1 text-sm">upload</span> هەڵبژاردنی وێنە
          </Button>
          <Button 
            onClick={startCamera} 
            variant="outline"
            className="border-violet-300 text-violet-700 hover:bg-violet-100"
            disabled={isLoading}
          >
            <span className="material-icons ml-1 text-sm">photo_camera</span> کامێرا
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {previewUrl && (
        <div className="mt-2 text-sm text-violet-600 flex items-center justify-end">
          وێنە بەسەرکەوتوویی ئامادەیە بۆ شیکردنەوە
          <span className="material-icons text-violet-500 mr-1 ml-1 text-sm">check_circle</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;