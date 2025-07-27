# 🌟 MindWeave AI

A modern, AI-powered journaling application that helps users reflect on their thoughts and emotions through intelligent analysis and personalized insights.

## ✨ Features

- **🤖 AI-Powered Reflections**: Get intelligent insights and reflections on your journal entries
- **📱 Modern UI/UX**: Beautiful, responsive design with dark/light mode support
- **📊 Mood Tracking**: Track your emotional state with visual mood indicators
- **📅 Calendar Integration**: View your journal entries in a calendar format
- **🔐 Secure Authentication**: Built with Supabase for secure user management
- **💳 Subscription Management**: Integrated Stripe payments for premium features
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Payments**: Stripe
- **Icons**: Lucide React
- **Charts**: Recharts
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/mindweave-ai.git
   cd mindweave-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_REFLECTION_API_URL=your_reflection_api_url
   ```

4. **Set up Supabase**

   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Set up authentication providers
   - Configure Row Level Security (RLS) policies

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
mindweave-ai/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, Theme)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries (Supabase)
│   ├── pages/              # Page components
│   └── utils/              # Helper functions
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Supabase)

1. Push migrations: `supabase db push`
2. Deploy edge functions: `supabase functions deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Stripe](https://stripe.com) for payment processing
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact us at support@mindweave.ai.

---

Made with ❤️ by the MindWeave team
