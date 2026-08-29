import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Configure this projection in the Sanity webhook so the payload carries
// what we need to scope revalidation (see report for the exact GROQ).
interface WebhookPayload {
  _type: string;
  slug?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    // `isValidSignature` is `null` when no secret is configured — treat
    // that the same as `false`. This endpoint is public; never skip auth.
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Missing _type in payload" }, { status: 400 });
    }

    // Type-level tag covers listing pages (catalog, featured, search);
    // the slug-level tag covers just that document's detail page. A
    // species publish never has to revalidate articles or vice versa.
    const tags = [`sanity:${body._type}`];
    if (body.slug) tags.push(`sanity:${body._type}:${body.slug}`);

    // Next 16 exige el perfil de cacheLife como segundo argumento. "max"
    // purga la entrada completa, que es lo que quiere una publicación del
    // CMS; `updateTag` no sirve aquí porque solo vale en Server Actions.
    for (const tag of tags) revalidateTag(tag, "max");

    return NextResponse.json({ revalidated: true, tags });
  } catch (err) {
    console.error("Sanity revalidate webhook error:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
