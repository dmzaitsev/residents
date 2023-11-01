import { SQLService } from './../services/sql.service';
import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('residents')
@ApiTags('residents')
export class ResidentController {
  constructor(
    private readonly httpService: HttpService,
    private readonly sqlService: SQLService,
  ) {}

  @Get('/population')
  @ApiOperation({ summary: 'Get city population' })
  @ApiQuery({
    name: 'city',
    required: false,
    description: 'Filter by city name',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
  })
  @ApiResponse({
    status: 200,
    description: 'cities_population: [...], city_members: [...]',
  })
  async getCityPopulation(
    @Query('city') city: string,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to limit 10
  ) {
    const offset = (page - 1) * limit;
    if (offset < 1) {
      throw new HttpException('Wrong page or limit', HttpStatus.BAD_REQUEST);
    }
    const loggingData = {
      requestDuration: 0,
      requestData: { city, page, limit },
      responseData: {},
      httpStatus: 200,
    };

    const startTime = performance.now();
    // Raw SQL query to fetch the population data !!!Injection risk
    let populationQuery = `
      SELECT cities.name AS city, COUNT(residents.id) AS count
      FROM cities
      LEFT JOIN residents ON cities.id = residents.city_id
    `;

    if (city) {
      populationQuery += ` WHERE cities.name ILIKE :city`;
    }

    // !!!Injection risk
    populationQuery += `
      GROUP BY cities.name
      ORDER BY count DESC
      LIMIT :limit
      OFFSET :offset
    `;

    // Raw SQL query to fetch city members with the same first name !!!Injection risk
    const cityMembersQuery = `
     SELECT cities.name AS city, residents.first_name, COUNT(residents.id) AS count
     FROM cities
     LEFT JOIN residents ON cities.id = residents.city_id
     GROUP BY cities.name, residents.first_name
   `;

    let cities_population, city_members;

    try {
      cities_population = await this.sqlService.execQuery(populationQuery, {
        city: `%${city}%`, // Use ILIKE for case-insensitive matching
        limit,
        offset,
      });
      city_members = await this.sqlService.execQuery(cityMembersQuery);
      loggingData.requestDuration = startTime - performance.now();
      loggingData.responseData = { cities_population, city_members };
    } catch (error) {
      loggingData.requestDuration = startTime - performance.now();
      loggingData.httpStatus = 400; //Depends on error type, by default just 400
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    this.httpService.post('http://localhost:8765/logging', loggingData);

    return { cities_population, city_members };
  }
}
