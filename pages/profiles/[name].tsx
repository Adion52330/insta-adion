import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { client } from '../../client'
import Header from '../../components/Header'

const Name = () => {
  const router = useRouter()
  const { name } = router.query
  const { data: session } = useSession()

  const [user, setUser] = useState([])

  useEffect(() => {
    if (name == session?.user?.name) {
      router.push('/profile')
    }
    const query = `
    *[_type == "author" && name == "${name}"] {
        _id,
        name,
        image,
        email,
        followers
  }
  
      `
    client.fetch(query).then((author: any) => {
      console.log(author)
      setUser(author[0])
    })
  }, [])

  const addANewFollower = (e: any) => {
    //   make the element disabled forever
    e.target.disabled = true
    client
      // @ts-ignore
      .patch(user?._id) // Document ID to patch
      // @ts-ignore
      .set({ followers: user?.followers + 1 }) // Shallow merge
      .commit() // Perform the patch and return a promise
      .then((res) => {
        console.log('Hurray! You liked it New document:')
        console.log(res)
      })
      .catch((err) => {
        console.error('Oh no, the update failed: ', err.message)
      })
    setTimeout(() => {
      Router.push('/')
    }, 1000)
  }

  return (
    <div>
      <Head>
        <title>{name} Profile - Instagram Clone - Adion</title>
      </Head>
      <Header />
      <div className="mx-5 flex max-w-2xl justify-around py-10 md:mx-auto">
        <img
          // @ts-ignore
          src={user?.image}
          className="rounded-full border-4 border-red-600 from-red-600 to-lime-500 p-2"
          alt=""
        />
        <div className="flex  flex-col gap-3">
          <p className="text-4xl">{name}</p>
          <button
            className="rounded-sm border-2 border-gray-900 bg-blue-600 py-1 font-semibold text-white transition active:opacity-50"
            onClick={(e) => {
              addANewFollower(e)
            }}
          >
            Follow
          </button>
          <p>
            {/* @ts-ignore */}
            <strong>Followers</strong> {user?.followers}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Name
