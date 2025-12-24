import { Injectable } from "@nestjs/common";
import { SavedSend } from "./send.type";

@Injectable()
export class SendService {
  private send: SavedSend[] = [];

  // GET
  findAll() {
    let data = this.send;

    return { success: true, data, count: data.length };
  }

  // DELETE (id 있으면 단일 삭제, 없으면 전체 삭제)
  remove(id?: number) {
    // 1) 단일 삭제
    if (id !== undefined) {
      this.send = this.send.filter((item) => item.id !== id);
    } else {
      this.send = [];
    }

    // 2) 전체 삭제
    const count = this.send.length;
    this.send.splice(0, this.send.length);
    return { success: true, message: `Cleared ${count} requests` };
  }
}
