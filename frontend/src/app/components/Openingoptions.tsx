import { pieceImageData } from "@/utils/pieces";
import { ButtonGray, ButtonLime } from "./Button";
import Image from "next/image";
import { PieceSymbol } from "chess.js";

const Openingoptions = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const SkillLevel = [
    { piece: "p", level: "New to Chess" },
    {
      piece: "n",
      level: "Beginner",
    },
    { piece: "r", level: "Intermediate" },
    { piece: "q", level: "Advanced" },
  ];

  return (
    <div>
      <dialog id="my_modal_3" className={`modal ${showModal && "modal-open"}`}>
        <form
          method="dialog"
          className="modal-box flex items-center flex-col space-y-4 p-2 bg-stone-900 sm:w-1/2 sm:max-w-[480px] sm:p-10 max-h-screen"
        >
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-neutral-700 text-xl font-semibold"
            onClick={() => {
              setShowModal(false);
            }}
          >
            ✕
          </button>
          <div className="text-center">
            <h3 className="sm:text-4xl text-white font-bold text-2xl ">Play Online Chess</h3>
            <p className="py-2 font-semibold text-neutral-400 text-sm sm:text-xl">
              what is your skill level ?
            </p>
          </div>
          <div className="w-full p-5 flex flex-col space-y-9">
            <div className="w-full flex flex-col space-y-4">
              {SkillLevel.map((skill) => (
                <div className="bg-stone-800 rounded-lg hover:bg-stone-700 w-full overflow-hidden p-2 py-3 gap-2 flex  justify-center items-center">
                  <Image
                    src={pieceImageData(skill.piece as PieceSymbol, "w")}
                    alt={skill.level}
                    width={35}
                    height={35}
                  />
                  <div className="w-1/3">
                    <p className="text-white text-sm font-semibold">
                      {skill.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex flex-col space-y-4">
              <ButtonGray>Play as a Guest</ButtonGray>
              <ButtonLime>Sign Up</ButtonLime>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default Openingoptions;
