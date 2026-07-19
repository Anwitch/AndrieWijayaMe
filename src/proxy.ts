import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isLoginRoute = createRouteMatcher(["/thisisandwitch/login"]);
const isProtectedRoute = createRouteMatcher(["/thisisandwitch(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isLoginRoute(request)) {
    if (await convexAuth.isAuthenticated()) {
      return nextjsMiddlewareRedirect(request, "/thisisandwitch");
    }
    return;
  }

  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/thisisandwitch/login");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
};
