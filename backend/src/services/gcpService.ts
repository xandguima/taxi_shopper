import axios from "axios";

//const GCP_API_KEY = process.env.GOOGLE_API_KEY;
const GCP_GEOCONTROL_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GCP_DIRECTION_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

export class GoogleMapsService {

  private apiKey: string;

  constructor(keyApiGMaps: string) {
    if (!keyApiGMaps) {
      throw new Error("A chave de API do Google não foi configurada. Verifique o arquivo .env.");
    }
    this.apiKey = keyApiGMaps;
  }

  async getCoordinatesFromAddress(address: string) {
    try {

      console.log("Buscando coordenadas para o endereço:", address);

      const response = await axios.get(GCP_GEOCONTROL_URL, {
        params: {
          address,
          key: this.apiKey,
        },
      });

      const { data } = response;

      if (data.status !== "OK") {
        throw new Error(`Erro ao obter dados de geocodificação do endereço ${address}, results: ${data.status} - ${data.error_message || "Nenhuma dado fornecido"}`);
      }

      if (!data.results || data.results.length === 0) {
        throw new Error("Nenhum resultado encontrado para o endereço fornecido.");
      }

      const location = data.results[0].geometry.location;


      return location;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao obter as coordenadas:", error.message);
        throw new Error(error.message);
      } else {
        console.error("Erro desconhecido:", error);
        throw new Error("Ocorreu um erro desconhecido. Por favor, tente novamente.");
      }
    }
  }
  async getRoute(originLat: number, originLng: number, DestinationLat: number, DestinationLng: number) {
    console.log("Buscando rota para o endereço:", originLat, originLng, DestinationLat, DestinationLng);

    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: originLat,
            longitude: originLng,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: DestinationLat,
            longitude: DestinationLng,
          },
        },
      },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      units: 'METRIC',
    };
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    };
    try {
      const response = await axios.post(GCP_DIRECTION_URL, requestBody, { headers });
     
      return response.data.routes[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar rota: ${error}`);
      }

    }

  }
}