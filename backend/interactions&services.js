// Command interface
class AnalyticsCommand {
    execute() {
        throw new Error("Execute method must be implemented.");
    }
}

// Receiver Interface
class AnalyticsService {
    getUserInteractionStats() {
        // Simulate analytics data
        return [
            { email: "user1@example.com", clicked: true, completedTraining: true },
            { email: "user2@example.com", clicked: false, completedTraining: false },
            { email: "user3@example.com", clicked: true, completedTraining: false },
        ];
    }
}

// Concrete Command
class FetchInteractionAnalyticsCommand extends AnalyticsCommand {
    constructor(analyticsService) {
        super();
        this.analyticsService = analyticsService;
    }

    execute() {
        const data = this.analyticsService.getUserInteractionStats();
        console.log("\t Phishing Simulation Analytics \t");
        console.table(data);
        return data;
    }
}

// Invoker
class AdminDashboard {
    constructor() {
        this.history = [];
    }

    runCommand(command) {
        const result = command.execute();
        this.history.push(command);
        return result;
    }
}

// Objects created then returned
const analyticsService = new AnalyticsService();
const analyticsCommand = new FetchInteractionAnalyticsCommand(analyticsService);
const adminDashboard = new AdminDashboard();

adminDashboard.runCommand(analyticsCommand);
