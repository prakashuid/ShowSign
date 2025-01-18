"use client";
import React, { useEffect, useState } from "react";
import SignIn from "../auth/signin/page";

const HomePage: React.FC = () => {
  

  return (
    <div className="h-screen">
      <header className="sticky top-0 z-999 flex h-15 w-full border-stroke bg-white bg-headerBdr bg-cover bg-center bg-no-repeat dark:border-stroke-dark dark:bg-gray-dark"></header>

      

      <SignIn />

      <footer className="sticky top-0 z-999 flex h-15 w-full border-stroke bg-white bg-footerBdr bg-cover bg-center bg-no-repeat dark:border-stroke-dark dark:bg-gray-dark"></footer>
    </div>
  );
};

export default HomePage;
