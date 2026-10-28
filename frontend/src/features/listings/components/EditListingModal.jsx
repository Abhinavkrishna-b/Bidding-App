
import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const categories = [
  "Electronics",
  "Books",
  "Accessories",
  "Hostel Essentials",
  "Cycles",
  "Others",
];

const conditions = ["New", "Like New", "Good", "Fair"];

function createInitialValues(listing) {
  return {
    title: listing?.title || "",
    category: listing?.category || "Others",
    condition: listing?.condition || "Good",
    description: listing?.description || "",
    startingPrice: String(listing?.startingPrice ?? ""),
    location: listing?.location || "",
  };
}

export default function EditListingModal({
  listing,
  onClose,
  onSave,
}) {
  const [values, setValues] = useState(() =>
    createInitialValues(listing)
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!listing) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [listing, onClose]);

  if (!listing) return null;

  function updateField(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = values.title.trim();
    const description = values.description.trim();
    const price = Number(values.startingPrice);
    const location = values.location.trim();

    if (title.length < 5 || title.length > 100) {
      setError("Title must contain 5–100 characters.");
      return;
    }

    if (!categories.includes(values.category)) {
      setError("Choose a valid category.");
      return;
    }

    if (!conditions.includes(values.condition)) {
      setError("Choose a valid item condition.");
      return;
    }

    if (
      description.length < 20 ||
      description.length > 1500
    ) {
      setError("Description must contain 20–1500 characters.");
      return;
    }

    if (!Number.isSafeInteger(price) || price <= 0) {
      setError("Starting price must be a positive whole number.");
      return;
    }

    if (!location || location.length > 120) {
      setError("Enter a location of up to 120 characters.");
      return;
    }

    onSave({
      ...values,
      title,
      description,
      startingPrice: price,
      location,
    });
  }

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-listing-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
          <div>
            <h2
              id="edit-listing-title"
              className="text-xl font-bold text-slate-900"
            >
              Edit listing
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your item's information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit listing dialog"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-7"
        >
          {listing.image && (
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-3">
              <img
                src={listing.image}
                alt=""
                className="h-16 w-16 rounded-lg bg-slate-100 object-cover"
              />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Current cover image
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Image replacement will be connected during
                  storage integration.
                </p>
              </div>

              <ImagePlus
                size={19}
                className="ml-auto shrink-0 text-slate-400"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="edit-title"
              className="text-sm font-semibold text-slate-700"
            >
              Item title
            </label>

            <input
              id="edit-title"
              name="title"
              value={values.title}
              onChange={updateField}
              minLength={5}
              maxLength={100}
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-category"
                className="text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="edit-category"
                name="category"
                value={values.category}
                onChange={updateField}
                required
                className={fieldClass}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-condition"
                className="text-sm font-semibold text-slate-700"
              >
                Condition
              </label>

              <select
                id="edit-condition"
                name="condition"
                value={values.condition}
                onChange={updateField}
                required
                className={fieldClass}
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="edit-description"
              name="description"
              value={values.description}
              onChange={updateField}
              rows={4}
              minLength={20}
              maxLength={1500}
              required
              className={`${fieldClass} resize-y`}
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {values.description.length}/1500
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-price"
                className="text-sm font-semibold text-slate-700"
              >
                Starting price (₹)
              </label>

              <input
                id="edit-price"
                name="startingPrice"
                type="number"
                min="1"
                step="1"
                value={values.startingPrice}
                onChange={updateField}
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label
                htmlFor="edit-location"
                className="text-sm font-semibold text-slate-700"
              >
                Pickup location
              </label>

              <input
                id="edit-location"
                name="location"
                value={values.location}
                onChange={updateField}
                maxLength={120}
                required
                className={fieldClass}
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Save changes
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
