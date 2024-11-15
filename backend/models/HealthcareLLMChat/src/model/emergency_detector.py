class EmergencyDetector:
    def __init__(self):
        self.emergency_symptoms = {
            "chest pain",
            "difficulty breathing",
            "severe headache",
            "stroke",
            "heart attack",
            "unconscious",
            "severe bleeding"
        }
    
    def check_emergency(self, text: str) -> tuple[bool, str]:
        text_lower = text.lower()
        for symptom in self.emergency_symptoms:
            if symptom in text_lower:
                return True, f"⚠️ EMERGENCY ALERT: {symptom} detected. Please seek immediate medical attention!"
        return False, "" 