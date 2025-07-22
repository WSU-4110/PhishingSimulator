-- Create the main database
CREATE DATABASE IF NOT EXISTS phishing_platform;
USE phishing_platform;

-- Companies table
CREATE TABLE IF NOT EXISTS Companies (
  company_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Employees table
CREATE TABLE IF NOT EXISTS Employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS QuizResults (
  result_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  company_id INT,
  module_number INT,
  score VARCHAR(10),
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
  FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);

-- Click tracking table
CREATE TABLE IF NOT EXISTS Clicks (
  click_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  company_id INT,
  email_type VARCHAR(50),  -- e.g. 'DocShare', 'PasswordReset'
  clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
  FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);
