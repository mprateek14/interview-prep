import React from 'react'
import { FeatureFlagProvider } from '../contexts/FeatureFlag'
import Features from '../components/FeatureFlags/Features'

function FeatureFlag() {
  return (
    <FeatureFlagProvider>
        <div>
            This is the page where we will render stuff based on feature flags. 
            This is important practice on prod to control the rollout of new features and test them with a subset of users before making them available to everyone.

            <Features />
        </div>
    </FeatureFlagProvider>
  )
}

export default FeatureFlag