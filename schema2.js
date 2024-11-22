const schema = {
  "name": "screenplay_for_short_comic_like_movie",
  'strict': true,
  "schema":
  {
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
         items:{
          type: "object",
            properties: {
              panel_number:{
                type: "number",
              },
              panel:{
          anyOf:[
          {
          type: "object",
          description:"dialogue panel",
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
                  emotion: {
                    type: "string",
                    enum: ["neutral", "happy", "surprised", "angry", "sad", "afraid"],
                    description: "with what emotion character is delivering the dialogue",
                  },
                  positioning_of_character:{
                    type: "string",
                    enum: [
                      "positioned together", "positioned apart or far away", "positioned opposite to one another"
                    ],
                    description: `Position of the characters in the panel, it also signifies who are together and who are against or seperated`
                  },
                  action_being_performed_or_state_of_character:{
                    type:"string",
                    enum:["sitting", "standing", "flying", "laying", "ready_for_attack", "tired", "running", "dancing"],
                    description:'what is character doing or what state he/she/it is in'
                  },
                
                 },
                required: ["character", "dialogue", "emotion", "positioning_of_character", "action_being_performed_or_state_of_character"],
                "additionalProperties": false,
              }, 
            },
            location_and_environment:{
              type:"string",
              description: `Describe Location and environment of the scene(more like landscape), a fictional or real-world location, be descriptive about it's features, 
              remember not to mention any character's name and dont give description like 'similar to previous location'. Just pure discription of what place looks like, where scene is being carried out.`,
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
          required: ["content", "background_sound","background_music","location_and_environment", "indoor_or_outdoor", "weather"],
          "additionalProperties": false,
      },
      {
        description: "An establishing shot panel that provides an overview of the setting or a key location in the storyline. This shot helps to set the scene and provides context for the action that follows.",
            type: "object",
            properties: {
              //panel_name:"dialogue",
              description_of_the_shot:{
                type:"string",
                "description": `A detailed description of the location or environment in the scene. This could include landscapes, cityscapes, spacecraft, or any other significant setting(weather if outdoor). Be descriptive about its features, 
                colors, and atmosphere. Avoid mentioning characters or giving vague descriptions like 'similar to previous location'. Focus purely on the visual aspects of the place where the scene unfolds.`
              },
              type_of_shot:{
                type: "string",
                enum: [
                  "bird-eye", "low-shot", "vertically-stretched-shot", "horizontally-stretched-shot"
                ],
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
            required: ["type_of_shot", "background_sound", "background_music", "description_of_the_shot"],
          "additionalProperties": false,
      },
      {
        description:"character focus shot for entry or transformation",
            type: "object",
            properties: {
              //panel_name:"focus",
              character:{
                type:"string",
                description: `name of the character this shot is focusing on`,
              },
              reason_for_focusing:{
                type: "string",
                enum: [
                  "normal entry","powerful/super entry", "getting transformed",
                ],
              },
              location_and_environment:{
                type:"string",
                description: `Describe Location and environment of the scene(more like landscape), a fictional or real-world location, be descriptive about it's features, 
                remember NOT to mention any character's name and dont give description like 'similar to previous location'. Just pure discription of what place looks like`,
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
            required: ["character","reason_for_focusing","indoor_or_outdoor", "weather", "background_sound", "background_music", "location_and_environment"],
          "additionalProperties": false,
      },

      // {
      //   description:"someone on TV or on screen.",
      //       type: "object",
      //       properties: {
      //         descriptiom_of_the_shot:{
      //           type:"string",
      //           description: `describe the what we see on TV screen .`,
      //         },

      //         background_sound: {
      //           type: "string",
      //           enum: [
      //             "no sound", "wind", "people bustling", "car sound", "birds chirping", "rain", "thunder", "ocean/river waves", "explosion",
      //           ],
      //         },
      //         background_music: {
      //           type: "string",
      //           enum: [
      //             "no music","instrumental","epic_orchestral","fantasy","horror","romantic","mystery", "sad","adventure"
      //           ],
      //         },
      //       }
      // },


      {
        description: "A fight scene panel that involves characters in combat. This panel should detail the sequence of actions, poses, and use of powers, all based on the characters' abilities. This shot could be shot or it could be long",
        type: "object",
        properties: {
          // panel_name: {
          //   "type": "string",
          //   "enum": ["fight"],
          //   "description": "This specifies that the panel is a fight scene."
          // },
          sequence_of_actions: {
            type: "array",
            description: "A step-by-step sequence of actions that occur during the fight. The sequence should reflect the logical progression of the fight, including attacks, defenses, and other significant actions.",
            items: {
              type: "object",
              properties: {
                character: {
                  type: "string",
                  "description": "Name of the character performing the action. Should match the character's name as defined in the characters array."
                },
                action: {
                  "type": "string",
                  // "enum": ["ready for attack","running to hit","punching", "kicking", "dodging", "being hit by punch", "being hit by kick", "shooting laser", "being hiy by laser", 
                  //   "being hit on wall and dust covers the scene",
                  // ]
                  "enum" :["punching","being hit by punch"]
                },
                
          
              },
              "required": ["character", "action"],
              "additionalProperties": false
            }
          },
          team_winning: {
            "type": "array",
            items: {
              "type": "string",
              "description": "Character name in the winning team."
            }
          },
          losing_team: {
            "type": "array",
            items: {
              "type": "string",
              "description": "Character name in the losing team."
            }
          },
          location_and_environment: {
            "type": "string",
            "description": `Describe the location and environment of the scene (more like landscape), a fictional or real-world location. Be descriptive about its features, 
           do NOT mention any character or its name or vague descriptions like 'similar to previous location.' Just pure description of what the place looks like.`
          },
          indoor_or_outdoor: {
            "type": "string",
            "enum": ["indoor", "outdoor"],
            "description": "Is the scene set indoors, outdoors?"
          },
          weather: {
            "type": "string",
            "enum": ["rainy", "day", "night"],
            "description": "The weather conditions during the scene."
          },
          background_sound: {
            "type": "string",
            "enum": [
              "no sound", "wind", "people bustling", "car sound", "birds chirping", "rain", "thunder", "ocean/river waves", "explosion"
            ],
            "description": "Background sounds that contribute to the atmosphere of the scene."
          },
          background_music: {
            "type": "string",
            "enum": [
              "no music", "instrumental", "epic_orchestral", "fantasy", "horror", "romantic", "mystery", "sad", "adventure"
            ],
            "description": "Background music that sets the tone for the scene."
          }
        },
        required: [ "sequence_of_actions", "team_winning", "losing_team", "location_and_environment", "indoor_or_outdoor", "weather", "background_sound", "background_music"],
        "additionalProperties": false
      }
    
      ] 
    } 
    },
    required: [ "panel_number", "panel"],
        "additionalProperties": false
  },
  
      },
      characters: {
        type: "array",
        items: {
          type: "object",
          properties: {
            character: {
              type: "string",
              description: `Character's name in the panels should match exactly with this name(dont mention about narrator).`
            },
            // base_character: {
            //   type: "string",
            //   description: `The name of the base character, if this is a transformed or alternate version or alter ego or duplicate of another character
            //    (e.g., Tony Stark for Ironman, Goku for Super Siyan 1,2,3, or Naruto shadow clone 1, Naruto shadow clone 2). 
            //   If this is the base form, leave it as the same name as character.`
            // },
            // is_transformation_or_duplicate: {
            //   type: "boolean",
            //   description: "Indicates if this character is a transformation or alternate or duplicate version of another character."
            // },
            
            character_type: {
              type: "string",
              enum: [ "character with two legs","four legged animal", "other"],
            },
            
            sound: {
              type: "string",
              enum: ["male", "female", "deep sound"],
              description: "Sound of the character: male, female, or deep sound."
            },
            height: {
              type: "string",
              enum: [ "normal 5'10 to 6 feet", "2-3 feet", "enormous size"],
              description: "estimated size of characters"
            },
            role: {
              type: "string",
              enum: ["villain", "hero/good", "normal"],
              description: "is the character good or bad"
            },
            
            costume_or_looks:{
                type:"string",
                description:`describe the visual appearance of the character, like face, costume, clothes, age, and be descriptive about it. Dont give description like 
                'similar to another mentioned character'. Just pure discription of what character looks like. Be as discriptive about it as possible as I will use this description to
                generate AI image from Stable Diffusion so this will be a prompt.`
            },

            visual_characteristics_key: {
            type: "string",
            description: `A few words (3-5) describing the character's unique visual appearance, used for identifying unique characters from thousands of custom or classic 
            characters (e.g., 'Captain_America_Henry_Cavill,' 
            'Ironman_Elon_Musk_Silver_Mark1', 'Man_Asian_30s_brownHair_businessSuit', 'Groot_babyTree', 'Invincible_MarkGrayson_yellowBlueSuit', Spiderman2099_MiguelOHara_futuristic).`
            },
          },
          required: ["character", "character_type", "sound", "height", "role", "costume_or_looks", "visual_characteristics_key"],
          "additionalProperties": false,
        }
      }
    },
    required: ["title", "hashtag", "panels", "characters"],
    "additionalProperties": false,
  },
  
  };

  module.exports = schema;





  //dialogue panel
  //fight panel
  //establishing shot panel
  //character focus panel
  //character movement panel