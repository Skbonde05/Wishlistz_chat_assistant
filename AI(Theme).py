import pandas as pd
import re
from huggingface_hub import InferenceClient

#Please input the HF Token before running this program.
HF_TOKEN = "<HuggingFace Token>"
MODEL_ID = "Qwen/Qwen2.5-7B-Instruct" 
client = InferenceClient(api_key=HF_TOKEN)


try:
    full_df = pd.read_csv("data.csv")
    allowed_cols = ["name", "description", "price", "catName", "subCat", "rating", "additionalInfo"]
    catalog = full_df[allowed_cols].copy()
    catalog['rating'] = pd.to_numeric(catalog['rating'], errors='coerce').fillna(0)
    catalog['price'] = pd.to_numeric(catalog['price'], errors='coerce').fillna(0)
except Exception as e:
    print(f"Error: {e}")
    catalog = pd.DataFrame(columns=allowed_cols)


sessions = {}

class ChatSession:
    def __init__(self, user_id):
        self.user_id = user_id
        self.last_intent = None
        self.context = {}

def extract_number(text):
    nums = re.findall(r'\d+', str(text))
    return int(nums[0]) if nums else 0

def get_theme_context(filters):
    df = catalog.copy()
    
    budget_limit = extract_number(filters.get("budget", 0))
    if budget_limit > 0:
        df = df[df['price'] <= budget_limit]
    

    gender = str(filters.get("gender", "")).upper()
    if any(g in gender for g in ["MALE", "MEN", "BOY"]):
        df = df[df['catName'].str.upper() == "MEN"]
    elif any(g in gender for g in ["FEMALE", "WOMEN", "GIRL"]):
        df = df[df['catName'].str.upper() == "WOMEN"]
    

    return df.sort_values(by='rating', ascending=False).head(20).to_string(index=False)

def query_llm(system_prompt, user_input):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat_completion(model=MODEL_ID, messages=messages, max_tokens=800, temperature=0.0)
    return response.choices[0].message.content

def handle_chat(user_id, user_message):
    if user_id not in sessions: sessions[user_id] = ChatSession(user_id)
    session = sessions[user_id]
    
    msg_upper = user_message.upper()
    if "THEME" in msg_upper: 
        session.last_intent = "THEME_PLANNER"
        session.context = {}
        return "Theme Planner: What is the event type?"

    if session.last_intent == "THEME_PLANNER":
        steps = ["event", "audience", "gender", "budget", "vibe"]
        prompts = {
            "event": "Who is the audience? (e.g., Kids, Adults)",
            "audience": "What is the gender of the audience? (Male/Female)",
            "gender": "What is the budget in Rupees (₹)?",
            "budget": "What is the vibe? (e.g., Elegant, Traditional, Modern)",
            "vibe": "Processing..."
        }
        
        for step in steps:
            if step not in session.context:
                session.context[step] = user_message
                if step == "vibe":
                    return finish_theme_workflow(session)
                return prompts[step]
    
    return "Hello! Type 'Theme Planner' to get started."

def finish_theme_workflow(session):
    csv_data = get_theme_context(session.context)
    
    system_prompt = f"""
    You are the Wishlistz Theme Specialist. 
    
    CONTEXT:
    - Event: {session.context.get('event')}
    - Audience: {session.context.get('audience')}
    - Gender: {session.context.get('gender')}
    - Vibe: {session.context.get('vibe')}
    
    STRICT RULES:
    1. GENDER GUARD: If the audience is Male, NEVER suggest a Saree, Dress, or Women's item.
    2. AGE GUARD: If the audience is Adult, NEVER suggest Toys.
    3. PRICE: All prices are in Indian Rupees (₹).
    4. SOURCE: Use ONLY the CSV data provided. If no items match the gender/vibe, say so.
    
    TASK:
    Analyze the products. From the ones that fit the {session.context.get('gender')} gender and {session.context.get('vibe')} vibe, suggest the one with the HIGHEST RATING.

    CSV DATA:
    {csv_data}
    """
    
    ans = query_llm(system_prompt, "Please recommend the best themed product.")
    session.last_intent = None
    session.context = {}
    return ans

#Test(To be removed when integrating with the final code)
if __name__ == "__main__":
    print("Bot: " + handle_chat("user_test", "Theme Planner"))
    print("Bot: " + handle_chat("user_test", "Traditional Wedding"))
    print("Bot: " + handle_chat("user_test", "Adults"))
    print("Bot: " + handle_chat("user_test", "Female"))
    print("Bot: " + handle_chat("user_test", "1500"))
    print("Bot: " + handle_chat("user_test", "Elegant"))