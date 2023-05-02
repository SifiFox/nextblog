import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:
        "163024832145-aqv8uc4r0s0kcb8ns0fdagsas09hnruh.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
};

export default NextAuth(authOptions);
