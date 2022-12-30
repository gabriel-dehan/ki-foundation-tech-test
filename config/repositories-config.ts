import { Container } from 'typedi';
import datasource from 'config/data-source';
import { Base } from 'src/entities/base.model';
import { User } from 'src/entities/user.model';
import { Repository } from 'typeorm';
import { Transaction } from 'src/entities/transaction.model';
import { BankAccount } from 'src/entities/bank-account.model';
import { Brand } from 'src/entities/brand.model';
import { Cashback } from 'src/entities/cashback.model';
import { Merchant } from 'src/entities/merchant.model';
import { IocAdapter } from 'routing-controllers';

// Inspired by https://stackoverflow.com/questions/73928282/how-to-inject-a-repository-with-typedi-and-typeorm

type RepositoriesList = Record<string, Repository<Base>>;

/* Register all entities repositories in typedi */
/* You can extend repositories with additional functionalities using .extend({ method: () => {} }) */
export const useRepositories = (): IocAdapter => {
  const repositories: RepositoriesList = {
    User: datasource.getRepository(User),
    BankAccount: datasource.getRepository(BankAccount),
    Transaction: datasource.getRepository(Transaction),
    Brand: datasource.getRepository(Brand),
    Cashback: datasource.getRepository(Cashback),
    Merchant: datasource.getRepository(Merchant),
  };

  Object.entries(repositories).forEach(([name, repository]) => {
    Container.set(name, repository);
  });
  Container.set('Manager', datasource.manager);

  return Container;
};
