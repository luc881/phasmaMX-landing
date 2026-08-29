import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Todo lo que no sea asset, ruta de API o el Studio lleva prefijo de
    // idioma. `api` y `studio` deben quedar fuera: sin ellos, next-intl
    // redirige /api/revalidate a /es/api/revalidate y el webhook de Sanity
    // —y el modo borrador— dejan de existir.
    "/((?!api|_next|_vercel|studio|.*\\..*).*)",
  ],
};
