import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { client } from '../client'
import Header from '../components/Header'

const Followers: NextPage = () => {
  const { data: session } = useSession()
  const [num, setNum] = useState(0)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const query = `
    *[_type == "author" && name == "${session?.user?.name}"] {
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

  const addFollowers = (e: any) => {
    e.preventDefault()
    client
      // @ts-ignore
      .patch(user?._id) // Document ID to patch
      // @ts-ignore
      .set({ followers: num }) // Shallow merge
      .commit() // Perform the patch and return a promise
      .then((res) => {
        console.log('Hurray! You liked it New document:')
        console.log(res)
        setTimeout(() => {
          Router.push('/')
        }, 2000)
      })
      .catch((err) => {
        console.error('Oh no, the update failed: ', err.message)
        setTimeout(() => {
          Router.push('/')
        }, 2000)
      })
  }
  return (
    <div>
      <Head>
        <title>Add Followers Baby - Instagram Clone - Adion</title>
      </Head>
      <Header />
      <div className="mx-5 mt-24 flex max-w-2xl items-center justify-center rounded-md border-2 border-gray-300 bg-gray-200 p-5 md:mx-auto">
        <form className="flex flex-col items-center justify-center space-y-5">
          <input
            type="number"
            placeholder="How many followers do you need?"
            className="border-2 border-gray-300 bg-gray-100 p-2 outline-none"
            value={num}
            onChange={(e: any) => setNum(e.target.value)}
          />
          <button
            type="submit"
            className="cursor-pointer rounded-sm border-2 border-gray-100 bg-blue-600 px-5 py-2 font-semibold text-white transition active:opacity-50"
            onClick={(e) => addFollowers(e)}
          >
            Add Followers
          </button>
        </form>
      </div>
    </div>
  )
}

export default Followers
