import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRequestDto } from "./dto/create-request.dto";
import { SavedRequest } from "./request.type";

@Injectable()
export class RequestService {
  private requests: SavedRequest[] = [];

  // GET
  findAll() {
    let data = this.requests;

    return { success: true, data, count: data.length };
  }

  //POST
  create(body: CreateRequestDto) {
    const newRequest: SavedRequest = {
      id: Date.now(),
      name: body.name || "No name",
      method: body.method,
      url: body.url,
    };

    // unshift(최신이 앞)
    this.requests.unshift(newRequest);

    return { success: true, data: newRequest };
  }

  // DELETE (id 있으면 단일 삭제, 없으면 전체 삭제)
  remove(id?: number) {
    // 1) 단일 삭제
    if (typeof id === "number") {
      const idx = this.requests.findIndex((r) => r.id === id);
      if (idx === -1) throw new NotFoundException("Request not found");

      const removed = this.requests.splice(idx, 1)[0];
      return { success: true, data: removed };
    }

    // 2) 전체 삭제
    const count = this.requests.length;
    this.requests.splice(0, this.requests.length);
    return { success: true, message: `Cleared ${count} requests` };
  }
}
