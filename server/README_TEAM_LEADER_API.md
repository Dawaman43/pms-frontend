# Team Leader API Documentation

This document describes the backend API endpoints available for team leaders in the Performance Management System.

## Authentication

All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Team Leader Dashboard

#### Get Dashboard Summary
```
GET /team-leader/dashboard
```

Returns overview data for the team leader's dashboard:
- Team size
- Pending evaluations count
- Active evaluations
- Recent evaluation history

**Response:**
```json
{
  "teamSize": 5,
  "pendingEvaluations": 2,
  "activeEvaluations": [
    {
      "id": "evaluation_id",
      "type": "work_rate",
      "period": "Q1 2024",
      "status": "active",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-03-31T23:59:59.999Z"
    }
  ],
  "recentHistory": [
    {
      "id": "evaluation_id",
      "type": "behavioral",
      "period": "Q4 2023",
      "completedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Team Management

#### Get Team Information
```
GET /team-leader/team
```

Returns detailed information about the team leader's team:
- Team details (name, department, description)
- Leader information
- Member list with basic details
- Member count

#### Get Team Member Details
```
GET /team-leader/team/members/:memberId
```

Returns detailed information about a specific team member:
- Personal information
- Job details
- Contact information
- Profile image

#### Get Team Performance Summary
```
GET /team-leader/team/performance
```

Returns performance metrics for the team:
- Total evaluations count
- Completed vs. active evaluations
- Work rate evaluation summaries
- Behavioral evaluation summaries

#### Get Member Performance History
```
GET /team-leader/team/members/:memberId/performance
```

Returns performance history for a specific team member:
- Work rate evaluation history
- Behavioral evaluation history
- Scores and criteria breakdowns

### 3. Evaluation Management

#### Get All Evaluations
```
GET /evaluations
```

Returns all evaluations created by the team leader:
- Work rate evaluations
- Behavioral evaluations
- Status and period information

#### Get Evaluation Templates
```
GET /evaluations/templates
GET /evaluations/templates?type=work_rate
GET /evaluations/templates?type=behavioral
```

Returns available evaluation templates:
- Standard templates
- Specialized templates (e.g., software development, project management)
- Criteria with weights and descriptions

#### Create New Evaluation
```
POST /evaluations
```

Creates a new evaluation (work rate or behavioral):

**Request Body:**
```json
{
  "type": "work_rate",
  "evaluationPeriod": "Q1 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "allowSelfEvaluation": true,
  "allowPeerEvaluation": true,
  "requireLeaderApproval": false,
  "workRateCriteria": [
    {
      "name": "Quality of Work",
      "weight": 25,
      "maxScore": 10
    }
  ]
}
```

#### Get Evaluation Details
```
GET /evaluations/:id
```

Returns detailed information about a specific evaluation:
- Evaluation settings
- Member evaluations
- Scores and criteria
- Status and dates

#### Update Evaluation
```
PUT /evaluations/:id
```

Updates evaluation status or criteria:
- Change status (draft → active → completed)
- Update work rate evaluations
- Update behavioral evaluations

#### Submit Work Rate Evaluation
```
POST /evaluations/:id/work-rate/:memberId
```

Submits work rate evaluation for a specific team member:

**Request Body:**
```json
{
  "criteria": [
    {
      "name": "Quality of Work",
      "weight": 25,
      "score": 8,
      "remarks": "Excellent attention to detail"
    }
  ],
  "overallRemarks": "Strong performer with room for growth"
}
```

#### Submit Behavioral Evaluation
```
POST /evaluations/:id/behavioral
```

Submits behavioral evaluation as team leader:

**Request Body:**
```json
{
  "evaluateeId": "member_id",
  "criteria": [
    {
      "name": "Leadership",
      "score": 4,
      "remarks": "Shows initiative in team projects"
    }
  ],
  "overallRemarks": "Demonstrates strong leadership potential"
}
```

#### Delete Evaluation
```
DELETE /evaluations/:id
```

Deletes a draft evaluation (only draft evaluations can be deleted).

### 4. Team Reports

#### Generate Team Report
```
GET /team-leader/team/report
GET /team-leader/team/report?startDate=2024-01-01&endDate=2024-03-31
GET /team-leader/team/report?type=work_rate
```

Generates comprehensive team performance report:
- Team information
- Evaluation summary
- Detailed evaluation breakdowns
- Performance metrics

**Query Parameters:**
- `startDate`: Report start date (YYYY-MM-DD)
- `endDate`: Report end date (YYYY-MM-DD)
- `type`: Filter by evaluation type (work_rate, behavioral)

## Data Models

### Evaluation Types

#### Work Rate Evaluation
- **Purpose**: Leader evaluates team members on performance criteria
- **Scoring**: Weighted scoring system (0-10 scale)
- **Criteria**: Customizable with weights (e.g., Quality: 25%, Productivity: 20%)
- **Output**: Weighted scores and overall performance rating

#### Behavioral Evaluation
- **Purpose**: Assess soft skills and competencies
- **Scoring**: Standard scoring (0-5 scale)
- **Types**: Self-evaluation, peer evaluation, leader evaluation
- **Output**: Comprehensive behavioral assessment

### Evaluation Statuses
- `draft`: Initial creation, can be modified
- `active`: Open for submissions
- `completed`: All evaluations submitted
- `archived`: Historical record

## Usage Examples

### Creating a Work Rate Evaluation

1. **Get Template:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/evaluations/templates?type=work_rate"
```

