import { Provider } from "next-auth/providers/index";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { genUniSeq, getIsoTimestr } from "@/backend/utils";
import { saveUser } from "@/backend/service/user";
import { User } from "@/backend/type/type";
import { createCreditUsage } from "@/backend/service/credit_usage";
import { getCreditUsageByUserId } from "@/backend/service/credit_usage";

let providers: Provider[] = [];

// Compute redirect URI from env, fallback to NEXTAUTH_URL if available
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || (NEXTAUTH_URL ? `${NEXTAUTH_URL}/api/auth/callback/google` : undefined);

providers.push(
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    ...(GOOGLE_REDIRECT_URI
      ? {
          authorization: {
            params: {
              redirect_uri: GOOGLE_REDIRECT_URI,
            },
          },
        }
      : {}),
  })
);

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/`;
    },
    async session({ session, token, user }) {
      if (token && token.user) {
        session.user = token.user;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      const hasDb = !!process.env.POSTGRES_URL;
      if (user && user.email && account) {
        if (hasDb) {
          const dbUser: User = {
            uuid: genUniSeq(),
            email: user.email,
            nickname: user.name || "",
            avatar_url: user.image || "",
            signin_type: account.type,
            signin_provider: account.provider,
            signin_openid: account.providerAccountId,
            created_at: getIsoTimestr(),
            signin_ip: "",
          };
          await saveUser(dbUser);
          const creditUsage = await getCreditUsageByUserId(dbUser.uuid);
          if (!creditUsage) {
            await createCreditUsage({
              user_id: dbUser.uuid,
              user_subscriptions_id: -1,
              is_subscription_active: false,
              used_count: 0,
              // 赠送的积分数
              period_remain_count: 5,
              period_start: new Date(),
              period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
              created_at: new Date(),
            });
          }
          token.user = {
            uuid: dbUser.uuid,
            nickname: dbUser.nickname,
            email: dbUser.email,
            avatar_url: dbUser.avatar_url,
            created_at: dbUser.created_at || getIsoTimestr(),
          };
        } else {
          // No DB configured: create a lightweight session user without persistence
          const ephemeralId = `ephemeral-${account.provider}-${account.providerAccountId}`;
          token.user = {
            uuid: ephemeralId,
            nickname: user.name || "",
            email: user.email,
            avatar_url: user.image || "",
            created_at: getIsoTimestr(),
          } as any;
        }
      }
      return token;
    },
  },
};