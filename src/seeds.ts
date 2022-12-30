import { faker } from '@faker-js/faker';
import { User } from 'src/entities/user.model';
import { DataSource } from 'typeorm';
import { BankAccount } from './entities/bank-account.model';
import { Brand } from './entities/brand.model';
import { Merchant } from './entities/merchant.model';

// Small util to map n times asynchrnously
const times = async (n: number, cb: (n: number) => Record<string, any>) =>
  Promise.all(Array(n).fill(null).map(cb));

const randomNumeric = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const seedApplication = async (datasource: DataSource) => {
  /* Users */
  const users = await times(2, async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    };

    await datasource.getRepository(User).save(user);
    return user;
  });

  /* Bank Accounts */
  const bankAccounts = await Promise.all(
    users.map(async (user) => {
      const bankAccount = {
        user,
        IBAN: faker.finance.iban(),
        // BIC: faker.finance.bic(),
        cardId: faker.datatype.uuid(),
      };

      await datasource.getRepository(BankAccount).save(bankAccount);

      return bankAccount;
    }),
  );

  /* Brands */
  const brands = await times(5, async () => {
    const brand = {
      name: `${faker.company.name()} ${faker.company.companySuffix()}`,
      logoUrl: faker.image.imageUrl(),
      description: faker.lorem.paragraph(),
      cashbackAmountPercentage: randomNumeric(1, 100),
    };

    await datasource.getRepository(Brand).save(brand);

    return brand;
  });

  /* Merchants */
  const merchants = await Promise.all(
    brands.map(async (brand) => {
      const isPhysical = faker.datatype.boolean();
      const merchant = {
        brand,
        name: faker.company.name(),
        isPhysical,
        address: isPhysical ? faker.address.streetAddress() : undefined,
        url: !isPhysical ? faker.internet.url() : undefined,
      };

      await datasource.getRepository(Merchant).save(merchant);

      return brand;
    }),
  );

  return {
    users,
    bankAccounts,
    brands,
    merchants,
  };
};
