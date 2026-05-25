import { loadAndProcessGeoTIFF } from '../GeoTIFFProcessor';

// Mock geotiff and proj4 if needed, but here we just check if it's imported and the function is defined
describe('GeoTIFFProcessor', () => {
  it('loadAndProcessGeoTIFF is defined', () => {
    expect(loadAndProcessGeoTIFF).toBeDefined();
  });
});
