// const schema = {
//     type: "object",
//     properties: {
//       title: {
//         type: "string",
//         description: "Title of the comic story",
//       },
//       panels: {
//         type: "object",
//         description:`there are different types of panels. Panel which has multiple characters and their dialogues. Panel which has single
//         character who have dialogue or no dialogue(silence). Panel which has no character and shows something like scenery/landscape/buliding
//         or anything else related to story or background`,
//         oneOf:[
//         {
//           type: "object",
//           properties: {
//             type: {
//                 type: "string",
//                 enum: ["dialogues","monologue","silence"],
//               },
//             content: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   character: {
//                     type: "string",
//                     description: "Character's name in the panel",
//                   },
//                   dialogue: {
//                     type: "string",
//                     description: `Character's dialogue in the panel or return empty string if there is no dialogue and silence is required. 
//                     Like show the character as camera focus is required on his face at this moment`,
//                   },
//                   tone: {
//                     type: "string",
//                     enum: ["normal", "happy", "excited", "angry", "sad"],
//                     description: "Tone of the dialogue dilvery",
//                   },
//                   pose: {
//                     type: "string",
//                     enum:["front pose standing still","side pose standing still(left facing)","standing and waving hand", "showing anger, hands quenched, and back little bent",
//                     "boxing side pose(left facing)","boxing pose(front facing)", "heroic landing on gorund form air", "standing, front facing, arms wide open",
//                     "puching front pose", "punching side pose(left facing)", "showing back or back pose", "ironman shooting with hand propulsion",
//                     ""],
//                     description: "Pose of the character in the panel, use normal pose unless fancy pose is required.",
//                   },
//                   character_relative_location_in_panel:{
//                     type:"string",
//                     enum:["left","right","center","background"],
//                     description:`Direct where characters are located relative to each other or to the scene`,
//                 },
//                 },
//                 required:["character","dialogue","tone","pose","character_relative_location_in_panel"]
//               },
//             },
//             description_of_background: {
//               type: "string",
//               description: `Visually describe what the scene looks like(no description of any character), describe what the background will 
//               look like, show certain level of comman sense, consistency(only where required) and creativity within multiple panels. Do not
//               describe characters`,
//             },
            
//             camera_movement: {
//               type: "string",
//               enum:["up","down", "zoom in","zoom out","left to right","right to left"],
//               description: "simulate how camera would move in this scene or panel",
//             },
             
//             background_music:{
//                 type: "string",
//                 enum:["no music","sad","exciting","War like","smoothing","intense","happy"],
//                 description:"type of background music or no music.",
//             }
//           },
//           required: ["content", "description_of_background", "camera_movement", "background_music"],
//         },

//         {
//             type: "object",
//             properties: {
//               type: {
//                 type: "string",
//                 enum: ["scene"],
//                 default: "scene",
//               },
//               description_of_scene: {
//                 type: "string",
//                 description: "Description of the scene (landscape, objects, etc.)",
//               },
//               camera_movement: {
//                 type: "string",
//                 enum: ["up", "down", "zoom in", "zoom out", "left to right", "right to left"],
//                 description: "Simulate how the camera would move in this scene or panel",
//               },
//               background_music: {
//                 type: "string",
//                 enum: ["no music", "ambient", "nature sounds", "instrumental","police siren"],
//                 description: "Type of background music or no music.",
//               },
//             },
//             required: ["type", "description_of_scene", "camera_movement", "background_music"],
//           },
//     ],
//       },
//     }
// }
    //   characters: {
    //     type: "array",
    //     items: {
    //       type: "object",
    //       properties: {
    //         character: {
    //           type: "string",
    //           description: "Character name",
    //         },
    //         sound: {
    //           type: "string",
    //           enum: ["male", "female", "deep sound"],
    //           description: "Sound of the character: male, female, or deep sound",
    //         },
    //         visual_description: {
    //           type: "string",
    //           description:`You are a prompt generator for AI images. Give visual discription, be precise and have no metaphorical 
    //           responses. Following are some examples and explaination with it. Masked heroes like Spiderman-- "Spiderman, red mask, red arms, 
    //           red chest, blue abs, blue legs". Alternate versions like white & gold Spiderman-- "Spiderman, white mask, gold arms, white chest, white abs, 
    //           white legs". Unmasked characters in specific outfits like Hulk(if there is a character who has no mask, always give him or 
    //           her random/actor name)-- "Bruce Banner as Hulk, green muscular body, purple sweatpants, black hair, green eyes". For Normal 
    //           person be specific about clothing as well-- "Henry Hemsworth as caucasian male in mid 30s, green eyes, beard, black sweater, 
    //           blue jeans, white sports shoes". A woman-- "Ananya Patel as south Indian woman in early twenties, black hairs with bangs 
    //           on forehead, black eyes, in formal royal blue suit, royal blue pants, white shirt, black shoes". Anime characters like Goku in 
    //           supersian form 4-- "Goku in supersian form four, anime style, Spiky yellow hair, mulcular bare arms, orange top, orange and blue bottom." 
    //           For Robots, Androids, Monsters (going to providing explaination): imagine unique features explicitly and keep the prompt 
    //           simple yet descriptive about features, arms, chest, abdomen, legs or anything else. Similarly be specific about animals like 
    //           thier breed, color, furry or not etc.`,
    //       },
    //     },
    //     },
    //     required: ["character", "sound", "visual_description"],
    //   },
