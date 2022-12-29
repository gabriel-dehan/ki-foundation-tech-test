import { ModelPartial } from 'src/utils/modelPartial';
import {
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Base {
  constructor(input?: ModelPartial<Base>) {
    if (input) {
      // Set all properties on this from input
      Object.entries(input).forEach(([key, value]) => {
        // A bit weird
        (this as any)[key] = value;
      });
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
