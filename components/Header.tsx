import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { client } from '../client'
import Router from 'next/router'

const Header = () => {
  const { data: session } = useSession()
  useEffect(() => {
    if (session?.user) {
      const doc = {
        _type: 'author',
        _id: `${session && session?.user?.email?.split('@')[0]}`,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        followers: 0,
      }
      client.createIfNotExists(doc).then(() => {
        console.log('created')
      })
    }
  }, [session])
  return (
    <div className="sticky top-0 z-10 flex w-full items-center justify-around border-b-2 border-gray-300 bg-white py-4">
      <img
        className="cursor-pointer object-contain transition active:opacity-40"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        onClick={() => {
          Router.push('/')
        }}
        alt=""
      />
      <div className="flex space-x-4">
        <img
          className="icons cursor-pointer object-contain transition active:opacity-40"
          src="https://img.icons8.com/fluency-systems-regular/344/home.png"
          title="home"
          onClick={() => {
            Router.push('/')
          }}
          alt=""
        />
        <img
          onClick={() => {
            Router.push('/addpost')
          }}
          className="icons cursor-pointer object-contain transition active:opacity-40"
          src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/344/external-add-interface-dreamstale-lineal-dreamstale-3.png"
          title="add"
          alt=""
        />
        <img
          className="icons cursor-pointer rounded-full border-2 border-black object-contain transition active:opacity-40"
          src={session?.user?.image!}
          title="profile"
          onClick={() => {
            Router.push('/profile')
          }}
          alt=""
        />
      </div>
    </div>
  )
}

export default Header
