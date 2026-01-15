import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DepthContextProps {
    depthStack: string[];
    pushDepth: (label: string) => void;
    popDepth: () => void;
    currentDepth: number;
}

const AtmosphereDepthContext = createContext<DepthContextProps | undefined>(undefined);

export const AtmosphereDepthProvider = ({ children }: { children: ReactNode }) => {
    const [depthStack, setDepthStack] = useState<string[]>([]);

    const pushDepth = (label: string) => {
        setDepthStack(prev => [...prev, label]);
    };

    const popDepth = () => {
        setDepthStack(prev => prev.slice(0, -1));
    };

    const currentDepth = depthStack.length;

    return (
        <AtmosphereDepthContext.Provider value={{ depthStack, pushDepth, popDepth, currentDepth }}>
            {children}
        </AtmosphereDepthContext.Provider>
    );
};

export const useAtmosphereDepth = (): DepthContextProps => {
    const context = useContext(AtmosphereDepthContext);
    if (!context) {
        throw new Error('useAtmosphereDepth must be used within AtmosphereDepthProvider');
    }
    return context;
};
