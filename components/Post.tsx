import React, { useEffect, useState } from 'react'
import { client, urlFor } from '../client'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import Link from 'next/link'

const Post = (props: any) => {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(props.post.liked)
  const [name, setName] = useState('')
  const [img, setImage] = useState('')
  useEffect(() => {
    const query = `*[_type == "post" && _id == "${props.post._id}"]{
      author
    }`
    client.fetch(query).then((author) => {
      // console.log(author[0].author._ref)

      const query2 = `*[_type == "author" && _id == "${author[0].author._ref}"]{
        name,
        image
      }`
      client.fetch(query2).then((hello: any) => {
        // console.log(hello)

        setImage(hello[0]?.image)
        setName(hello[0]?.name)
      })
    })
  }, [])

  return (
    <div className="post flex flex-col">
      <PostHeader post={props.post} img={img} name={name} />
      <PostImage setLiked={setLiked} post={props.post} />
      <PostFooter
        liked={liked}
        setLiked={setLiked}
        post={props.post}
        name={name}
      />
    </div>
  )
}

const PostHeader = (props: any) => {
  return (
    <div className="flex items-center space-x-7 border-2 border-gray-300 bg-white p-5">
      <img
        src={props.img}
        className="mr-2 w-7 rounded-full border-2 border-red-500"
        alt=""
      />

      <p
        className="cursor-pointer transition active:opacity-50"
        onClick={() => {
          Router.push(`/profiles/${props.name}`)
        }}
      >
        {props.name}
      </p>
    </div>
  )
}

const PostImage = (props: any) => {
  const [liking, setLiking] = useState(false)
  const likeAnimation = () => {
    props.setLiked(true)
    setLiking(true)
    client
      .patch(props.post._id) // Document ID to patch
      .set({ liked: true }) // Shallow merge
      .commit() // Perform the patch and return a promise
      .then((res) => {
        console.log('Hurray! You liked it New document:')
        console.log(res)
      })
      .catch((err) => {
        console.error('Oh no, the update failed: ', err.message)
      })
    setTimeout(() => {
      setLiking(false)
    }, 1000)
  }
  return (
    <div
      className={`post-image flex w-full items-center justify-center`}
      onDoubleClick={likeAnimation}
    >
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <symbol id="icon-heart" viewBox="0 0 32 32">
            <path d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z"></path>
          </symbol>
        </defs>
      </svg>

      <svg className={`icon icon-heart ${liking && 'like'}`}>
        <use xlinkHref="#icon-heart"></use>
      </svg>
      <img
        src={urlFor(props?.post?.mainImage).url()!}
        alt="post-image"
        className="w-full"
      />
    </div>
  )
}

const PostFooter = (props: any) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const { data: session } = useSession()
  useEffect(() => {
    const query = `*[_type == "comment" && post._ref == "${props.post._id}"]{
      title,
  post {
    _ref
  },
  postedBy
}`
    client.fetch(query).then((comms: any) => {
      console.log(comms)

      // @ts-ignore
      setComments([...comms])
    })
  }, [])

  // console.log(comments)

  const addComment = (e: any) => {
    e.preventDefault()
    const doc = {
      _type: 'comment',
      title: comment,
      post: {
        _ref: props.post._id,
      },
      postedBy: {
        // @ts-ignore
        _ref: session?.user?.email.split('@')[0],
      },
    }
    client.create(doc).then((res: any) => {
      console.log(res)
      setComment('')
    })
  }

  return (
    <div className="flex w-full flex-col space-y-2 border-2 border-gray-300 bg-white">
      <div>
        <img
          src={
            props.liked
              ? 'https://img.icons8.com/material-outlined/344/like-filled--v1.png'
              : 'https://img.icons8.com/material-outlined/344/like--v1.png'
          }
          className="w-10 cursor-pointer p-2 transition hover:opacity-50"
          alt=""
          onClick={() => {
            props.setLiked(!props.liked)
          }}
        />
      </div>
      <div className="mx-5">
        <span className="mr-4 font-bold">{props.name}</span>
        {props.post.caption}
      </div>
      <div className="mx-6 flex flex-col space-y-1">
        <p className="text-gray-500">Comments</p>
        {comments.map((comment, id) => {
          return (
            <Comment
              // @ts-ignore
              title={comment?.title}
              key={id}
              // @ts-ignore
              sender={comment?.postedBy?._ref}
            />
          )
        })}
      </div>
      <div className="mx-4">
        <Link href="/followers">
          <p className="text-xs text-gray-500">
            {new Date(props.post.publishedAt).toLocaleString()}
          </p>
        </Link>
      </div>
      <form className="flex items-center justify-center border-t-2 border-gray-300 p-2">
        <input
          type="text"
          className="flex-1 outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          className="text-blue-600 disabled:text-blue-200"
          disabled={comment ? false : true}
          onClick={(e) => addComment(e)}
        >
          Post
        </button>
      </form>
    </div>
  )
}

const Comment = (props: any) => {
  return (
    <div className="flex">
      <span className="mr-2 font-semibold">{props.sender}</span> {props.title}
    </div>
  )
}

export default Post
