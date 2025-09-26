import json
import os
from datetime import datetime

import anthropic
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies, Authorization headers, etc.
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

with open("data/student_groups.json", "r") as f:
    categories = json.load(f)
# create inverse lookup table
club_to_cat = {club: cat["category"] for cat in categories for club in cat["clubs"]}
with open("data/student_groups_descriptions.json", "r") as f:
    descriptions = json.load(f)
descriptions_dict = {entry["name"]: entry["description"] for entry in descriptions}

client = anthropic.Anthropic()


@app.get("/conversation-id/")
def get_matches(conversationId: str):
    elevenlabs = ElevenLabs(
        api_key=os.getenv("ELEVENLABS_API_KEY"),
    )

    # get the transcript
    transcript = elevenlabs.conversational_ai.conversations.get(conversationId).transcript
    # extract user turns from transcript
    transcript = "\n".join([x.message for x in transcript if x.role == "user"][:3])  # TODO: remove

    messages = [
        {
            "role": "user",
            "content": f'Given the following transcript of messages where the user describes his preference, please choose the groups from the list that best fit the user preferences. Output the result in JSON format as list of dicts, each with keys `name` (string) and `reason` (string). Exactly match the spelling of the name in the list. The reason is why this club matches the user\'s interests.\nTranscript:\n"""{transcript}"""\nList of student clubs:\n{json.dumps(categories)}',
        }
    ]

    # match the messages to a list of student groups, including their descriptions
    response = client.messages.create(
        model="claude-4-sonnet-20250514", max_tokens=2048, messages=messages
    )
    club_names = json.loads("[" + response.content[0].text.split("[")[-1].split("]")[0] + "]")
    out = [
        {
            "name": item["name"],
            "category": club_to_cat[item["name"]],
            "description": descriptions_dict[item["name"]],
            "reason": item["reason"],
        }
        for item in club_names
    ]
    # out = [{"name": "TUM AI", "category": "a", "description": "d", "reason": "foo"}]

    return {"status": "successful", "results": out}


@app.get("/events/")
def get_events(groupName: str):
    messages = [
        {
            "role": "user",
            "content": f"For the following student club, please find the next events (at most 5), e.g. from Instagram, LinkedIn and their homepage. Answer in JSON format, as a list of dicts with keys `event_name`, `datetime`, `location` (as written in the announcement), `description` (all the details you can find, as in the announcement) and `url` (the link with details or application link). If the location or date is unknown, return an empty string value. Do not use html tags. Today is {datetime.today().date()}\nThe student club: {groupName}",
        }
    ]

    response = client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=2048,
        messages=messages,
        tool_choice={"type": "tool", "name": "web_search"},
        tools=[
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "user_location": {
                    "type": "approximate",
                    "city": "Munich",
                    "region": "Germany",
                    "country": "DE",
                    "timezone": "Europe/Berlin",
                },
            }
        ],
    )
    text = "".join([x.text for x in response.content if x.type == "text"])
    events = json.loads("[" + text.split("[")[-1].split("]")[0] + "]")
    # events = [{"event_name": "Hackathon Lovable", "datetime": "22.09.2025", "location": "Arcisstr. 21", "description": "This hackathon is cool.", "url": "https://tum.ai"}]
    return {"results": events}