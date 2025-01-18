import React from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  link: string;
  customClasses: string;
  children?: React.ReactNode;
}

const ButtonDefault = ({
  label,
  link,
  customClasses,
  children,
}: ButtonPropTypes) => {
  return (
    <>
      <Link
        className={`inline-flex items-center justify-center ${customClasses}`}
        href={link}
      >
        {children}
        {label}
      </Link>
    </>
  );
};

export default ButtonDefault;
