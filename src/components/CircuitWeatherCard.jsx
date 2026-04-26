import { useEffect, useMemo, useState } from 'react'

const WEATHER_COPY = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌧️' },
  61: { label: 'Light rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '❄️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  80: { label: 'Rain showers', icon: '🌦️' },
  81: { label: 'Rain showers', icon: '🌧️' },
  82: { label: 'Violent rain showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
}

const formatTemp = (value) => `${Math.round(value)}°`

function CircuitWeatherCard({ t, track }) {
  const [state, setState] = useState({ status: 'idle', payload: null, error: '' })

  const trackLabel = useMemo(() => {
    if (!track) return t('homeWeatherNoTrack')
    return `${track.city}, ${track.country}`
  }, [track, t])

  useEffect(() => {
    if (!track?.city) {
      setState({ status: 'idle', payload: null, error: '' })
      return undefined
    }

    const controller = new AbortController()

    const loadWeather = async () => {
      setState({ status: 'loading', payload: null, error: '' })

      try {
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(track.city)}&count=5&language=en&format=json`,
          { signal: controller.signal }
        )

        if (!geoResponse.ok) throw new Error('geocoding-failed')

        const geoData = await geoResponse.json()
        const candidates = Array.isArray(geoData.results) ? geoData.results : []
        const match =
          candidates.find((item) => item.country?.toLowerCase() === track.country.toLowerCase()) ?? candidates[0]

        if (!match) throw new Error('location-not-found')

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${match.latitude}&longitude=${match.longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
          { signal: controller.signal }
        )

        if (!weatherResponse.ok) throw new Error('weather-failed')

        const weatherData = await weatherResponse.json()
        const current = weatherData.current

        setState({
          status: 'ready',
          payload: {
            placeName: `${match.name}, ${match.country}`,
            temperature: current?.temperature_2m ?? null,
            feelsLike: current?.apparent_temperature ?? null,
            windSpeed: current?.wind_speed_10m ?? null,
            weatherCode: current?.weather_code ?? null,
            updatedAt: current?.time ?? null,
          },
          error: '',
        })
      } catch (error) {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          payload: null,
          error: error instanceof Error ? error.message : 'weather-failed',
        })
      }
    }

    loadWeather()
    return () => controller.abort()
  }, [track?.city, track?.country])

  const weatherCopy = state.payload?.weatherCode != null ? WEATHER_COPY[state.payload.weatherCode] ?? WEATHER_COPY[3] : null

  return (
    <article className="weather-card card">
      <div className="weather-card__topline">
        <div>
          <p className="eyebrow">{t('homeWeatherTitle')}</p>
          <h3>{track ? track.name : t('homeWeatherNoTrackTitle')}</h3>
        </div>
        <span className="weather-card__tag">{t('homeWeatherLive')}</span>
      </div>

      <p className="weather-card__subtitle">{trackLabel}</p>

      {state.status === 'loading' && <div className="weather-card__loading">{t('homeWeatherLoading')}</div>}

      {state.status === 'error' && <div className="weather-card__loading is-error">{t('homeWeatherUnavailable')}</div>}

      {state.status === 'ready' && state.payload && (
        <>
          <div className="weather-card__visual">
            <div className="weather-card__icon">{weatherCopy?.icon ?? '🌤️'}</div>
            <div>
              <strong>{weatherCopy?.label ?? t('homeWeatherFallback')}</strong>
              <span>{state.payload.placeName}</span>
            </div>
          </div>

          <div className="weather-card__metrics">
            <div>
              <span>{t('homeWeatherTemp')}</span>
              <strong>{state.payload.temperature != null ? formatTemp(state.payload.temperature) : '—'}</strong>
            </div>
            <div>
              <span>{t('homeWeatherFeelsLike')}</span>
              <strong>{state.payload.feelsLike != null ? formatTemp(state.payload.feelsLike) : '—'}</strong>
            </div>
            <div>
              <span>{t('homeWeatherWind')}</span>
              <strong>{state.payload.windSpeed != null ? `${Math.round(state.payload.windSpeed)} km/h` : '—'}</strong>
            </div>
          </div>

          <p className="weather-card__footer">
            {t('homeWeatherUpdated')} {state.payload.updatedAt ?? t('homeWeatherNow')}
          </p>
        </>
      )}
    </article>
  )
}

export default CircuitWeatherCard
