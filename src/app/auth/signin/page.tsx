"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import Buttons from "@/app/ui-elements/buttons/page";
import SignatureCanvas from "react-signature-canvas";
import confetti from "canvas-confetti";
import { Camera } from "react-camera-pro";
import bandgPhoto from "../../../../public/images/CustImages/BandG.png";
import { useRouter } from "next/navigation";
import { combineItemsByCoreIdentifier, CombinedItem } from "@/utils/helper";
interface CameraRef {
  takePhoto: () => string;
  // Add any other necessary methods or properties
}

interface LocalCombinedItem {
  signature: any;
  capture: any;
}

const SignIn: React.FC = () => {
  const canvasRef = useRef(null);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const camera = useRef<CameraRef | null>(null);
  const router = useRouter();

  const [camCapture, setCamCapture] = useState(true);
  const [isSelected, setIsSelected] = useState(true);
  const [isSelectedSign, setIsSelectedSign] = useState(true);
  const [isSignatureReady, setIsSignatureReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [ratio, setRatio] = useState(11 / 5);
  const [brideAndGoomImage, setBrideAndGoomImage] = useState<string | null>(
    null,
  );
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [marriageDate, setMarriageDate] = useState("");
  const [imagesDataOnclick, setImagesDataOnclick] = useState<LocalCombinedItem[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);

  React.useEffect(() => {
    const brideName = sessionStorage.getItem("brideName") || "";
    const groomName = sessionStorage.getItem("groomName") || "";
    const marriageDate = sessionStorage.getItem("marriageDate") || "";
    setBrideName(brideName);
    setGroomName(groomName);
    setMarriageDate(marriageDate);
  }, []);

  const confettiDefaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  useEffect(() => {
    if (sigCanvas.current) {
      setIsSignatureReady(true);
    }
  }, [sigCanvas]);

  React.useEffect(() => {
    const uploadedPhoto = sessionStorage.getItem("uploadedPhoto");
    setBrideAndGoomImage(uploadedPhoto);
  }, []);
  const [imagesData, setImagesData] = useState<LocalCombinedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const response = await fetch("/api/file");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch blob URLs");
  //       }
  //       const data = await response.json();
  //       handleConfetti();
  //       const combinedItems = combineItemsByCoreIdentifier(data);
  //       const localCombinedItems: LocalCombinedItem[] = combinedItems.map(
  //         (item) => ({
  //           capture: item.captured,
  //           signature: item.signature,
  //         }),
  //       );

  //       setImagesData(localCombinedItems);
  //       setIsSignatureReady(true);
  //       setLoading(false);
  //     } catch (err) {
  //       setLoading(false);
  //     }
  //   };

  //   fetchImages();
  //   const intervalId = setInterval(fetchImages, 15000);

  //   return () => clearInterval(intervalId);
  // }, []);
  useEffect(() => {
    let lastModified: string | null = null; //Store last modified timestamp
  
    const fetchImages = async () => {
      try {
        const headers: Record<string, string> = {};
        if (lastModified) {
          headers['If-Modified-Since'] = lastModified;
        }
        const response = await fetch("/api/file", { headers });
        if (!response.ok) {
          if (response.status === 304) {
            //Not modified, do nothing
            return;
          } else {
            throw new Error(`Failed to fetch blob URLs: ${response.status}`);
          }
        }
        const data = await response.json();
        lastModified = response.headers.get('Last-Modified'); // Update lastModified
        handleConfetti();
        const combinedItems = combineItemsByCoreIdentifier(data);
              const localCombinedItems: LocalCombinedItem[] = combinedItems.map(
                (item) => ({
                  capture: item.captured,
                  signature: item.signature,
                }),
              );
      
              setImagesData(localCombinedItems);
              setIsSignatureReady(true);
              setLoading(false);      } catch (err) {
        setLoading(false);
        console.error("Error fetching images:", err);
      }
    };
  
    fetchImages();
    const intervalId = setInterval(fetchImages, 15000);
  
    return () => clearInterval(intervalId);
  }, []);
  
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
    setTimeout(() => {
      setIsSignatureReady(false);
    }, 6000);
  };

  const settingsHandler = () => {
    router.push("/settings");
  };
  const imageHandeler = (capture: string, signature: string) => {
    setImagesDataOnclick([{ capture, signature }]);
    console.log(imagesDataOnclick);
    setIsSignatureReady(true);
  }
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex  justify-center align-middle">
        <div className="w-full  p-5 sm:w-1/2 xl:w-1/2">
          <div className=" flex h-[652px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-bandgBg bg-cover bg-center bg-no-repeat text-center  align-middle ">
            <Image
              src={brideAndGoomImage ? brideAndGoomImage : bandgPhoto}
              alt="Logo"
              width={300}
              height={400}
              className=" h-[400px] w-[300px]"
            />
            <div className="-mt-5 flex w-full items-center justify-center">
              <button className="text-md h-[180px] w-3/4  rounded-2xl bg-myButton bg-cover bg-center bg-no-repeat p-5 font-bold text-white">
                <span className="text-4xl font-bold">
                  {brideName} {brideName ? "&" : ""} {groomName}
                </span>
                <br />

                <span className=""> {marriageDate} </span>
              </button>
            </div>
          </div>
        </div>

        <div className=" mt-5 w-full sm:block sm:w-1/2  xl:block xl:w-1/2">
          <div className="flex h-[650px] flex-wrap justify-center overflow-y-auto ">
            {imagesData.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  imageHandeler(item?.capture?.url, item?.signature?.url);
                }}
                className="m-2 w-1/4 cursor-pointer overflow-hidden rounded-[10px] bg-gray shadow-1 dark:bg-gray-dark dark:shadow-card"
              >
                <div className="relative z-20 "></div>
                <div className="">
                  <div className="relative z-30 mx-auto  w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
                    <div className="relative drop-shadow-2">
                      <Image
                        src={item?.capture?.url}
                        width={100}
                        height={100}
                        style={{
                          width: "auto",
                          height: "auto",
                        }}
                        alt="profile"
                      />
                    </div>
                    <div className="mt-4">
                      <Image
                        src={item?.signature?.url}
                        width={160}
                        height={160}
                        className="overflow-hidden rounded-full"
                        alt="profile"
                      />
                    </div>
                  </div>
                  <div className="mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" flex justify-end pb-5 mr-10 ">
        <button
          className="float-right rounded-2xl bg-myButton bg-cover bg-center bg-no-repeat font-bold text-white md:h-[40px] md:w-[100px] lg:h-[42px] lg:w-[135px]"
          onClick={() => {
            settingsHandler();
          }}
        >
          Settings
        </button>
      </div>

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
              src={
                imagesDataOnclick[0]?.capture
                  ? imagesDataOnclick[0]?.capture
                  : imagesData[0]?.capture?.url
              }
              width={500}
              height={100}
            />
            <Image
              alt=""
              className="mt-2 rounded-xl object-cover"
              src={
                imagesDataOnclick[0]?.signature
                  ? imagesDataOnclick[0]?.signature
                  : imagesData[0]?.signature?.url
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
