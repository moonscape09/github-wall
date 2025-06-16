'use client';
import Image from "next/image";
import dynamic from 'next/dynamic';

const GitHubGlobe = dynamic(() => import('@/components/Globe'), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <GitHubGlobe />
    </div>
  );
}
