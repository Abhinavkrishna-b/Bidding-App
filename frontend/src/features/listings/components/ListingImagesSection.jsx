import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { MAX_IMAGES } from "../utils/listingValidation.js";

export default function ListingImagesSection({
  images,
  error,
  inputRef,
  onAdd,
  onRemove,
}) {
  const canAddMore = images.length < MAX_IMAGES;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Item photos
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add clear photos from different angles. Upload up to {MAX_IMAGES} images.
        </p>
      </div>

      {canAddMore && (
        <div>
          <input
            ref={inputRef}
            id="listing-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onAdd}
            className="sr-only"
          />

          <label
            htmlFor="listing-images"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-9 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <ImagePlus size={24} />
            </span>

            <span className="mt-3 text-sm font-semibold text-slate-800">
              Add photos of your item
            </span>

            <span className="mt-1 text-xs text-slate-500">
              JPG, PNG, or WebP · Maximum 5 MB per image
            </span>

            <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
              <UploadCloud size={17} />
              Choose images
            </span>
          </label>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm leading-5 text-rose-600">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <img
                src={image.preview}
                alt={`Selected item photo ${index + 1}`}
                className="h-36 w-full object-cover sm:h-40"
              />

              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/75 px-2 py-1 text-xs font-medium text-white">
                  Main photo
                </span>
              )}

              <button
                type="button"
                onClick={() => onRemove(image.id)}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm transition hover:bg-rose-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ImagePlus size={14} />
          {images.length} of {MAX_IMAGES} photos selected
        </span>

        {images.length > 0 && (
          <span>The first photo is your main photo.</span>
        )}
      </div>
    </section>
  );
}