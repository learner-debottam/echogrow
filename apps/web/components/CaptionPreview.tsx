type Props = {
  caption?: string;
  translated?: string;
  isGenerating?: boolean;
  isTranslating?: boolean;
};

export default function CaptionPreview({ caption, translated, isGenerating, isTranslating }: Props) {
  return (
    <div className="space-y-2">
      <div className="bg-blue-50 p-2 rounded min-h-[2rem]">
        {isGenerating ? <span className="animate-pulse">Generating...</span> : (caption || '')}
      </div>
      <div className="bg-green-50 p-2 rounded min-h-[2rem]">
        {isTranslating ? <span className="animate-pulse">Translating...</span> : (translated || '')}
      </div>
    </div>
  );
}
