import { io } from "socket.io-client";
import { API_ORIGIN } from "./api.js";

export function connectAuctionSocket() {
  return io(API_ORIGIN, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
}
