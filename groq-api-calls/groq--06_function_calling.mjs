import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./.env') });

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const MODEL = 'llama3-70b-8192'


// Example dummy function hard coded to return the score of an NBA game
function get_game_score(team_name) {

    switch (team_name?.toLowerCase()) {
        case "warriors":
        case "golden state":
        case "golden state warriors":
            return { "game_id": "401585601", "status": 'Final', "home_team": "Los Angeles Lakers", "home_team_score": 121, "away_team": "Golden State Warriors", "away_team_score": 128 };
            break;

        case "lakers":
        case "los angeles lakers":
            return { "game_id": "401585601", "status": 'Final', "home_team": "Los Angeles Lakers", "home_team_score": 121, "away_team": "Golden State Warriors", "away_team_score": 128 };
            break;

        case "denver":
        case "nuggets":
        case "denver nuggets":
            return { "game_id": "401585577", "status": 'Final', "home_team": "Miami Heat", "home_team_score": 88, "away_team": "Denver Nuggets", "away_team_score": 100 };
            break;

        case "miami heat":
        case "heat":
        case "miami":
            return { "game_id": "401585577", "status": 'Final', "home_team": "Miami Heat", "home_team_score": 88, "away_team": "Denver Nuggets", "away_team_score": 100 };
            break;

        default:
            return { "team_name": team_name, "score": "unknown" };
            break;
    }
}

async function run_conversation(user_prompt) {
    // Step 1: send the conversation and available functions to the model
    const messages = [
        {
            "role": "system",
            "content": "You are a function calling LLM that uses the data extracted from the get_game_score function to answer questions around NBA game scores. Include the team and their opponent in your response."
        },
        {
            "role": "user",
            "content": user_prompt,
        }
    ]

    const tools = [
        {
            "type": "function",
            "function": {
                "name": "get_game_score",
                "description": "Get the score for a given NBA game",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "team_name": {
                            "type": "string",
                            "description": "The name of the NBA team (e.g. 'Golden State Warriors')",
                        }
                    },
                    "required": ["team_name"],
                },
            },
        }
    ]

    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: messages,
        tools: tools,
        tool_choice: "auto",
        max_tokens: 4096
    })

    const response_message = response.choices[0].message;
    const tool_calls = response_message.tool_calls;

    // Step 2: check if the model wanted to call a function
    if (tool_calls) {

        // Step 3: call the function
        // Note: the JSON response may not always be valid; be sure to handle errors
        const available_functions = {
            "get_game_score": get_game_score,
        }

        // only one function in this example, but you can have multiple
        messages.push(response_message)
        // extend conversation with assistant's reply

        // Step 4: send the info for each function call and function response to the model
        for await (const tool_call of tool_calls) {

            // for tool_call in tool_calls:
            const function_name = tool_call.function.name
            const function_to_call = available_functions[function_name]
            const function_args = JSON.parse(tool_call.function.arguments)

            const function_response = function_to_call(function_args['team_name']);

            messages.push(
                {
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": JSON.stringify(function_response),
                }
            )
        }
        // extend conversation with function response
        const second_response = await groq.chat.completions.create({
            model: MODEL,
            messages: messages
        });
        // get a new response from the model where it can see the function response
        return second_response.choices[0].message.content
    }
}

const user_prompt = "What was the score of the 'Warriors' team? Please don't use your own info but use the provided function to respond."
console.log(JSON.stringify(await run_conversation(user_prompt), null, 2))


