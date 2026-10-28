export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const LISTING_CATEGORIES = [
  "Electronics",
  "Books",
  "Accessories",
  "Hostel Essentials",
  "Cycles",
  "Others",
];

export const ITEM_CONDITIONS = [
  "New",
  "Like New",
  "Good",
  "Fair",
];

export const AUCTION_DURATIONS = [
  { value: "6", label: "6 hours" },
  { value: "12", label: "12 hours" },
  { value: "24", label: "24 hours" },
  { value: "72", label: "3 days" },
  { value: "168", label: "7 days" },
];

export function validateListing(values, images) {
  const errors = {};

  if (values.title.trim().length < 5) {
    errors.title = "Title must contain at least 5 characters.";
  } else if (values.title.trim().length > 100) {
    errors.title = "Title cannot exceed 100 characters.";
  }

  if (!LISTING_CATEGORIES.includes(values.category)) {
    errors.category = "Please select a valid category.";
  }

  if (!ITEM_CONDITIONS.includes(values.condition)) {
    errors.condition = "Please select the item's condition.";
  }

  if (values.description.trim().length < 20) {
    errors.description =
      "Description must contain at least 20 characters.";
  } else if (values.description.trim().length > 1500) {
    errors.description = "Description cannot exceed 1500 characters.";
  }

  const price = Number(values.startingPrice);

  if (
    values.startingPrice === "" ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isSafeInteger(price)
  ) {
    errors.startingPrice =
      "Enter a positive, whole-number starting price.";
  }

  if (
    !AUCTION_DURATIONS.some(
      (duration) => duration.value === values.duration
    )
  ) {
    errors.duration = "Please select a valid auction duration.";
  }

  if (!values.location.trim()) {
    errors.location = "Enter a campus pickup location.";
  } else if (values.location.trim().length > 120) {
    errors.location = "Location cannot exceed 120 characters.";
  }

  if (images.length === 0) {
    errors.images = "Upload at least one image.";
  } else if (images.length > MAX_IMAGES) {
    errors.images = `You can upload up to ${MAX_IMAGES} images.`;
  } else {
    const invalidType = images.some(
      (image) => !ALLOWED_IMAGE_TYPES.includes(image.file.type)
    );

    const oversized = images.some(
      (image) => image.file.size > MAX_IMAGE_SIZE
    );

    if (invalidType) {
      errors.images = "Only JPG, PNG, and WebP images are allowed.";
    } else if (oversized) {
      errors.images = "Each image must be 5 MB or smaller.";
    }
  }

  return errors;
}