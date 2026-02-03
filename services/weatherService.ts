
import { GeoLocation, WeatherData } from '../types';

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
const MARINE_API = 'https://marine-api.open-meteo.com/v1/marine';

const GEO_CACHE = new Map<string, GeoLocation[]>();

const LOCAL_DB: GeoLocation[] = [
  { id: 900001, name: 'Mazunte', latitude: 15.6639, longitude: -96.5542, country: 'México', admin1: 'Oaxaca' },
  { id: 900002, name: 'Zipolite', latitude: 15.6632, longitude: -96.5126, country: 'México', admin1: 'Oaxaca' },
  { id: 900003, name: 'San Agustinillo', latitude: 15.6675, longitude: -96.5451, country: 'México', admin1: 'Oaxaca' },
  { id: 900004, name: 'Puerto Escondido', latitude: 15.8642, longitude: -97.0767, country: 'México', admin1: 'Oaxaca' },
  { id: 900005, name: 'Cocoyoc', latitude: 18.8742, longitude: -98.9842, country: 'México', admin1: 'Morelos' },
  { id: 900006, name: 'Tulum', latitude: 20.2114, longitude: -87.4653, country: 'México', admin1: 'Quintana Roo' },
  { id: 900007, name: 'Sayulita', latitude: 20.8689, longitude: -105.4408, country: 'México', admin1: 'Nayarit' },
  { id: 900008, name: 'Holbox', latitude: 21.5230, longitude: -87.3789, country: 'México', admin1: 'Quintana Roo' }
];

const normalizeText = (text: string) => 
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

export const searchLocation = async (query: string): Promise<GeoLocation[]> => {
  if (!query || query.trim().length < 2) return [];
  const normalizedQuery = normalizeText(query);
  const cacheKey = `geo_v4:${normalizedQuery}`;
  if (GEO_CACHE.has(cacheKey)) return GEO_CACHE.get(cacheKey)!;

  let results: GeoLocation[] = LOCAL_DB.filter(loc => 
    normalizeText(loc.name).includes(normalizedQuery) || 
    normalizedQuery.includes(normalizeText(loc.name))
  );

  try {
    const url = `${GEO_API}?name=${encodeURIComponent(query)}&count=10&language=es&format=json`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.results) {
        const remote = data.results.map((item: any) => ({
          id: item.id, name: item.name, latitude: item.latitude, longitude: item.longitude,
          country: item.country || '', admin1: item.admin1,
        }));
        results = [...results, ...remote];
      }
    }
  } catch (e) {}

  const uniqueResults = results.reduce((acc: GeoLocation[], current) => {
    const isDuplicate = acc.some(loc => 
      (Math.abs(loc.latitude - current.latitude) < 0.01 && Math.abs(loc.longitude - current.longitude) < 0.01) ||
      (loc.name === current.name && loc.admin1 === current.admin1 && loc.country === current.country)
    );
    if (!isDuplicate) acc.push(current);
    return acc;
  }, []);

  const sortedResults = uniqueResults.sort((a, b) => {
    const aIsMx = a.country.toLowerCase().includes('mex');
    const bIsMx = b.country.toLowerCase().includes('mex');
    return aIsMx && !bIsMx ? -1 : !aIsMx && bIsMx ? 1 : 0;
  }).slice(0, 6);

  if (sortedResults.length > 0) GEO_CACHE.set(cacheKey, sortedResults);
  return sortedResults;
};

const fetchMarineDataWithSnap = async (lat: number, lon: number, start: string, end: string) => {
  const probes = [
    { lat, lon },
    { lat: lat - 0.05, lon },
    { lat, lon: lon - 0.05 },
    { lat, lon: lon + 0.05 },
    { lat: lat + 0.05, lon },
  ];

  for (const probe of probes) {
    const url = `${MARINE_API}?latitude=${probe.lat}&longitude=${probe.lon}&start_date=${start}&end_date=${end}&hourly=sea_surface_temperature&timezone=auto`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.hourly?.sea_surface_temperature?.some((v: any) => v !== null)) {
          return { data, snapLat: probe.lat, snapLon: probe.lon };
        }
      }
    } catch (e) {}
  }
  return null;
};

