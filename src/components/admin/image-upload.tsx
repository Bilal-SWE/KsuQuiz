'use client';

import { useState, useRef } from 'react';
import { uploadImage, deleteImage } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';

async function compressToWebP(file: File, maxWidth = 1200): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob!], 'image.webp', { type: 'image/webp' }));
        },
        'image/webp',
        0.8,
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressToWebP(file);
      const formData = new FormData();
      formData.append('file', compressed);
      const url = await uploadImage(formData);
      // Delete old image if exists
      if (value) await deleteImage(value);
      onChange(url);
    } catch {
      alert('فشل في رفع الصورة');
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = async () => {
    if (value) {
      await deleteImage(value);
      onChange('');
    }
  };

  return (
    <div>
      {value && (
        <div className="relative mb-2 inline-block">
          <img src={value} alt="" className="h-32 rounded-lg object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -start-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="secondary"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
          className="text-sm"
        >
          {value ? 'تغيير الصورة' : 'رفع صورة'}
        </Button>
      </div>
    </div>
  );
}
