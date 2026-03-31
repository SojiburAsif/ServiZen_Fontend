# 🚀 ServZEN - Service Management Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<div align="center">
  <h3>🌟 Your One-Stop Solution for Home & Business Services</h3>
  <p>From faulty wiring to new appliance installation, our certified professionals ensure your home's safety and efficiency. Fast, reliable, and affordable services at your doorstep.</p>
</div>

---

## 📖 About the Project

ServZEN is a comprehensive service management platform designed to connect customers with certified service providers. Whether you need electrical repairs, plumbing services, HVAC maintenance, or home appliance care, ServZEN makes it easy to find, book, and manage professional services.

### 🎯 Mission
To revolutionize the service industry by providing a seamless, transparent, and efficient platform for both service seekers and providers.

### 🌍 Vision
To become the leading digital marketplace for home and business services worldwide, empowering local professionals and ensuring customer satisfaction.

---

## 📋 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📦 Installation](#-installation)
- [🎯 Usage](#-usage)
- [🔗 Links](#-links)
- [📸 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🏠 Service Categories
- **🔌 Electrical Services**: Faulty wiring, new appliance installation, safety checks
- **🚰 Plumbing Services**: Leaky faucets, pipe installations, residential & commercial
- **🌡️ HVAC Services**: Heating, cooling, maintenance, and repairs
- **❄️ AC & Appliance Care**: Installation, maintenance, repairs for comfort
- **🎨 Interior & Painting**: Design consultation, flawless execution, quality craftsmanship

### 👤 User Features
- 🔐 **Authentication**: Secure login/signup with role-based access
- 📅 **Booking System**: Easy scheduling and management of services
- ⭐ **Reviews & Ratings**: Share feedback and read reviews
- 🔔 **Notifications**: Real-time updates on bookings and services
- 📍 **Location Services**: Integrated maps for service areas
- 📊 **Dashboard**: Personalized dashboard for users, providers, and admins

### 🛡️ Admin & Provider Features
- 👥 **User Management**: Manage users, providers, and roles
- 📈 **Analytics**: Service statistics and performance metrics
- 💳 **Payment Integration**: Secure payment processing
- 📋 **Booking Management**: Oversee and manage all bookings
- 🏷️ **Service Management**: Add, update, and categorize services

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **State Management**: [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- **Maps**: [React Leaflet](https://react-leaflet.js.org/) & [Google Maps API](https://developers.google.com/maps)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animations
- **Audio**: [Howler.js](https://howlerjs.com/) - Audio library
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

### Development Tools
- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Linting**: [ESLint](https://eslint.org/) - Code linting
- **Deployment**: [Vercel](https://vercel.com/) - Cloud platform for frontend

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher) or [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/servizen-frontend.git
   cd servizen-frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   # Add other required environment variables
   ```

4. **Run the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 Usage

### For Users
1. **Sign Up/Login**: Create an account or log in
2. **Browse Services**: Explore available services by category
3. **Book Services**: Select a service, choose date/time, and confirm booking
4. **Track Bookings**: View booking history and status in dashboard
5. **Leave Reviews**: Rate and review completed services

### For Service Providers
1. **Register as Provider**: Sign up with provider role
2. **Manage Profile**: Update services, availability, and pricing
3. **Handle Bookings**: Accept/reject bookings, update status
4. **View Analytics**: Monitor performance and earnings

### For Admins
1. **Access Admin Panel**: Login with admin credentials
2. **Manage Users**: View, edit, or deactivate user accounts
3. **Oversee Services**: Add new services, manage categories
4. **Monitor Platform**: View analytics and system health

---

## 🔑 Demo Credentials

To explore the platform, you can use the following demo accounts:

### 👑 Admin Account
- **Email**: admin@gmail.com
- **Password**: Admin1234
- **Role**: Full access to admin dashboard, user management, analytics, and platform settings

### 🛠️ Service Provider Account
- **Email**: provider@gmail.com
- **Password**: Provider1234
- **Role**: Manage services, handle bookings, view provider analytics

### 👤 Client Account
- **Email**: clinte@gmail.com
- **Password**: Clinte1234
- **Role**: Browse services, book appointments, leave reviews, manage personal dashboard

> **Note**: These are demo credentials for testing purposes. Please use them responsibly and do not share sensitive information.

---

## 🔗 Links

- **🌐 Live Demo**: [https://servi-zen-backend.vercel.app/](https://servi-zen-backend.vercel.app/)
- **🎥 Demo Video**: [Watch on Google Drive](https://drive.google.com/file/d/1TTPKsI8YCEszoxKHtXUTTRnQbkZBMIaQ/view)
- **📚 Documentation**: [Coming Soon]
- **🐛 Report Issues**: [GitHub Issues](https://github.com/your-username/servizen-frontend/issues)

---

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Homepage+Screenshot" alt="Homepage" width="80%" />
  <p><em>🏠 Homepage - Discover Services</em></p>

  <img src="https://via.placeholder.com/800x400?text=Dashboard+Screenshot" alt="Dashboard" width="80%" />
  <p><em>📊 User Dashboard - Manage Bookings</em></p>

  <img src="https://via.placeholder.com/800x400?text=Booking+Screenshot" alt="Booking" width="80%" />
  <p><em>📅 Service Booking - Easy Scheduling</em></p>
</div>

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the ServZEN Team</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