//     },
//     required: ["panels"],
//   };
  
//   module.exports = schema;

// const generatedText = `{"title":"Avengers vs Justice League","panels":[{"type":"scene with no characters","description_of_background":"The city is under attack as the Avengers and the Justice League face off in an epic battle. Buildings lie in ruins, and the sky is filled with ominous clouds.","background_music":"ambient"},{"type":"character dialogues","content":[{"character":"Captain America","dialogue":"We need to contain Darkseids forces! Avengers, assemble!","tone":"heroic","pose":"heroic landing on ground from air","character_relative_location_in_panel":"center"},{"character":"Batman","dialogue":"Superman, cover the civilians. Flash, assist Wonder Woman. Lets end this chaos.","tone":"determined","pose":"boxing pose(front facing)","character_relative_location_in_panel":"center"}]},{"type":"character dialogues","content":[{"character":"Superman","dialogue":"You got it, Cap. Flash, let's clear the streets. 
//Wonder Woman, with me!","tone":"confident","pose":"standing and waving hand","character_relative_location_in_panel":"center"},
// {"character":"Iron Man","dialogue":"Thor, bring the lightning! Hawkeye, provide air support. We've got this.","tone":"confident","pose":"punching front pose","character_relative_location_in_panel":"center"}]},{"type":"scene with no characters","description_of_background":"The clash of titans continues as the city trembles under the impact of their powers. Smoke billows from the devastation, and the ground shakes with every blow.","background_music":"instrumental"},{"type":"character dialogues","content":[{"character":"Wonder Woman","dialogue":"You face justice now, Thanos. We will not yield to your tyranny.","tone":"determined","pose":"front pose standing still","character_relative_location_in_panel":"left"},{"character":"Hulk","dialogue":"Hulk smash Darkseid! No one hurts puny humans.","tone":"angry","pose":"boxing pose(front facing)",
//"character_relative_location_in_panel":"right"}]},{"type":"character dialogues","content":[{"character":"Flash","dialogue":"I'll take Darkseid head on. You guys handle the minions.","tone":"confident","pose":"standing and waving hand","character_relative_location_in_panel":"left"},{"character":"Aquaman","dialogue":"The seas rage with our fury. Darkseid, prepare for justice.","tone":"angry","pose":"front pose standing still","character_relative_location_in_panel":"right"}]},{"type":"scene with no characters","description_of_background":"The battle rages on, with energy beams, lightning, and superhuman strength on full display. The fate of the city hangs in the balance.","background_music":"ambient"},{"type":"character dialogues","content":[{"character":"Thor","dialogue":"None can withstand the might of Mjolnir! Darkseid, your time is at an end.
//","tone":"heroic","pose":"front pose standing still","character_relative_location_in_panel":"center"},{"character":"Green Lantern","dialogue":"Avengers, stand firm! Justice League, show them what we're made of.","tone":"determined","pose":"front pose standing still","character_relative_location_in_panel":"center"}]}],"characters":[{"character":"Captain America","visual_description":"Captain America in his iconic suit, bearing the shield with the star emblem, noble and determined in the face of danger."},{"character":"Batman","visual_description":"Batman in his armored suit, cowl and cape billowing, the shadow of Gotham ready to strike at the heart of the threat."},{"character":"Superman","visual_description":"Superman, the Man of Steel, in his heroic attire, the symbol of hope as he watches over the innocent with unwavering resolve."},
//{"character":"Iron Man","visual_description":"Tony Stark as Iron Man, armor glinting in the chaos, repulsors charged and ready to bring the fight to the enemy."},{"character":"Wonder Woman","visual_description":"Wonder Woman, an Amazon warrior, with her lasso and sword, a beacon of strength and courage amidst the chaos."},{"character":"Hulk","visual_description":"Bruce Banner as the Hulk, towering and fierce, a force of nature as he unleashes his fury upon the invading forces."},{"character":"Flash","visual_description":"The Flash, crackling with speed and energy, the scarlet blur striking with swift justice against the encroaching dark forces."},{"character":"Aquaman","visual_description":"Aquaman, trident in hand, commanding the fury of the seas and the might of the ocean to repel the enemy onslaught."},
//{"character":"Thor","visual_description":"The God of Thunder, Thor, wielding Mjolnir, the stormbreaker, radiating power and valor in the heat of battle."},{"character":"Green Lantern","visual_description":"Green Lantern, emanating the emerald light of willpower, resolute in the defense of the city, a steadfast guardian of order and justice."}]}`;

