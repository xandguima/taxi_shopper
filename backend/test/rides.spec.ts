import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { app } from '../src/app'; // Importe o servidor da sua aplicação
import request from 'supertest';
import { execSync } from 'node:child_process'


describe('Testar a rota de estimativa', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
 

  it('Deve retornar uma estimativa válida com dados corretos', async () => {
    await request(app.server)
    .post('/ride/estimate')
    .send({
      customer_id: 'c0ead346-1714-4fea-acc5-4ad5f96c8c64',
      origin: '-23.546, -46.635',
      destination: '-23.546, -46.635'
    }).expect(200)
    .expect(res => {
      console.log("res.body", res.body);
      expect(res.body).toHaveProperty('destination');
      expect(res.body).toHaveProperty('origin');
      expect(res.body).toHaveProperty('duration');
      expect(res.body).toHaveProperty('options');
      expect(res.body).toHaveProperty('routeResponse');
      
      
      
    })

     // Verifica se o status HTTP é 200
  });

  
});
