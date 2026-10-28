import FormField, { fieldClass } from "./FormField.jsx";
import {
  ITEM_CONDITIONS,
  LISTING_CATEGORIES,
} from "../utils/listingValidation.js";

export default function ListingDetailsSection({
  values,
  errors,
  onChange,
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Item details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Describe your item clearly to help other students make an informed decision.
        </p>
      </div>

      <FormField
        label="Item title"
        htmlFor="title"
        required
        error={errors.title}
        hint="Use a clear name, such as MacBook Air M1."
      >
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={onChange}
          maxLength={100}
          placeholder="Enter item name"
          className={fieldClass}
          aria-invalid={Boolean(errors.title)}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Category"
          htmlFor="category"
          required
          error={errors.category}
        >
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={onChange}
            className={fieldClass}
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Select a category</option>
            {LISTING_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Condition"
          htmlFor="condition"
          required
          error={errors.condition}
        >
          <select
            id="condition"
            name="condition"
            value={values.condition}
            onChange={onChange}
            className={fieldClass}
            aria-invalid={Boolean(errors.condition)}
          >
            <option value="">Select condition</option>
            {ITEM_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField
        label="Description"
        htmlFor="description"
        required
        error={errors.description}
        hint="Mention the item's age, features, condition, and any defects."
      >
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={onChange}
          rows={5}
          maxLength={1500}
          placeholder="Tell buyers what makes this item useful and describe its condition..."
          className={`${fieldClass} resize-y`}
          aria-invalid={Boolean(errors.description)}
        />

        <p className="mt-1 text-right text-xs text-slate-400">
          {values.description.length}/1500 characters
        </p>
      </FormField>
    </section>
  );
}