//   [{"background_music": "c8c68580-d24d-4f57-9ba0-e2e4831341d2", "description_of_background": "The city is under attack as the Avengers and the Justice League face off in an epic battle. Buildings lie in ruins, and the sky is filled with ominous clouds.", "type": "scene with no characters"}, 
//   {"content": [Array], "type": "character dialogues"}, 
//   {"content": [Array], "type": "character dialogues"},
//   {"background_music": "instrumental", "description_of_background": "The clash of titans continues as the city trembles under the impact of their powers. Smoke billows from the devastation, and the ground shakes with every blow.", "type": "scene with no characters"}, 
//   {"content": [Array], "type": "character dialogues"}, 
//   {"content": [Array], "type": "character dialogues"}, 
//   {"background_music": "ambient", "description_of_background": "The battle rages on, with energy beams, lightning, and superhuman strength on full display. The fate of the city hangs in the balance.", "type": "scene with no characters"}, 
//   {"content": [Array], "type": "character dialogues"}], "title": "Avengers vs Justice League"}




//   {"title":"Avengers vs Justice League",
//   "panels":[{"type":"scene","content":[],"description_of_background":"The city is in chaos, with skyscrapers crumbling and explosions lighting up the sky. The Avengers and Justice League face off in an epic battle, each determined to protect the innocent and emerge victorious.","camera_movement":"zoom out","background_music":"epic battle music"},
//   {"type":"dialogues","content":[{"character":"Iron Man","dialogue":"This is it, team! We can't let them take over the city!","tone":"excited","pose":"ironman shooting with hand propulsion","character_relative_location_in_panel":"left"},{"character":"Superman","dialogue":"You should stand down, Tony. This fight is bigger than you realize.","tone":"serious","pose":"standing and waving hand","character_relative_location_in_panel":"right"},{"character":"Black Widow","dialogue":"We've faced worse odds before. Let's do this.","tone":"confident","pose":"standing, front facing, arms wide open","character_relative_location_in_panel":"center"},{"character":"Wonder Woman","dialogue":"We fight for justice, and we will not be swayed!","tone":"determined","pose":"standing, front facing, arms wide open","character_relative_location_in_panel":"right"}]},
//   {"type":"dialogues","content":[{"character":"Captain America","dialogue":"We stand as one, Avengers! Assemble!","tone":"heroic","pose":"heroic landing on ground from air","character_relative_location_in_panel":"center"},{"character":"Batman","dialogue":"I don't need a team to finish this.","tone":"serious","pose":"showing anger, hands quenched, and back little bent","character_relative_location_in_panel":"left"},{"character":"Thor","dialogue":"The thunder roars with our battle cry! Let lightning strike our foes!","tone":"boastful","pose":"standing and waving hand","character_relative_location_in_panel":"center"},{"character":"Flash","dialogue":"Are you ready to see speed in action? I've got this!","tone":"excited","pose":"showing back or back pose","character_relative_location_in_panel":"left"}]},
//   {"type":"dialogues","content":[{"character":"Hulk","dialogue":"Hulk smash puny metahumans!","tone":"angry","pose":"boxing pose(front facing)","character_relative_location_in_panel":"center"},{"character":"Aquaman","dialogue":"The seas rise to protect their king and crush all who oppose us!","tone":"authoritative","pose":"front pose standing still","character_relative_location_in_panel":"left"}]},
//   {"type":"scene","content":[],"description_of_background":"The battle rages on, with energy blasts and thunderous clashes filling the air. The fate of the city hangs in the balance as the two legendary teams clash in an epic showdown for the ages.","camera_movement":"up","background_music":"epic battle music"}],
//   "characters":[{"character":"Iron Man","visual_description":"Tony Stark as Ironman, in his iconic red and gold suit, repulsor gauntlets glowing."},{"character":"Superman","visual_description":"Superman, the Man of Steel, in his classic red and blue suit, with the symbol of hope emblazoned on his chest."},{"character":"Black Widow","visual_description":"Natasha Romanoff as Black Widow, in her sleek black outfit, weapons at the ready."},{"character":"Wonder Woman","visual_description":"Wonder Woman, with her lasso and shield, a beacon of strength and determination."},{"character":"Captain America","visual_description":"Steve Rogers as Captain America, holding his shield, determined and unwavering."},{"character":"Batman","visual_description":"The Dark Knight, Batman, in his imposing black and gray suit, standing tall and formidable."},
//{"character":"Thor","visual_description":"Thor, the God of Thunder, wielding Mjolnir and crackling with electricity."},{"character":"Flash","visual_description":"The Flash, in his red and gold costume, ready to move at the speed of light."},{"character":"Hulk","visual_description":"Bruce Banner as Hulk, green muscular body, purple shorts, and an enraged expression."},{"character":"Aquaman","visual_description":"Aquaman, with his trident and regal armor, commanding the might of the ocean."}]}

