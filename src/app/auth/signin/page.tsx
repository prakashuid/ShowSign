"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import Buttons from "@/app/ui-elements/buttons/page";
import SignatureCanvas from "react-signature-canvas";
import confetti from "canvas-confetti";
import { Camera } from "react-camera-pro";
import bandgPhoto from "../../../../public/images/CustImages/BandG.png";
import { useRouter } from "next/navigation";
import { combineItemsByCoreIdentifier, CombinedItem } from "@/utils/helper";
import { unstable_noStore as noStore } from "next/cache";

interface CameraRef {
  takePhoto: () => string;
}

interface LocalCombinedItem {
  signature: any;
  capture: any;
}

export async function getStaticProps() {
  try {
    const timestamp = Date.now();
    const response = await fetch(`/api/file?t=${timestamp}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();

    const combinedItems = combineItemsByCoreIdentifier(data);
    const localCombinedItems: LocalCombinedItem[] = combinedItems.map((item) => ({
      capture: item.captured,
      signature: item.signature,
    }));

    return {
      props: {
        initialImagesData: localCombinedItems,
      },
      revalidate: 60, // Revalidate every 60 seconds (ISR)
    };
  } catch (error) {
    console.error("Error fetching static data:", error);
    return {
      props: {
        initialImagesData: [],
      },
      revalidate: 60, // Revalidate even if there is an error
    };
  }
}

const SignIn: React.FC<{ initialImagesData: LocalCombinedItem[] }> = ({ initialImagesData }) => {
  const canvasRef = useRef(null);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const camera = useRef<CameraRef | null>(null);
  const router = useRouter();

  const [imagesData, setImagesData] = useState<LocalCombinedItem[]>(initialImagesData);
  const [imagesDataOnclick, setImagesDataOnclick] = useState<LocalCombinedItem[]>([]);
  const [isSignatureReady, setIsSignatureReady] = useState(false);
  const [brideAndGoomImage, setBrideAndGoomImage] = useState<string | null>(null);
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [marriageDate, setMarriageDate] = useState("");

  useEffect(() => {
    const brideName = sessionStorage.getItem("brideName") || "";
    const groomName = sessionStorage.getItem("groomName") || "";
    const marriageDate = sessionStorage.getItem("marriageDate") || "";
    setBrideName(brideName);
    setGroomName(groomName);
    setMarriageDate(marriageDate);

    const uploadedPhoto = sessionStorage.getItem("uploadedPhoto");
    setBrideAndGoomImage(uploadedPhoto);
  }, []);

  const confettiDefaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
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
  };

  const settingsHandler = () => {
    router.push("/settings");
  };

  const imageHandler = (capture: string, signature: string) => {
    setImagesDataOnclick([{ capture, signature }]);
    setIsSignatureReady(true);
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-center align-middle">
        <div className="w-full p-5 sm:w-1/2 xl:w-1/2">
          <div className="flex h-[652px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-bandgBg bg-cover bg-center bg-no-repeat text-center align-middle">
            <Image
              src={brideAndGoomImage || bandgPhoto}
              alt="Logo"
              width={300}
              height={400}
              className="h-[400px] w-[300px]"
            />
            <div className="-mt-5 flex w-full items-center justify-center">
              <button className="text-md h-[180px] w-3/4 rounded-2xl bg-myButton bg-cover bg-center bg-no-repeat p-5 font-bold text-white">
                <span className="text-4xl font-bold">
                  {brideName} {brideName ? "&" : ""} {groomName}
                </span>
                <br />
                <span>{marriageDate}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full h-[650px] sm:block sm:w-1/2 xl:block xl:w-1/2 overflow-y-auto">
          <div className="flex w-full flex-wrap justify-start">
            {imagesData.map((item, i) => (
              <div
                key={i}
                onClick={() => imageHandler(item.capture.url, item.signature.url)}
                className="w-[120px] m-1 h-[160px] cursor-pointer overflow-hidden rounded-[10px] bg-gray shadow-1 dark:bg-gray-dark dark:shadow-card"
              >
                <Image
                  src={item.capture.url}
                  width={100}
                  height={100}
                  alt="Capture"
                  className="w-auto h-auto"
                />
                <Image
                  src={item.signature.url}
                  width={160}
                  height={160}
                  className="overflow-hidden rounded-full"
                  alt="Signature"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-5 mr-10">
        <button
          className="float-right rounded-2xl bg-myButton bg-cover bg-center bg-no-repeat font-bold text-white md:h-[40px] md:w-[100px] lg:h-[42px] lg:w-[135px]"
          onClick={settingsHandler}
        >
          Settings
        </button>
      </div>

      {isSignatureReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative flex flex-col items-center rounded-lg bg-white p-5 text-center shadow-lg">
            <button
              className="absolute right-2 top-2 rounded-full bg-gray px-1 py-1"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              alt=""
              className="rounded-xl object-cover"
              src={imagesDataOnclick[0]?.capture || imagesData[0]?.capture?.url}
              width={500}
              height={100}
            />
            <Image
              alt=""
              className="mt-2 rounded-xl object-cover"
              src={imagesDataOnclick[0]?.signature || imagesData[0]?.signature?.url}
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
