import { getLatLongFromAddress, findClosestBuildingInsights, getDataLayers } from '../SolarApiService';

global.fetch = jest.fn();

describe('SolarApiService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('getLatLongFromAddress returns location on success', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          status: 'OK',
          results: [{ geometry: { location: { lat: 10, lng: 20 } } }]
        }),
      })
    );

    const result = await getLatLongFromAddress('some address');
    expect(result).toEqual({ lat: 10, lng: 20 });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('geocode/json'));
  });

  it('getLatLongFromAddress throws error on failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'ZERO_RESULTS' }),
      })
    );

    await expect(getLatLongFromAddress('invalid address')).rejects.toThrow('Geocoding failed');
  });
});
