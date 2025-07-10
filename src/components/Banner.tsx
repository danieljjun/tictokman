'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { saveData, loadData, setupStorageListener } from '@/utils/storage';

const BANNER_STORAGE_KEY = 'bannerData';

export default function Banner() {
  const [bannerImage, setBannerImage] = useState<string>('/uploads/images/default-banner.jpg');
  const [bannerText, setBannerText] = useState<string>('');

  useEffect(() => {
    // 초기 데이터 로드
    const savedBanner = loadData(BANNER_STORAGE_KEY, {
      image: '/uploads/images/default-banner.jpg',
      text: ''
    });
    
    setBannerImage(savedBanner.image);
    setBannerText(savedBanner.text);

    // 데이터 변경 감지 설정
    const cleanup = setupStorageListener(BANNER_STORAGE_KEY, (data) => {
      if (data.image) setBannerImage(data.image);
      if (data.text !== undefined) setBannerText(data.text);
    });

    return cleanup;
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
      <Image
        src={bannerImage}
        alt="Banner"
        fill
        style={{ objectFit: 'cover' }}
        priority
        sizes="100vw"
      />
      {bannerText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 p-4 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              {bannerText}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
} 