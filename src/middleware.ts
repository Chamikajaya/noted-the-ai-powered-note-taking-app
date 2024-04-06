import {authMiddleware} from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/"],  // home page is public and doesn't require authentication
});

export const config = {
    matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};