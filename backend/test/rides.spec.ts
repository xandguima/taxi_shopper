import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { app } from '../src/app'; // Importe o servidor da sua aplicação
import request from 'supertest';
import { GoogleMapsService } from '../src/services/gcpService';


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
        origin: ' -5.8402654, -35.2171663',
        destination: ' -5.8112867,  -35.2062242'
      }).expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('destination');
        expect(res.body).toHaveProperty('origin');
        expect(res.body).toHaveProperty('duration');
        expect(res.body).toHaveProperty('options');
        expect(res.body).toHaveProperty('routeResponse');
        expect(res.body).toHaveProperty('distance')
      })
  });

  it('Deve retornar erro 400 custommer_id = number', async () => {
    await request(app.server)
      .post('/ride/estimate')
      .send({
        customer_id: 111,
        origin: 'natal shopping natal',
        destination: 'capim macio natal'
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.error_code).toBe('INVALID_DATA');
      });
  });
  it('Deve retornar erro 400 origin = number', async () => {
    await request(app.server)
      .post('/ride/estimate')
      .send({
        customer_id: '0b30db5a-a248-4684-95ca-34969dfd3683',
        origin: 112,
        destination: 'capim macio natal'
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.error_code).toBe('INVALID_DATA');
      });
  });
  it('Deve retornar erro 400 destinacion = number', async () => {
    await request(app.server)
      .post('/ride/estimate')
      .send({
        customer_id: '0b30db5a-a248-4684-95ca-34969dfd3683',
        origin: 'natal shopping natal',
        destination: 111,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.error_code).toBe('INVALID_DATA');
      });
  });
 

 




});
