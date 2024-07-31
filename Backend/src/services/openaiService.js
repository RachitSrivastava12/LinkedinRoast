const axios = require('axios');

const generateRoast = async (profileData) => {
  try {
    const name = profileData.name || 'N/A';
    const title = profileData.title || 'N/A';
    const location = profileData.location || 'N/A';
    const skills = profileData.skills && profileData.skills.length > 0 ? profileData.skills.join(', ') : 'N/A';
    const latestExperience = profileData.experiences && profileData.experiences[0] ?
      `${profileData.experiences[0].role} at ${profileData.experiences[0].company} for ${profileData.experiences[0].duration}` : 'N/A';
    const education = profileData.education && profileData.education[0] ?
      `${profileData.education[0].degree} from ${profileData.education[0].school}` : 'N/A';

    const prompt = `Generate a humorous and sarcastic roast based on this LinkedIn profile. Be creative and witty, but not overly mean:
    Name: ${name}
    Title: ${title}
    Location: ${location}
    Skills: ${skills}
    Latest Experience: ${latestExperience}
    Education: ${education}
    Roast:`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a humorous and sarcastic roaster.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.8,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating roast:', error.response?.data || error.message || error);
    throw new Error('Failed to generate roast');
  }
};

module.exports = {
  generateRoast
};