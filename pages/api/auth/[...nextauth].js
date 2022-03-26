import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId:
        '18680040661-t9335igj96o6sh2eciuspn70us7qrdtl.apps.googleusercontent.com',
      clientSecret: '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',
    }),
    // ...add more providers here
  ],
  secret: 'my-super-secret-key',
  // Configure the session.
  session: {
    jwt: true,
    // The session cookie will have the same name as the provider
    fromExtension: true,
  },
  //pages: {
    //signIn: '/signin',
  //},
  callbacks: {
    redirect(url, baseUrl) {
      return 'https://insta-adion.vercel.app/'
    }
  }
})
