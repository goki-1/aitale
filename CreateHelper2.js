import { uploadData, getUrl } from 'aws-amplify/storage';
const AlbedoBaseXL = "2067ae52-33fd-4a82-bb92-c2c55e7d2786";
const LeonardoDiffusionXL = "1e60896f-3c26-4296-8ecc-53e2afecc132";
const LeonardoVisionXL = "5c232a9e-9061-4777-980a-ddc8e65647c6";
const KinoXL = "aa77f04e-3eec-4034-9c07-d0f619684628";
const Lightning = "b24e16ff-06e3-43eb-8d33-4416c2d75876";
const AnimeLightning = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
const styleReference = '67';
const characterReference = '133';
const poseReference = '21';

import { LEO_PRO } from '@env';
import axios from 'axios';
const apiKey = "26a31a79-bde8-4ed9-921f-3df58c090aa1";
const userId = "ad1fa781-4f92-4642-a3d3-a5bf85eec6e3";
import { Image } from 'react-native';


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

const initialprompt = (pose) => {
  if(pose == "front pose standing still")
    return "";
  if(pose == "side pose standing still")
    return "looking sideways, ";
  if(pose == "back pose standing still")
    return "Back pose, ";
};

async function checkimagesforbac(poses) {
  let images = {}
  for (const pose in poses) {
    await verifyUrl(poses[pose]);
    id = poses[pose]
    requestData = {
      "id": id.substring(0, id.indexOf('/')),
      "isVariation": true
    }
    const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/variations/nobg', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    const responseData = await response.json();
    generatedId = responseData.sdGenerationJob.generationId;
    let url = constructImageUrl(generatedId, prompt, style);
    images[pose] = url;
  }
  return images
}


