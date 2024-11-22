import { uploadData, getUrl } from 'aws-amplify/storage';
const AlbedoBaseXL = "2067ae52-33fd-4a82-bb92-c2c55e7d2786";
const LeonardoDiffusionXL = "1e60896f-3c26-4296-8ecc-53e2afecc132";
const LeonardoVisionXL = "5c232a9e-9061-4777-980a-ddc8e65647c6";
const DreamShaper = "ac614f96-1082-45bf-be9d-757f2d31c174";
const Lightning = "b24e16ff-06e3-43eb-8d33-4416c2d75876";
const AnimeLightning = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
import { LEO_PRO} from '@env';
import axios from 'axios';
const apiKey = "26a31a79-bde8-4ed9-921f-3df58c090aa1";
const userId = "ad1fa781-4f92-4642-a3d3-a5bf85eec6e3";
import { Image } from 'react-native';

const combine = (characterArray, logObject) => {
      
    return characterArray.map(character => {
      
      const descriptionObject = logObject[character.character];
  
      
      if (descriptionObject) {
        const descriptionParts = [];
  
        // Loop through each property of the description object
        for (const [key, value] of Object.entries(descriptionObject)) {
          // Check if the character type is "famous character who walks on two legs" and the face is covered
          if (character.character_type === "comic/movie character who walks on two legs" && key === "faceCovered" && value === "yes") {
            descriptionParts.push(`${character.character}`);
            descriptionParts.push(`${descriptionObject["costume/skin"]}`);
          } 
          if (character.character_type === "comic/movie character who walks on two legs" && key === "faceCovered" && value === "no") {
            descriptionParts.push(`${character.character}`);
            descriptionParts.push(`${descriptionObject["full name"]}`);
            descriptionParts.push(`${descriptionObject["costume/skin"]}`);
          }else {
            if (!(character.character_type === "comic/movie character who walks on two legs")) {
              
              descriptionParts.push(`${value}`);
            }
          }
        }
  
        // Combine all parts into a single string
        const combinedDescription = descriptionParts.join(", ");
        return {
          ...character,
          description: combinedDescription
        };
      } else {
        return {
          ...character,
          description: character.character
        };
      }
    });
  };

  const truncateString = (inputString, maxUnderscores) => {
    // Replace special characters with underscores and remove extra whitespaces
    const processedString = inputString.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    const underscoreCount = (processedString.match(/_/g) || []).length;

    let truncatedString;
    if (underscoreCount > maxUnderscores) {
        // If there are more than `maxUnderscores` underscores, truncate the string
        truncatedString = processedString.split('_').slice(0, maxUnderscores).join('_');
    } else {
        truncatedString = processedString;
    }

    return truncatedString;
};

const removeDuplicateFirstTwoWords = (inputString) => {
  const words = inputString.split(',').map(word => word.trim());
  if (words.length >= 2 && words[0] === words[1]) {
      words.splice(0, 1);
  }
  return words.join(', ');
};


const generateImagesForCharacter = async (characterArray) => {
  const poseIds = {
    "front pose standing still": "578c550e-d1d3-468d-afe3-988dbce0c038",
    "side pose standing still(left facing)": "45719c08-790a-42bb-9a39-e112386d34a3",
    // "standing back pose": "de7968c9-737c-4fb6-974e-3dd0b83e6a46",
  };

  let updatedCharacterArray = [];
  const promises = characterArray.map(async (character) => {
    character.poseImageIds = {};
    let updatedCharacter = { ...character };

    try {
      let y = removeDuplicateFirstTwoWords(character.description);
      y = y.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
      y = truncateString(y, 4);
      const getStringResult = await getUrl({ key: y });
      const response = await fetch(getStringResult.url);
      if (response.ok) {
        const content = await response.text();
        updatedCharacter.poseImageIds = JSON.parse(content);
      } else {
        // Handle the case where the string download fails
        
        updatedCharacter.poseImageIds = {};
        for (const pose in poseIds) {
          try {
            const prompt = removeDuplicateFirstTwoWords(character.description) + ", extremely high quality, detailed";
            const requestData = {
              prompt: prompt,
              negative_prompt: "ugly, multiple faces, deformed limbs, deformed fingers, deformed body, low quality, blurred",
              modelId: AlbedoBaseXL,
              transparency: "foreground_only",
              width: 1024,
              height: 768,
              public: false,
              //presetStyle: 'LEONARDO',
              num_images: 1,
              num_inference_steps: 40,
              init_generation_image_id: poseIds[pose],
              init_strength: 0.4,
              controlNet: true,
              controlNetType: "POSE",
            };
            const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
            });
            const responseData = await response.json();
            const generatedId = responseData.sdGenerationJob.generationId;
            let url = constructImageUrl(generatedId, prompt);
            url = url.replace(/__/g, '_');
            updatedCharacter.poseImageIds[pose] = url;
          } catch (error) {
            console.error('Error generating image for pose:', pose, error.response?.data ?? error.message);
          }
        }
      

      try {
        const result = await uploadData({ key: y, data: JSON.stringify(updatedCharacter.poseImageIds) }).result;
        console.log('Succeeded: ', result);
      } catch (error) {
        console.log('Error uploading the character pictures: ', error);
      }
    }
      updatedCharacterArray.push(updatedCharacter);
    } catch (error) {
      console.error('Error downloading string from S3:', error);
    }
  });

  await Promise.all(promises);
  return updatedCharacterArray;
};

