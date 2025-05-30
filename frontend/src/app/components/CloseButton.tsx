import { RefObject } from "react";
import { Cross } from "next/dist/client/components/react-dev-overlay/ui/components/errors/dev-tools-indicator/next-logo";

export default function CloseButton({ ref }: { ref: RefObject<any> }) {
  return (
    <button
      className={
        "absolute top-2 right-2 rounded-full bg-blue-500/30 stroke-blue-600 p-2 hover:bg-blue-500/20"
      }
      onClick={() => ref.current?.classList.add("hidden")}
    >
      <Cross />
    </button>
  );
}
