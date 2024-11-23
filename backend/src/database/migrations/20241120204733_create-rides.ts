import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('rides', (table) => {
    table.increments('id').primary()//
    table.timestamp('date').defaultTo(knex.fn.now()).notNullable() //
    table.string('origin').notNullable()// //
    table.string('destination').notNullable()// //
    table.integer('distance').notNullable()// //
    table.string('duration').notNullable()// //
    table.string('customer_id').notNullable()// //
    table.integer('driver_id').notNullable().references('id').inTable('drivers').onDelete('CASCADE')//
    table.decimal('value').notNullable()//
  })

}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('rides')
}

