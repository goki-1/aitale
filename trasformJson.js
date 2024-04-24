
  const createCharacterDialogueSinglePanel = (parentPanel, character, index, initialAppearances) => {
    const isInitialAppearance = !initialAppearances.includes(character.character);
  
    const dialogues = character.dialogue.split(/[.]/).filter(dialogue => dialogue.trim() !== "" 
    && dialogue.trim() !== "." && dialogue.trim() !== ",");
  
    const panels = dialogues.map((dialogue, i) => {
      // Update the condition to check if it's the narrator and isFirstNarratorPanel
      if (character.character === 'Narrator') {
  
        if (isInitialAppearance) {
          initialAppearances.push(character.character);
        }
          const cameraMovement = isInitialAppearance
            ? { camera_movement: 'left to right' }
            : { camera_movement: 'right to left' };
  
          return {
            type: 'narrator',
            content: [{
              character: character.character,
              dialogue: dialogue.trim(), // Remove leading/trailing whitespaces
              tone: character.tone,
            }],// Do not add any character for the first narrator panel
            background_music: parentPanel.background_music,
            background_sound: parentPanel.background_sound,
            index: index + i,
            genId: parentPanel.genId,
            ...cameraMovement,
          };
      } 
      let cameraMovement;
      if (isInitialAppearance) {
        cameraMovement = { camera_movement: 'zoom in and up' };
      
      } else {
        const movements = ['up', 'down', 'zoom in', 'zoom out', 'left to right', 'right to left'];
        const randomIndex = Math.floor(Math.random() * movements.length);
        cameraMovement = { camera_movement: movements[randomIndex] };
      }
  
      return {
        type: 'character dialogues single',
        content: [{
          character: character.character,
          dialogue: dialogue.trim(), // Remove leading/trailing whitespaces
          tone: character.tone,
        }],
        background_music: parentPanel.background_music,
        background_sound: parentPanel.background_sound,
        index: index + i,
        genId: parentPanel.genId,
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
  
   const addPoseImageIdsToCharacters = (panels, characters) => {
    // Create a map for quick access to character pose IDs
    const characterPoses = characters.reduce((acc, character) => {
      acc[character.character] = character.poseImageIds["front pose standing still"];
      return acc;
    }, {});
  
    // Iterate over each panel and each character to add the poseImageId
    return panels.map(panel => {
      if (panel.type === 'character dialogues single') {
        panel.content = panel.content.map(content => {
          if (content.character !== 'Narrator') {
            // Add poseImageId to the character
            return {
              ...content,
              poseImageId: characterPoses[content.character],
              character_relative_location_in_panel:"center",
            };
          }
          return content;
        });
      }
      return panel;
    });
  };
  //data = transformJson(data);
  function modifyPanelsForNarratorAndDialogueLength(panels) {
    let lastCharacterPanel = null;
    let b = 0;
    const modifiedPanels = []; // Use a new array to store the modified panels
    let ind = 0;
    panels.forEach(panel => {
      if (panel.type === 'character dialogues') b = -1;
      else b += 1;
  
      // Directly add the current panel to the modifiedPanels array
      modifiedPanels.push(panel);
  
      // For narrator panels, add characters from the last character dialogue panel
      if (panel.type === 'narrator' && lastCharacterPanel && b > 0) {
        panel.content.push(...lastCharacterPanel.content.map(character => ({
          ...character,
          dialogue: "" // Copy characters without dialogue
        })));
      }
  
      // For single dialogue panels with long dialogues, add characters from the last character dialogue panel
      if (panel.type === 'character dialogues single') {
        panel.content.forEach(content => {
          if (content.dialogue.length > 40 && lastCharacterPanel) {
            panel.content.push(...lastCharacterPanel.content.filter(c => c.character !== content.character).map(character => ({
              ...character,
              dialogue: "" // Copy characters without dialogue
            })));
          }
        });
      }
  
      // Keep track of the last character dialogue panel
      if (panel.type === 'character dialogues' || panel.type === 'character dialogues single') {
        lastCharacterPanel = panel;
      }
  
      // Check for objectGenId and create an additional "object" panel
      if (panel.objectGenId) {
        const objectPanel = {
          type: 'object',
          content: [],
          genId: panel.objectGenId,
          camera_movement: "zoom in",
          index: ind, // Increment the index slightly to insert after the current panel
        };
        modifiedPanels.push(objectPanel); // Add the new object panel to the modifiedPanels array
      }
    
      ind ++;
    });
  
    return modifiedPanels; // Return the array with the added object panels
  }
  const addPoseImageIdsToCharacter = (panels, characters) => {
    // Create a map for quick access to character pose IDs
    const characterInfo = characters.reduce((acc, character) => {
      acc[character.character] = {
        role: character.role,
        poseImageIds: character.poseImageIds,
      };
      return acc;
    }, {});
  
    
   const allCharactersAreGoodOrNormal = (contents) => 
      contents.every(content => 
        characterInfo[content.character].role === 'hero/good' || 
        characterInfo[content.character].role === 'normal'
      );
    // Helper function to determine if all characters have the same role
    const allCharactersHaveRole = (contents, role) => 
      contents.every(content => characterInfo[content.character].role === role);
  
    // Iterate over each panel and update character locations and poses
    return panels.map(panel => {
      if (panel.type === 'character dialogues single' || panel.type === 'narrator') {
        let contents = panel.content.filter(content => content.character !== 'Narrator');
  
  
        if (contents.length === 2 && (allCharactersAreGoodOrNormal(contents)|| allCharactersHaveRole(contents, 'villain'))) {
          contents = contents.map((content, index) => ({
            ...content,
            character_relative_location_in_panel: index === 0 ? 'left' : 'right',
            poseImageId: index === 0 ? 
              characterInfo[content.character].poseImageIds['side pose standing still(right facing)'] :
              characterInfo[content.character].poseImageIds['side pose standing still(left facing)'],
          }));
        } else if ((contents.length === 3 && (allCharactersAreGoodOrNormal(contents) || allCharactersHaveRole(contents, 'villain')))) {
          contents = contents.map((content, index) => ({
            ...content,
            character_relative_location_in_panel: ['left', 'center', 'right'][index],
            poseImageId: [
              characterInfo[content.character].poseImageIds['side pose standing still(right facing)'],
              characterInfo[content.character].poseImageIds['front pose standing still'],
              characterInfo[content.character].poseImageIds['side pose standing still(left facing)'],
            ][index],
          }));
        } else if (contents.length > 3 && (allCharactersAreGoodOrNormal(contents) || allCharactersHaveRole(contents, 'villain'))) {
          contents = contents.map((content, index) => ({
            ...content,
            character_relative_location_in_panel: index < 3 ? ['left', 'center', 'right'][index] : (index % 2 === 0 ? 'right' : 'left'),
            poseImageId: characterInfo[content.character].poseImageIds['front pose standing still'],
          }));
        }
        else{
           contents = contents.map((content, index) => ({
            ...content,
            character_relative_location_in_panel: index < 3 ? ['left', 'center', 'right'][index] : (index % 2 === 0 ? 'right' : 'left'),
            poseImageId: characterInfo[content.character].poseImageIds['front pose standing still'],
          }));
        }
  
        // Replace the content with the updated character information
        panel.content = [
          ...panel.content.filter(content => content.character === 'Narrator'), // Keep the narrator as is
          ...contents,
        ];
      }
      return panel;
    });
  };
  
  const adjustDialogueBasedOnMajorityRole = (panels, characters) => {
    // First, create a mapping of characters to their roles for quick lookup.
     const characterRoles = characters.reduce((acc, character) => {
      // Treat 'normal' characters as 'hero/good'
      acc[character.character] = character.role === 'normal' ? 'hero/good' : character.role;
      return acc;
    }, {});
  
    // Helper function to count roles in a panel
    const countRolesInPanel = (panelContent) => {
      return panelContent.reduce((acc, content) => {
        const role = characterRoles[content.character];
        if (role) { // Skip if character is 'Narrator'
          acc[role] = (acc[role] || 0) + 1;
        }
        return acc;
      }, {});
    };
  
    // Process each panel
    return panels.map(panel => {
      if (panel.type === 'narrator' || panel.type === 'character dialogues single') {
        const roleCounts = countRolesInPanel(panel.content);
        const majorityRole = roleCounts['hero/good'] >= (roleCounts['villain'] || 0) ? 'hero/good' : 'villain';
  
        // Filter out dialogues for characters of the minority role
        panel.content = panel.content.filter(content => {
          // Keep the dialogue if the character is a narrator or belongs to the majority role
          return content.character === 'Narrator' || characterRoles[content.character] === majorityRole;
        });
      }
      return panel;
    });
  };
  
  
  
  
  // Extend transformJson to include modifyPanelsForNarratorAndDialogueLength processing
  const transformJsonExtended = (originalJson) => {
    const transformedJson = transformJson(originalJson); // Use the existing transformation logic
  
    // Modify panels as per the new requirements
    transformedJson.panels = modifyPanelsForNarratorAndDialogueLength(transformedJson.panels);
  
    return transformedJson;
  };
  const adjustCameraMovementForSingleCharacterDialogue = (panels) => {
    return panels.map(panel => {
      // Check if it's a single character dialogue panel with exactly one content entry
      if (panel.type === 'character dialogues single' && panel.content.length === 1) {
        // Randomly decide between 'close up' and 'random zoom in' for the camera movement
        const randomCameraMovement = panel.content[0].dialogue.length % 2 == 0 ? 'close up' : 'some random zoom in';
        // Update the camera movement for the panel
        return {
          ...panel,
          camera_movement: randomCameraMovement,
        };
      }
      // Return the panel unmodified if it doesn't meet the criteria
      return panel;
    });
  };
  const transformJsonFullyExtended = (originalJson) => {
    let transformedJson = transformJsonExtended(originalJson); // Use the existing extended transformation logic
  
    // Add poseImageIds to the characters
    transformedJson.panels = addPoseImageIdsToCharacters(transformedJson.panels, originalJson.characters);
   
    transformedJson.panels = addPoseImageIdsToCharacter(transformedJson.panels, originalJson.characters);
    transformedJson.panels = adjustDialogueBasedOnMajorityRole(transformedJson.panels, originalJson.characters);
    transformedJson.panels = adjustCameraMovementForSingleCharacterDialogue(transformedJson.panels);
    
    return transformedJson;
  };

 
  export default transformJsonFullyExtended;


   // Assuming 'data' is the original JSON object you provided
  //const fullyTransformedData = transformJsonFullyExtended(data);
  //console.log(JSON.stringify(fullyTransformedData, null, 2));