//   "url": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/0da6be15-795c-487c-9cd9-e57ec60bde65/variations/Default_Steve_Rogers_as_Captain_America_mesmerising_look_high_0_0da6be15-795c-487c-9cd9-e57ec60bde65_0.png",
//   "url": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/aeaca260-651d-4c90-8d33-8a3723d30bc3/AlbedoBase_XL_Steve_Rogers_as_Captain_America_mesmerising_look_0.jpg",
//
// Helper function to generate a random number (0 or 1)


const getRandomExtremeValue = () => Math.round(Math.random());
// Helper function to create a new character dialogue single panel
// Helper function to create a new character dialogue single panel
const createCharacterDialogueSinglePanel = (parentPanel, character, index, initialAppearances) => {
  
  const isInitialAppearance = !initialAppearances.includes(character.character);

  const cameraMovement = isInitialAppearance
    ? { camera_movement: 'zoom in and up' }
    : { camera_movement: 'some random zoom in'};

  return {
    type: 'character dialogues single',
    content: [{
      character: character.character,
      dialogue: character.dialogue,
      gen_id: character.gen_id,
      tone: character.tone,
      pose: character.pose,
      character_relative_location_in_panel: character.character_relative_location_in_panel,
    },],
    background_music: parentPanel.background_music,
    index: index,
    gen_id: parentPanel.gen_id,
    ...cameraMovement,
  };
};

// Main function to transform the original JSON
const transformJson = (originalJson) => {
  let currentIndex = 0;
  const charactersWithInitialAppearance = [];

  const transformedJson = {
    ...originalJson,
    panels: originalJson.panels.flatMap((panel, panelIndex) => {
      const modifiedPanel = {
        ...panel,
        index: currentIndex++,
      };

      const newPanels = [modifiedPanel];
  
      if (panel.type === 'narrator' || panel.type === 'scene with no characters') {
        if (panel.camera_movement === 'right to left' || panel.camera_movement === 'left to right') {
          modifiedPanel.extreme = getRandomExtremeValue();
        }
      } else if (panel.type === 'character dialogues') {
        panel.content.forEach((character, characterIndex) => {
          
          const characterDialogueSinglePanel = createCharacterDialogueSinglePanel(
            modifiedPanel,
            character,
            currentIndex,
            charactersWithInitialAppearance
          );

          if (!charactersWithInitialAppearance.includes(character.character)) {
            charactersWithInitialAppearance.push(character.character);
          }
          currentIndex++;
          newPanels.push(characterDialogueSinglePanel);
        });
      }

      return newPanels;
    }),
  };

  return transformedJson;
};

