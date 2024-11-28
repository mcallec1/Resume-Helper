from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from typing import Dict
import os
from PyPDF2 import PdfReader
import tempfile
import markdown
from weasyprint import HTML
import markdown2

from crewai_tools import ( 
  FileReadTool,
  ScrapeWebsiteTool,
  MDXSearchTool,
  SerperDevTool
)

load_dotenv()

search_tool = SerperDevTool()
scrape_tool = ScrapeWebsiteTool()

class ResumeAgents:
    def __init__(self, resume_file=None): 
        # Convert PDF to markdown and store temporarily
        self.temp_resume_path = None
        if resume_file:
            self.temp_resume_path = self._process_pdf_resume(resume_file)
        else:
            # If no resume provided, convert the fake PDF to markdown
            with open('./fake_resume.pdf', 'rb') as pdf_file:
                self.temp_resume_path = self._process_pdf_resume(pdf_file)
        
        # Initialize tools with the markdown file path
        self.read_resume = FileReadTool(file_path=self.temp_resume_path)
        self.semantic_search_resume = MDXSearchTool(mdx_file_path=self.temp_resume_path)
        
        # Extract summary from resume
        self.resume_summary = self._extract_summary_from_resume()
        
        self.researcher = Agent(
            role="Tech Job Researcher",
            goal="Make sure to do amazing analysis on "
                 "job posting to help job applicants",
            tools = [scrape_tool, search_tool],
            verbose=True,
            backstory=(
            "As a Job Researcher, your prowess in "
            "navigating and extracting critical "
            "information from job postings is unmatched."
            "Your skills help pinpoint the necessary "
            "qualifications and skills sought "
            "by employers, forming the foundation for "
            "effective application tailoring."
            )
        )

        self.profiler = Agent(
            role="Personal Profiler for Engineers",
            goal="Do increditble research on job applicants "
                "to help them stand out in the job market",
            tools = [scrape_tool, search_tool,
                     self.read_resume, self.semantic_search_resume],
            verbose=True,
            backstory=(
                "Equipped with analytical prowess, you dissect "
                "and synthesize information "
                "from diverse sources to craft comprehensive "
                "personal and professional profiles, laying the "
                    "groundwork for personalized resume enhancements."
            )
        )

        self.resume_strategist = Agent(
            role="Resume Strategist for Engineers",
            goal="Find all the best ways to make a "
                "resume stand out in the job market.",
            tools = [scrape_tool, search_tool,
                     self.read_resume, self.semantic_search_resume],
            verbose=True,
            backstory=(
                "With a strategic mind and an eye for detail, you "
                "excel at refining resumes to highlight the most "
                "relevant skills and experiences, ensuring they "
                "resonate perfectly with the job's requirements."
            )
        )

        self.interview_preparer = Agent(
            role="Engineering Interview Preparer",
            goal="Create interview questions and talking points "
                "based on the resume and job requirements",
            tools = [scrape_tool, search_tool,
                     self.read_resume, self.semantic_search_resume],
            verbose=True,
            backstory=(
                "Your role is crucial in anticipating the dynamics of "
                "interviews. With your ability to formulate key questions "
                "and talking points, you prepare candidates for success, "
                "ensuring they can confidently address all aspects of the "
                "job they are applying for."
            )
        )

        self.research_task = Task(
            description=(
                "Analyze the job posting URL provided ({job_posting_url}) "
                "to extract key skills, experiences, and qualifications "
                "required. Use the tools to gather content and identify "
                "and categorize the requirements."
            ),
            expected_output=(
                "A structured list of job requirements, including necessary "
                "skills, qualifications, and experiences."
            ),
            agent=self.researcher,   
            async_execution=True
        )

    def create_crew(self) -> Crew:
        # Create profile task here where we have access to inputs
        self.profile_task = Task(
            description=(
                "Compile a detailed personal and professional profile using "
                "the resume summary. "
                f"Resume summary: {self.resume_summary}. "
                "Utilize tools to extract and synthesize information "
                "from these sources."
            ),
            expected_output=(
                "A comprehensive profile document that includes skills, "
                "project experiences, contributions, interests, and "
                "communication style."
            ),
            agent=self.profiler,
            async_execution=True
        )

        self.resume_strategy_task = Task(
            description=(
                "Using the profile and job requirements obtained from "
                "previous tasks, tailor the resume to highlight the most "
                "relevant areas. Employ tools to adjust and enhance the "
                "resume content. Make sure this is the best resume even but "
                "don't make up any information. Update every section, "
                "inlcuding the initial summary, work experience, skills, "
                "and education. All to better reflrect the candidates "
                "abilities and how it matches the job posting."
            ),
            expected_output=(
                "An updated resume that effectively highlights the candidate's "
                "qualifications and experiences relevant to the job."
            ),
            output_file="tailored_resume.md",
            context=[self.research_task, self.profile_task],
            agent=self.resume_strategist
        )

        self.interview_preparation_task = Task(
            description=(
                "Create a set of potential interview questions and talking "
                "points based on the tailored resume and job requirements. "
                "Utilize tools to generate relevant questions and discussion "
                "points. Make sure to use these question and talking points to "
                "help the candiadte highlight the main points of the resume "
                "and how it matches the job posting."
            ),
            expected_output=(
                "A document containing key questions and talking points "
                "that the candidate should prepare for the initial interview."
            ),
            output_file="interview_materials.md",
            context=[self.research_task, self.profile_task, self.resume_strategy_task],
            agent=self.interview_preparer
        )

        return Crew(
            agents=[
                self.researcher,
                self.profiler,
                self.resume_strategist,
                self.interview_preparer
            ],
            tasks=[
                self.research_task,
                self.profile_task,
                self.resume_strategy_task,
                self.interview_preparation_task
            ],
            verbose=True
        )

    def _process_pdf_resume(self, pdf_file):
        """Convert uploaded PDF to structured markdown format for processing."""
        try:
            # Create temp file with .md extension
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.md', mode='w+', encoding='utf-8')
            
            # Read PDF content
            pdf_reader = PdfReader(pdf_file)
            text_content = ""
            
            # Extract text from each page
            for page in pdf_reader.pages:
                text_content += page.extract_text()
            
            # Split into lines and clean up
            lines = [line.strip() for line in text_content.split('\n') if line.strip()]
            
            # Detect potential section headers
            sections = []
            current_section = {'title': 'Header', 'content': []}
            
            for line in lines:
                # Heuristics for detecting section headers:
                # 1. All caps or title case
                # 2. Short length (typically 1-4 words)
                # 3. Often preceded by newlines
                # 4. Sometimes followed by separators (---, ___, etc)
                is_likely_header = (
                    (line.isupper() or line.istitle()) and 
                    len(line.split()) <= 4 and
                    not any(char in line.lower() for char in '@.:,/')
                )
                
                if is_likely_header:
                    # Save previous section if it has content
                    if current_section['content']:
                        sections.append(current_section)
                    # Start new section
                    current_section = {'title': line, 'content': []}
                else:
                    current_section['content'].append(line)
            
            # Add the last section
            if current_section['content']:
                sections.append(current_section)
            
            # Convert to markdown with original section names preserved
            markdown_content = "# Resume\n\n"
            
            for section in sections:
                # Clean up section title and make it markdown-friendly
                title = section['title'].strip().title()
                markdown_content += f"## {title}\n"
                markdown_content += '\n'.join(section['content'])
                markdown_content += "\n\n"
            
            # Write to temp file
            temp_file.write(markdown_content)
            temp_file.close()
            
            return temp_file.name
            
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            # If processing fails, try the fake resume PDF instead
            try:
                with open('./fake_resume.pdf', 'rb') as fake_pdf:
                    return self._process_pdf_resume(fake_pdf)
            except Exception as fallback_error:
                print(f"Error loading fake resume: {str(fallback_error)}")
                raise  # If even the fallback fails, we should raise the error

    def _extract_summary_from_resume(self):
        """Extract the summary/profile section from the resume."""
        try:
            with open(self.temp_resume_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Look for common summary section headers
            sections = content.split('\n## ')
            summary = ""
            summary_headers = ['summary', 'profile', 'about', 'overview', 'objective']
            
            for section in sections:
                if any(header in section.lower().split('\n')[0] for header in summary_headers):
                    # Get everything after the header up to the next section
                    summary = '\n'.join(section.split('\n')[1:]).strip()
                    break
            
            return summary or "No summary found in resume"
                
        except Exception as e:
            print(f"Error extracting summary: {str(e)}")
            return "Error extracting summary from resume"

    def __del__(self):
        """Cleanup temporary files."""
        if self.temp_resume_path and os.path.exists(self.temp_resume_path):
            try:
                os.unlink(self.temp_resume_path)
            except Exception as e:
                print(f"Error cleaning up temp file: {str(e)}")

    def get_tailored_resume_pdf(self):
        """Convert the tailored resume markdown to PDF."""
        try:
            if os.path.exists("tailored_resume.md"):
                with open("tailored_resume.md", "r") as f:
                    markdown_content = f.read()
                
                # Convert markdown to HTML
                html_content = markdown2.markdown(markdown_content)
                
                # Add some basic styling
                styled_html = f"""
                    <html>
                        <head>
                            <style>
                                body {{ font-family: Arial, sans-serif; margin: 2cm; }}
                                h1 {{ color: #2c3e50; }}
                                h2 {{ color: #34495e; border-bottom: 1px solid #bdc3c7; }}
                            </style>
                        </head>
                        <body>
                            {html_content}
                        </body>
                    </html>
                """
                
                # Create a temporary PDF file
                pdf_path = "tailored_resume.pdf"
                HTML(string=styled_html).write_pdf(pdf_path)
                return pdf_path
                
        except Exception as e:
            print(f"Error converting to PDF: {str(e)}")
            return None