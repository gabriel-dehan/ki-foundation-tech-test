import { Entity, Column, OneToMany, RelationId, ManyToOne } from 'typeorm';
import { Base } from 'src/entities/base.model';
import { Merchant } from 'src/entities/merchant.model';

@Entity()
export class Brand extends Base {
  @Column()
  name: string;

  // Could be a BLOB or a base64 string if necessary but I would host them on S3 so the URL makes more sense
  @Column({ type: 'text' })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'numeric' })
  cashbackAmountPercentage: number;

  @OneToMany(() => Merchant, (target) => target.brand)
  merchants: Merchant[];
}
