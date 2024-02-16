const schema = {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the story",
      },
      panels: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["character dialogues", "narrator", "scene with no characters"],
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
                    description: "Character's dialogue in the panel or if it is narrator narrating the story then its' dialogue",
                  },
                  tone: {
                    type: "string",
                    enum: ["normal", "happy", "excited", "angry", "sad"],
                    description: "Tone of the dialogue delivery",
                  },
                  pose: {
                    type: "string",
                    enum: [
                        "nornal standing pose","normal sitting pose", "heroic entrance pose","walking pose","running pose","dancing pose","fight pose","defending pose"
                    ],
                    description: "Pose of the character in the panel",
                  },
                  positioning_of_characters:{
                    type: "string",
                    enum: [
                      "positioned together", "positioned apart", "positioned against or opposite"
                    ],
                    description: `Position of the characters in the panel, it also signifies who are together and who are against or seperated`
                  }
                },
                required: ["character", "dialogue", "tone", "pose", "positioning_of_characters"],
              },
            },
            description_of_background: {
              type: "string",
              description: `desscribe background focusing on environmental elements, objects, and atmosphere without including 
              characters or their actions. For example, if the scene is set in a city, describe the buildings, streets, and any notable landmarks or 
              weather conditions. If the scene takes place indoors, detail the room's appearance, including furniture, decorations, and lighting. 
              Use vivid imagery to paint a clear picture of the scene's backdrop, ensuring that the description enhances the mood and context of the panel. 
              Avoid mentioning any story characters or their actions in this description. Aim for creativity and consistency across panels when describing 
              evolving or changing backgrounds`
            },
            background_music: {
              type: "string",
              enum: [
                "no music", "ambient","nature sounds","instrumental","police siren","epic orchestral","fantasy","horror","romantic","mystery",
                "sad","comedy","war drums","sci-fi","adventure"
              ],
              description: `Type of background music or no music`
            },
            
          },
          required: [ "type", "content", "description_of_background", "background_music", "positioning_of_characters"],
        },
      },
      characters: {
        type: "array",
        items: {
          type: "object",
          properties: {
            character: {
              type: "string",
              description: "Character's name in the panels (should match exactly)."
            },
            character_type: {
              type: "string",
              enum: ["human", "famous/well known character", "robot", "animal", "monster", "object"],
              description: "Type of the character, which dictates the format and detail of the visual description to follow."
            },
            sound: {
              type: "string",
              enum: ["male", "female", "deep sound"],
              description: "Sound of the character: male, female, or deep sound."
            },
            size: {
              type: "string",
              enum: ["normal 5'10 feet", "2-3 feet", "10 feet", "enormous size"],
              description: "estimated size of characters"
            }
          },
          required: ["character", "character_type", "sound", "size"],
        }
      }
    },
    required: ["title", "panels", "characters"]
    //   characters: {
    //     type: "array",
    //     items: {
    //       type: "object",
    //       properties: {
    //         character: {
    //           type: "string",
    //           description: "Character's name in the panels(should match exactly)",
    //         },
    //         sound: {
    //           type: "string",
    //           enum: ["male", "female", "deep sound"],
    //           description: "Sound of the character: male, female, or deep sound",
    //         },
    //         visual_description: {
    //           type: "string",
    //           description:`Give visual discription of charcter of atleast 30 words have no metaphorical responses. Describe specificaly 
    //           what they are wearing and what they look like. Following are some examples and explaination with it. Masked heroes like Spiderman-- "Spiderman, red mask, red arms, 
    //           red chest, blue abs, blue legs". Alternate versions like white & gold Spiderman-- "Spiderman, white mask, gold arms, white chest, white abs, 
    //           white legs". Unmasked characters in specific outfits like Hulk(if there is a character who has no mask, always give him or 
    //           her random/actor name)-- "Bruce Banner as Hulk, green muscular body, purple sweatpants, black hair, green eyes". For Normal 
    //           person be specific about clothing as well-- "Henry Chad as caucasian male in mid 30s, green eyes, beard, black sweater, 
    //           blue jeans, white sports shoes". A woman-- "Ananya Patel as south Indian woman in early twenties, black hairs with bangs 
    //           on forehead, black eyes, in formal royal blue suit, royal blue pants, white shirt, black shoes". Anime characters like Goku in 
    //           supersian form 4-- "Goku in supersian form four, anime style, Spiky yellow hair, mulcular bare arms, orange top, orange and blue bottom." 
    //           For Robots, Androids, Monsters: imagine unique features explicitly and keep the prompt 
    //           simple yet descriptive about features, arms, chest, abdomen, legs or anything else. Similarly be specific about animals like 
    //           thier breed, color, furry or not etc.`,
    //       },
    //     },
    //     },
    //     required: ["character", "sound", "visual_description"],
    //   },
    // },
    // required: ["title", "panels", "characters"],
  };
  
  module.exports = schema;