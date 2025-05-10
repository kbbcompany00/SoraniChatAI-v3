import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useImageEmbedding = () => {
  const [embedding, setEmbedding] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getEmbedding = useCallback(async (imageBase64: string) => {
    if (!imageBase64) return;

    setIsLoading(true);
    setEmbedding([]);

    try {
      const response = await fetch('/api/embed/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error embedding image');
      }

      const data = await response.json();
      setEmbedding(data.embedding);
      
      toast({
        title: "شیکردنەوەی وێنە تەواو بوو",
        description: `وێنەکە بە سەرکەوتوویی شیکرایەوە بۆ فێکتەر بە ${data.embedding.length} دوورییەوە`,
      });
      
      return data.embedding;
    } catch (error) {
      console.error('Error getting image embedding:', error);
      toast({
        title: "هەڵە لە شیکردنەوەی وێنە",
        description: error instanceof Error ? error.message : 'هەڵەیەک ڕوویدا لە کاتی شیکردنەوەی وێنەکەت',
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetEmbedding = useCallback(() => {
    setEmbedding([]);
  }, []);

  return {
    embedding,
    isLoading,
    getEmbedding,
    resetEmbedding
  };
};