import {
  addStudentWatchlistItem,
  getStudentDashboard,
  removeStudentWatchlistItem,
} from "../services/dashboardService.js";

export async function getDashboard(request, response) {
  response.json({ dashboard: await getStudentDashboard(request.user._id) });
}

export async function addWatchlistItem(request, response) {
  response.status(201).json({
    watchlistItem: await addStudentWatchlistItem(
      request.user._id,
      request.params.auctionId
    ),
  });
}

export async function removeWatchlistItem(request, response) {
  response.json({
    watchlistItem: await removeStudentWatchlistItem(
      request.user._id,
      request.params.auctionId
    ),
  });
}
