import { useState, useEffect } from 'react';

export const useOnboarding = (userId) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        // Replace with your API call
        const hasCompleted = localStorage.getItem(`onboarding_${userId}`);
        setIsCompleted(!!hasCompleted);
        setShowOnboarding(!hasCompleted);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    if (userId) {
      checkOnboardingStatus();
    }
  }, [userId]);

  const completeOnboarding = async (formData) => {
    try {
      // Replace with your API call to save the data
      localStorage.setItem(`onboarding_${userId}`, 'completed');
      setIsCompleted(true);
      setShowOnboarding(false);
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  return {
    showOnboarding,
    isCompleted,
    completeOnboarding
  };
}; 