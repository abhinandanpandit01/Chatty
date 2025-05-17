import { useState } from "react";
import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import axios from "axios";
import { UserMessage } from "server/src/types/MessageTypes";
import { useSelectedContactStore } from "@/store/UseSelectedContactStore";
import { useUser } from "@clerk/clerk-react";
import { useUserSocket } from "@/store/UseSocketStore";
type FileUploadDialogueProps = {
  modelRef: React.RefObject<HTMLDialogElement | null>;
};

function FileUploadDialogue({ modelRef }: FileUploadDialogueProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const contactInfo = useSelectedContactStore((state) => state.selectedContact);
  const socket = useUserSocket((state) => state.socket);
  const { user: currentUser } = useUser();
  const handleSendFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files?.length == 0 || files == null) {
      toast.error("File or Files must be selected first");
      return;
    }
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    try {
      setLoading(true);
      const responseUploadImages = await axios.post(
        "http://localhost:8000/files/images/postImage",
        formData
      );
      const imageUrls = responseUploadImages.data.data.imageFilesUrl;
      const new_message: UserMessage = {
        senderId: socket?.id as string,
        receiverId: contactInfo.socketId as string,
        message: "",
        senderName: currentUser?.fullName as string,
        receiverName: contactInfo.fullname as string,
        conversationId: "",
        attactments: imageUrls,
      };
      socket?.emit("send_message", new_message);
    } catch (err) {
      toast.error("Failed to upload images");
      console.log("Failed to upload images", err);
    }
    setLoading(false);
    modelRef.current?.close();
  };
  return (
    <dialog className="modal modal-middle" ref={modelRef}>
      <div className="modal-box">
        <div className="modal-action flex flex-col">
          <div className="w-full">
            <input
              type="file"
              className="file-input file-input-primary w-full"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          <form
            method="dialog"
            className="ml-auto flex gap-5 mt-3"
            onSubmit={handleSendFile}
            encType="multipart/form-data"
          >
            <Button
              className={`${
                loading ? "bg-indigo-900" : "bg-indigo-500"
              }  text-white`}
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <span className="animate-pulse">Loading ....</span>
              ) : (
                <span className="flex items-center gap-2">
                  <IoSend />
                  Send
                </span>
              )}
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
