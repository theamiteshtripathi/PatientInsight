class EmergencyDetector:
    def __init__(self):
        self.emergency_symptoms = {
            "chest pain",
            "difficulty breathing",
            "stroke",
            "heart attack",
            "unconscious",
            "severe bleeding",
            "suicidal thoughts",
        }
    
    def check_emergency(self, text: str) -> tuple[bool, str]:
        """
        Check if the text contains any emergency symptoms
        Returns: (is_emergency, message)
        """
        text_lower = text.lower()
        for symptom in self.emergency_symptoms:
            if symptom in text_lower:
                return True, f"⚠️ EMERGENCY ALERT: {symptom} detected. Please seek immediate medical attention!"
        return False, "" 