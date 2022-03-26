import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { signOut, useSession } from 'next-auth/react'
import Router from 'next/router'
import Head from 'next/head'
import { client } from '../client'

const Profile: NextPage = () => {
  const { data: session } = useSession()
  const [followers, setFollowers] = useState(0)
  useEffect(() => {
    if (!session) {
      Router.push('/signin')
    }
    const query = `*[_type == "author" && _id == "${
      session?.user?.email?.split('@')[0]
    }"] {
      followers
    }`
    client.fetch(query).then((author: any) => {
      setFollowers(author[0]?.followers)
    })
  }, [])

  console.log(followers)

  return (
    <div className="bg-[#fafafa] ">
      <Head>
        <title>Profile - Instagram Clone - Adion</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="mx-5 flex max-w-2xl justify-around py-10 md:mx-auto">
        <img
          src={session?.user?.image!}
          className="rounded-full border-4 border-red-600 from-red-600 to-lime-500 p-2"
          alt=""
        />
        <div className="flex  flex-col gap-3">
          <p className="text-4xl">{session?.user?.name}</p>
          <button
            className="rounded-sm border-2 border-gray-900 bg-blue-600 py-1 font-semibold text-white transition active:opacity-50"
            onClick={() => {
              signOut()
              Router.push('/signin')
            }}
          >
            Log Out
          </button>
          <p>
            <strong>Followers</strong> {followers}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile
