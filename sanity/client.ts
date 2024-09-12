import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: '3v494xc6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token:
    'skLwxbuQudxvXrzTRPTDHIpDlxZcknfD7OEXZB8ZgPKrXApdiECITTDpy2eDo6mlkCtcXIMb7I1tiwYfbgN5N7BRWv2m2WHWdhMOnsEZIG6ILa4i5XTAw83RMKiMu8RnLCPiAzdBMRvZFR187FYeMRjkYmTZu0DVA0iWBl8RhO8egzCOVmaB',
  useCdn: false,
})
