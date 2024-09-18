import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPopup,
  OAuthCredential,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import Lottie from 'lottie-react'

import emailAnimation from './email-animation.json'
import { FIREBASE_REGION } from '~/constants'
import { useAuth } from '~/context/UserContext'
import { appleProvider, firebaseApp, firebaseAuth, googleProvider } from '~/services/firebase'
import { classNames } from '~/utils/classNames'

const db = getFirestore(firebaseApp)

type Props = {
  dict: {
    languageCode: 'en' | 'ro' | 'ru'
    title: string
    subtitle: string
    loginWithGoogle: string
    loginWithApple: string
    orEmail: string
    email: string
    signIn: string
    otpTitle: string
    otpSubtitle: string
    otpDidnReceive: string
    otpResend: string
    otpAnotherEmail: string
    otpError: string
    resendIn: string
    oneMomentWeLoggingYouIn: string
  }
}

const SECOND = 1000

const SharedCabinetPage: React.FC<Props> = ({ dict }) => {
  const isLinkProcessing = useRef(false)
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [waitOtp, setWaitOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [lastOtpSent, setLastOtpSent] = useState<number | null>(null)
  const [lastOtpSeconds, setLastOtpSeconds] = useState(0)
  const [confirmingOtp, setConfirmingOtp] = useState(false)

  useEffect(() => {
    if (lastOtpSent) {
      const interval = setInterval(() => {
        const remainingSeconds = Math.ceil(
          (60 * SECOND - (Date.now() - (lastOtpSent || 0))) / SECOND
        )
        setLastOtpSeconds(remainingSeconds)

        if (remainingSeconds === 0) {
          clearInterval(interval)
          setLastOtpSent(null)
        }
      }, SECOND)
      return () => clearInterval(interval)
    }
  }, [setLastOtpSeconds, lastOtpSent, setLastOtpSent, lastOtpSeconds])

  const redirectToCabinet = useCallback(async () => {
    const functions = getFunctions(firebaseApp, FIREBASE_REGION)
    const crossAuth = httpsCallable<void, { token: string }>(functions, 'crossauth')

    try {
      const result = await crossAuth()
      location.href = `${process.env.NEXT_PUBLIC_CABINET_URL}/${dict.languageCode}/auth/landing?token=${result.data.token}`
      // location.href = `http://localhost:3001/${dict.languageCode}/auth/landing?token=${result.data.token}`
    } catch (error) {
      console.error(error)
      setConfirmingOtp(false)
      setOtpError(dict.otpError)
    }
    setLoading(false)
  }, [dict.languageCode, dict.otpError])

  useEffect(() => {
    if (currentUser && !currentUser.isAnonymous) {
      setConfirmingOtp(true)
      redirectToCabinet()
    }
  }, [currentUser, redirectToCabinet])

  const loginWithEmail = async (firstTime = false) => {
    if (lastOtpSent && Date.now() - lastOtpSent < 60000) {
      return
    }
    setLoading(true)
    setOtpError('')
    try {
      if (!firstTime) {
        setLastOtpSeconds(60)
        setLastOtpSent(Date.now())
      } else {
        setLastOtpSent(null)
        setLastOtpSeconds(0)
      }
      window.localStorage.setItem('emailForSignIn', email)

      firebaseAuth.languageCode = dict.languageCode
      setWaitOtp(true)
      await sendSignInLinkToEmail(firebaseAuth, email, {
        url: location.href,
        handleCodeInApp: true,
      })
    } catch (e) {
      console.error(e)
      setOtpError(dict.otpError)
      setWaitOtp(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !currentUser || isLinkProcessing.current) {
      return
    }
    if (isSignInWithEmailLink(firebaseAuth, location.href)) {
      isLinkProcessing.current = true
      setConfirmingOtp(true)
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation')
        if (!email) return
      }
      const credential = EmailAuthProvider.credentialWithLink(email, location.href)
      linkWithCredential(currentUser, credential)
        .then((result) => {
          createOrUpdateUserAccount(result.user)
          redirectToCabinet()
        })
        .catch((error) => {
          if (
            error.code === 'auth/provider-already-linked' ||
            error.code === 'auth/credential-already-in-use' ||
            error.code === 'auth/email-already-in-use'
          ) {
            signInWithCredential(firebaseAuth, credential)
              .then((result) => {
                createOrUpdateUserAccount(result.user)
                redirectToCabinet()
              })
              .catch((err) => {
                console.error(err)
                setConfirmingOtp(false)
                setOtpError(dict.otpError)
                isLinkProcessing.current = false
              })
          } else {
            setConfirmingOtp(false)
            setOtpError(dict.otpError)
            console.error(error)
            isLinkProcessing.current = false
          }
        })
    }
  }, [currentUser])

  const signIn = async (provider, oauthProvider) => {
    setLoading(true)
    try {
      let result
      if (currentUser && currentUser.isAnonymous) {
        result = await linkWithPopup(currentUser, provider)
      } else {
        result = await signInWithPopup(firebaseAuth, provider)
      }
      await createOrUpdateUserAccount(result.user)
      redirectToCabinet()
    } catch (error: any) {
      if (
        error.code === 'auth/provider-already-linked' ||
        error.code === 'auth/credential-already-in-use' ||
        error.code === 'auth/email-already-in-use'
      ) {
        const credential = oauthProvider.credentialFromError(error) as OAuthCredential
        await signInWithCredential(firebaseAuth, credential)
        await createOrUpdateUserAccount(firebaseAuth.currentUser)
        redirectToCabinet()
      } else {
        console.error(error)
        setLoading(false)
      }
    }
  }

  if (confirmingOtp) {
    return (
      <div className="flex flex-1 flex-col justify-center py-0 md:py-36 h-screen md:h-auto sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">
            {dict.oneMomentWeLoggingYouIn}
          </h2>
          <Lottie animationData={emailAnimation} />
        </div>
      </div>
    )
  }

  if (waitOtp) {
    return (
      <div className="flex flex-1 flex-col justify-center py-0 md:py-36 h-screen md:h-auto sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">{dict.otpTitle}</h2>
          <p className="text-center my-4 px-4">{dict.otpSubtitle.replace('{email}', email)}</p>
          <Lottie animationData={emailAnimation} />
          <p className="text-center my-6 text-lg">{dict.otpDidnReceive}</p>
          <div className="flex flex-col">
            <button
              className={classNames(
                'text-center my-2 underline cursor-pointer',
                lastOtpSeconds > 0 ? 'opacity-50 cursor-not-allowed' : ''
              )}
              onClick={() => loginWithEmail()}
              disabled={lastOtpSeconds > 0}
            >
              {lastOtpSeconds
                ? `(${dict.resendIn.replace('{seconds}', lastOtpSeconds.toString())})`
                : dict.otpResend}
            </button>
            <button
              className="text-center my-2 underline cursor-pointer"
              onClick={() => {
                setWaitOtp(false)
                setLastOtpSeconds(0)
                setEmail('')
                setLastOtpSent(null)
              }}
            >
              {dict.otpAnotherEmail}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getUserInfo = (user) => {
    for (const userInfo of user.providerData) {
      if (userInfo.displayName) {
        return { fullName: userInfo.displayName, phoneNumber: userInfo.phoneNumber }
      }
    }
    return { fullName: '', phoneNumber: '' }
  }

  const createOrUpdateUserAccount = async (user) => {
    if (!user) return
    const userRef = doc(db, 'accounts', user.uid)
    const userInfo = getUserInfo(user)

    try {
      await setDoc(
        userRef,
        {
          fullName: user.displayName || userInfo.fullName,
          phoneNumber: user.phoneNumber || userInfo.phoneNumber,
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating user account:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center py-0 md:py-36 h-screen md:h-auto sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">{dict.title}</h2>
        <p className="text-center my-10">{dict.subtitle}</p>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <SocialButton
              onClick={() => signIn(googleProvider, GoogleAuthProvider)}
              className="text-white bg-blue hover:bg-blue-800"
              label={dict.loginWithGoogle}
              disabled={loading}
            />
            <SocialButton
              onClick={() => signIn(appleProvider, OAuthProvider)}
              className="text-white bg-gray-950 hover:bg-gray-700"
              label={dict.loginWithApple}
              disabled={loading}
            />
            <div className="text-center border-b border-slate-300 pb-4">{dict.orEmail}</div>
            <div className="max-w-none">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={dict.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-4 text-gray-900 shadow-sm ring-1 ring-slate-300 placeholder:text-gray-400 focus:ring-1 focus:ring-pink sm:text-sm sm:leading-4"
              />
              <p className="text-center text-xs text-red-500 pt-4">{otpError}</p>
              <SocialButton
                onClick={() => email && loginWithEmail(true)}
                className="text-white bg-pink hover:bg-pink/80 mt-6"
                label={dict.signIn}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SocialButton = ({ onClick, className, label, disabled = false, type = 'button' }) => {
  return (
    <button
      type={type as any}
      className={classNames(
        'w-full flex justify-center py-3 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
        className,
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default SharedCabinetPage
