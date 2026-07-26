import { NextResponse } from 'next/server';

export async function GET() {
  const farcasterManifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    frame: {
      version: "1",
      name: "NLA Templates",
      iconUrl: "https://nla-template.vercel.app/apple-touch-icon.svg",
      homeUrl: "https://nla-template.vercel.app",
      imageUrl: "https://nla-template.vercel.app/og-image.svg",
      buttonTitle: "Open NLA Templates",
      splashImageUrl: "https://nla-template.vercel.app/apple-touch-icon.svg",
      splashBackgroundColor: "#07090e"
    }
  };

  return NextResponse.json(farcasterManifest, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
}
