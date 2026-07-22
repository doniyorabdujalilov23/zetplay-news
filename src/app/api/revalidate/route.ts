import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ error: "Noto'g'ri token" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const path = (body as { path?: string }).path || "/";

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