const generateImagesForCharacter = async (characterArray, style) => {

  const poseIdshuman = {
    "front pose standing still": "578c550e-d1d3-468d-afe3-988dbce0c038",
    "side pose standing still(left facing)": "45719c08-790a-42bb-9a39-e112386d34a3",
    // "standing back pose": "de7968c9-737c-4fb6-974e-3dd0b83e6a46",
  };
  const poseIdsanimal = {
    "front pose standing still": "578c550e-d1d3-468d-afe3-988dbce0c038",
    "side pose standing still(left facing)": "45719c08-790a-42bb-9a39-e112386d34a3",
    // "standing back pose": "de7968c9-737c-4fb6-974e-3dd0b83e6a46",
  };
  const poseIdsOther = {
    "front pose standing still": "578c550e-d1d3-468d-afe3-988dbce0c038",
    "side pose standing still(left facing)": "45719c08-790a-42bb-9a39-e112386d34a3",
  }
  let poseIds = {};
  let updatedCharacterArray = [];
  const promises = characterArray.map(async (character) => {
    character.poseImageIds = {};
    let w,h;
    if (character.character_type == "character with two legs"){
      poseIds = poseIdshuman;
      w = 720
      h = 1280}
    else if (character.character_type == "four legged animal"){
      poseIds = poseIdsanimal;
      w = 1080
      h = 720}
    else{
      poseIds = poseIdsOther;
      w = 720
      h = 720}
    
    let updatedCharacter = { ...character };
    let description = character.character + ", "+ character.costume_or_looks
    model = Lightning
    if(style == "anime")
      model = AnimeLightning

    try {
      // let y = removeDuplicateFirstTwoWords(description);
      // y = y.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
      // y = truncateString(y, 4);
      let y = style +"_" + character.visual_characteristics_key;
      const getStringResult = await getUrl({ key: y });
      const response = await fetch(getStringResult.url);
      if (response.ok) {
        const content = await response.text();
        updatedCharacter.poseImageIds = JSON.parse(content);
      } 
      else {
        // Handle the case where the string download fails
        updatedCharacter.poseImageIds = {};
        let generatedId = null;
        for (const pose in poseIds) {
          let initi = initialprompt(pose);
          const controlnets = generatedId == null 
          ? [
              {
                "initImageId": poseIds[pose],
                "initImageType": "GENERATED",
                "strengthType": "High",
                "preprocessorId": poseReference
              }
            ]
          : [
              {
                "initImageId": poseIds[pose],
                "initImageType": "GENERATED",
                "strengthType": "High",
                "preprocessorId": poseReference
              },
              {
                "initImageId": generatedId,
                "initImageType": "GENERATED",
                "preprocessorId": styleReference,
                "strengthType": "High"
              },
              {
                "initImageId": generatedId,
                "initImageType": "GENERATED",
                "preprocessorId": characterReference,
                "strengthType": "High"
              }
            ];
          try {
            const prompt = initi + removeDuplicateFirstTwoWords(description) + ", extremely high quality, detailed";
            const requestData = {
              prompt: prompt,
              negative_prompt: "ugly, multiple faces, deformed limbs, deformed fingers, deformed body, low quality, blurred",
              modelId: model,
              width: w,
              height: h,
              public: false,
              alchemy: true,
              presetStyle: 'DYNAMIC',
              num_images:1,
              expandedDomain: true,
              highResolution: true,
              controlnets: controlnets
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
            generatedId = responseData.sdGenerationJob.generationId;
            let url = constructImageUrlbac(generatedId, prompt, style);
            url = url.replace(/__/g, '_');
            updatedCharacter.poseImageIds[pose] = url;
          } catch (error) {
            console.error('Error generating image for pose:', pose, error.response?.data ?? error.message);
          }
        }
      

      try {
        updatedCharacter.poseImageIds = await checkimagesforbac(updatedCharacter.poseImageIds);
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

function constructImageUrl( imageid, prompt, style) {
    const promptSlug = prompt.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    if (promptSlug.length > 54) {
        return `${imageid}/variations/Default_${promptSlug.substring(0, 54)}_0_${imageid}_0.png`;
    } else {
        return `${imageid}/variations/Default_${promptSlug}_0_${imageid}_0.png`;
    }
}
function constructImageUrlbac( imageid, prompt, model) {
  st = "Leonardo_Lightning_XL_"
  nu = 45
  if(model == "anime"){
    st = "Leonardo_Anime_XL_"
    nu = 49
  }
    const promptSlug = prompt.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    if (promptSlug.length > nu) {
        return `${imageid}/${st}${promptSlug.substring(0, nu)}_0.jpg`;
    } else {
        return `${imageid}/${st}${promptSlug}_0.jpg`;
    }
}



  const generateImageOfBackground = async (sceneDescription,style, paneltype, shottype) => {
    sceneDescription = sceneDescription + ", high quality, extremely detailed"
    model = Lightning
    w = 1248
    h = 624
    if(style == "anime")
        model = AnimeLightning

    if(shottype == "vertically-stretched-shot"){
      h = 1248
      w = 624
    }
    if(shottype == "low-shot"){
      sceneDescription =  "low-shot. " + sceneDescription
      h = 664
      w = 1184
    
    }
    if(shottype == "bird-eye"){
      sceneDescription =  "bird-eye view shot. " + sceneDescription
      h = 664
      w = 1184
    }
      
    try {
      sceneDescription = sceneDescription.replace(/- /g, '');
      const requestData = {
        prompt: sceneDescription,
        negative_prompt: "ugly, lazy, poor quality, ugly, blurred",
        modelId: model,
        width: w,
        height: h,
        //promptMagic: true,
        public: false,
        alchemy: true,
        presetStyle: 'DYNAMIC',
        num_images:1,
        expandedDomain: true,
        highResolution: true,
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
      let url = constructImageUrlbac(generatedId, sceneDescription, style);
      url = url.replace(/__/g, '_');
      console.log("background photo  ",generatedId);
      return url;
    } catch (error) {
      console.error('Error back::', error.response.data ?? error.message);
    }
    
  };


const generateImagesForPanel = async (panel, style) => {
    try {
        if(panel.content != null){
            if(panel.indoor_or_outdoor == "outdoor"){
                panel.genId = await generateImageOfBackground( panel.weather+ ", " + panel.location_and_environment,style, "content", null);
            }
            else{
                panel.genId = await generateImageOfBackground( panel.location_and_environment +", indoor", style, "content", null);   
            }
        }
        else if (panel.description_of_the_shot != null){
            panel.genId = await generateImageOfBackground( panel.description_of_the_shot, style, "description", panel.type_of_shot);
        }
        else if(panel.reason_for_focusing != null){
            if(panel.indoor_or_outdoor == "outdoor"){
                panel.genId = await generateImageOfBackground( panel.weather+ ", " + panel.location_and_environment,style, "focus", null);
            }
            else{
                panel.genId = await generateImageOfBackground(panel.location_and_environment +", indoor", style, "focus", null);   
            }
        }
        else if(panel.sequence_of_actions != null){
            if(panel.indoor_or_outdoor == "outdoor"){
                panel.genId = await generateImageOfBackground( panel.weather+ ", " + panel.location_and_environment,style, "fight", null);
            }
            else{
                panel.genId = await generateImageOfBackground(panel.location_and_environment +", indoor", style, "fight", null);   
            }
        }
          
        return panel;
      } catch (error) {
          console.error('Error generating images for panel:', error.message);
          return null;
      }
  };
  
    
      
 const processComicBookStory = async (comicBookStory, style) => {
        comicBookStory = await Promise.all(comicBookStory.map(async (panel) => {
          
          return await generateImagesForPanel(panel.panel, style);
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

  async function verifyUrl(ur) {
    // Construct the full URL
    ur = "https://cdn.leonardo.ai/users/ad1fa781-4f92-4642-a3d3-a5bf85eec6e3/generations/" + ur;
    
    // Start an infinite loop
    while (true) {
      try {
        const response = await fetch(ur);
        
        // Check if the response is OK (status code 200-299)
        if (response.ok) {
          return true; // Image is available, return true
        }
      } catch (error) {
        console.error("Error fetching URL: will try again hehe", error);
      }
      
      // Wait for 10 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
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


export {generateImagesForCharacter, generateImageOfBackground, generateImagesForPanel, processComicBookStory, verifyImageUrls} 