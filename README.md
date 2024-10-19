# Rule Engine with AST (Backend)

This is the backend service for a rule engine application that uses an Abstract Syntax Tree (AST) to evaluate user eligibility based on attributes like age, department, income, and spend. 

## Tech Stack

 Node.js, Express, and MongoDB.
 
## Features

- Create rules using an Abstract Syntax Tree (AST) to represent conditions.
- Combine multiple rules into a single AST for optimized evaluations.
- Evaluate user eligibility based on JSON data against combined rules.
- Store rules and application metadata in MongoDB for persistence.
- API endpoints for creating, combining, and evaluating rules.
- Error handling for invalid rule strings and data formats.

## Prerequisites

- **Node.js**: Version 14 or higher
- **MongoDB**: Either a local instance or a cloud service like MongoDB Atlas

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rijurekh24/Rule-Engine-Backend.git
   cd rule-engine-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file and set the following variables:
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/RuleEngine?retryWrites=true&w=majority
   ```

4. **Start the server**:
   ```
   npm start
   ```

