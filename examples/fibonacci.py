from google import genai
from google.genai.types import (
    GenerateContentConfig,
    HttpOptions,
    Tool,
    ToolCodeExecution,
)
import os

# Agrega datos reales de este proyecto
# Ensure GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION, GOOGLE_GENAI_USE_ENTERPRISE are set

client = genai.Client(http_options=HttpOptions(api_version="v1"))
model_id = "gemini-3.7-flash"

code_execution_tool = Tool(code_execution=ToolCodeExecution())
response = client.models.generate_content(
    model=model_id,
    contents="Calculate 20th fibonacci number. Then find the nearest palindrome to it.",
    config=GenerateContentConfig(
        tools=[code_execution_tool],
        temperature=0,
    ),
)
print("# Code:")
print(response.executable_code)
print("# Outcome:")
print(response.code_execution_result)
print("# Response:")
print(response.text)