// Usage
let generatedText = {
  "title": "Ironman and Spiderman vs Venom",
  "panels": [
    {
      "type": "character dialogues",
      "content": [
        {
          "character": "Ironman",
          "dialogue": "Spiderman, we need to take Venom down!",
          "tone": "serious",
          "pose": "front pose standing still",
          "character_relative_location_in_panel": "left",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/ea72e979-509e-4aa9-a83f-fd7f9a19fe53/variations/Default_Robert_Downey_Jr_as_Ironman_in_the_iconic_red_and_gold_0_ea72e979-509e-4aa9-a83f-fd7f9a19fe53_0.png"
        },
        {
          "character": "Spiderman",
          "dialogue": "I'm ready! Let's do this!",
          "tone": "determined",
          "pose": "front pose standing still",
          "character_relative_location_in_panel": "right",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/e178460a-2236-4376-ae9a-1b9195dbc60f/variations/Default_Tom_Holland_as_Spiderman_in_the_classic_red_and_blue_w_0_e178460a-2236-4376-ae9a-1b9195dbc60f_0.png"
        }
      ],
      "description_of_background": "the city streets, with towering skyscrapers in the background.",
      "camera_movement": "zoom in",
      "background_music": "ambient",
      "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/05072638-04e2-42dc-adeb-74244705d9be/Leonardo_Diffusion_XL_busy_city_night_time_0.jpg"
    },
    {
      "type": "scene with no characters",
      "content": [],
      "description_of_background": "busy city, night time.",
      "camera_movement": "right to left",
      "background_music": "police siren",
      "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b0b28199-be76-41c9-b87a-b0f7a30a9e03/Leonardo_Diffusion_XL_the_city_streets_with_towering_skyscrape_0.jpg"
    },
    {
      "type": "narrator",
      "content": [
        {
          "character": "narrator",
          "dialogue": "To save the city Spiderman and ironman has to take down Venom together",
          "tone": "serious",
          "pose": "",
          "character_relative_location_in_panel": "",
          "gen_id":""
        },
      ],
      "description_of_background": "busy city, night time.",
      "camera_movement": "right to left",
      "background_music": "police siren",
      "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b0b28199-be76-41c9-b87a-b0f7a30a9e03/Leonardo_Diffusion_XL_the_city_streets_with_towering_skyscrape_0.jpg"
    },
    {
      "type": "character dialogues",
      "content": [
        {
          "character": "Venom",
          "dialogue": "You can't stop me! I am the ultimate predator!",
          "tone": "menacing",
          "pose": "side pose standing still(right facing)",
          "character_relative_location_in_panel": "center",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/edde5f6e-63f8-484e-bb2b-94088c292f6d/variations/Default_Venom_a_formidable_and_monstrous_being_with_dark_symbi_0_edde5f6e-63f8-484e-bb2b-94088c292f6d_0.png"
        },
        {
          "character": "Spiderman",
          "dialogue": "With great powers come great responsibilities",
          "tone": "determined",
          "pose": "side pose standing still(left facing)",
          "character_relative_location_in_panel": "right",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/a3d47ef4-d76d-4513-a5e1-426895e1eac8/variations/Default_Tom_Holland_as_Spiderman_in_the_classic_red_and_blue_w_0_a3d47ef4-d76d-4513-a5e1-426895e1eac8_0.png"
        },
        {
          "character": "Ironman",
          "dialogue": "And, I, am, Ironman!",
          "tone": "serious",
          "pose": "side pose standing still(left facing)",
          "character_relative_location_in_panel": "right",
          "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/0c60357e-a959-411a-8b39-d3d33e9137a5/variations/Default_back_pose_Robert_Downey_Jr_as_Ironman_in_the_iconic_re_0_0c60357e-a959-411a-8b39-d3d33e9137a5_0.png"
        },
      ],
      "description_of_background": "City, roads, cars, ground level",
      "camera_movement": "zoom out",
      "background_music": "no music",
      "gen_id":"https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b46ce78d-3b5a-465b-83f5-6eee9c899cd5/Leonardo_Diffusion_XL_City_roads_cars_ground_level_0.jpg"
    }
  ],
  "characters": [
    {
      "character": "Ironman",
      "sound": "male",
      "visual_description": "Robert Downey Jr. as Ironman, in the iconic red and gold armored suit, with glowing arc reactor in the chest and a helmet with a face plate."
    },
    {
      "character": "Spiderman",
      "sound": "male",
      "visual_description": "Tom Holland as Spiderman, in the classic red and blue web-slinger suit, with the iconic spider emblem on the chest and expressive eye lenses."
    },
    {
      "character": "Venom",
      "sound": "deep sound",
      "visual_description": "Venom, a formidable and monstrous being, with dark symbiote tendrils, glowing eyes, and a menacing, toothy grin."
    }
  ]
}
const generatedTextTransformed = transformJson(generatedText);
console.log(JSON.stringify(generatedTextTransformed, null, 2));


