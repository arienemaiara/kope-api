import NodeGeocoder from 'node-geocoder';

class GeocodeService {
    constructor() {
        this.geocoder = NodeGeocoder({
            
            apiKey: process.env.API_KEY,
            provider: 'google',
            language: 'pt-BR',
        });
    }

    async geocodificarEndereco({ endereco, cep, numero, bairro, cidade, estado }) {
        const enderecoGeocodificado = await this.geocoder.geocode({
            address: `${endereco} - ${numero}, ${bairro}, ${cidade} - ${estado}`,
            zipcode: cep,
            countryCode: 'br',
        });

        console.log(enderecoGeocodificado);

        if (enderecoGeocodificado.length > 0) {
            return enderecoGeocodificado[0];
        } 

       
    }
}

export default new GeocodeService()

