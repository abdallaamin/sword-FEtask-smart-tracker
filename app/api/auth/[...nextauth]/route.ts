import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// This handler will handle all authentication requests
export const handler = NextAuth({
  providers: [
    // Google OAuth provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    
    // Email/Password provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        // Here you would typically fetch the user from your database
        // For demo purposes, let's use a mock user
        // In a real app, replace this with database lookup
        const mockUsers = [
          {
            id: "1",
            name: "Test User",
            email: "test@example.com",
            password: await bcrypt.hash("password123", 10)
          }
        ];
        
        const user = mockUsers.find(user => user.email === credentials.email);
        
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null;
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email
        };
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  }
});

export { handler as GET, handler as POST } 