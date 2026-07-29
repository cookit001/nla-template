import { NextResponse } from 'next/server';

export async function GET() {
  const farcasterManifest = {
    accountAssociation: {
      header: "eyJmaWQiOjMzNDA5NzgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMjNlM0JCMEExNDE3MzJmMTFlMkUxQ2QyZDFjRTFCRjc4Yjg5NTE2In0",
      payload: "eyJkb21haW4iOiJubGEuOXJlYWxtc3N0dWRpb3MubmFtZS5uZyJ9",
      signature: "W5qj1ruluvlPvervV+nXL6gbRsZDVjiobX7tk4RXD5Imqmkm6bbYFcY3MZ1POnl6EwNH9C4FqQkKVfFEKRpekxs="
    },
    frame: {
      version: "1",
      name: "NLA Templates",
      iconUrl: "https://nla.9realmsstudios.name.ng/icon.png",
      homeUrl: "https://nla.9realmsstudios.name.ng",
      imageUrl: "https://nla.9realmsstudios.name.ng/og-image.png",
      buttonTitle: "Open NLA Templates",
      splashImageUrl: "https://nla.9realmsstudios.name.ng/splash.svg",
      splashBackgroundColor: "#07090e",
      webhookUrl: "https://nla.9realmsstudios.name.ng/api/webhook"
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
