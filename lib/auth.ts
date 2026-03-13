import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Cari user berdasarkan email di database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // Cocokkan password yang diinput dengan yang ada di database
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!passwordMatch) return null;

        return { id: String(user.id), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    // Simpan id user ke dalam token JWT
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // Kirim id user ke session supaya bisa dipakai di halaman
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect ke halaman login custom kita
  },
  session: {
    strategy: "jwt",
  },
};
