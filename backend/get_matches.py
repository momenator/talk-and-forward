import json
import os

import anthropic
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

from fastapi import FastAPI

app = FastAPI()

with open("data/student_groups.json", "r") as f:
    categories = json.load(f)
# create inverse lookup table
club_to_cat = {club: cat["category"] for cat in categories for club in cat["clubs"]}
with open("data/student_groups_descriptions.json", "r") as f:
    descriptions = json.load(f)
descriptions_dict = {entry["name"]: entry["description"] for entry in descriptions}

client = anthropic.Anthropic()


@app.get("/conversation-id/")
async def read_root(conversation_id: int):
    print(conversation_id)
    elevenlabs = ElevenLabs(
        api_key=os.getenv("ELEVENLABS_API_KEY"),
    )

    # get the transcript
    transcript = elevenlabs.conversational_ai.conversations.get(conversation_id).transcript
    # extract user turns from transcript
    transcript = "\n".join([x.message for x in transcript if x.role == "user"])

    messages = [{
        "role": "user",
        "content": f'Given the following transcript of messages where the user describes his preference, please choose the groups from the list that best fit the user preferences. If the purpose of the club is unclear from the name, just include it. Output the result in JSON format as list of student club names (string). Exactly match the spelling in the list.\nTranscript:\n"""{transcript}"""\nList of student clubs:\n{json.dumps(categories)}'
    }]

    # match the messages to a list of student groups, including their descriptions
    response = client.messages.create(
        model="claude-4-sonnet-20250514",
        max_tokens=2048,
        messages=messages
    )
    club_names = json.loads("[" + response.content[0].text.split("[")[-1].split("]")[0] + "]")
    out = [{"name": name, "category": club_to_cat[name], "description": descriptions_dict[name]} for name in club_names]

    return {"results": out}
