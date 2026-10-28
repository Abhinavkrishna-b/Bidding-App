import { randomUUID } from "node:crypto";
import {
  cancelSellerAuction,
  createAuction,
  getAuction,
  listActiveAuctions,
  listAuctionBids,
  listSellerAuctions,
  submitAuctionBid,
  updateSellerAuction,
} from "../services/auctionService.js";

export async function listActive(_request, response) {
  response.json({ auctions: await listActiveAuctions() });
}

export async function listMine(request, response) {
  response.json({ auctions: await listSellerAuctions(request.user._id) });
}

export async function getById(request, response) {
  response.json({ auction: await getAuction(request.params.auctionId) });
}

export async function listBids(request, response) {
  response.json({ bids: await listAuctionBids(request.params.auctionId) });
}

export async function create(request, response) {
  const files = request.files || [];
  const auction = await createAuction({
    sellerId: request.user._id,
    body: request.body,
    files,
  });

  request.app.get("io")?.emit("auction:updated", {
    id: auction._id.toString(),
    currentBid: null,
    bidCount: 0,
  });
  response.status(201).json({ auction });
}

export async function update(request, response) {
  const auction = await updateSellerAuction({
    sellerId: request.user._id,
    id: request.params.auctionId,
    body: request.body,
    replacementImage: request.file,
  });

  request.app.get("io")?.emit("auction:updated", {
    id: auction._id.toString(),
    currentBid: auction.currentBid,
    bidCount: auction.bidCount,
    status: auction.status,
  });
  response.json({ auction });
}

export async function cancel(request, response) {
  const auction = await cancelSellerAuction({
    sellerId: request.user._id,
    id: request.params.auctionId,
  });

  request.app.get("io")?.emit("auction:updated", {
    id: auction._id.toString(),
    currentBid: auction.currentBid,
    bidCount: auction.bidCount,
    status: auction.status,
  });
  response.json({ auction });
}

export async function placeBid(request, response) {
  const amount = Number(request.body?.amount);
  const requestId =
    typeof request.body?.requestId === "string"
      ? request.body.requestId
      : randomUUID();
  const event = await submitAuctionBid({
    auctionId: request.params.auctionId,
    bidderId: request.user._id,
    amount,
    requestId,
  });

  request.app.get("io")?.to(event.auction.id).emit("bid:placed", event);
  request.app.get("io")?.emit("auction:updated", event.auction);
  response.status(201).json(event);
}
