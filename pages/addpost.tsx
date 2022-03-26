import React, { useCallback, useState } from 'react'
import { NextPage } from 'next'
import Header from '../components/Header'
import { useDropzone } from 'react-dropzone'
import Head from 'next/head'
import { client } from '../client'
import { useSession } from 'next-auth/react'
import Router from 'next/router'

const AddPost: NextPage = () => {
  const { data: session } = useSession()
  const [image, setImage] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)
  const [caption, setCaption] = useState('')

  const uploadImage = (e: any) => {
    const selectedFile = e.target.files[0]
    // uploading asset to sanity
    if (
      selectedFile.type === 'image/png' ||
      selectedFile.type === 'image/jpeg'
    ) {
      setWrongImageType(false)
      client.assets
        .upload('image', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document: any) => {
          setImage(document)
          console.log(document)
        })
        .catch((error: any) => {
          console.log('Upload failed:', error.message)
        })
    } else {
      setWrongImageType(true)
    }
  }

  console.log(image)

  const saveBlog = (e: any) => {
    e.preventDefault()
    // @ts-ignore
    if (caption && image) {
      const doc = {
        // @ts-ignore
        _type: 'post',
        caption: caption,
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            // @ts-ignore
            _ref: image?._id,
          },
        },
        author: {
          _type: 'reference',
          // @ts-ignore
          _ref: session?.user?.email.split('@')[0],
        },
        publishedAt: new Date(),
        liked: false,
        comments: [
          {
            _key: 'a10783f1c86a',
            _ref: 'd6e24fd2-9b6d-4a64-8d8e-b3231e19fb84',
            _type: 'reference',
          },
        ],
      }
      client.create(doc).then(() => {
        setCaption('')
        setImage(null)
      })
      setTimeout(() => {
        Router.push('/')
      }, 14000)
    } else {
      alert('Please fill all the fields')
    }
  }

  return (
    <div className="mb-5 h-screen bg-[#fafafa]">
      <Head>
        <title>Add a new Post - Instagram Clone - Adion</title>
      </Head>
      <Header />
      <div className="mx-5 mt-24 flex max-w-2xl items-center justify-center rounded-md border-2 border-gray-300 bg-gray-200 p-5 md:mx-auto">
        <form className="flex flex-col items-center justify-center space-y-5">
          {!image ? (
            <input
              type="file"
              placeholder="Image"
              className="bg-gray-300 p-2 text-lg outline-none"
              onChange={uploadImage}
            />
          ) : (
            <div className="relative h-full">
              <img
                // @ts-ignore
                src={image?.url}
                alt="uploaded-pic"
                className="h-full w-full"
              />
              <button
                type="button"
                className="absolute top-0 right-0 m-2 rounded-full bg-gray-300 px-2 py-1 text-sm font-bold"
                onClick={() => setImage(null)}
              >
                Delete
              </button>
            </div>
          )}
          <div>
            <textarea
              className="resize-none border-2 border-gray-300 bg-gray-100 p-2 outline-none"
              cols={30}
              rows={5}
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div>
            <input
              type="submit"
              value="Post"
              className="cursor-pointer rounded-sm border-2 border-gray-100 bg-blue-600 px-5 py-2 font-semibold text-white transition active:opacity-50"
              onClick={saveBlog}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPost
