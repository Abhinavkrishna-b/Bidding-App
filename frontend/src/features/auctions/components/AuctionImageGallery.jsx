
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export default function AuctionImageGallery({ auction }) {
  const images =
    Array.isArray(auction.images) && auction.images.length > 0
      ? auction.images
      : auction.image
        ? [auction.image]
        : [];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex];

  return (
    <section className="min-w-0">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={auction.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <ImageIcon size={42} strokeWidth={1.5} />
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white ${
                selectedIndex === index
                  ? "border-indigo-600"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
