import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface IBackButtonProps {
  onClick?: () => void;
  title?: string;
}

export const BackButton = (props: IBackButtonProps) => {
  const { onClick, title } = props || {};
  const router = useRouter();

  return (
    <div className="flex flex-row items-center">
      <Button
        className="h-7 w-7"
        onClick={() => {
          if (onClick) {
            onClick?.();
          } else {
            router.back();
          }
        }}
        size="icon"
        variant="outline"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight sm:grow-0">
        {title}
      </h1>
    </div>
  );
};
