
# Description
## Since it's impossible to add db to git itself - lets assume this file as a migration file where all raw SQL queries described. 

# Setup tables (from task)

```sql
CREATE TABLE "cities" (
  "id" SERIAL NOT NULL,
  "name" character varying NOT NULL,
  "description" character varying NULL,
  CONSTRAINT "PK_589871db156cc7f92942334ab7e" PRIMARY KEY ("id")
);
```
```sql
CREATE TABLE "residents" (
  "id" SERIAL NOT NULL,
  "first_name" character varying NOT NULL,
  "last_name" character varying NOT NULL,
  "city_id" integer NOT NULL,
  CONSTRAINT "PK_589871db156cc7f929424ab7e" PRIMARY KEY ("id")
);
```
```sql
ALTER TABLE "residents" ADD CONSTRAINT "FK_45d515503b0253f6443a4a97cf8" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
```

## Add indexes (we assuming 'Residents' table might has hundreds of millions records) 

### City Name Index:
For the "name" column in the "cities" table, create an index. This will help improve performance when filtering, searching, or joining data based on city names.
```sql
CREATE INDEX idx_cities_name ON cities (name);
```

### First Name Index:
For the "first_name" column in the "residents" table, we can create an index if we frequently search or filter data by residents' first names.
```sql
CREATE INDEX idx_residents_first_name ON residents (first_name);
```
###  Composite Index:
If we often query data from the "residents" table with a combination of city and first name filtering, we can create a composite index on both columns. This can significantly improve query performance for such use cases.
```sql
CREATE INDEX idx_residents_city_first_name ON residents (city_id, first_name);
 ```
### Additional Indexes:
Depending on your application's specific query patterns, we may need to add indexes to other columns used frequently in WHERE clauses or JOIN conditions. Evaluate your query performance and add indexes accordingly

# Swagger -> http://localhost:3000/api
![plot](./Swagger.png)


## Stay in touch
Author - [Dmytro Zaitsev](https://www.linkedin.com/in/zaitsev-dm/)
