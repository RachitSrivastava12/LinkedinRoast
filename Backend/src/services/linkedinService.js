const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const getProfileData = async (url) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for the profile content to load
    await page.waitForSelector('.pv-top-card', { timeout: 30000 });

    const profileData = await page.evaluate(() => {
      const name = document.querySelector('.pv-top-card--list li')?.textContent.trim() || 'N/A';
      const title = document.querySelector('.pv-top-card--list li:nth-child(2)')?.textContent.trim() || 'N/A';
      const location = document.querySelector('.pv-top-card--list-bullet li')?.textContent.trim() || 'N/A';
      
      const skills = Array.from(document.querySelectorAll('.pv-skill-category-entity__name-text'))
        .map(skill => skill.textContent.trim());

      const experiences = Array.from(document.querySelectorAll('.pv-position-entity'))
        .map(exp => ({
          role: exp.querySelector('.pv-entity__summary-info h3')?.textContent.trim() || 'N/A',
          company: exp.querySelector('.pv-entity__secondary-title')?.textContent.trim() || 'N/A',
          duration: exp.querySelector('.pv-entity__date-range span:nth-child(2)')?.textContent.trim() || 'N/A'
        }));

      const education = Array.from(document.querySelectorAll('.pv-education-entity'))
        .map(edu => ({
          school: edu.querySelector('.pv-entity__school-name')?.textContent.trim() || 'N/A',
          degree: edu.querySelector('.pv-entity__degree-name span:nth-child(2)')?.textContent.trim() || 'N/A'
        }));

      return { name, title, location, skills, experiences, education };
    });

    return profileData;
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    throw new Error('Failed to fetch LinkedIn profile data');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  getProfileData
};