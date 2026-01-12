import { useState } from 'react';

const useUpload = () => {
    const [media, setMedia] = useState<string[]>([]);

    const uploadMedia = async (files: File[]) => {
        const fileReaders = files.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              reject(new Error('File reading has failed'));
            };
            reader.readAsDataURL(file);
          });
        });
      
        try {
          const urls = await Promise.all(fileReaders);
          setMedia(urls);
        } catch (error) {
          console.error('Failed to read files:', error);
        }
      };

    const removeMedia = (index: number) => {
        setMedia(prevMedia => prevMedia.filter((_, i) => i !== index));
    };

    const removeAllMedia = () => {
        setMedia([]);
    };

    return {
        media,
        uploadMedia,
        removeMedia,
        removeAllMedia
    };
};

export default useUpload;
