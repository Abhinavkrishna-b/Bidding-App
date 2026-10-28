import { Clock3, MapPin, IndianRupee } from "lucide-react";
import FormField, { fieldClass } from "./FormField.jsx";
import { AUCTION_DURATIONS } from "../utils/listingValidation.js";

export default function AuctionSettingsSection({
  values,
  errors,
  onChange,
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Auction settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Set the starting price and choose how long the auction should remain active.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Starting price"
          htmlFor="startingPrice"
          required
          error={errors.startingPrice}
          hint="The opening price buyers will bid from."
        >
          <div className="relative">
            <IndianRupee
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="startingPrice"
              name="startingPrice"
              type="number"
              min="1"
              step="1"
              value={values.startingPrice}
              onChange={onChange}
              placeholder="e.g. 1500"
              className={`${fieldClass} pl-10`}
              aria-invalid={Boolean(errors.startingPrice)}
            />
          </div>
        </FormField>

        <FormField
          label="Auction duration"
          htmlFor="duration"
          required
          error={errors.duration}
          hint="How long bidding will remain open."
        >
          <div className="relative">
            <Clock3
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              id="duration"
              name="duration"
              value={values.duration}
              onChange={onChange}
              className={`${fieldClass} pl-10`}
              aria-invalid={Boolean(errors.duration)}
            >
              {AUCTION_DURATIONS.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
        </FormField>
      </div>

      <FormField
        label="Campus pickup location"
        htmlFor="location"
        required
        error={errors.location}
        hint="Enter a suitable public campus meeting point. Do not enter your home address."
      >
        <div className="relative">
          <MapPin
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="location"
            name="location"
            value={values.location}
            onChange={onChange}
            maxLength={120}
            placeholder="e.g. CSE Block or Main Library"
            className={`${fieldClass} pl-10`}
            aria-invalid={Boolean(errors.location)}
          />
        </div>
      </FormField>
    </section>
  );
}