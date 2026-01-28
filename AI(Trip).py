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
    print(f"Error loading data: {e}")
    catalog = pd.DataFrame(columns=allowed_cols)


sessions = {}

class ChatSession:
    def __init__(self, user_id):
        self.user_id = user_id
        self.last_intent = None
        self.context = {}

def query_llm(system_prompt, user_input):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat_completion(model=MODEL_ID, messages=messages, max_tokens=700, temperature=0.1)
    return response.choices[0].message.content

def get_trip_context(filters):
    """Filters data for travel-related items based on destination and travel type."""
    df = catalog.copy()
    

    travel_keywords = [filters.get('destination', ''), filters.get('travel_type', ''), filters.get('season', '')]
    

    query = '|'.join([str(k) for k in travel_keywords if k])
    if query:
        mask = df.apply(lambda row: row.astype(str).str.contains(query, case=False).any(), axis=1)
        if mask.any():
            df = df[mask]
    

    return df.sort_values(by='rating', ascending=False).head(15).to_string(index=False)

def handle_chat(user_id, user_message):
    if user_id not in sessions: sessions[user_id] = ChatSession(user_id)
    session = sessions[user_id]
    
    msg_upper = user_message.upper()
    

    if "GIFT" in msg_upper: 
        session.last_intent = "GIFT_PLANNER"
        session.context = {} 
        return "Gift Planner: Who are you buying for?"
    elif "TRIP" in msg_upper:
        session.last_intent = "TRIP_PLANNER"
        session.context = {}
        return "Trip Planner: Where is your destination?"


    if session.last_intent == "TRIP_PLANNER":
        if "destination" not in session.context:
            session.context["destination"] = user_message
            return "How many days is your trip?"
        elif "days" not in session.context:
            session.context["days"] = user_message
            return "What is the season? (e.g., Summer, Winter, Monsoon)"
        elif "season" not in session.context:
            session.context["season"] = user_message
            return "What is the travel type? (e.g., Adventure, Business, Leisure)"
        elif "travel_type" not in session.context:
            session.context["travel_type"] = user_message
            return finish_trip_workflow(session)


    
    return "Welcome! I can help you with a 'Gift Planner' or a 'Trip Planner'."

def finish_trip_workflow(session):
    csv_data = get_trip_context(session.context)
    
    system_prompt = f"""
    You are the Wishlistz Trip Assistant. 
    
    USER TRIP DETAILS:
    - Destination: {session.context.get('destination')}
    - Duration: {session.context.get('days')} days
    - Season: {session.context.get('season')}
    - Travel Type: {session.context.get('travel_type')}

    PRIORITY 1: Analyze the destination and travel type to shortlist relevant items. 
    (e.g., if it's a winter trip, prioritize heavy cotton or warm items. If it's leisure, suggest comfortable sarees or t-shirts.)
    
    PRIORITY 2: Select the highest-rated products from the CSV below.

    RULES:
    1. ONLY use the provided CSV data.
    2. Currency must be in Rupees (₹).
    3. Explain why each item is essential for a {session.context.get('days')}-day trip to {session.context.get('destination')}.

    CSV DATA:
    {csv_data}
    """
    
    ans = query_llm(system_prompt, "Curate a travel pack for my trip.")
    session.last_intent = None
    session.context = {}
    return ans

#Test(To be removed when integrating with the final code)
if __name__ == "__main__":
    print("Bot: " + handle_chat("u2", "I want to plan a trip"))
    print("Bot: " + handle_chat("u2", "Delhi"))
    print("Bot: " + handle_chat("u2", "5"))
    print("Bot: " + handle_chat("u2", "Monsoon"))
    print("Bot: " + handle_chat("u2", "Leisure"))