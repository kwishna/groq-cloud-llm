import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./.env') });

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


const schema = {
    $defs: {
        Ingredient: {
            properties: {
                name: {
                    title: "Name",
                    type: "string"
                },
                quantity: {
                    title: "Quantity",
                    type: "string"
                },
                quantity_unit: {
                    anyOf: [
                        {
                            type: "string"
                        },
                        {
                            type: "null"
                        }
                    ],
                    title: "Quantity Unit"
                }
            },
            required: [
                "name",
                "quantity",
                "quantity_unit"
            ],
            title: "Ingredient",
            type: "object"
        }
    },
    properties: {
        recipe_name: {
            title: "Recipe Name",
            type: "string"
        },
        ingredients: {
            items: {
                $ref: "#/$defs/Ingredient"
            },
            title: "Ingredients",
            type: "array"
        },
        directions: {
            items: {
                type: "string"
            },
            title: "Directions",
            type: "array"
        }
    },
    required: [
        "recipe_name",
        "ingredients",
        "directions"
    ],
    title: "Recipe",
    type: "object"
};

class Ingredient {
    constructor(name, quantity, quantity_unit) {
        this.name = name;
        this.quantity = quantity;
        this.quantity_unit = quantity_unit || null;
    }
}

class Recipe {
    constructor(recipe_name, ingredients, directions) {
        this.recipe_name = recipe_name;
        this.ingredients = ingredients;
        this.directions = directions;
    }
}

async function getRecipe(recipe_name) {
    // Pretty printing improves completion results.
    const jsonSchema = JSON.stringify(schema, null, 4);
    
    const chat_completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a recipe database that outputs recipes in JSON.\n'The JSON object must use the schema: ${jsonSchema}`
            },
            {
                role: "user",
                content: `Fetch a recipe for ${recipe_name}`
            }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0,
        stream: false,
        response_format: {
            type: "json_object"
        }
    });
    return Object.assign(new Recipe(), JSON.parse(chat_completion.choices[0].message.content));
}

function printRecipe(recipe) {
    console.log("Recipe:", recipe.recipe_name);
    console.log();
    console.log("Ingredients:");
    recipe.ingredients.forEach((ingredient) => {
        console.log(`- ${ingredient.name}: ${ingredient.quantity} ${ingredient.quantity_unit || ""}`);
    });
    console.log();
    console.log("Directions:");
    recipe.directions.forEach((direction, step) => {
        console.log(`${step + 1}. ${direction}`);
    });
}

async function main() {
    const recipe = await getRecipe("apple pie");
    printRecipe(recipe);
}

await main();
