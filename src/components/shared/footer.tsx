import { Gift } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 sm:px-6 lg:px-8">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Gift className="h-4 w-4" />
          <span>Вишлистович &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
