import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';

@Injectable()
export class SQLService {

  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize('database', 'username', 'password', {
      host: 'localhost',
      dialect: 'postgres'
    });
  }

  async execQuery(query: string, replacements = null, raw = true) {
    return await this.sequelize.query(query, { replacements, raw });
  }
}
