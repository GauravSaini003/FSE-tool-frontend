# Seoly Operations Portal

## Client Overview

Seoly is a role-based operations portal for managing customers, products, sales orders, stock review, approval, and dispatch. Each user sees the areas relevant to their operational role, while administrators manage the full system.

The frontend is a responsive React web application connected to the Seoly backend API. The production frontend is configured to use:

`https://fse-tool-backend.onrender.com`

## Main Capabilities

- Secure account registration and login
- Password recovery and password reset screens
- Role-based dashboards and navigation
- Customer directory and customer order history
- Product and inventory visibility
- Sales order creation and tracking
- Order detail view with status timeline
- Order approval, rejection, and send-back workflow
- Dispatch queue for dispatch users
- Scheme management for administrators
- User management for administrators
- Automatic access-token use and refresh-token handling
- Logout and protected routes

## User Roles

### FSE

The Field Sales Executive creates and tracks customer orders.

Available areas:

- Dashboard
- Orders
- Create Order
- My Customers
- Products

### Team Leader

The Team Leader reviews submitted orders and monitors customer activity.

Available areas:

- Dashboard
- Orders
- Customer Insights

Team Leaders can move orders through the review decision flow by approving, rejecting, or sending an order back when clarification or correction is needed.

### Warehouse

The Warehouse user reviews products and stock-related information.

Available areas:

- Dashboard
- Orders
- Inventory / Stock

### Dispatch

The Dispatch user manages orders that are ready to move through delivery operations.

Available areas:

- Dashboard
- Orders
- Dispatch Queue

### Admin

The Admin has access to the complete operational system and configuration areas.

Available areas:

- Dashboard
- Orders
- Customers
- Products
- Schemes
- User Management

## Application Screens

### Authentication

- **Login:** Signs an existing user into the portal.
- **Register:** Creates a new user account.
- **Forgot Password:** Starts the password recovery process using an email address.
- **Reset Password:** Completes a password reset using the reset details supplied by the backend.

After a successful login, the access token and refresh token are stored for the current browser session. Protected pages redirect unauthenticated users to the login screen.

### Dashboard

The dashboard is the landing page after login. It provides the operational starting point for the signed-in user and is displayed inside the shared navigation layout.

### Orders

The Orders area is used to:

- View the order list
- Open an individual order
- Review order information and status history
- Create a new order when the user has FSE permissions
- Update order status when the user’s role and the order state allow it

### Create Order

FSE users can create an order by selecting or entering the required customer, product, and order information. The order is submitted to the backend and then becomes available in the order workflow.

### Order Details

The order detail screen presents the selected order and its current progress. The status timeline makes the order lifecycle visible to operational users.

### Customers

The customer screens provide customer records and customer-related order information. Access is available to FSE, Team Leader, and Admin users.

### Products / Inventory

The Products screen provides product information and supports product updates for the roles permitted by the backend. FSE users see products while preparing orders, Warehouse users use the area for stock operations, and Admin users have broader management access.

### Dispatch Queue

The Dispatch Queue is the dispatch worklist for Dispatch users. It is intended to show orders ready for dispatch and support the final operational handoff.

### Schemes

The Schemes area is available to Admin users for managing commercial schemes or promotional rules used by the business.

### User Management

Admin users can view users, create users, and update user status from the User Management screen.

## Order Lifecycle

Orders use the following business statuses:

1. `SUBMITTED` - The order has been created and submitted.
2. `UNDER_REVIEW` - The order is being reviewed.
3. `APPROVED` - The order has passed review.
4. `REJECTED` - The order has been declined.
5. `SENT_BACK` - The order requires correction or additional information.
6. `STOCK_CONFIRMED` - Required stock has been confirmed.
7. `READY_FOR_DISPATCH` - The order can be handed to dispatch.
8. `DISPATCHED` - The order has left the dispatch operation.
9. `DELIVERED` - The order has been delivered.

Team Leader review decisions support the following transitions:

- Submitted or under-review order -> Approved
- Submitted or under-review order -> Rejected
- Submitted or under-review order -> Sent back

The backend remains the source of truth for permissions and valid status transitions.

## Backend Integration

The frontend uses a shared Axios API client. The client:

- Sends JSON requests to the backend
- Attaches the stored access token as a Bearer token
- Attempts token refresh after an unauthorized response
- Clears the session and returns the user to login if refresh fails

The main API areas are:

| Area | Operations |
| --- | --- |
| Authentication | Register, login, refresh, logout, current user, forgot password, reset password |
| Customers | List, create, update, customer orders |
| Orders | List, detail, create, update status |
| Products | List, create, update |
| Schemes | List, create |
| Users | List, create, update status |

## Running the Frontend

### Requirements

- Node.js 18 or newer recommended
- npm
- Access to the Seoly backend API

### Install and run locally

From the `vite-project` directory:

```bash
npm install
npm run dev
```

The local development configuration defaults to:

`http://localhost:3000/api`

### Production build

```bash
npm run build
```

The production configuration in `.env.production` points to the live Render backend:

`VITE_API_BASE_URL=https://fse-tool-backend.onrender.com`

## Client Notes

- The interface is responsive and can be used on desktop and smaller screens.
- Navigation is automatically filtered according to the signed-in user role.
- Users cannot open protected screens without a valid authenticated session.
- The backend must be available for login, data loading, and create/update actions.
- Search and notification controls are currently present in the shared header UI; their full business behavior depends on the next backend/product integration phase.
- The final production deployment should provide the same `VITE_API_BASE_URL` value through its hosting environment when environment files are not included in the deployment process.

## Project Structure

```text
src/
  api/          Backend API modules and Axios client
  components/   Shared layout and status components
  context/      Authentication state and session handling
  pages/        Authentication, dashboard, and operations screens
  utils/        Shared roles and order status constants
```

## Current Delivery

The frontend application is available in the GitHub repository:

https://github.com/GauravSaini003/FSE-tool-frontend

The live backend health endpoint is available at:

https://fse-tool-backend.onrender.com