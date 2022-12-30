import { Entity, Column, OneToMany, RelationId, ManyToOne } from 'typeorm';
import { Base } from 'src/entities/base.model';
import { Cashback } from 'src/entities/cashback.model';
import { Brand } from 'src/entities/brand.model';
import { ModelPartial } from 'src/utils/modelPartial';

@Entity()
export class Merchant extends Base {
  constructor(input?: ModelPartial<Merchant>) {
    super(input);
  }

  @RelationId((self: Merchant) => self.brand)
  readonly brandId: Brand['id'];

  @ManyToOne(() => Brand, (target) => target.merchants, {
    nullable: false,
  })
  brand: Brand;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  isPhysical: boolean;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'text', nullable: true })
  url?: string;

  @OneToMany(() => Cashback, (target) => target.merchant)
  cashbacks: Cashback[];
}
