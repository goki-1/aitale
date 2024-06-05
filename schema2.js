const schema = {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the story",
      },
      hashtag:{
        type:"string",
        description: "One word hashtag of the story. Could be main character or anything else"
      },
      panels: {
        type: "array",
        items: {
          type: "object",
          properties: {
            content: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  character: { 
                    type: "string", 
                    description: "Character's name in the panel" 
                  },
                  dialogue: {
                    type: "string",
                    description: `Character's dialogue in the panel or if it is narrator narrating the story then its' dialogue`,
                  },
                  tone: {
                    type: "string",
                    enum: ["neutral", "happy", "surprised", "angry", "sad", "afraid"],
                    description: "take a break and choose only from neutral, happy, surprised, angry, sad, afraid",
                  },
                  positioning_of_character:{
                    type: "string",
                    enum: [
                      "positioned together", "positioned apart or far away", "positioned opposite to another"
                    ],
                    description: `Position of the characters in the panel, it also signifies who are together and who are against or seperated`
                  },
                  action_being_performed_or_state_of_character:{
                    type:"string",
                    enum:[sitting, standing, flying, laying, ready_for_attack, tired, attacking, being_hit, running, dancing],
                    description:'what is character doing or what state he/she/it is in'
                  },
                  focus_on_character:{
                    type:"string",
                    enum:[being_introduced, got_transformation, got_injured,],
                    description:'is there a focus on some character if yes then why'
                  }
                 },
                required: [character, content, tone, positioning_of_character, action_being_performed_or_state_of_character],
              }, 
            },
            "if fighting? who is fighting with who":{
                type:"object",
                properties:{
                    team_winning:{
                        type:"array",
                        description:"charcters who are winning and in one team"
                    },
                    loosing_team:{
                        type:"array",
                        description:"charcters who are loosing and in another team"
                    }
                },
                required: [team_winning, loosing_team]
            },

            location_environment_setting:{
              type:"string",
              description: "Describe Location and environment of the scene, a fictional or real-world location, be descriptive about it's features",
            },
            
            indoor_or_outdoor:{
                type:"string",
                enum:["indoor", "outdoor", "sky/space"],
                description:"is the scene setting in indoor, outdoor, sky/space"
            },
            weather:{
                type:"string",
                enum:["rainy", "day", "night"],
                description:"is the scene setting in indoor, outdoor, sky/space"
            },

            background_sound: {
              type: "string",
              enum: [
                "no sound", "wind", "people bustling", "car sound", "birds chirping", "rain", "thunder", "ocean/river waves", "explosion",
              ],
            },
            background_music: {
              type: "string",
              enum: [
                "no music","instrumental","epic_orchestral","fantasy","horror","romantic","mystery", "sad","adventure"
              ],
            },
            
          },
          required: [ type,dialogues, background_sound,background_music,location_environment_setting, indoor_or_outdoor, weather],
        },
      },
      characters: {
        type: "array",
        items: {
          type: "object",
          properties: {
            character: {
              type: "string",
              description: "Character's name in the panels should match exactly with this name(dont mention about narrator)"
            },
            character_type: {
              type: "string",
              enum: [ "comic/movie character who walks on two legs","comic/movie character who walks on four legs","normal human","four legged normal animal", "robot", "monsterous"],
            },
            sound: {
              type: "string",
              enum: ["male", "female", "deep sound"],
              description: "Sound of the character: male, female, or deep sound."
            },
            height: {
              type: "string",
              enum: [ "normal 5'10 to 6 feet", "2-3 feet", "10 feet", "enormous size"],
              description: "estimated size of characters"
            },
            role: {
              type: "string",
              enum: ["villain", "hero/good", "normal"],
              description: "is the character good or bad"
            },
            costume_or_looks:{
                type:"string",
                description:"describe the visual appearance of the character, be descriptive about it"
            }
          },
          required: ["character", "character_type", "sound", "height", "role", costume_or_looks],
        }
      }
    },
    required: ["title", "hashtag", "panels", "characters"]
    
  };

  module.exports = schema;