let generatedTextt = {
  "title": "Ironman and Spiderman vs Venom",
  "panels": [
    {
      "type": "character dialogues",
      "content": [
        {
          "character": "Ironman",
          "dialogue": "Spiderman, we need to take Venom down!",
          "tone": "serious",
          "pose": "front pose standing still",
          "character_relative_location_in_panel": "left",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/ea72e979-509e-4aa9-a83f-fd7f9a19fe53/variations/Default_Robert_Downey_Jr_as_Ironman_in_the_iconic_red_and_gold_0_ea72e979-509e-4aa9-a83f-fd7f9a19fe53_0.png"
        },
        {
          "character": "Spiderman",
          "dialogue": "I'm ready! Let's do this!",
          "tone": "determined",
          "pose": "front pose standing still",
          "character_relative_location_in_panel": "right",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/e178460a-2236-4376-ae9a-1b9195dbc60f/variations/Default_Tom_Holland_as_Spiderman_in_the_classic_red_and_blue_w_0_e178460a-2236-4376-ae9a-1b9195dbc60f_0.png"
        }
      ],
      "description_of_background": "the city streets, with towering skyscrapers in the background.",
      "camera_movement": "zoom in",
      "background_music": "ambient",
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/05072638-04e2-42dc-adeb-74244705d9be/Leonardo_Diffusion_XL_busy_city_night_time_0.jpg",
      "index": 0
    },
    {
      "type": "character dialogues single",
      "content": [
        {
          "character": "Ironman",
          "dialogue": "Spiderman, we need to take Venom down!",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/ea72e979-509e-4aa9-a83f-fd7f9a19fe53/variations/Default_Robert_Downey_Jr_as_Ironman_in_the_iconic_red_and_gold_0_ea72e979-509e-4aa9-a83f-fd7f9a19fe53_0.png",
          "tone": "serious",
          "pose": "front pose standing still",
          "character_relative_location_in_panel": "left"
        }
      ],
      "background_music": "ambient",
      "index": 1,
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/05072638-04e2-42dc-adeb-74244705d9be/Leonardo_Diffusion_XL_busy_city_night_time_0.jpg",
      "camera_movement": "zoom in and up"
    },
    {
      "type": "character dialogues single",
      "content": [
        {
          "character": "Spiderman",
          "dialogue": "I'm ready! Let's do this!",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/e178460a-2236-4376-ae9a-1b9195dbc60f/variations/Default_Tom_Holland_as_Spiderman_in_the_classic_red_and_blue_w_0_e178460a-2236-4376-ae9a-1b9195dbc60f_0.png",
          "tone": "determined",
          "pose": "front pose standing still",
          "character_relative_location_in_panel": "right"
        }
      ],
      "background_music": "ambient",
      "index": 2,
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/05072638-04e2-42dc-adeb-74244705d9be/Leonardo_Diffusion_XL_busy_city_night_time_0.jpg",
      "camera_movement": "zoom in and up"
    },
    {
      "type": "scene with no characters",
      "content": [],
      "description_of_background": "busy city, night time.",
      "camera_movement": "right to left",
      "background_music": "police siren",
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b0b28199-be76-41c9-b87a-b0f7a30a9e03/Leonardo_Diffusion_XL_the_city_streets_with_towering_skyscrape_0.jpg",
      "index": 3,
      "extreme": 0
    },
    {
      "type": "narrator",
      "content": [
        {
          "character": "narrator",
          "dialogue": "To save the city Spiderman and ironman has to take down Venom together",
          "tone": "serious",
          "pose": "",
          "character_relative_location_in_panel": "",
          "gen_id": ""
        }
      ],
      "description_of_background": "busy city, night time.",
      "camera_movement": "right to left",
      "background_music": "police siren",
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b0b28199-be76-41c9-b87a-b0f7a30a9e03/Leonardo_Diffusion_XL_the_city_streets_with_towering_skyscrape_0.jpg",
      "index": 4,
      "extreme": 1
    },
    {
      "type": "character dialogues",
      "content": [
        {
          "character": "Venom",
          "dialogue": "You can't stop me! I am the ultimate predator!",
          "tone": "menacing",
          "pose": "side pose standing still(right facing)",
          "character_relative_location_in_panel": "center",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/edde5f6e-63f8-484e-bb2b-94088c292f6d/variations/Default_Venom_a_formidable_and_monstrous_being_with_dark_symbi_0_edde5f6e-63f8-484e-bb2b-94088c292f6d_0.png"
        },
        {
          "character": "Spiderman",
          "dialogue": "With great powers come great responsibilities",
          "tone": "determined",
          "pose": "side pose standing still(left facing)",
          "character_relative_location_in_panel": "right",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/a3d47ef4-d76d-4513-a5e1-426895e1eac8/variations/Default_Tom_Holland_as_Spiderman_in_the_classic_red_and_blue_w_0_a3d47ef4-d76d-4513-a5e1-426895e1eac8_0.png"
        },
        {
          "character": "Ironman",
          "dialogue": "And, I, am, Ironman!",
          "tone": "serious",
          "pose": "side pose standing still(left facing)",
          "character_relative_location_in_panel": "right",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/0c60357e-a959-411a-8b39-d3d33e9137a5/variations/Default_back_pose_Robert_Downey_Jr_as_Ironman_in_the_iconic_re_0_0c60357e-a959-411a-8b39-d3d33e9137a5_0.png"
        }
      ],
      "description_of_background": "City, roads, cars, ground level",
      "camera_movement": "zoom out",
      "background_music": "no music",
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b46ce78d-3b5a-465b-83f5-6eee9c899cd5/Leonardo_Diffusion_XL_City_roads_cars_ground_level_0.jpg",
      "index": 5
    },
    {
      "type": "character dialogues single",
      "content": [
        {
          "character": "Venom",
          "dialogue": "You can't stop me! I am the ultimate predator!",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/edde5f6e-63f8-484e-bb2b-94088c292f6d/variations/Default_Venom_a_formidable_and_monstrous_being_with_dark_symbi_0_edde5f6e-63f8-484e-bb2b-94088c292f6d_0.png",
          "tone": "menacing",
          "pose": "side pose standing still(right facing)",
          "character_relative_location_in_panel": "center"
        }
      ],
      "background_music": "no music",
      "index": 6,
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b46ce78d-3b5a-465b-83f5-6eee9c899cd5/Leonardo_Diffusion_XL_City_roads_cars_ground_level_0.jpg",
      "camera_movement": "zoom in and up"
    },
    {
      "type": "character dialogues single",
      "content": [
        {
          "character": "Spiderman",
          "dialogue": "With great powers come great responsibilities",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/a3d47ef4-d76d-4513-a5e1-426895e1eac8/variations/Default_Tom_Holland_as_Spiderman_in_the_classic_red_and_blue_w_0_a3d47ef4-d76d-4513-a5e1-426895e1eac8_0.png",
          "tone": "determined",
          "pose": "side pose standing still(left facing)",
          "character_relative_location_in_panel": "right"
        }
      ],
      "background_music": "no music",
      "index": 7,
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b46ce78d-3b5a-465b-83f5-6eee9c899cd5/Leonardo_Diffusion_XL_City_roads_cars_ground_level_0.jpg",
      "camera_movement": "some random zoom in"
    },
    {
      "type": "character dialogues single",
      "content": [
        {
          "character": "Ironman",
          "dialogue": "And, I, am, Ironman!",
          "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/0c60357e-a959-411a-8b39-d3d33e9137a5/variations/Default_back_pose_Robert_Downey_Jr_as_Ironman_in_the_iconic_re_0_0c60357e-a959-411a-8b39-d3d33e9137a5_0.png",
          "tone": "serious",
          "pose": "side pose standing still(left facing)",
          "character_relative_location_in_panel": "right"
        }
      ],
      "background_music": "no music",
      "index": 8,
      "gen_id": "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/b46ce78d-3b5a-465b-83f5-6eee9c899cd5/Leonardo_Diffusion_XL_City_roads_cars_ground_level_0.jpg",
      "camera_movement": "some random zoom in"
    }
  ],
  "characters": [
    {
      "character": "Ironman",
      "sound": "male",
      "visual_description": "Robert Downey Jr. as Ironman, in the iconic red and gold armored suit, with glowing arc reactor in the chest and a helmet with a face plate."
    },
    {
      "character": "Spiderman",
      "sound": "male",
      "visual_description": "Tom Holland as Spiderman, in the classic red and blue web-slinger suit, with the iconic spider emblem on the chest and expressive eye lenses."
    },
    {
      "character": "Venom",
      "sound": "deep sound",
      "visual_description": "Venom, a formidable and monstrous being, with dark symbiote tendrils, glowing eyes, and a menacing, toothy grin."
    }
  ]
}


