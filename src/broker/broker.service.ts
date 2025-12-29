import { Injectable } from "@nestjs/common";
import { BrokerEntry, BrokerStatus, makeSeedBrokers } from "./broker.type";
import { CreateBrokerDto } from "./dto/create-broker.dto";

@Injectable()
export class BrokerService {
  private brokers: BrokerEntry[] = makeSeedBrokers(3); // 처음부터 seed로 시작 (원하면 []도 가능)

  // GET /brokers?status=ONLINE
  findAll(status?: BrokerStatus): BrokerEntry[] {
    if (!status) return this.brokers;
    return this.brokers.filter((b) => b.status === status);
  }

  // POST /brokers
  create(dto: CreateBrokerDto): BrokerEntry {
    const id = (dto as any).id ?? this.brokers.length + 1; // id 필드 DTO에 있으면 dto.id로 바꾸기
    const host = (dto as any).host ?? `broker-${id}.local`;

    const broker: BrokerEntry = {
      id,
      host,
      rack: (dto as any).rack,
      status: dto.status ?? BrokerStatus.ONLINE,
      cpu: (dto as any).cpu ?? 10,
      memory: (dto as any).memory ?? 20,
      disk: (dto as any).disk ?? 30,
      networkIn: (dto as any).networkIn ?? 5,
      networkOut: (dto as any).networkOut ?? 5,
      updatedAt: new Date().toISOString(),
    };

    this.brokers.push(broker);
    return broker;
  }

  // DELETE /brokers (Reset)
  reset(seedCount = 3) {
    const previousLength = this.brokers.length;
    this.brokers = makeSeedBrokers(seedCount);
    return { previousLength, seedCount, items: this.brokers };
  }
}
