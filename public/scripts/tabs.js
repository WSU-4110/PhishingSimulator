//Implementing Observer Pattern
// Subject class — manages tabs and notifies observers
class TabManager {
  constructor() {
    this.tabs = document.querySelectorAll('.tab');
    this.modules = document.querySelectorAll('.module');
    this.observers = [];
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.selectTab(tab));
    });
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }

  selectTab(tab) {
    const target = tab.getAttribute('data-tab');

    // Remove active classes
    this.tabs.forEach(t => t.classList.remove('active'));
    this.modules.forEach(m => m.classList.remove('active'));

    // Activate new
    tab.classList.add('active');
    document.querySelector(`.module[data-content="${target}"]`).classList.add('active');

    // Notify observers about the tab change
    this.notify({ activeTab: target });
  }
}

// Observer class — can do anything when tabs switch
class ProgressTracker {
  update(data) {
    console.log('Tab changed to:', data.activeTab);
    // Save this to localStorage or an API
  }
}

// Instantiate the tab manager and add an observer
document.addEventListener('DOMContentLoaded', () => {
  const tabManager = new TabManager();
  tabManager.addObserver(new ProgressTracker());
});
