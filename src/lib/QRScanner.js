import { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

const QRScanner = ({ onQRCodeScanned }) => {
  const webcamRef = useRef(null);

  const handleScan = () => {
    const video = webcamRef.current.video;

    if (video) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          const scannedValue = code.data;
          onQRCodeScanned(scannedValue);
        }
      } catch (error) {
        console.error('Error processing QR code:', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleScan();
    }, 1000); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        mirrored={true} // Adjust as needed
        screenshotFormat="image/jpeg"
      />
    </div>
  );
};

export default QRScanner;
