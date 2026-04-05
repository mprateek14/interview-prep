import React from 'react'
import { useFeatureFlags } from '../../contexts/FeatureFlag'

function Features() {

    const { flags, setFlags } = useFeatureFlags();

    return (
        <>
            <div style={{
                backgroundColor: flags.darkMode ? "inherit" : "white"
            }} > Check dark mode </div>
            <button onClick={() => setFlags(prev => ({ ...prev, darkMode: !prev.darkMode }))}> Toggle dark mode </button>
        </>
    )
}

export default Features