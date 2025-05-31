import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Cropper from 'react-easy-crop';

const CropperContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #333;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const SliderContainer = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

const SliderLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  color: var(--text);
`;

const Slider = styled.input`
  width: 100%;
  height: 2px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0;
  color: var(--text);
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ApplyButton = styled(Button)`
  background-color: var(--accent);
  color: white;
  
  &:hover {
    background-color: var(--primary);
  }
`;

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas dimensions to the cropped size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      blob.name = 'cropped.jpg';
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
};

const ImageCropper = ({ image, onCropComplete, onCancel, aspectRatio = 440 / 200 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    try {
      if (!croppedAreaPixels) return;
      
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  return (
    <>
      <CropperContainer>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteCallback}
          onZoomChange={onZoomChange}
        />
      </CropperContainer>
      
      <Controls>
        <SliderContainer>
          <SliderLabel>Zoom</SliderLabel>
          <Slider
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
        </SliderContainer>
        
        <ButtonsContainer>
          <CancelButton onClick={onCancel}>Cancelar</CancelButton>
          <ApplyButton onClick={handleApplyCrop}>Aplicar Recorte</ApplyButton>
        </ButtonsContainer>
      </Controls>
    </>
  );
};

export default ImageCropper;
