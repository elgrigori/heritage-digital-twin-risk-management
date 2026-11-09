import { toast } from "sonner";
import type { ToastKind } from "@/data/types";

const DURATION = 3400;

/** Single place that turns engine cues into user-visible notifications. */
export function notify(kind: ToastKind, text: string) {
  const options = { duration: DURATION };
  if (kind === "success") toast.success(text, options);
  else if (kind === "warning") toast.warning(text, options);
  else if (kind === "danger") toast.error(text, options);
  else toast(text, options);
}
