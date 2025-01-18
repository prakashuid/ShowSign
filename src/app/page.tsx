import ECommerce from "@/components/Dashboard/E-commerce";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HomePage from "./home/page";
import React from "react";

export const metadata: Metadata = {
  title:
    "Signature Cap | Drizzeal by Prakash",
  description: "This is a Signature Cap by Drizzeal",
};

export default function Home() {
  return (
    <>
    <div>
      <HomePage />
    </div>
      {/* <DefaultLayout>
        <ECommerce />
      </DefaultLayout> */}
    </>
  );
}
