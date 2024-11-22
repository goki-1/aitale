import { uploadData, getUrl } from 'aws-amplify/storage';
const AlbedoBaseXL = "2067ae52-33fd-4a82-bb92-c2c55e7d2786";
const LeonardoDiffusionXL = "1e60896f-3c26-4296-8ecc-53e2afecc132";
const LeonardoVisionXL = "5c232a9e-9061-4777-980a-ddc8e65647c6";
const KinoXL = "aa77f04e-3eec-4034-9c07-d0f619684628";
const Lightning = "b24e16ff-06e3-43eb-8d33-4416c2d75876";
const AnimeLightning = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
const styleReference = 67;
const characterReference = 133;
const poseReference = 21;
const styleReferenceP = 166;

const Pheonix = '6b645e3a-d64f-4341-a6d8-7a3690fbf042'
const apiKey = "26a31a79-bde8-4ed9-921f-3df58c090aa1";
const userId = "ad1fa781-4f92-4642-a3d3-a5bf85eec6e3";
import { Image } from 'react-native';


const removeDuplicateFirstTwoWords = (inputString) => {
  const words = inputString.split(',').map(word => word.trim());
  if (words.length >= 2 && words[0] === words[1]) {
      words.splice(0, 1);
  }
  return words.join(', ');
};

const initialprompt = (pose) => {
  if(pose == "front pose standing still")
    return "Full body, ";
  if(pose == "side pose standing still(left facing)")
    return "Full body, looking left, ";
  if(pose == "side pose standing still(right facing)")
    return "Full body, looking right, ";
  if(pose == "back pose standing still")
    return "Back pose, ";
  if(pose == "punching")
    return "Full body, punching, ";
  if(pose == "being hit by punch")
    return "Full body, dodging a punch, ";
    
};

