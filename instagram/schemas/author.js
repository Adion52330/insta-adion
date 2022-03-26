export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'followers',
      title: 'Followers',
      type: 'number',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'url',
    },
  ],
}