2. **Create Evaluation:**
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "work_rate",
    "evaluationPeriod": "Q1 2024",
    "startDate": "2024-01-01",
    "endDate": "2024-03-31",
    "workRateCriteria": [
      {"name": "Quality", "weight": 30, "maxScore": 10},
      {"name": "Productivity", "weight": 25, "maxScore": 10},
      {"name": "Skills", "weight": 25, "maxScore": 10},
      {"name": "Communication", "weight": 20, "maxScore": 10}
    ]
  }' \
  "http://localhost:5000/api/evaluations"
```

3. **Submit Member Evaluation:**
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "criteria": [
      {"name": "Quality", "weight": 30, "score": 8, "remarks": "Good work"},
      {"name": "Productivity", "weight": 25, "score": 9, "remarks": "Excellent output"},
      {"name": "Skills", "weight": 25, "score": 7, "remarks": "Room for improvement"},
      {"name": "Communication", "weight": 20, "score": 8, "remarks": "Clear communicator"}
    ],
    "overallRemarks": "Strong team member with good potential"
  }' \
  "http://localhost:5000/api/evaluations/<evaluation_id>/work-rate/<member_id>"
```

### Creating a Behavioral Evaluation

1. **Get Template:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/evaluations/templates?type=behavioral"
```

2. **Create Evaluation:**
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "behavioral",
    "evaluationPeriod": "Q1 2024",
    "startDate": "2024-01-01",
    "endDate": "2024-03-31",
    "allowSelfEvaluation": true,
    "allowPeerEvaluation": true,
    "behavioralCriteria": [
      {"name": "Leadership", "maxScore": 5},
      {"name": "Adaptability", "maxScore": 5},
      {"name": "Professionalism", "maxScore": 5}
    ]
  }' \
  "http://localhost:5000/api/evaluations"
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a message field:
```json
{
  "message": "Error description"
}
```

## Setup Instructions

1. **Install Dependencies:**
```bash
npm install
```

2. **Set Environment Variables:**
Create `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. **Seed Evaluation Templates:**
```bash
npm run seed:templates
```

4. **Start Server:**
```bash
npm run server:dev
```

## Notes

- Team leaders can only access evaluations for their own team
- Evaluation templates provide standardized criteria for consistency
- Work rate evaluations use weighted scoring for objective assessment
- Behavioral evaluations support multiple evaluator types (self, peer, leader)
- All evaluations include timestamps and audit trails
- Reports can be filtered by date range and evaluation type

