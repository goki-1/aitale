const schema = {
  "name": "screenplay_for_short_comic_like_movie",
  'strict': true,
  "schema":{
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
            type: {
              type: "string",
              enum: ["character dialogues", "narrator"],
            },
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
                //   positioning_of_characters:{
                //     type: "string",
                //     enum: [
                //       "positioned together", "positioned apart", "positioned against or opposite"
                //     ],
                //     description: `Position of the characters in the panel, it also signifies who are together and who are against or seperated`
                //   }
                 },
                required: ["character", "dialogue", "tone"],
                additionalProperties: false,
              }, 
            },
            location:{
              type:"string",
              description: "Describe Location and environment of the scene, a fictional or real-world location, be descriptive about it's features",
            },
            importantObject:{
              type:"string",
              description: "Describe important object in the scene, a fictional or real-world object, be descriptive about it",
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
          required: [ "type","content", "background_sound","background_music","location", "importantObject"],
          additionalProperties: false,
        },
      },
      characters: {
        type: "array",
        items: {
          type: "object",
          properties: {
            character_name: {
              type: "string",
              description: "Character's name in the panels should match exactly with this name(dont mention about narrator)"
            },
            character_type: {
              type: "string",
              enum: [ "comic/movie character who walks on two legs","comic/movie character who walks on four legs","normal human","four legged normal animal", "robot", "monsterous", "car"],
            },
            sound: {
              type: "string",
              enum: ["male", "female", "deep sound"],
              description: "Sound of the character: male, female, or deep sound."
            },
            size: {
              type: "string",
              enum: ["child", "normal 5'10 feet", "2-3 feet", "10 feet", "enormous size"],
              description: "estimated size of characters"
            },
            role: {
              type: "string",
              enum: ["villain", "hero/good", "normal"],
              description: "is the character good or bad"
            },
          },
          required: ["character", "character_type", "sound", "size", "role"],
          additionalProperties:false,
        }
      }
    },
    required: ["title", "hashtag", "panels", "characters"],
    additionalProperties: false,
  }
  };

  module.exports = schema;