# English Course Website with API Integration

This is a Next.js website for an English course with integrated backend API functionality for course and member registrations.

## Features

### Frontend Components

- **Courses Section**: Displays course content with integrated registration form
- **Member Registration**: Standalone component for member registrations
- **Admin Dashboard**: Full admin interface for managing registrations
- **Responsive Design**: Mobile-first approach with modern UI components

### API Integration

- **Course Registrations**: Public registration endpoint with admin management
- **Member Registrations**: Public registration endpoint with admin management
- **Authentication**: JWT-based admin authentication
- **Status Management**: Full CRUD operations for registrations

## API Endpoints

### Base URL

```
http://localhost:8080/api
```

### Public Endpoints

- `POST /courses/register` - Course registration
- `POST /members/register` - Member registration

### Admin Endpoints (Require Authentication)

- `POST /auth/login` - Admin login
- `GET /auth/profile` - Get admin profile
- `POST /auth/change-password` - Change admin password
- `GET /courses` - Get all course registrations
- `PUT /courses/:id/status` - Update course registration status
- `DELETE /courses/:id` - Delete course registration
- `GET /members` - Get all member registrations
- `PUT /members/:id/status` - Update member registration status
- `DELETE /members/:id` - Delete member registration

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Backend API server running on port 8080

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd english-course-website
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Access

1. Navigate to `/admin` in your browser
2. Use the default credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. **Important**: Change the default password after first login

## Component Usage

### Course Registration

The course registration form is integrated into the main courses section. Users can:

- Fill out personal information
- Select course details
- Add optional notes
- Submit registration

### Member Registration

The member registration component can be placed anywhere in your application:

```tsx
import MemberRegistration from "@/components/member-registration"

// Basic usage
<MemberRegistration />

// Customized usage
<MemberRegistration
  triggerText="Join Our Community"
  triggerVariant="outline"
  triggerSize="lg"
  className="custom-styles"
/>
```

### Admin Dashboard

Access the admin dashboard at `/admin` to:

- View all registrations
- Filter by status
- Search course registrations
- Update registration statuses
- Delete registrations
- Manage pagination

## File Structure

```
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── admin-dashboard.tsx   # Admin interface
│   ├── courses-section.tsx   # Course display + registration
│   ├── member-registration.tsx # Member registration form
│   ├── footer.tsx            # Footer with member registration
│   └── ui/                   # Reusable UI components
├── lib/
│   └── api.ts                # Centralized API service
├── hooks/
│   └── use-toast.ts          # Toast notifications
└── public/                   # Static assets
```

## API Service

The `lib/api.ts` file provides a centralized service for all API calls:

```tsx
import { courseAPI, memberAPI, authAPI } from "@/lib/api";

// Course registration
const result = await courseAPI.register(registrationData);

// Member registration
const result = await memberAPI.register(memberData);

// Admin login
const result = await authAPI.login(credentials);
```

## Status Values

### Course Registration Status

- `pending` - Chờ duyệt (Pending)
- `approved` - Đã duyệt (Approved)
- `rejected` - Từ chối (Rejected)
- `completed` - Hoàn thành (Completed)

### Member Registration Status

- `pending` - Chờ duyệt (Pending)
- `approved` - Đã duyệt (Approved)
- `rejected` - Từ chối (Rejected)
- `active` - Hoạt động (Active)
- `inactive` - Không hoạt động (Inactive)

## Customization

### Styling

The application uses Tailwind CSS with custom components. You can customize:

- Color scheme in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `app/globals.css`

### API Configuration

Update the API base URL in `lib/api.ts`:

```tsx
const API_BASE_URL = "http://your-api-domain.com/api";
```

### Form Fields

Modify registration forms by updating the interfaces in `lib/api.ts` and the corresponding component state.

## Error Handling

The application includes comprehensive error handling:

- API error responses
- Network failures
- Validation errors
- User-friendly error messages via toast notifications

## Security Features

- JWT token authentication for admin endpoints
- Token storage in localStorage (consider httpOnly cookies for production)
- Input validation and sanitization
- CSRF protection through proper API design

## Production Considerations

1. **Environment Variables**: Use `.env.local` for API URLs and secrets
2. **HTTPS**: Ensure all API calls use HTTPS in production
3. **Token Storage**: Consider more secure token storage methods
4. **Rate Limiting**: Implement rate limiting on registration endpoints
5. **Input Validation**: Add server-side validation
6. **Error Logging**: Implement proper error logging and monitoring

## Troubleshooting

### Common Issues

1. **API Connection Failed**

   - Ensure backend server is running on port 8080
   - Check CORS configuration on backend
   - Verify API endpoint URLs

2. **Authentication Issues**

   - Clear localStorage and re-login
   - Check JWT token expiration
   - Verify admin credentials

3. **Form Submission Errors**
   - Check browser console for errors
   - Verify required fields are filled
   - Check network tab for API responses

### Debug Mode

Enable debug logging by adding to your environment:

```bash
NEXT_PUBLIC_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the API documentation

---

**Note**: This is a frontend application that requires a compatible backend API server to function properly. Ensure your backend implements the API endpoints described in this documentation.
