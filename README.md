# Consultant Tracker

A comprehensive full-stack application for managing consultants and job submissions, built with FastAPI + MongoDB backend and React + Material-UI frontend.

## 🚀 Features

### Core Functionality
- **Consultant Management**: CRUD operations for consultant profiles
- **Submission Tracking**: Track job submissions with status updates
- **Per-Consultant Analytics**: Individual consultant performance metrics
- **Availability Management**: Filter and manage consultant availability
- **Comprehensive Reports**: Analytics and insights with charts
- **CSV Import/Export**: Bulk data operations
- **Real-time Status Updates**: Track submission pipeline progress

### Technical Features
- **Clean Architecture**: Modular backend with repositories and services
- **Data Validation**: Pydantic models with comprehensive validation
- **Database Indexing**: Optimized MongoDB queries with proper indexes
- **Responsive UI**: Material-UI components with modern design
- **Docker Support**: Complete containerization with Docker Compose
- **API Documentation**: Auto-generated FastAPI docs
- **Unit Tests**: Comprehensive test coverage for backend services

## 🛠 Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **MongoDB**: NoSQL database with Motor async driver
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for production deployment

### Frontend
- **React**: Modern JavaScript library
- **Material-UI (MUI)**: React component library
- **Recharts**: Chart library for data visualization
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **MongoDB**: Database with authentication

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd consultant-tracker
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Seed the database** (optional)
   ```bash
   docker-compose exec backend python seed_data.py
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - MongoDB: localhost:27017

## 🏗 Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**
   ```bash
   export MONGODB_URL="mongodb://localhost:27017/consultant_tracker"
   ```

5. **Start MongoDB** (if not using Docker)
   ```bash
   mongod
   ```

6. **Run the backend**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   export REACT_APP_API_URL="http://localhost:8000/api"
   ```

4. **Start the frontend**
   ```bash
   npm start
   ```

## 📊 Database Schema

### Consultants Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "experience_years": "number",
  "tech_stack": ["string"],
  "available": "boolean",
  "location": "string",
  "visa_status": "enum",
  "rating": "enum",
  "email": "string",
  "phone": "string",
  "notes": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Submissions Collection
```json
{
  "_id": "ObjectId",
  "consultant_id": "string",
  "client_or_job": "string",
  "recruiter": "string",
  "submitted_on": "datetime",
  "status": "enum",
  "comments": "string",
  "attachment_path": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Status History Collection
```json
{
  "_id": "ObjectId",
  "submission_id": "string",
  "old_status": "enum",
  "new_status": "enum",
  "changed_at": "datetime",
  "changed_by": "string",
  "comments": "string"
}
```

## 🔌 API Endpoints

### Consultants
- `POST /api/consultants/` - Create consultant
- `GET /api/consultants/` - List consultants (with filters)
- `GET /api/consultants/{id}` - Get consultant by ID
- `PUT /api/consultants/{id}` - Update consultant
- `DELETE /api/consultants/{id}` - Delete consultant
- `POST /api/consultants/import-csv` - Import consultants from CSV
- `GET /api/consultants/export/csv` - Export consultants to CSV

### Submissions
- `POST /api/submissions/` - Create submission
- `GET /api/submissions/` - List submissions (with filters)
- `GET /api/submissions/{id}` - Get submission by ID
- `PUT /api/submissions/{id}` - Update submission
- `PUT /api/submissions/{id}/status` - Update submission status
- `DELETE /api/submissions/{id}` - Delete submission
- `GET /api/submissions/consultant/{id}` - Get submissions by consultant
- `GET /api/submissions/{id}/history` - Get status history

### Reports
- `GET /api/reports/status` - Submissions by status
- `GET /api/reports/tech` - Submissions by tech stack
- `GET /api/reports/recruiter` - Recruiter productivity
- `GET /api/reports/funnel` - Pipeline funnel
- `GET /api/reports/time-to-stage` - Time between stages
- `GET /api/reports/dashboard` - Comprehensive dashboard data

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
consultant-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── db.py                   # Database configuration
│   │   ├── models.py               # Pydantic models
│   │   ├── repositories/           # Data access layer
│   │   │   ├── consultants.py
│   │   │   ├── submissions.py
│   │   │   └── reports.py
│   │   └── routers/                # API routes
│   │       ├── consultants.py
│   │       ├── submissions.py
│   │       └── reports.py
│   ├── tests/                      # Unit tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── seed_data.py               # Sample data
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── pages/                 # Page components
│   │   │   ├── Consultants.js
│   │   │   ├── Submissions.js
│   │   │   ├── PerConsultant.js
│   │   │   ├── Availability.js
│   │   │   └── Reports.js
│   │   ├── App.js                 # Main app component
│   │   ├── api.js                 # API client
│   │   └── index.js               # Entry point
│   ├── package.json
│   └── Dockerfile
├── mongo-init/                    # MongoDB initialization
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend
- `MONGODB_URL`: MongoDB connection string
- `DEBUG`: Enable debug mode

#### Frontend
- `REACT_APP_API_URL`: Backend API URL

### Docker Configuration
- MongoDB: Port 27017
- Backend: Port 8000
- Frontend: Port 3000

## 📈 Usage Examples

### Adding a Consultant
1. Navigate to Consultants page
2. Click "Add Consultant"
3. Fill in the form with consultant details
4. Select tech stack and other preferences
5. Save the consultant

### Creating a Submission
1. Go to Submissions page
2. Click "Add Submission"
3. Select consultant from dropdown
4. Enter client/job details
5. Set submission date and status
6. Add any comments
7. Save the submission

### Viewing Reports
1. Navigate to Reports page
2. Apply filters (date range, recruiter, etc.)
3. View various charts and analytics
4. Export data to CSV if needed

### Managing Availability
1. Go to Availability page
2. Use filters to find consultants
3. Toggle availability status
4. Add submissions directly from consultant cards

## 🚀 Deployment

### Production Deployment

1. **Update environment variables for production**
   ```bash
   # Backend
   export MONGODB_URL="mongodb://your-production-mongodb-url"
   
   # Frontend
   export REACT_APP_API_URL="https://your-api-domain.com/api"
   ```

2. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **Deploy with production compose file**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Scaling Considerations
- Use MongoDB Atlas for production database
- Implement Redis for caching
- Add load balancer for multiple backend instances
- Use CDN for frontend static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the test files for usage examples

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - Consultant management
  - Submission tracking
  - Basic reporting
  - Docker support
