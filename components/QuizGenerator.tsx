
import React, { useState, useRef } from 'react';
import { FileImage, Type, Send, X, FileText, UploadCloud, ListChecks } from 'lucide-react';
import { MediaFile } from '../types';

interface QuizGeneratorProps {
  onGenerate: (text: string, questionCount: number, media?: MediaFile) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onGenerate }) => {
  const [text, setText] = useState('');
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setMediaFile({
          data: base64String,
          mimeType: file.type,
          name: file.name
        });
        
        if (file.type.startsWith('image/')) {
          setPreviewUrl(reader.result as string);
        } else {
          setPreviewUrl(null); // No preview for PDF
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !mediaFile) return;
    onGenerate(text, questionCount, mediaFile || undefined);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Type className="w-4 h-4 text-indigo-500" />
            Paste your notes
          </label>
          <textarea
            className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-gray-700 placeholder:text-gray-400"
            placeholder="e.g. Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <UploadCloud className="w-4 h-4 text-indigo-500" />
            Upload Source (Image or PDF)
          </label>
          
          {!mediaFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
            >
              <div className="flex gap-4 mb-2">
                <FileImage className="w-10 h-10 text-gray-300 group-hover:text-indigo-400" />
                <FileText className="w-10 h-10 text-gray-300 group-hover:text-red-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">Click to browse files</p>
              <p className="text-xs text-gray-400 mt-1">Images or PDF Documents</p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                ) : (
                  <div className="w-12 h-12 bg-red-100 flex items-center justify-center rounded-lg">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{mediaFile.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{mediaFile.mimeType.split('/')[1]}</p>
                </div>
                <button
                  type="button"
                  onClick={removeMedia}
                  className="p-1.5 bg-gray-200 text-gray-600 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />
        </div>

        {/* Question Count Selector */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <ListChecks className="w-4 h-4 text-indigo-500" />
            Number of Questions
          </label>
          <div className="flex gap-2">
            {[5, 10, 20, 30].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                  questionCount === count
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !mediaFile}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Generate Quiz
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default QuizGenerator;