export function getDailyCondition(params: {
  weathercode: number;
  precipProb: number;
  cloudcover: number;
  date: string;
  sunshine?: number;
  daylight?: number;
}): WeatherData['condition'] {
  const { precipProb, cloudcover, sunshine, daylight } = params;
  const code = Number(params.weathercode) || 0;

  if ([95, 96, 99].includes(code)) return 'thunder';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';

  if (precipProb >= 60) return 'rain';
  if (precipProb >= 35) return 'drizzle';

  const getSunRatioCondition = (): WeatherData['condition'] => {
    const sunRatio = (daylight && daylight > 0 && typeof sunshine === 'number') 
      ? (sunshine / daylight) 
      : null;

    if (sunRatio !== null) {
      if (sunRatio >= 0.60) return 'sun';
      if (sunRatio >= 0.30) return 'partly_cloudy';
      return 'cloudy';
    }

    if (cloudcover >= 75) return 'cloudy';
    if (cloudcover >= 35) return 'partly_cloudy';
    return 'sun';
  };

  if ([0, 1, 2, 3].includes(code)) {
    return getSunRatioCondition();
  }

  switch (code) {
    case 45:
    case 48: return 'fog';
    case 51:
    case 53:
    case 55:
    case 56:
    case 57: return 'drizzle';
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82: return 'rain';
  }

  return getSunRatioCondition();
}

export const getForecast = async (lat: number, lon: number, startDate: string, endDate: string): Promise<WeatherData[]> => {
  const today = new Date();
  const startD = new Date(startDate);
  const diffDays = Math.ceil((startD.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const mode: 'forecast' | 'climatology' = diffDays < 14 ? 'forecast' : 'climatology';
  
  try {
    const weatherUrl = `${FORECAST_API}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,wind_speed_10m_max,sunrise,sunset,relative_humidity_2m_max,cloud_cover_mean,sunshine_duration,daylight_duration&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) return [];
    
    const weatherData = await weatherRes.json();
    const daily = weatherData.daily;
    if (!daily || !daily.time) return [];

    // Alineación de Seguridad: Truncar al mínimo común para evitar desbordamientos
    const arrayLengths = [
        daily.time.length,
        daily.temperature_2m_max.length,
        daily.temperature_2m_min.length,
        daily.weather_code?.length || daily.weathercode?.length || 0
    ].filter(l => l > 0);
    const minLength = Math.min(...arrayLengths);

    let waterTemps: (number | null)[] = new Array(minLength).fill(null);
    let waterSource: WeatherData['waterTempSource'] = 'unavailable';

    try {
        const marineStart = mode === 'forecast' ? startDate : today.toISOString().split('T')[0];
        const marineEnd = mode === 'forecast' 
            ? endDate 
            : new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const marineResult = await fetchMarineDataWithSnap(lat, lon, marineStart, marineEnd);
        
        if (marineResult && marineResult.data.hourly) {
          const rawTemps = marineResult.data.hourly.sea_surface_temperature;
          waterSource = mode === 'forecast' ? 'forecast' : 'climatology';
          
          for (let i = 0; i < minLength; i++) {
            if (mode === 'forecast') {
              const idx = i * 24 + 12;
              const val = rawTemps?.[idx];
              if (val !== undefined && val !== null) waterTemps[i] = Math.round(val);
            } else {
              const validTemps = rawTemps?.filter((v: any) => v !== null) || [];
              if (validTemps.length > 0) {
                const avg = validTemps.reduce((a: number, b: number) => a + b, 0) / validTemps.length;
                waterTemps[i] = Math.round(avg);
              }
            }
          }
        }
    } catch (marineError) {
        console.warn("[Weather Hardening] Marine data skipped due to error.");
    }

    return Array.from({ length: minLength }).map((_, i) => {
      const wCode = daily.weather_code !== undefined ? daily.weather_code[i] : daily.weathercode[i];
      const prob = daily.precipitation_probability_max?.[i] ?? 0;
      const cloud = daily.cloud_cover_mean?.[i] ?? 0;
      const sunshine = daily.sunshine_duration?.[i];
      const daylight = daily.daylight_duration?.[i];
      
      const condition = getDailyCondition({
        date: daily.time[i],
        weathercode: wCode,
        precipProb: prob,
        cloudcover: cloud,
        sunshine,
        daylight
      });

      return {
        date: daily.time[i],
        maxTemp: Math.round(daily.temperature_2m_max[i] ?? 0),
        minTemp: Math.round(daily.temperature_2m_min[i] ?? 0),
        rainProb: prob,
        windSpeed: Math.round(daily.wind_speed_10m_max?.[i] ?? 0),
        humidity: daily.relative_humidity_2m_max?.[i],
        sunrise: daily.sunrise?.[i]?.includes('T') ? daily.sunrise[i].split('T')[1] : (daily.sunrise?.[i] || '--:--'),
        sunset: daily.sunset?.[i]?.includes('T') ? daily.sunset[i].split('T')[1] : (daily.sunset?.[i] || '--:--'),
        waterTemp: waterTemps[i],
        waterTempSource: waterSource,
        cloudCover: cloud,
        condition
      };
    });
  } catch (error) {
    console.error("[Weather Hardening] Critical Failure in getForecast:", error);
    return [];
  }
};
