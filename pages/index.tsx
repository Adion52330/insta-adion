import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Post from '../components/Post'
import { client } from '../client'

const Home: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (!session?.name) {
      router.push('/signin')
    } else {
      router.push('/')
    }
  }, [])

  useEffect(() => {
    const query = `*[_type == "post"]{
      caption,
  mainImage,
  publishedAt,
  liked,
  comments,
  author,
  _id
 }`
    client.fetch(query).then((posts) => {
      setPosts(posts)
    })
  }, [])

  console.log(posts)

  return (
    <div className="bg-[#fafafa] ">
      <Head>
        <title>Instagram Clone - Adion</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="relative mx-5 my-10 flex max-w-3xl justify-center pb-5 md:mx-auto md:justify-between">
        <div className="flex flex-col space-y-5">
          {posts.map((post) => (
            // @ts-ignore
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="hidden flex-col space-y-3 md:flex">
          <div
            className="flex cursor-pointer items-center justify-center space-x-3"
            onClick={() => {
              router.push('/profile')
            }}
          >
            <img
              src={session?.user?.image!}
              className="w-14 rounded-full"
              alt=""
            />
            <div>
              <p className="text-sm font-bold">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
          <div className="border-2 border-gray-300 bg-white px-4 py-5 text-center">
            Made with 💕 by Adion
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
