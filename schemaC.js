function generateCustomSchema(characters) {
    // Base schema structure
    const schema = {
      type: "object",
      properties: {},
      required: []
    };
  
    // Template for additional properties based on character type
    const typeProperties = {
      human: {
        properties: {
          "full name": { "type": "string" },
          "age": { "type": "string", "description": "Specify the character's age group (e.g., '30s', 'child', '20s')." },
          "gender": { "type": "string", "description": "Indicate the character's gender." },
          "ethnicity": { "type": "string", "description": "Describe the character's ethnicity to provide cultural context." },
          "hair style and color": { "type": "string", "description": "Detail the character's hair style and color for visual accuracy." },
          "clothes_upper": { "type": "string", "description": "Describe the upper body clothing, including color and type." },
          "clothes_lower": { "type": "string", "description": "Describe the lower body clothing, including color and type." },
          "aditional_details": { "type": "string", "description": "any other details regarding visual appearance like cartoon or realistic or anime" }
        },
        required: ["full name", "age", "gender", "ethnicity", "hair style and color", "clothes_upper", "clothes_lower"]
      },
      "famous/well-known character": {
        properties: {
          "played_by_actor": { "type": "string", enum:["yes", "no"], description:"return yes if it is a character played by movie stars, return no if it some cartoon or anything else with no real human face"},
          "full name": { "type": "string", description: "full name of the actor playing it"},
          "costume": { "type": "string", "description": "list what kind/color of costume he is wearing, give details, customize it if user asks for it" },
          "aditional_details": { "type": "string", "description": "any other details regarding visual appearance including like cartoon or realistic or anime" }
        },
        required: ["costume", "played_by_actor"]
      },
      "robot": {
        properties: {
          "costume_colors": { "type": "string", "description": "List the primary colors of the character's costume." },
          "powers": { "type": "string", "description": "Describe the character's powers or abilities." }
        },
        required: ["costume_colors", "powers"]
      },
      "animal": {
        properties: {
          "color": { "type": "string", "description": "what is their color" },
          "breed": { "type": "string", "description": "what type of breed is it" }
        },
        required: ["color", "breed"]
      },
      "monster": {
        properties: {
          "costume_colors": { "type": "string", "description": "List the primary colors of the character's costume." },
          "powers": { "type": "string", "description": "Describe the character's powers or abilities." }
        },
        required: ["costume_colors", "powers"]
      },
    };
  
    // Iterating through characters to add specific properties based on character type
    characters.forEach((character, index) => {
      const charType = character.character_type;
      if (typeProperties[charType]) {
        schema.properties[character.character] = {
          type: "object",
          properties: typeProperties[charType].properties,
          description:character.character_type,
          required: typeProperties[charType].required
        };
      }
    });
  
    return schema;
  }

 module.exports = generateCustomSchema;
