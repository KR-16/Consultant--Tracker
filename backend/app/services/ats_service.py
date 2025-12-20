import random

class ATSService:
    @staticmethod
    def calculate_score(resume_text: str, job_description: str) -> float:


        score = 0
        job_words = set(job_description.lower().split())
        score = random.uniform(30, 70)
        
        if resume_text and len(resume_text) > 50:
             score += random.uniform(5, 20)
             
        return min(round(score, 1), 99.9)