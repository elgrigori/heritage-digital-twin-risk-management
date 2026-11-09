import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SKIN, SKINS, type SkinId } from "@/theme/skins";

const STORAGE_KEY = "hdt-demo-skin";

const isSkinId = (value: string | null): value is SkinId =>
  SKINS.some((skin) => skin.id === value);

/**
 * The skin class lives on <html> so it also reaches portalled surfaces
 * (dialogs, sheets, toasts) that render outside the app root.
 */
export function useSkin() {
  const [skin, setSkin] = useState<SkinId>(() => {
    if (typeof window === "undefined") return DEFAULT_SKIN;
    // ?skin=console|aegean wins, so a look can be linked or projected directly.
    const fromUrl = new URLSearchParams(window.location.search).get("skin");
    if (isSkinId(fromUrl)) return fromUrl;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSkinId(stored) ? stored : DEFAULT_SKIN;
  });

  useEffect(() => {
    const root = document.documentElement;
    SKINS.forEach((s) => root.classList.toggle(`skin-${s.id}`, s.id === skin));
    root.style.colorScheme = skin === "console" ? "dark" : "light";
    try {
      window.localStorage.setItem(STORAGE_KEY, skin);
    } catch {
      // Storage can be unavailable (private mode); the skin still applies.
    }
  }, [skin]);

  const selectSkin = useCallback((id: SkinId) => setSkin(id), []);

  return { skin, setSkin: selectSkin, skins: SKINS };
}
