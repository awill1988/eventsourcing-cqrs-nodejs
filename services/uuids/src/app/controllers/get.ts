import {Request, Response} from 'express';
import getMAC from 'getmac';

class SequenceGenerator {
  // Custom Epoch (January 1, 2015 Midnight UTC = 2015-01-01T00:00:00Z
  static readonly CUSTOM_EPOCH = 1420070400000n;
  static lastTimestamp = -1n;

  readonly #nodeId: bigint;
  readonly #NODE_ID_BITS = 10;
  readonly #SEQUENCE_BITS = 12;
  readonly #maxNodeId: bigint = BigInt.asUintN(64, BigInt(Math.pow(2, this.#NODE_ID_BITS) - 1));
  readonly #maxSequence: bigint = BigInt.asUintN(64, BigInt(Math.pow(2, this.#SEQUENCE_BITS) - 1));

  #sequence = 0n;

  constructor(nodeId?: bigint) {
    if (nodeId && (nodeId < 0 || nodeId > this.#maxNodeId)) {
      throw new Error(`NodeId must be between 0 and ${this.#maxNodeId}`);
    }
    this.#nodeId = nodeId ?? SequenceGenerator.generateNodeId();
  }

  public nextId(): string {
    let currentTimestamp = SequenceGenerator.timestamp();
    if(currentTimestamp < SequenceGenerator.lastTimestamp) {
      throw new Error("Invalid System Clock!");
    }
    if (currentTimestamp == SequenceGenerator.lastTimestamp) {
      this.#sequence = (this.#sequence + 1n) & this.#maxSequence;
      if (this.#sequence === 0n) {
        // Sequence Exhausted, wait till next millisecond.
        currentTimestamp = SequenceGenerator.waitNextMillis(currentTimestamp);
      }
    } else {
      // reset sequence to start with zero for the next millisecond
      this.#sequence = 0n;
    }

    SequenceGenerator.lastTimestamp = currentTimestamp;

    let id = currentTimestamp << BigInt(this.#NODE_ID_BITS + this.#SEQUENCE_BITS);
    id |= BigInt.asUintN(64, this.#nodeId << BigInt(this.#SEQUENCE_BITS));
    id |= this.#sequence;
    return id.toString(10);
  }

  static waitNextMillis(currentTimestamp: bigint) {
    while (currentTimestamp == SequenceGenerator.lastTimestamp) {
      currentTimestamp = SequenceGenerator.timestamp();
    }
    return currentTimestamp;
  }

  static timestamp() {
    return BigInt((new Date()).getTime()) - SequenceGenerator.CUSTOM_EPOCH;
  }

  static generateNodeId = (): bigint => {
    const macAddress = getMAC();
    let macAddressHash = 0;
    for (let i = 0; i < macAddress.length; i++) {
      const character = macAddress.charCodeAt(i);
      macAddressHash = ((macAddressHash<<5)-macAddressHash)+character;
      macAddressHash = macAddressHash & macAddressHash; // Convert to 32bit integer
    }
    return BigInt.asUintN(64, BigInt(macAddressHash));
  }
}

const generator = new SequenceGenerator();

export default (
  req: Request<unknown>,
  res: Response,
): Response => {
  const data: string[] = [];
  const count = req.query.count ?? 1;
  for (let i = 0; i < count; i++) {
    data.push(generator.nextId())
  }
  return res
    .status(201)
    .send({
      data,
    });
}
