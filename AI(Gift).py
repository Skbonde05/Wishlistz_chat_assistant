import pandas as pd
import re
from huggingface_hub import InferenceClient

#Please input the HF Token before running this program.
HF_TOKEN = "<HuggingFace Token>"
MODEL_ID = "Qwen/Qwen2.5-7B-Instruct" 
client = InferenceClient(api_key=HF_TOKEN)


full_df = pd.read_csv("data.csv")
allowed_cols = ["name", "description", "price", "catName", "subCat", "rating", "additionalInfo"]
catalog = full_df[allowed_cols].copy()
catalog['rating'] = pd.to_numeric(catalog['rating'], errors='coerce').fillna(0)
catalog['price'] = pd.to_numeric(catalog['price'], errors='coerce').fillna(0)

sessions = {}

class ChatSession:
    def __init__(self, user_id):
        self.user_id = user_id
        self.last_intent = None
        self.context = {}

def extract_number(text):
    nums = re.findall(r'\d+', str(text))
    return int(nums[0]) if nums else 0

def get_filtered_context(filters):
    """Filters data for budget and provides a rich list for the AI to analyze."""
    df = catalog.copy()

    budget_limit = extract_number(filters.get("budget", 0))
    if budget_limit > 0:
        df = df[df['price'] <= budget_limit]
    

    df = df.sort_values(by='rating', ascending=False)
    return df.head(20).to_string(index=False)

def query_llm(system_prompt, user_input):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat_completion(model=MODEL_ID, messages=messages, max_tokens=700, temperature=0.1)
    return response.choices[0].message.content

def handle_chat(user_id, user_message):
    if user_id not in sessions: sessions[user_id] = ChatSession(user_id)
    session = sessions[user_id]
    
    msg_upper = user_message.upper()
    if "GIFT" in msg_upper: 
        session.last_intent = "GIFT_PLANNER"
        return "Who are you buying for? (e.g., Sister, Brother, Friend)"

    if session.last_intent == "GIFT_PLANNER":
        if "relation" not in session.context:
            session.context["relation"] = user_message
            return "What is their age?"
        elif "age" not in session.context:
            session.context["age"] = user_message
            return "What is your budget in Rupees (₹)?"
        elif "budget" not in session.context:
            session.context["budget"] = user_message
            return finish_workflow(session)
    
    return "Hello! I am Wishlistz AI. Type 'Gift Planner' to find a product."

def finish_workflow(session):
    csv_data = get_filtered_context(session.context)
    

    system_prompt = f"""
    You are the Wishlistz Shopping Expert. You must follow these priorities strictly:

    PRIORITY 1: ANALYZE THE RECIPIENT
    - Recipient: {session.context.get('relation')}
    - Age: {session.context.get('age')} years old
    - Gender Hint: Determine gender from the relation (e.g., 'Sister' is female, 'Brother' is male).
    - Task: Shortlist ONLY items from the CSV below that are appropriate for this age and gender. 

    PRIORITY 2: SELECTION BY RATING
    - From your shortlist, identify the item with the HIGHEST Star Rating.
    - If ratings are equal, choose the one that fits the "vibe" of the recipient best.

    RULES:
    1. Only recommend products listed in the CSV data below.
    2. CURRENCY: Use Indian Rupees (₹) only. NEVER use '$'.
    3. Response Format: Start by mentioning the shortlisted categories, then present the "Best Choice" with its Rating, Price, and Description.

    CSV DATA:
    {csv_data}
    """
    
    ans = query_llm(system_prompt, f"I need a gift for my {session.context.get('age')} year old {session.context.get('relation')} under ₹{session.context.get('budget')}.")
    

    session.last_intent = None
    session.context = {}
    return ans

#Test(To be removed when integrating with the final code)
if __name__ == "__main__":
    print("Bot: " + handle_chat("user1", "I want a Gift"))
    print("Bot: " + handle_chat("user1", "Brother")) 
    print("Bot: " + handle_chat("user1", "25"))     
    print("Bot: " + handle_chat("user1", "1000"))