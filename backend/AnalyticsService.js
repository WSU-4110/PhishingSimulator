const fs = require("fs"); //required file system
const path = require("path"); //file path

class AnalyticsService {
  getUserInteractionStats() {
    const trackingPath = path.join(_dirname, "tracking.json"); 
    const phishingPath = path.join(_dirname, "data", "phishAttempts.json");

    let trackingData = {}; 
    let phishingAttempts = [];

    if (fs.existsSync(trackingPath)) {
      trackingData = JSON.parse(fs.readFileSync(trackingPath,"utf8")); //Read the attempts for email opening
    }

    if (fs.existsSync(phishingPath)) { //Read the attempts for link clicking 
      phishingAttempts = JSON.parse(fs.readFileSync(phishingPath,"utf8"));
    }

    const result = Object.entries(trackingData).map(([token, { email, opened, openedAt }]) => {
      const clicked = phishingAttempts.some(a => a.username === email);
      return {
        email,
        opened,
        openedAt,
        clicked,
        completedTraining: false 
      };
    });

    return result;
  }
}

module.exports = AnalyticsService;
