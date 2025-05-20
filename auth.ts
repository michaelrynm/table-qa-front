import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    CredentialsProvider({
      // Menampilkan form di UI
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Dummy User
        const user = {
          id: "123",
          name: "John Doe",
          email: "user@example.com",
        };

        // Validasi sederhana (gunakan database sebenarnya jika sudah siap)
        if (
          credentials?.email === "user@example.com" &&
          credentials?.password === "password123"
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
