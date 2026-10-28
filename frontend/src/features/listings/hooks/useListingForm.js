import { useEffect, useRef, useState } from "react";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGES,
  MAX_IMAGE_SIZE,
  validateListing,
} from "../utils/listingValidation.js";

export const initialValues = {
  title: "",
  category: "",
  condition: "",
  description: "",
  startingPrice: "",
  duration: "24",
  location: "",
};

export function useListingForm() {
  const [values, setValues] = useState(initialValues);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrls = useRef(new Set());

  useEffect(() => {
    return () => {
      previewUrls.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewUrls.current.clear();
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSubmitted(false);
  }

  function addImages(event) {
    const files = Array.from(event.target.files ?? []);

    // Allow the same file to be selected again later.
    event.target.value = "";

    if (!files.length) return;

    const messages = [];
    const validFiles = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        messages.push(`${file.name}: use JPG, PNG, or WebP.`);
      } else if (file.size > MAX_IMAGE_SIZE) {
        messages.push(`${file.name}: maximum size is 5 MB.`);
      } else {
        validFiles.push(file);
      }
    }

    const remaining = Math.max(0, MAX_IMAGES - images.length);
    const acceptedFiles = validFiles.slice(0, remaining);

    if (validFiles.length > remaining) {
      messages.push(`You can upload up to ${MAX_IMAGES} images.`);
    }

    const newImages = acceptedFiles.map((file) => {
      const preview = URL.createObjectURL(file);
      previewUrls.current.add(preview);

      return {
        id: crypto.randomUUID(),
        file,
        preview,
      };
    });

    setImages((current) => [...current, ...newImages]);

    setErrors((current) => ({
      ...current,
      images: messages.join(" ") || "",
    }));

    setSubmitted(false);
  }

  function removeImage(imageId) {
    const image = images.find((item) => item.id === imageId);

    if (image) {
      URL.revokeObjectURL(image.preview);
      previewUrls.current.delete(image.preview);
    }

    setImages((current) =>
      current.filter((item) => item.id !== imageId)
    );

    setErrors((current) => ({
      ...current,
      images: "",
    }));

    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateListing(values, images);
    setErrors(validationErrors);
    setSubmitted(false);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Prototype only: this does not publish or save a listing.
    console.log("Validated listing draft:", {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      startingPrice: Number(values.startingPrice),
      durationHours: Number(values.duration),
      images: images.map(({ file }) => file),
    });

    setSubmitted(true);
  }

  function resetForm() {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
      previewUrls.current.delete(image.preview);
    });

    setValues(initialValues);
    setImages([]);
    setErrors({});
    setSubmitted(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return {
    values,
    images,
    errors,
    submitted,
    fileInputRef,
    updateField,
    addImages,
    removeImage,
    handleSubmit,
    resetForm,
  };
}