from backend.models.HealthcareLLMChat.src.model.emergency_detector import EmergencyDetector


def test_emergency_detector():
    detector = EmergencyDetector()
    
    # Test emergency case
    text1 = "I've been having severe chest pain for the last hour"
    is_emergency, message = detector.check_emergency(text1)
    print("Test 1 (Emergency):")
    print(f"Input: {text1}")
    print(f"Is Emergency: {is_emergency}")
    print(f"Message: {message}\n")
    
    # Test non-emergency case
    text2 = "I have a mild headache and feel tired"
    is_emergency, message = detector.check_emergency(text2)
    print("Test 2 (Non-Emergency):")
    print(f"Input: {text2}")
    print(f"Is Emergency: {is_emergency}")
    print(f"Message: {message}")

if __name__ == "__main__":
    test_emergency_detector() 