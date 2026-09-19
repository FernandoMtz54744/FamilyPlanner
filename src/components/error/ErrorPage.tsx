import { AlertCircle } from "lucide-react";

export default function ErrorPage({ text }: { text: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Algo salió mal
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
