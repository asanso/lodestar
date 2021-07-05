import {NumberUintType} from "@chainsafe/ssz";
import {ssz} from "@chainsafe/lodestar-types";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IDatabaseController, Bucket, IDbMetrics} from "@chainsafe/lodestar-db";

export class PreGenesisStateLastProcessedBlock {
  private readonly bucket: Bucket;
  private readonly type: NumberUintType;
  private readonly db: IDatabaseController<Buffer, Buffer>;
  private readonly key: Buffer;
  private readonly metrics?: IDbMetrics;

  constructor(config: IBeaconConfig, db: IDatabaseController<Buffer, Buffer>, metrics?: IDbMetrics) {
    this.db = db;
    this.type = ssz.Number64;
    this.bucket = Bucket.phase0_preGenesisStateLastProcessedBlock;
    this.key = Buffer.from(new Uint8Array([this.bucket]));
    this.metrics = metrics;
  }

  async put(value: number): Promise<void> {
    this.metrics?.dbWrites.labels({bucket: "phase0_preGenesisStateLastProcessedBlock"}).inc();
    await this.db.put(this.key, this.type.serialize(value) as Buffer);
  }

  async get(): Promise<number | null> {
    this.metrics?.dbReads.labels({bucket: "phase0_preGenesisStateLastProcessedBlock"}).inc();
    const value = await this.db.get(this.key);
    return value ? this.type.deserialize(value) : null;
  }

  async delete(): Promise<void> {
    await this.db.delete(this.key);
  }
}
