from agents.resume_agent import ResumeAgents
from IPython.display import Markdown
import os

def test_resume_agents():
    # Initialize the agents
    resume_agents = ResumeAgents()
    crew = resume_agents.create_crew()

    # Test inputs
    job_application_inputs = {
        'job_posting_url': 'https://jobs.lever.co/AIFund/6c82e23e-d954-4dd8-a734-c0c2c5ee00f1',
        'github_url': ''
    }

    print("Starting CrewAI execution...")
    print("This may take several minutes to complete...")
    
    # Execute the crew with the inputs
    result = crew.kickoff(inputs=job_application_inputs)
    
    print("\nCrewAI execution completed!")
    
    # Display the results
    if os.path.exists("tailored_resume.md"):
        print("\nTailored Resume:")
        with open("tailored_resume.md", "r") as f:
            print(f.read())
    
    if os.path.exists("interview_materials.md"):
        print("\nInterview Materials:")
        with open("interview_materials.md", "r") as f:
            print(f.read())
    
    return result

if __name__ == "__main__":
    test_resume_agents() 