import { NextResponse } from 'next/server';

export async function GET() {
  const farcasterManifest = {
    accountAssociation: {
      header: "eyJmaWQiOjMzNDA5NzgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMjNlM0JCMEExNDE3MzJmMTFlMkUxQ2QyZDFjRTFCRjc4Yjg5NTE2In0",
      payload: "eyJkb21haW4iOiJubGEtdGVtcGxhdGUudmVyY2VsLmFwcCJ9",
      signature: "e9GUuAqSVqKZUjTTFi/zxrYdt5qkMdoCaEycRfXBcvxzDWA819sl7o1ktc5PYAc7B4kYmjUwAt3l9eZNCzyzzBs="
    },
    frame: {
      version: "1",
      name: "NLA Templates",
      iconUrl: "https://nla-template.vercel.app/apple-touch-icon.svg",
      homeUrl: "https://nla-template.vercel.app",
      imageUrl: "https://nla-template.vercel.app/og-image.svg",
      buttonTitle: "Open NLA Templates",
      splashImageUrl: "https://nla-template.vercel.app/apple-touch-icon.svg",
      splashBackgroundColor: "#07090e",
      webhookUrl: "https://nla-template.vercel.app/api/webhook"
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
