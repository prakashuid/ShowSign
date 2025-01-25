"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import bandgPhoto from "../../../../public/images/CustImages/BandG.png";
import { combineItemsByCoreIdentifier } from "@/utils/helper";
import { unstable_noStore as noStore } from "next/cache";

interface LocalCombinedItem {
  signature: any;
  capture: any;
}

const confettiDefaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
};

const SignIn: React.FC = () => {
  const router = useRouter();
  const [isSignatureReady, setIsSignatureReady] = useState(false);
  const [brideAndGoomImage, setBrideAndGoomImage] = useState<string | null>(null);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [marriageDate, setMarriageDate] = useState("");
  const [imagesData, setImagesData] = useState<LocalCombinedItem[]>([]);
  const prevDataLength = useRef<number>(0);

  useEffect(() => {
    const brideName = sessionStorage.getItem("brideName") || "";
    const groomName = sessionStorage.getItem("groomName") || "";
    const marriageDate = sessionStorage.getItem("marriageDate") || "";
    const uploadedPhoto = sessionStorage.getItem("uploadedPhoto");
    setBrideName(brideName);
    setGroomName(groomName);
    setMarriageDate(marriageDate);
    setBrideAndGoomImage(uploadedPhoto);

    // Initial fetch
    fetchImages();

    // Set up polling every 10 seconds
    const intervalId = setInterval(fetchImages, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchImages = async () => {
    try {
      const headers: Record<string, string> = {};
      noStore();
      const timestamp = Date.now();
      const response = await fetch(`/api/file?t=${timestamp}`, {
        headers: headers as HeadersInit,
        method: "GET",
        next: { revalidate: 6 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blob URLs: ${response.status}`);
      }

      const data = await response.json();
      const combinedItems = combineItemsByCoreIdentifier(data);

      const localCombinedItems: LocalCombinedItem[] = combinedItems.map((item) => ({
        capture: item.captured,
        signature: item.signature,
      }));

      if (localCombinedItems.length !== prevDataLength.current) {
        setImagesData(localCombinedItems);
        setIsSignatureReady(true);
        prevDataLength.current = localCombinedItems.length;
        handleConfetti();
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const handleConfetti = () => {
    confetti({
      ...confettiDefaults,
      particleCount: 140,
      scalar: 2.2,
      shapes: ["star"],
    });
    confetti({
      ...confettiDefaults,
      particleCount: 110,
      scalar: 0.75,
      shapes: ["circle"],
    });
    setTimeout(() => setIsSignatureReady(false), 6000);
  };

  const settingsHandler = () => {
    router.push("/settings");
  };

  
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-center align-middle">
        {/* Left Section */}
        <div className="w-full p-5 sm:w-1/2 xl:w-1/2">
          <div className="flex h-[652px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-bandgBg bg-cover bg-center text-center">
            <Image
              src={brideAndGoomImage || bandgPhoto}
              alt="Logo"
              width={300}
              height={400}
              className="h-[400px] w-[300px]"
            />
            <div className="-mt-5 flex w-full items-center justify-center">
              <button className="text-md h-[180px] w-3/4 rounded-2xl bg-myButton bg-cover bg-center p-5 font-bold text-white">
                <span className="text-4xl font-bold">
                  {brideName} {brideName ? "&" : ""} {groomName}
                </span>
                <br />
                <span>{marriageDate}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-5 w-full h-[650px] sm:w-1/2 xl:w-1/2 overflow-y-auto">
          <div className="flex w-full flex-wrap justify-start">
            {imagesData.map((item, i) => (
              <div key={i} className="w-[120px] m-1 h-[160px] cursor-pointer overflow-hidden rounded-[10px] bg-gray shadow-1">
                <Image src={item.capture?.url} width={100} height={100} alt="Capture" />
                <Image src={item.signature?.url} width={160} height={160} className="mt-4 rounded-full" alt="Signature" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end pb-5 mr-10">
        <button
          className="rounded-2xl bg-myButton bg-cover font-bold text-white md:h-[40px] md:w-[100px] lg:h-[42px] lg:w-[135px]"
          onClick={settingsHandler}
        >
          Settings
        </button>
      </div>

      {/* Confetti Modal */}
      {isSignatureReady && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="relative flex flex-col items-center rounded-lg bg-white p-5 text-center shadow-lg">
      <div className="mb-6">
        <button
          className="color-black absolute right-2 top-2 rounded-full bg-gray px-1 py-1"
          onClick={() => setIsSignatureReady(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <Image
        alt=""
        className="rounded-xl object-cover"
        src={imagesData[0]?.capture?.url}
        width={500}
        height={100}
      />
      <Image
        alt=""
        className="mt-2 rounded-xl object-cover"
        src={imagesData[0]?.signature?.url
        }
        width={300}
        height={100}
      />
    </div>
  </div>
)}
    </div>
  );
};

export default SignIn;
