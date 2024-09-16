import { FirebaseOptions, initializeApp } from 'firebase/app'
import { ReCaptchaEnterpriseProvider, initializeAppCheck } from 'firebase/app-check'
import { GoogleAuthProvider, OAuthProvider, browserLocalPersistence, getAuth } from 'firebase/auth'

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const firebaseApp = initializeApp(config)

if (typeof window !== 'undefined') {
  initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_CAPTCHA_KEY as string),
    isTokenAutoRefreshEnabled: true,
  })
}

export const firebaseAuth = getAuth(firebaseApp)
firebaseAuth.setPersistence(browserLocalPersistence)

export const googleProvider = new GoogleAuthProvider()
export const appleProvider = new OAuthProvider('apple.com')
