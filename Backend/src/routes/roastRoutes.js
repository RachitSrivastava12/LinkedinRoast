const express = require('express');
const router = express.Router();
const linkedinService = require('../services/linkedinService');
const openaiService = require('../services/openaiService');

router.post('/roast', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'LinkedIn profile URL is required' });
    }

    const profileData = await linkedinService.getProfileData(url);
    if (!profileData || Object.keys(profileData).length === 0) {
      return res.status(404).json({ message: 'Failed to retrieve profile data' });
    }

    const roast = await openaiService.generateRoast(profileData);
    res.json({ roast, profileData });
  } catch (error) {
    console.error('Error in roast route:', error);
    res.status(500).json({ message: 'An error occurred while processing your request', error: error.message });
  }
});

module.exports = router;