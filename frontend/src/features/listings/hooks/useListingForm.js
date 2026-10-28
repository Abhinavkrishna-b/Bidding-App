import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api.js";
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
  minimumBidIncrement: "10",
  duration: "24",
  location: "",
};

export function useListingForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrls = useRef(new Set());

  useEffect(() => {
    const urls = previewUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
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

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateListing(values, images);
    setErrors(validationErrors);
    setSubmitted(false);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("category", values.category);
    formData.append("condition", values.condition);
    formData.append("description", values.description.trim());
    formData.append("startingPrice", values.startingPrice);
    formData.append("minimumBidIncrement", values.minimumBidIncrement);
    formData.append("duration", values.duration);
    formData.append("location", values.location.trim());
    images.forEach(({ file }) => formData.append("images", file));

    setSubmitting(true);
    try {
      const result = await apiRequest("/auctions", {
        method: "POST",
        body: formData,
      });
      setSubmitted(true);
      navigate(`/auctions/${result.auction._id}`, { replace: true });
    } catch (error) {
      setSubmitError(error.message || "Unable to publish your listing.");
    } finally {
      setSubmitting(false);
    }
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
    setSubmitError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return {
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
  };
}