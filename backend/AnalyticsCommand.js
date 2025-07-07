//AnalyticsCommand

const AnalyticsService = require("./AnalyticsService");

class AnalyticsCommand { //Command Interface
  execute() {
    throw new Error("Execute method must be implemented");
}
}

class FetchInteractionAnalyticsCommand extends AnalyticsCommand { //Concrete Command that wraps to 
  constructor(analyticsService) { //AnalyticsService
    super();
    this.analyticsService = analyticsService;
  }

  execute() {
    
    const data = this.analyticsService.getUserInteractionStats(); //Calls the function to get the data
    
    console.log("\n📧Phishing Simluation Analytics\n"); //Display the data
    console.table(data); //Table format
    
    return data; //Return the data
  }
}

class AdminDashboard { //Invoker which takes a command executes it
  constructor() {
    this.history = []; //Good practice for logging and auditing (s/o database management class.
  }

  runCommand(command) {
    const result = command.execute(); //Actually runs the command
    this.history.push(command); // Push to history logging
    return result;
  }
}

module.exports = { //Export to be used in other files.
  AdminDashboard,
  FetchInteractionAnalyticsCommand
};
