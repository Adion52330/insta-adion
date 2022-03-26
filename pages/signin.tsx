import React, { useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { signIn, useSession } from 'next-auth/react'
import Router from 'next/router'

const Login: NextPage = () => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      Router.push('/')
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] md:space-x-10">
      <Head>
        <title>SignIn - Instagram Clone - Adion</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <img
        className="hidden rounded-3xl bg-gray-900 p-3 md:block"
        src="https://www.instagram.com/static/images/homepage/screenshots/screenshot4.png/a4fd825e3d49.png"
        alt=""
      />
      <div className="flex flex-col space-y-10">
        <div className="flex h-screen w-screen flex-col items-center justify-center space-y-5 border-2 border-gray-300 bg-white md:h-auto md:w-auto md:rounded-sm md:p-10">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
          <div
            className="jutify-center flex cursor-pointer flex-col items-center space-y-3 rounded-sm border-2 bg-[#fafafa] p-5"
            onClick={() => signIn('google')}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/120px-Google_%22G%22_Logo.svg.png?20210618182606"
              alt=""
            />
            <p className="font-bold">Sign In with Google</p>
          </div>
        </div>
        <div className="hidden h-screen w-full flex-col items-center justify-center space-y-5 border-2 border-gray-300 bg-white md:flex md:h-auto md:w-auto md:rounded-sm md:p-10">
          <p>
            Made with 💕 by{' '}
            <a
              href="https://adion.vercel.app"
              className="text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adion
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
