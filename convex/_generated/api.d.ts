/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as lib_admin from "../lib/admin.js";
import type * as lib_media from "../lib/media.js";
import type * as lib_validation from "../lib/validation.js";
import type * as media from "../media.js";
import type * as posts from "../posts.js";
import type * as profile from "../profile.js";
import type * as projects from "../projects.js";
import type * as seedEntity from "../seedEntity.js";
import type * as siteSettings from "../siteSettings.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  http: typeof http;
  "lib/admin": typeof lib_admin;
  "lib/media": typeof lib_media;
  "lib/validation": typeof lib_validation;
  media: typeof media;
  posts: typeof posts;
  profile: typeof profile;
  projects: typeof projects;
  seedEntity: typeof seedEntity;
  siteSettings: typeof siteSettings;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
