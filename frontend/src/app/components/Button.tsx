import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

const ButtonLime = ({ children, onClick }: Props) => {
  return (
    //added a box shadow to the button on hover
    <div className="bg-lime-300/70 w-full flex items-center justify-center rounded-xl text-center shadow-xl sm:text-2xl text-white font-extrabold border border-b-4 border-lime-900/70  hover:bg-[#a3d160] hover:border-lime-900/60 transition-all duration-300 hover:shadow-2xl">
      <button
        className="py-2.5 w-full font-bold"
        style={{
          textShadow: "0 .1rem 0 rgba(0,0,0,.2),0 .3rem 1.6rem rgba(0,0,0,.05)",
        }}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};

const ButtonGray = ({ children, onClick }: Props) => {
  return (
    <div className="bg-neutral-600/70  flex items-center justify-center rounded-xl text-center shadow-xl sm:text-2xl text-white font-bold border border-b-4 border-neutral-800/70 rounded-b-2xl hover:bg-neutral-600 hover:border-neutral-800/30 transition-all duration-300 hover:shadow-2xl">
      <button
        className="py-2.5 w-full font-bold"
        style={{
          textShadow: "0 .1rem 0 rgba(0,0,0,.2),0 .3rem 1.6rem rgba(0,0,0,.05)",
        }}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};

const ChipButton = ({ children, onClick }: Props) => {
  return (
    <button className="btn border-none bg-stone-800 text-sm text-white font-normal hover:bg-stone-900/40 w-auto px-9 border-2 rounded-md lowercase" onClick={onClick}>
      {children}
    </button>
  );
};

export { ButtonLime, ButtonGray, ChipButton };
