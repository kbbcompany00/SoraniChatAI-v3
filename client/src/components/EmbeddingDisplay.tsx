import React from 'react';

interface EmbeddingDisplayProps {
  embedding: number[];
  isLoading: boolean;
}

const EmbeddingDisplay: React.FC<EmbeddingDisplayProps> = ({ embedding, isLoading }) => {
  if (isLoading) {
    return (
      <div className="embedding-loading p-4 bg-white rounded-lg border border-violet-100 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-700"></div>
          <span className="text-violet-700">شیکردنەوەی وێنە...</span>
        </div>
      </div>
    );
  }

  if (!embedding || embedding.length === 0) {
    return null;
  }

  // Get a sample of the embedding to display (first 10 values)
  const sampleEmbedding = embedding.slice(0, 10);
  // Calculate total length
  const totalLength = embedding.length;
  
  return (
    <div className="embedding-display p-4 bg-white rounded-lg border border-violet-100 shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-violet-800">فێکتەری شیکردنەوەی وێنە</h3>
        <span className="text-xs text-gray-500">قەبارە: {totalLength}</span>
      </div>
      
      <div className="embedding-visualization mb-2">
        <div className="grid grid-cols-10 gap-1">
          {sampleEmbedding.map((value, index) => (
            <div 
              key={index}
              className="h-8 rounded"
              style={{ 
                backgroundColor: `rgba(124, 58, 237, ${Math.abs(value)})`,
                transform: `scaleY(${Math.abs(value) * 0.8 + 0.2})`,
              }}
              title={`Value ${index}: ${value.toFixed(6)}`}
            />
          ))}
        </div>
      </div>
      
      <div className="sample-values">
        <details>
          <summary className="text-xs text-violet-600 cursor-pointer hover:text-violet-800 transition-colors">
            نیشاندانی بەهاکان (10 لە {totalLength})
          </summary>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-700 max-h-24 overflow-auto">
            {sampleEmbedding.map((value, index) => (
              <div key={index} className="flex justify-between">
                <span>بەها {index + 1}:</span>
                <span>{value.toFixed(6)}</span>
              </div>
            ))}
            <div className="text-gray-500 mt-1 text-center">
              ... {totalLength - 10} بەهای تر
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default EmbeddingDisplay;