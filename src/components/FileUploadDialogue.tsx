import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";
import { MdCancel } from "react-icons/md";

type FileUploadDialogueProps = {
  modelRef: React.RefObject<HTMLDialogElement | null>;
};

function FileUploadDialogue({ modelRef }: FileUploadDialogueProps) {
  const handleSendFile = async (e: React.FormEvent) => {
    e.preventDefault();
    // handle file upload here
  };
  return (
    <dialog className="modal modal-bottom sm:modal-middle" ref={modelRef}>
      <div className="modal-box">
        <div className="modal-action flex flex-col">
          <div className="w-full">
            <input
              type="file"
              className="file-input file-input-primary w-full"
            />
          </div>
          <form
            method="dialog"
            className="ml-auto flex gap-5 mt-3"
            onSubmit={handleSendFile}
          >
            <Button className="bg-indigo-500 text-white" type="submit">
              <IoSend />
              Send
            </Button>
            <Button
              className="bg-red-500 text-white"
              type="button"
              onClick={() => {
                modelRef.current?.close();
              }}
            >
              <MdCancel />
              Close
            </Button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default FileUploadDialogue;