async function getId(id, retries = 6, delay = 10000) {
    try {
      const response = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        }
      });
  
      if (!response.ok) 
        throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      //console.log("iiiiiiiiii",responseData)
      if(responseData.generations_by_pk.generated_images.length > 0){
        console.log(responseData.generations_by_pk.generated_images[0].id)
        return responseData.generations_by_pk.generated_images[0].id;
      }
     else
        throw new Error(`Trying to get ID:`);
    } catch (error) {
      console.error(`Error id fetching data: ${error.message}`);
  
      if (retries > 0) {
        console.log(`Retrying in ${delay / 1000} seconds... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getId(id, retries - 1, delay); // retry with reduced retries count
      } else {
        console.error("Failed to fetch data after multiple attempts.");
        throw error; // Throw the error after all retries are exhausted
      }
    }
  }


async function getUrlforBg(id, retries = 4, delay = 9000) {
    try {
      const response = await fetch(`https://cloud.leonardo.ai/api/rest/v1/variations/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const generatedId = responseData.generated_image_variation_generic[0].url;
      if(generatedId !== null)
        return generatedId;
     else
     {
        throw new Error(`Trying to get URL:`);
     }
  
    } catch (error) {
      console.error(`Error url fetching data: ${error.message}`);
  
      if (retries > 0) {
        console.log(`Retrying in ${delay / 1000} seconds.---.. (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getUrlforBg(id, retries - 1, delay); // retry with reduced retries count
      } else {
        console.error("Failed to fetch data after multiple attempts.");
        throw error; // Throw the error after all retries are exhausted
      }
    }
  }




async function checkimagesforbac(poses) {
  let images = {}
  for (const pose in poses) {
    id = poses[pose]

    //id = await getId(id)
    console.log("idddd",id)
    requestData = {
      "id": id,
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
    generatedId = responseData.sdNobgJob.id;
    url = await getUrlforBg(generatedId);
    
    console.log(url)
    images[pose] = url;
  }
  return images
}


const generateImagesForCharacter = async (characterArray, style) => {

  const poseIdshuman = {
    "front pose standing still": "578c550e-d1d3-468d-afe3-988dbce0c038",
    "side pose standing still(left facing)": "45719c08-790a-42bb-9a39-e112386d34a3",
    "side pose standing still(right facing)": "19d43419-23eb-4555-b624-3650dabd588d",
    "punching" :"5881f73a-c69b-43fa-9397-e84dd3862b29",
    "being hit by punch": "b96d523b-d678-457e-a95b-b7d14ca7583b"
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
    //for (const character of characterArray) {
    character.poseImageIds = {};
    let w,h;
    if (character.character_type == "character with two legs"){
      poseIds = poseIdshuman;
      w = 736
      h = 1120}
    else if (character.character_type == "four legged animal"){
      poseIds = poseIdsanimal;
      h = 1120
      w = 736}
    else{
      poseIds = poseIdsOther;
      w = 736
      h = 1120}
    
    let updatedCharacter = { ...character };
    let description = character.character + ", "+ character.costume_or_looks
    model = Lightning
    if(style == "anime")
      model = AnimeLightning

        updatedCharacter.poseImageIds = {};
        let generatedId = null;
        for (const pose of Object.keys(poseIds)) {
          let initi = initialprompt(pose);
          const controlnets = generatedId == null 
          ? [
            //   {
            //     "initImageId": poseIds[pose],
            //     "initImageType": "GENERATED",
            //     "preprocessorId": poseReference,
            //     "weight": 0.5
            //   }
            ]
          : [
            //   {
            //     "initImageId": poseIds[pose],
            //     "initImageType": "GENERATED",
            //     "preprocessorId": poseReference,
            //     "weight": 0.4
            //   },
              {
                "initImageId": generatedId,
                "initImageType": "GENERATED",
                "preprocessorId": styleReference,
                "strengthType": "High",
            
              },
            //   {
            //     "initImageId": generatedId,
            //     "initImageType": "GENERATED",
            //     "preprocessorId": characterReference,
            //     "strengthType": "Low",

            //   }
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
              //alchemy: true,
              //presetStyle: 'DYNAMIC',
              num_images:1,
              //promptMagic: true,
              expandedDomain: true,
              highResolution: true,
              //controlnets: controlnets,
              init_generation_image_id: poseIds[pose],
              init_strength: 0.20,
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
            console.log("=============",responseData)
            generatedId = responseData.sdGenerationJob.generationId;
            console.log("id----",generatedId)
            
            generatedId = await getId(generatedId);
            updatedCharacter.poseImageIds[pose] = generatedId;
          } catch (error) {
            console.error('Error generating image for pose:', pose, error.response?.data ?? error.message);
          }
        }
    
      updatedCharacter.poseImageIds = await checkimagesforbac(updatedCharacter.poseImageIds);
      updatedCharacterArray.push(updatedCharacter);
 
  });
    //}

  await Promise.all(promises);
  return updatedCharacterArray;
};

async function getBackUrl(id, retries = 7, delay = 10000) {
  try {
    const response = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    if (!response.ok) 
      throw new Error(`HTTP error! status: ${response.status}`);

    const responseData = await response.json();
   
    if(responseData.generations_by_pk.generated_images.length > 0){
      console.log(responseData.generations_by_pk.generated_images[0].url)
      return responseData.generations_by_pk.generated_images[0].url;
    }
   else
      throw new Error(`Trying to get Url for background:`);
  } catch (error) {
    console.error(`Error id fetching data: ${error.message}`);

    if (retries > 0) {
      console.log(`Retrying in ${delay / 1000} seconds... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getBackUrl(id, retries - 1, delay); // retry with reduced retries count
    } else {
      console.error("Failed to fetch data after multiple attempts.");
      throw error; // Throw the error after all retries are exhausted
    }
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
        promptMagic: true,
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
      let url = await getBackUrl(generatedId);
      
      console.log("background photo  ",generatedId);
      return url;
    } catch (error) {
      console.error('Error back::', error.response.data ?? error.message);
    }
    
  };


const generateImagesForPanel = async (panel, style) => {
    try {
        if(panel.panel.content != null){
            if(panel.panel.indoor_or_outdoor == "outdoor"){
                panel.panel.genId = await generateImageOfBackground( panel.panel.weather+ ", " + panel.panel.location_and_environment,style, "content", null);
            }
            else{
                panel.panel.genId = await generateImageOfBackground( panel.panel.location_and_environment +", indoor", style, "content", null);   
            }
        }
        else if (panel.panel.description_of_the_shot != null){
            panel.panel.genId = await generateImageOfBackground( panel.panel.description_of_the_shot, style, "description", panel.panel.type_of_shot);
        }
        else if(panel.panel.reason_for_focusing != null){
            if(panel.panel.indoor_or_outdoor == "outdoor"){
                panel.panel.genId = await generateImageOfBackground( panel.panel.weather+ ", " + panel.panel.location_and_environment,style, "focus", null);
            }
            else{
                panel.panel.genId = await generateImageOfBackground(panel.panel.location_and_environment +", indoor", style, "focus", null);   
            }
        }
        else if(panel.panel.sequence_of_actions != null){
            if(panel.panel.indoor_or_outdoor == "outdoor"){
                panel.panel.genId = await generateImageOfBackground( panel.panel.weather+ ", " + panel.panel.location_and_environment,style, "fight", null);
            }
            else{
                panel.panel.genId = await generateImageOfBackground(panel.panel.location_and_environment +", indoor", style, "fight", null);   
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
          
          return await generateImagesForPanel(panel, style);
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


export {generateImagesForCharacter, generateImageOfBackground, generateImagesForPanel, processComicBookStory, verifyImageUrls} 