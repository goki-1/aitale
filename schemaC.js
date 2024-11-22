function generateCustomSchema(characters) {
    // Base schema structure
    const schema = {
      type: "object",
      properties: {},
      required: []
    };
  
    // Template for additional properties based on character type
    const typeProperties = {
      "normal human": {
        properties: {
          "full name": { "type": "string" },
          "age": { "type": "string", "description": "Specify the character's age group (e.g., '30s', 'child', '20s')." },
          "gender": { "type": "string", "description": "Indicate the character's gender." },
          "ethnicity": { "type": "string", "description": "Describe the character's ethnicity to provide cultural context." },
          "hair style and color": { "type": "string", "description": "Detail the character's hair style and color for visual accuracy." },
          "clothes_upper": { "type": "string", "description": "Describe the upper body clothing, including color and type." },
          "clothes_lower": { "type": "string", "description": "Describe the lower body clothing, including color and type, including footwear" },
        },
        required: ["full name", "age", "gender", "ethnicity", "hair style and color", "clothes_upper", "clothes_lower"]
      },
      "comic/movie character who walks on two legs": {
        properties: {
          "played_by_actor": { "type": "string", enum:["yes", "no"], description:"return yes if it is a character played by movie stars, return no if it some cartoon or anything else with no real human"},
          "Actor name":{type:"string", description:"return name of actor who plays it or some name(if it is human like), if not played by any actor or not human like at all respond no"},
          "full name": { "type": "string", description: "full name of the character, if name has Son in it skip it"},
          faceCovered: { "type": "string", enum: ["yes", "no"], description: "return yes if character has face covered, return no if character has no face covered" },
          "costume/skin": { "type": "string", "description": "detailed list what kind/color of costume/skin he or she has or wearing, give details, customize it if user asks for it" },
        },
        required: ["costume/skin", "played_by_actor","faceCovered", 'Actor name','full name']
      },
      "comic/movie character who walks on four legs": {
        properties: {
          "full name": { "type": "string", description: "full name of the character"},
          "skin": { "type": "string", "description": "list what kind/color of costume/skin he or she has or wearing, give details, customize it if user asks for it" },
          "costume/skin": { "type": "string", "description": "detailed list what kind/color of costume/skin he or she has or wearing, give details, customize it if user asks for it" },
        },
        required: ["skin", 'full name', "costume/skin"]
      },
      "robot": {
        properties: {
          "famous name": { "type": "string", "description": `give it one well-known descriptive yet famous name (if user hasn't mentioned explicitly) like R2-D2 and C-3PO from 
          Star Wars, WALL-E from WALL-E, Optimus Prime from Transformers, Bender from Futurama, and The Terminator from the Terminator series etc.` },
          "costume/skin": { "type": "string", "description": "detailed list what kind/color of costume/skin he or she has or wearing, give details, customize it if user asks for it" },
        },
        required: ["famous name", "costume/skin"]
      },
      "four legged normal animal": {
        properties: {
          "color": { "type": "string", "description": "what is their color" },
          "type and breed": { "type": "string", "description": "what type of animal and its breed" },
          "costume/skin": { "type": "string", "description": "detailed list what kind/color of costume/skin he or she has or wearing, give details, customize it if user asks for it" },
        },
        required: ["color", "type and breed", "costume/skin"]
      },
      "monsterous": {
        properties: {
          "famous name": { "type": "string", "description": `give it some well known descriptive yet famous name (if user hasn't mentioned explicitly) 
          Dracula, Frankenstein's monster, Godzilla, King Kong, The Wolfman, The Mummy, The Creature from the Black Lagoon.`},
          "costume/skin": { "type": "string", "description": "detailed list what kind/color of costume/skin he or she has or wearing, give details, customize it if user asks for it" },
        },
        required: ["famous name", "costume/skin"]
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
