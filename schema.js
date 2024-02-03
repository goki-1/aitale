const schema = {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the comic story",
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
                  character: { type: "string", description: "Character's name in the panel" },
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
                        "front pose standing still",
                        "side pose standing still(left facing)", 
                        "side pose standing still(right facing)",
                        // "standing and waving hand":"", 
                        // "showing anger, hands quenched, and back little bent":"5",
                        // "heroic landing on ground form air":"", 
                        // "standing, front facing, arms wide open":"",
                        // "puching front pose":"5", 
                        // "punching side pose(left facing)":"", 
                    ],
                    description: "Pose of the character in the panel",
                  },
                  character_relative_location_in_panel: {
                    type: "string",
                    enum: ["left", "right", "center", "background"],
                    description: "Direct where characters are located relative to each other or to the scene. All of them cannot be at center",
                  },
                },
                required: ["character", "dialogue", "tone", "pose", "character_relative_location_in_panel"],
              },
            },
            description_of_background: {
              type: "string",
              description: `describe what the background looks like, show certain level of common sense, consistency(only where required) 
              and creativity within multiple panels. Do not inlude name of any story character in this description in any way please.`,
            },
            camera_movement: {
              type: "string",
              enum: ["up", "down", "zoom in", "zoom out", "left to right", "right to left"],
              description: "Simulate how the camera would move in this scene or panel",
            },
            background_music: {
              type: "string",
              enum: ["no music", "ambient", "nature sounds", "instrumental", "police siren"],
              description: "Type of background music or no music",
            },
            
          },
          required: [ "type", "content", "description_of_background", "background_music", "camera_movement"],
        },
      },
      characters: {
        type: "array",
        items: {
          type: "object",
          properties: {
            character: {
              type: "string",
              description: "Character's name in the panels(should match exactly)",
            },
            sound: {
              type: "string",
              enum: ["male", "female", "deep sound"],
              description: "Sound of the character: male, female, or deep sound",
            },
            visual_description: {
              type: "string",
              description:`Give visual discription of charcter of atleast 30 words have no metaphorical responses. Describe specificaly 
              what they are wearing and what they look like. Following are some examples and explaination with it. Masked heroes like Spiderman-- "Spiderman, red mask, red arms, 
              red chest, blue abs, blue legs". Alternate versions like white & gold Spiderman-- "Spiderman, white mask, gold arms, white chest, white abs, 
              white legs". Unmasked characters in specific outfits like Hulk(if there is a character who has no mask, always give him or 
              her random/actor name)-- "Bruce Banner as Hulk, green muscular body, purple sweatpants, black hair, green eyes". For Normal 
              person be specific about clothing as well-- "Henry Hemsworth as caucasian male in mid 30s, green eyes, beard, black sweater, 
              blue jeans, white sports shoes". A woman-- "Ananya Patel as south Indian woman in early twenties, black hairs with bangs 
              on forehead, black eyes, in formal royal blue suit, royal blue pants, white shirt, black shoes". Anime characters like Goku in 
              supersian form 4-- "Goku in supersian form four, anime style, Spiky yellow hair, mulcular bare arms, orange top, orange and blue bottom." 
              For Robots, Androids, Monsters (going to providing explaination): imagine unique features explicitly and keep the prompt 
              simple yet descriptive about features, arms, chest, abdomen, legs or anything else. Similarly be specific about animals like 
              thier breed, color, furry or not etc.`,
          },
        },
        },
        required: ["character", "sound", "visual_description"],
      },
    },
    required: ["title", "panels", "characters"],
  };
  
  module.exports = schema;