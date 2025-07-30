const { AdminDashboard, FetchInteractionAnalyticsCommand } = require('../backend/AnalyticsCommand');

describe('AnalyticsCommand', () => {
  let mockAnalyticsService;
  let fetchCommand;
  let dashboard;

  beforeEach(() => {
    mockAnalyticsService = { getUserInteractionStats: jest.fn() };
    fetchCommand = new FetchInteractionAnalyticsCommand(mockAnalyticsService);
    dashboard = new AdminDashboard();
  });

  test('execute() should call analyticsService.getUserInteractionStats', () => {
    mockAnalyticsService.getUserInteractionStats.mockReturnValue([{ email: 'john@example.com' }]);
    const data = fetchCommand.execute();
    expect(mockAnalyticsService.getUserInteractionStats).toHaveBeenCalled();
    expect(data[0].email).toBe('john@example.com');
  });

  test('runCommand() should execute command and add it to history', () => {
    mockAnalyticsService.getUserInteractionStats.mockReturnValue([]);
    dashboard.runCommand(fetchCommand);
    expect(dashboard.history).toContain(fetchCommand);
  });
});
