import { CheckCircle2, Info, RotateCcw } from "lucide-react";

import Button from "../../../components/Button.jsx";
import { useListingForm } from "../hooks/useListingForm.js";

import ListingDetailsSection from "./ListingDetailsSection.jsx";
import ListingImagesSection from "./ListingImagesSection.jsx";
import AuctionSettingsSection from "./AuctionSettingsSection.jsx";

export default function ListingForm() {
  const {
    values,
    images,
    errors,
    submitted,
    submitError,
    submitting,
    fileInputRef,
    updateField,
    addImages,
    removeImage,
    handleSubmit,
    resetForm,
  } = useListingForm();

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {submitted && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <div>
            <p className="font-semibold text-emerald-900">
              Your auction is published
            </p>
            <p className="mt-1 text-sm leading-5 text-emerald-800">
              Your listing has been published to the marketplace.
            </p>
          </div>
        </div>
      )}

      <ListingDetailsSection
        values={values}
        errors={errors}
        onChange={updateField}
      />

      <div className="border-t border-slate-100" />

      <ListingImagesSection
        images={images}
        error={errors.images}
        inputRef={fileInputRef}
        onAdd={addImages}
        onRemove={removeImage}
      />

      <div className="border-t border-slate-100" />

      <AuctionSettingsSection
        values={values}
        errors={errors}
        onChange={updateField}
      />

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
        <div className="flex items-start gap-3">
          <Info size={19} className="mt-0.5 shrink-0 text-indigo-600" />
          <div>
            <p className="text-sm font-semibold text-indigo-950">
              Before you submit
            </p>
            <p className="mt-1 text-sm leading-5 text-indigo-800">
              Check your item description, photos, and starting price.
              Your listing will open for bids as soon as it is published.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={resetForm}
        >
          <RotateCcw size={16} />
          Clear form
        </Button>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Publishing..." : "Publish auction"}
        </Button>
      </div>
      {submitError && (
        <p role="alert" className="text-sm text-red-700">
          {submitError}
        </p>
      )}
    </form>
  );
}