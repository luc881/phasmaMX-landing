import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// ponytail: no next-sanity helper for disabling — Next's own draftMode()
// covers it in three lines, no signature/secret needed to turn preview off.
export async function GET(request: Request) {
  (await draftMode()).disable();

  // Solo se acepta una ruta interna. La ruta es pública y sin autenticación
  // (desactivar el preview no es sensible), pero pasar el parámetro tal cual
  // a redirect() la convierte en un open redirect: tanto `https://evil.com`
  // como el protocol-relative `//evil.com` sacarían al visitante del dominio
  // desde un enlace que parece nuestro.
  const requested = new URL(request.url).searchParams.get("redirectTo");
  const redirectTo = requested && /^\/(?!\/)/.test(requested) ? requested : "/";

  redirect(redirectTo);
}
