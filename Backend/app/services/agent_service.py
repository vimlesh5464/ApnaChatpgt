def calculator_tool(query: str):
    try:
        return str(eval(query))
    except:
        return "Invalid calculation"

def search_tool(query: str):
    return f"🔍 Searching for: {query}"

def run_agent(prompt: str):
    prompt = prompt.lower()

    if "calculate" in prompt:
        expression = prompt.replace("calculate", "").strip()
        return f"🧮 Result: {calculator_tool(expression)}"

    if "search" in prompt:
        return search_tool(prompt)

    return None