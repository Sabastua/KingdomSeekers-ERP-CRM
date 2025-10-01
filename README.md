# KingdomSeekers ERP/CRM System

A comprehensive ERP/CRM system for church management, including member management, donation processing, HR management, finance, procurement, project management, and Heaven's Gate prayer mountain booking system.

## Features

- **Member Management**: Registration, vetting, and pastor assignment
- **Donation Processing**: International giving with multiple payment methods
- **HR Management**: Staff records and payment processing
- **Finance Module**: Budgeting, expense tracking, and financial reporting
- **Procurement**: Purchase requisitions, approvals, and vendor management
- **Project Management**: Kingdom City construction project tracking
- **Heaven's Gate Booking**: Prayer mountain accommodation booking system

## Technology Stack

- Java 17+
- Spring Boot 3.x
- Spring Security with JWT
- PostgreSQL
- RESTful API
- OpenAPI Documentation

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 14+

### Installation

1. Clone the repository
2. Configure database settings in `application.properties`
3. Run the application:

```bash
mvn spring-boot:run
```

### API Documentation

Access the API documentation at:
```
http://localhost:8080/api-docs
http://localhost:8080/swagger-ui.html
```

## Project Structure

- `src/main/java/com/kingdomseekers/`
  - `config/`: Application configuration
  - `controller/`: REST API controllers
  - `entity/`: Domain models
  - `repository/`: Data access interfaces
  - `service/`: Business logic
  - `validation/`: Custom validators

## License

This project is proprietary and confidential.