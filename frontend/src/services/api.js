const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"
).replace(/\/+$/, "");
export const API_ORIGIN = new URL(API_BASE_URL).origin;

export async function apiRequest(path, { body, ...options } = {}) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(body === undefined || isFormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...(body === undefined
      ? {}
      : { body: isFormData ? body : JSON.stringify(body) }),
  });

  if (response.status === 204) return null;

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error?.message || result?.message || "The request failed."
    );
  }

  return result;
}

export function mapAuction(auction) {
  const primaryImage =
    auction.images?.find((image) => image.isPrimary) || auction.images?.[0];
  const seller =
    typeof auction.seller === "object" ? auction.seller : null;

  return {
    ...auction,
    images: (auction.images || []).map((image) =>
      new URL(typeof image === "string" ? image : image.url, API_ORIGIN).toString()
    ),
    id: auction._id || auction.id,
    sellerId: seller?._id || auction.seller,
    seller: seller?.name || "Campus student",
    currentBid: auction.currentBid ?? 0,
    bidCount: auction.bidCount || 0,
    image: primaryImage?.url ? new URL(primaryImage.url, API_ORIGIN).toString() : "",
    location: auction.pickupLocation || auction.location || "Campus pickup",
    featured: false,
  };
}
