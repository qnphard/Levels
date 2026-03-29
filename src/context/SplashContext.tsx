import React, { createContext, useContext } from 'react';

/**
 * True after {@link VideoSplashScreen} has finished its outro (video ended + fade).
 * Used so overlays like the session intention modal don’t cover the splash video.
 */
const SplashFinishedContext = createContext(false);

export function SplashFinishedProvider({
  finished,
  children,
}: {
  finished: boolean;
  children: React.ReactNode;
}) {
  return (
    <SplashFinishedContext.Provider value={finished}>{children}</SplashFinishedContext.Provider>
  );
}

export function useSplashFinished(): boolean {
  return useContext(SplashFinishedContext);
}
