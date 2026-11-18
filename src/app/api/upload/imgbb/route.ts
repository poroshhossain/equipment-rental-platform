import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

type ImgbbResponse = {
  success?: boolean;
  data?: {
    url?: string;
    display_url?: string;
    image?: { url?: string };
  };
  error?: { message?: string };
};

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Image uploads aren't configured. Add IMGBB_API_KEY to your environment or paste a direct image link.",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image was provided." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be 5MB or smaller." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const body = new FormData();
    body.append("image", buffer.toString("base64"));
    body.append("name", (file.name || "profile").slice(0, 60));

    const response = await fetch(`${IMGBB_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      body,
      cache: "no-store",
    });

    const result = (await response.json()) as ImgbbResponse;
    const url =
      result.data?.url ?? result.data?.display_url ?? result.data?.image?.url;

    if (!response.ok || !result.success || !url) {
      return NextResponse.json(
        {
          error:
            result.error?.message ??
            "ImgBB rejected the upload. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while uploading. Please try again." },
      { status: 500 },
    );
  }
}
