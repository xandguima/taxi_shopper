import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('drivers',(table)=>{
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.string('car').notNullable()
    // Campo para armazenar o objeto JSON contendo a avaliação
    table.string('review').notNullable()
    // A estrutura esperada é:
    //   - rating: (Inteiro) Avaliação de 1 a 5.
    //   - comment: (Texto) Comentário sobre o produto ou serviço.        
    table.decimal('rate').notNullable()
    table.integer('min_distance').notNullable()                                  
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('drivers')
}

