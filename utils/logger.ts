import { datadogRum } from '@datadog/browser-rum'
import { datadogLogs } from '@datadog/browser-logs'

export const initDatadogLogs = () => {
  datadogLogs.init({
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN as string,
    site: 'datadoghq.eu',
    service: 'iasig---web',
    env: process.env.NEXT_PUBLIC_DATADOG_ENV || 'local',

    forwardErrorsToLogs: true,
    sampleRate: 100,
  })
}

export const initDatadogRUM = () => {
  datadogRum.init({
    applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID as string,
    site: 'datadoghq.eu',
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN as string,
    service: 'iasig---web',
    env: process.env.NEXT_PUBLIC_DATADOG_ENV || 'local',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'allow',
    trackUserInteractions: true,
  })
  datadogRum.startSessionReplayRecording()
}

export const logInfo = (msg: string, data?: any) => {
  console.debug(msg, data)
  datadogLogs.logger.info(msg, data)
}

export const logError = (msg: string, data?: any) => {
  console.error(msg, data)
  datadogLogs.logger.error(msg, data)
}

export const initDD = () => {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_DATADOG_LOGS_ENABLED === 'true') {
      initDatadogLogs()
    }
    if (process.env.NEXT_PUBLIC_DATADOG_RUM_ENABLED === 'true') {
      initDatadogRUM()
    }
  }
}
