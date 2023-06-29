----------
# WorkWise
----------

## Module:
1. Consumer
2. Freelancer
3. Admin

### Entity of Consumer:
- Consumer
- Orders
- JOBS / SKILLS
- Payment
- Messages

### Entity of Freelancer:
- Freelancer
- JOBS / SKILLS
- Projects
- Work History
- Orders
- Messages

### Entity of Admin:
- Admin
- Payment to Freelancers
- Contact Us (E-Mail)

Schemas:
- Consumer
  - Name
  - Email
  - Username
  - Password
  - Phone
  - Address
  - Payment Details
  - avatar
  - emailVerified
  - phoneVerified
- Freelancer
  - Name
  - Email
  - Username
  - Password
  - Phone
  - Address
  - location
  - Account Details
  - Skills
  - experties
  - Priority
  - avatar
  - emailVerified
  - phoneVerified
  - approved
- Work
  - freelancerId
  - consumerId
  - skillId
  - price
  - status (requested, accepted, rejected, ongoing, failed, completed)