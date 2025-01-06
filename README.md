# Anon-Messenger

A Next.js application that enables users to receive anonymous messages and feedback through personalized URLs. Built with modern web technologies and featuring a clean, responsive interface with dark mode support.

## Features

- **Personalized Message Links**: Automatically generates unique URLs for each user upon login
- **Anonymous Messaging**: Visitors can send messages without revealing their identity
- **Secure Authentication**: User authentication powered by NextAuth.js
- **Dark Mode Support**: Seamless theme switching with next-themes
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Real-time Form Validation**: Enhanced form handling with React Hook Form and Zod
- **Email Notifications**: Email support using React Email and Resend
- **Modern UI Components**: Built with Radix UI primitives

## Tech Stack

### Frontend
- React 18
- Next.js 15
- Tailwind CSS
- Radix UI components
- React Hook Form
- Zod validation

### Backend
- MongoDB with Mongoose
- NextAuth.js for authentication
- Resend for email services
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB instance
- Resend API key for email functionality

### Installation

1. Clone the repository:
```bash
git https://github.com/Sarcastic-Soul/anon-messenger.git
cd anon-messenger
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```env
DATABASE_URL=your_mongodb_url
NEXTAUTH_SECRET=your_nextauth_secret
RESEND_API_KEY=your_resend_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Create an account or log in to generate your unique messaging URL
2. Share your personalized URL with others to receive anonymous messages
3. View and manage received messages in your dashboard
4. Toggle between light and dark mode using the theme switcher

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Youtube [Tutorial](https://www.youtube.com/playlist?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Database hosting on [MongoDB](https://www.mongodb.com/)
