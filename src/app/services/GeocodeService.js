import axios from 'axios';

class GeocodeService {
    constructor() {
        this.geocodeServiceUrl = process.env.GEOCODER_URL;
        this.api = axios.create({
            baseURL: this.geocodeServiceUrl
        });
    }

    async geocodificarEndereco({ endereco, cep, numero, bairro, cidade, estado }) {
        try {
            const response = await this.api.get('/findAddressCandidates', {
                params: {
                    f: 'json',
                    address: endereco,
                    address2: numero,
                    neighborhood: bairro,
                    city: cidade,
                    postal: cep,
                    RegionAbbr: estado
                }
            });
            const { candidates } = response.data;
            let point = { 
                type: 'Point', 
                coordinates: [0,0], 
                crs: { type: 'name', properties: { name: 'EPSG:4326'} } 
            };
            if (candidates.length > 0) {
                const coordenadas = candidates[0].location;
                point.coordinates = [coordenadas.x,coordenadas.y];
            }
            return point;
        } catch (error) {
            console.log(error);
        }
        
    }
}

export default new GeocodeService()

