data = {
  title : "fighty fighty",
  "visualStyle": "realistic",
  "panels": [{
    
        "type": "character dialogues",
        "content": [
          {
            "character": "Narrator",
            "dialogue": "In a world where legends and heroes collide, Goku and Aquaman set out on an epic journey to meet the notorious pirates of the Caribbean.",
            "tone": "neutral"
          },
          {
            "character": "Goku",
            "dialogue": "This is going to be an exciting adventure, Aquaman!",
            "tone": "happy"
          },
          {
            "character": "Aquaman",
            "dialogue": "Indeed, Goku. The seas hold many secrets and dangers.",
            "tone": "neutral"
          }
        ],
        "fight_in_this_panel": "no fight",
        "location": "Coastal town with bustling markets and ships",
        "background_sound": "people bustling",
        "background_music": "adventure",
        "genId": "jjjjjjjjjjjjjjjjj",
        "camera_movement": "down"
      },
      {
        "type": "character dialogues",
        "content": [
          {
            "character": "Narrator",
            "dialogue": "As they board their ship, the salty breeze carries whispers of the pirate crew's fearsome reputation.",
            "tone": "neutral"
          },
          {
            "character": "Aquaman",
            "dialogue": "The ocean beckons us, Goku. Let's sail towards the unknown!",
            "tone": "happy"
          },
          {
            "character": "Goku",
            "dialogue": "I can sense the thrill of the upcoming encounter!",
            "tone": "happy"
          }
        ],
        "fight_in_this_panel": "no fight",
        "location": "Onboard a majestic sailing ship",
        "background_sound": "ocean/river waves",
        "background_music": "adventure",
        "genId": "jjjjjjjjjjjjjjjjj",
        "camera_movement": "zoom in"
      },
      
      {
        "type": "character dialogues",
        "content": [
          {
            "character": "Narrator",
            "dialogue": "As they approach the mysterious island rumored to be the pirates' hideout, a sense of anticipation fills the air.",
            "tone": "neutral"
          },
          {
            "character": "Goku",
            "dialogue": "The thrill of the unknown awaits us, Aquaman. Are you ready?",
            "tone": "happy"
          },
          {
            "character": "Aquaman",
            "dialogue": "I am prepared, Goku. Our courage will guide us through any challenge.",
            "tone": "happy"
          }
        ],
        "fight_in_this_panel": "no fight",
        "location": "Approaching a fog-covered island with hidden coves",
        importantObject:"stunning view of sunset",
        "background_sound": "birds chirping",
        "background_music": "adventure",
        "genId": "jjjjjjjjjjjjjjjjj",
        objectGenId: "somethingsomtinhhh",
        "camera_movement": "down"
      },
      {
        "type": "character dialogues",
        "content": [
          {
            "character": "Narrator",
            "dialogue": "As Goku and Aquaman step onto the sandy shore, shadows of the pirate crew emerge from the mist, ready to confront the unexpected visitors.",
            "tone": "surprised"
          },
          {
            "character": "Goku",
            "dialogue": "The pirates have come to greet us, Aquaman. It seems our reputation precedes us!",
            "tone": "surprised"
          },
          {
            "character": "Aquaman",
            "dialogue": "Let's show them the strength of our alliance, Goku. The real adventure begins now!",
            "tone": "surprised"
          }
        ],
        "fight_in_this_panel": "fight",
        "location": "Sandy shore with hidden caves and pirate flags",
        "background_sound": "ocean/river waves",
        "background_music": "adventure",
        "genId": "jjjjjjjjjjjjjjjjj",
        "camera_movement": "zoom out"
      }
  ],
  "characters": [
      {
        "character": "Goku",
        "character_type": "comic/movie character who walks on two legs",
        "sound": "male",
        "size": "normal 5'10 feet",
        "role": "hero",
        "description": "Goku, Son Goku, Orange outfit with a blue sash, black wristbands and boots, spiky black hair, and a tail",
        "poseImageIds": {
          "front pose standing still": "766ee8dd-b188-4801-9110-825a67ae0ff8",
          "side pose standing still(left facing)": "daad58fe-a22f-4359-8062-2731f9f37c3a",
          "standing back pose": "de7968c9-737c-4fb6-974e-3dd0b83e6a46"
        }
      },
      {
        "character": "Aquaman",
        "character_type": "comic/movie character who walks on two legs",
        "sound": "male",
        "size": "normal 5'10 feet",
        "role": "hero",
        "description": "Aquaman, Arthur Curry, Golden and green scale armor with a trident",
        "poseImageIds": {
          "front pose standing still": "766ee8dd-b188-4801-9110-825a67ae0ff8",
          "side pose standing still(left facing)": "daad58fe-a22f-4359-8062-2731f9f37c3a",
          "standing back pose": "de7968c9-737c-4fb6-974e-3dd0b83e6a46"
        }
      }
    ],
}

const createCharacterDialogueSinglePanel = (parentPanel, character, index, initialAppearances) => {
  const isInitialAppearance = !initialAppearances.includes(character.character);

if (character.character === 'Narrator') {
  if (isInitialAppearance) {
    initialAppearances.push(character.character);
  }
    const cameraMovement = isInitialAppearance
      ? { camera_movement: 'left to right' }
      : { camera_movement: 'right to left' };

    return [{
      type: 'narrator',
      content: [{
        character: character.character,
        dialogue: character.dialogue.trim(), // Remove leading/trailing whitespaces
        gen_id: character.gen_id,
        tone: character.tone,
      }],
      background_music: parentPanel.background_music,
      index: index,
      gen_id: parentPanel.gen_id,
      ...cameraMovement,
    }];
  }

  const dialogues = character.dialogue.split(/[.,]/).filter(dialogue => dialogue.trim() !== "" 
  && dialogue.trim() !== "." && dialogue.trim() !== ",");


  const panels = dialogues.map((dialogue, i) => {
    
    const cameraMovement = isInitialAppearance && dialogue.length > 30
    ? { camera_movement: 'zoom in and up' }
    : { camera_movement: dialogue.length > 10 ? 'close up' : 'some random zoom in' };

    return {
      type: 'character dialogues single',
      content: [{
        character: character.character,
        dialogue: dialogue.trim(), // Remove leading/trailing whitespaces
        gen_id: character.gen_id,
        tone: character.tone,
      }],
      background_music: parentPanel.background_music,
      index: index + i,
      gen_id: parentPanel.gen_id,
      ...cameraMovement,
    };
  });

  // Update initialAppearances if it's the initial appearance
  if (isInitialAppearance) {
    initialAppearances.push(character.character);
  }

  return panels;
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

      if (panel.type === 'character dialogues') {
        panel.content.forEach((character, characterIndex) => {
          const characterDialogueSinglePanels = createCharacterDialogueSinglePanel(
            modifiedPanel,
            character,
            currentIndex,
            charactersWithInitialAppearance
          );

          // Concatenate new panels to the result
          newPanels.push(...characterDialogueSinglePanels);

          currentIndex += characterDialogueSinglePanels.length;
        });
      }

      return newPanels;
    }),
  };

  return transformedJson;
};

 
data = transformJson(data);
console.log(JSON.stringify(data, null, 2))
