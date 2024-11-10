from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class MedicalLLM:
    def __init__(self, model_name="microsoft/BioGPT"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        
    def generate_response(self, patient_text, max_length=512):
        inputs = self.tokenizer(patient_text, return_tensors="pt", truncation=True)
        
        outputs = self.model.generate(
            inputs["input_ids"],
            max_length=max_length,
            num_return_sequences=1,
            temperature=0.7,
            do_sample=True
        )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response

# Usage example:
if __name__ == "__main__":
    llm = MedicalLLM()
    patient_text = "Patient presents with fever and persistent cough for 3 days"
    response = llm.generate_response(patient_text)
    print(response)