import { Image as ImageIcon } from 'react-feather';

interface PreviewProps {
  image: string | null;
  prompt: string;
  style: string;
}

export function Preview ({
  image,
  prompt,
  style
}: PreviewProps) {
  const isEmpty = !image && !prompt.trim() && !style;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
      </div>
      
      {isEmpty ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Upload an image and add a prompt to see preview</p>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {image && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md min-h-[3rem] whitespace-pre-wrap">
                {prompt.trim() || 'No prompt provided'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md capitalize">
                {style}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};