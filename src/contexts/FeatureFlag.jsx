import {useState, useMemo, createContext, useContext} from 'react'

const FeatureFlagContext = createContext(null)

export const FeatureFlagProvider = ({ children }) => {
    const [flags, setFlags] = useState({
        darkMode: true,
        renderAll: false
    })

    const contextValue = useMemo(() => {
        return {flags, setFlags}
    }, [flags])

    return(
        <FeatureFlagContext.Provider value={contextValue}>
            {children}
        </FeatureFlagContext.Provider>
    )

}

export const useFeatureFlags = () => {
    const context = useContext(FeatureFlagContext)

    if(context === null) {
        throw new Error("useFeatureFlags must be used within a FeatureFlagProvider")
    }

    return context;
}