const key = API_KEY
const address = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`
const payload = createRequest("lets do it")
const path = `${RNFS.DocumentDirectoryPath}/voice.mp3`
try {
  const response = await fetch(`${address}`, payload)
  const result = await response.json()
  console.log(result)
  await createFile(path, result.audioContent)
  playMusic(path)
} catch (err) {
  console.warn("22",err)
}

const createRequest = text => ({
  headers : {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: {
      text: text,
    },
    voice: {
      "languageCode": "en-US",
      "name": "en-US-Neural2-A",
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  }),
  method: 'POST',
});

const createFile = async (path, data) => {
  try {
    return await RNFS.writeFile(path, data, 'base64')
  } catch (err) {
    console.warn(err)
  }
  
  return null
 }
const playMusic = (music) => {
  const speech = new Sound(music, '', (error) => {
    if (error) {
      console.warn('failed to load the sound', error)
  
      return null
    }
    speech.play((success) => {
      if (!success) {
        console.warn('playback failed due to audio decoding errors')
      }
    })
  
    return null
  })
 }
 import React, { useState, useEffect } from 'react';
import { View, FlatList, SafeAreaView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { createUser } from '../graphql/mutations';
import { getCurrentUser } from 'aws-amplify/auth';

const HomeScreen = () => {
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [loading, setLoading] = useState(false);
  const client = generateClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authUser = await getCurrentUser();
        console.log(authUser);
        const { data, errors } = await client.graphql({
          query: createUser,
          variables: {
            input: {
              "email": authUser.email,
              "userId": "Lorem ipsum dolor sit amet",
              "username": "Lorem ipsum dolor sit amet",
              "name": "Lorem ipsum dolor sit amet",
              "posts": [],
              "savedPosts": [],
              "interests": [],
              "followers": [],
              "likedPosts": [],
              "dislikedPosts": [],
              "viewedPosts": [],
              "credits": 1020
            }
          }
        });

        if (errors) {
          console.error('Error creating user:', errors);
          return;
        }

        console.log('User created successfully:', data.createUser);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

};

export default HomeScreen;
// const follow = () => {
  //   return currentUser.interests.includes(userid);
  // };
  //const [isLiked, setIsLiked] = useState(liked);
 // const [isDisliked, setIsDisliked] = useState(disliked);

  //const [isFollowing, setIsFollowing] = useState(follow);

  // const handleLikePress = () => {
  //   setIsLiked(!isLiked);
  //   if (isLiked) {
  //     setnumOfLikes((prevlikes) => prevlikes - 1);
  //     id.likes = returnlikes();
  //     currentUser.likedPosts = currentUser.likedPosts.filter(postId => postId !== id);
  //   } 
  //   else {
  //     setnumOfLikes((prevLikes) => prevLikes + 1);
  //     id.likes = returnlikes();
  //     currentUser.likedPosts = [...currentUser.likedPosts, id];
  //     }
    
  //     if(isDisliked){
  //       setnumOfDislikes((prevDislikes) => prevDislikes - 1);
  //       id.dislikes = returndislikes();
  //       currentUser.dislikedPosts = currentUser.dislikedPosts.filter(postId => postId !== id);
  //     }
  //     setIsDisliked(false);
  //   // Add logic for handling like action
  // };
  
  // const handleDislikePress = () => {
  //   setIsDisliked(!isDisliked);
  //   if (isDisliked) {
  //     setnumOfDislikes((prevDislikes) => prevDislikes - 1);
  //     id.dislikes = returndislikes();
  //     currentUser.dislikedPosts = currentUser.dislikedPosts.filter(postId => postId !== id);
  //   } else {
  //     setnumOfDislikes((prevDislikes) => prevDislikes + 1);
  //     id.dislikes = returndislikes();
  //     currentUser.dislikedPosts = [...currentUser.dislikedPosts, id];
  //   }

  //   if(isLiked){
  //       setnumOfLikes((prevlikes) => prevlikes - 1);
  //       id.likes = returnlikes();
  //       currentUser.likedPosts = currentUser.likedPosts.filter(postId => postId !== id);
  //   }
  //   setIsLiked(false);
  //   // Add logic for handling dislike action
  // };
  // const handleFollowPress = () => {
  //   setIsFollowing(!isFollowing);
  //   if (isFollowing) {
  //     currentUser.interests = currentUser.interests.filter(userId => userId !== userid);
  //     postUser.followers = postUser.followers.filter(userId => userId !== currentUser);
  //   }
  //   else{
  //     currentUser.interests = [...currentUser.interests, userid];
  //     postUser.followers = [...postUser.followers, currentUser];
  //   }
  // };