function constructImageUrl( imageid, prompt) {
    const promptSlug = prompt.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    if (promptSlug.length > 54) {
        return `${imageid}/Default_${promptSlug.substring(0, 54)}_0.png`;
    } else {
        return `${imageid}/Default_${promptSlug}_0.png`;
    }
}
function constructImageUrlbac( imageid, prompt) {
    const promptSlug = prompt.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    if (promptSlug.length > 54) {
        return `${imageid}/Default_${promptSlug.substring(0, 54)}_0.jpg`;
    } else {
        return `${imageid}/Default_${promptSlug}_0.jpg`;
    }
}

  const generateImageOfBackground = async (sceneDescription) => {
    try {
      sceneDescription = sceneDescription.replace(/- /g, '');
      const requestData = {
        prompt: sceneDescription + ", high quality, extremely detailed",
        negative_prompt: ", ugly, lazy, multiple faces, deformed limbs, deformed fingers, deformed body, poor quality, ugly, blurred",
        modelId: DreamShaper,
        width: 1360,
        height: 768,
        //promptMagic: true,
        public: false,
        presetStyle: 'LEONARDO',
        num_images:1,
        num_inference_steps: 30,
      };
      const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer 26a31a79-bde8-4ed9-921f-3df58c090aa1`,
          'Content-Type': 'application/json'
          },
        body: JSON.stringify(requestData)
      });

      const responseData = await response.json();
      const generatedId = responseData.sdGenerationJob.generationId;
      let url = constructImageUrlbac(generatedId, sceneDescription + ", high quality, extremely detailed");
      url = url.replace(/__/g, '_');
      console.log("background photo  ",generatedId);
      return url;
    } catch (error) {
      console.error('Error back::', error.response.data ?? error.message);
    }
    
  };


const generateImagesForPanel = async (panel) => {
    let locationGenIds = {};
    let objectGenIds = {};
      try {
          const camera_movement = ["up", "down", "zoom in", "zoom out", "left to right", "right to left"];
          
          if (locationGenIds[panel.location]) {
              panel.genId = locationGenIds[panel.location];
          } else {
              panel.genId = await generateImageOfBackground(panel.location + ", Low-shot");
              locationGenIds[panel.location] = panel.genId;
          }
          if(panel.importantObject){
            if (objectGenIds[panel.importantObject]) {
              panel.objectGenId = objectGenIds[panel.object];
            } else {
              panel.objectGenId = await generateImageOfBackground(panel.importantObject);
              objectGenIds[panel.object] = panel.objectGenId;
            }
          }
          const randomIndex = Math.floor(Math.random() * camera_movement.length);
          panel.camera_movement = camera_movement[randomIndex];
          
          return panel;
      } catch (error) {
          console.error('Error generating images for panel:', error.message);
          return null;
      }
  };
  
    
      
 const processComicBookStory = async (comicBookStory) => {
        comicBookStory = await Promise.all(comicBookStory.map(async (panel) => {
          //console.log("Entring the henerateimageesfor Panelllll", panel);
          return await generateImagesForPanel(panel);
        }));
        return comicBookStory;
      };


      function extractUrlsFromObject(obj) {
        const urls = [];
        const regex = /([^\s]+\.(jpg|png))/g; // Regular expression to match URLs or URLs with .jpg or .png
    
        // Recursive function to traverse the object
        const traverse = (data) => {
            if (typeof data === 'string') {
                // Check if the string contains 'jpg' or 'png' and matches the URL pattern
                if (regex.test(data)) {
                    const matches = data.match(regex);
                    urls.push(...matches);
                }
            } else if (typeof data === 'object' && data !== null) {
                // If the value is an object, recursively call traverse on its properties
                for (const key in data) {
                    traverse(data[key]);
                }
            }
        };
        traverse(obj);
        return urls;
    }


async function verifyImageUrls(story) {
  let imageUrls = [];
  if(typeof story === 'object'){
  imageUrls = extractUrlsFromObject(story)
  }
  else {
    imageUrls = extractUrlsFromObject(JSON.parse(story))
  }
    const validImageUrls = [];
    let allUrlsValid = false;
    
    while (!allUrlsValid) {
        try {
            // Promisify the image loading process
            const loadImage = (url) => {
              url = "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/" + url;
                return new Promise((resolve, reject) => {
                    Image.getSize(url, () => resolve(url), () => reject(url));
                });
            };

            // Loop through each URL
            const promises = imageUrls.map(loadImage);
            
            // Wait for all promises to resolve
            await Promise.all(promises)
                .then(validUrls => {
                    validImageUrls.push(...validUrls);
                    allUrlsValid = true;
                })
                .catch(invalidUrl => {
                    console.log(`Error accessing URL: doing againnnnnnnnnnnnnnn ${invalidUrl}`);
                    allUrlsValid = false;
                });
            
            if (!allUrlsValid) {
                // Wait for 10 seconds before retrying
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        } catch (error) {
            console.error('Error verifying image URLs:', error);
            allUrlsValid = true; // Exit loop on error
        }
    }

    return validImageUrls;
}


export {combine, generateImagesForCharacter, generateImageOfBackground, generateImagesForPanel, processComicBookStory, verifyImageUrls} 