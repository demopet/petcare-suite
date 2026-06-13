# PetCare Suite - Veterinary Clinic Management Demo

A modern, interactive demonstration of a veterinary clinic management system built with vanilla HTML, CSS, and JavaScript. Fully compatible with GitHub Pages.

## 🚀 Live Demo

**[https://demopet.github.io/petcare-suite](https://demopet.github.io/petcare-suite)**

## 📋 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Owner (Executive) | `owner@petcare.id` | `demo` |
| Doctor (Veterinarian) | `dokter@petcare.id` | `demo` |
| Staff (Front Desk) | `staff@petcare.id` | `demo` |
| Customer (Pet Owner) | `budi@gmail.com` | `demo` |

## ✨ Features

### 🏠 Homepage
- Premium landing page with clinic information
- Service showcase
- Trust section with statistics
- Team profiles
- Testimonials and FAQ
- Contact form (demo)

### 🔐 Role-Based Access
- Responsive login with 4 user roles
- Session storage persistence
- Sidebar navigation
- Role-specific menu items

### 👨‍💼 Owner Dashboard
- **Executive Analytics**: Multi-branch revenue, patient stats, inventory health
- **Revenue Trends**: Daily/monthly revenue charts
- **Branch Switcher**: View data across multiple clinic locations
- **Accounting**: Transaction tracking and profit analysis
- **Inventory Management**: Stock levels, purchase orders, stock movement
- **Reports**: Appointment, medical, vaccination, revenue reports
- **User Management**: Staff profiles and roles
- **Settings**: Clinic configuration

### 👨‍⚕️ Doctor Module
- **Dashboard**: Today's appointments and upcoming schedule
- **Appointments**: View and manage patient appointments
- **Medical Records**: Create and track medical examinations
- **Vaccination**: Monitor pet vaccination status and due dates
- **Patient Monitoring**: Track inpatient status and progress
- **Examination Workflow**: Full medical examination form with notes

### 👩‍💼 Staff Dashboard
- **Front Desk**: Appointment queue management
- **Queue Board**: Visual kanban-style queue tracking
- **Appointment Processing**: Move appointments through workflow states
- **Customer Management**: Register new customers
- **Inventory**: Manage medical supplies
- **POS System**: Process transactions

### 🐾 Customer Portal
- **Pet Profiles**: View all pet information
- **Appointment Booking**: Search available slots and book appointments
- **Medical Records**: View pet's medical history
- **Vaccination Tracking**: Check vaccination status and reminders
- **Invoice Center**: View and download invoices
- **Notifications**: Vaccination reminders and alerts

### 🛒 POS System
- Product catalog with categories
- Shopping cart with quantity management
- Real-time total calculation
- Multiple payment methods
- Receipt display

## 🏗️ Project Structure

```
├── index.html              # Landing page
├── pages/
│   ├── login.html         # Login page
│   └── dashboard.html     # Dashboard shell & all modules
├── css/
│   ├── variables.css      # Global theme (colors, spacing)
│   ├── components.css     # Shared UI components
│   ├── dashboard.css      # Dashboard-specific layout
│   └── landing.css        # Landing page styles
├── js/
│   ├── ui.js              # Global utilities (modals, toasts, formatting)
│   ├── data.js            # Mock data for all modules
│   └── dashboard.js       # Dashboard logic & rendering
├── assets/
│   ├── icons/             # SVG assets
│   └── images/            # Image placeholders
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions CI/CD
└── .nojekyll              # Prevent Jekyll processing
```

## 🎨 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Icons**: [Lucide Icons](https://lucide.dev) (CDN)
- **Data**: Mock data in JavaScript objects
- **Deployment**: GitHub Pages + GitHub Actions
- **Storage**: Session Storage (browser session only)

## 🔄 GitHub Pages Deployment

### Manual Setup
1. Go to repository **Settings** → **Pages**
2. Source: `Deploy from a branch`
3. Branch: `main` / `/(root)`
4. Click **Save**

### Automated CI/CD (GitHub Actions)
The repository includes a GitHub Actions workflow that:
- Triggers on every push to `main` branch
- Automatically builds and deploys to GitHub Pages
- No manual deployment needed

**Workflow file**: `.github/workflows/deploy.yml`

Monitor deployments in: **Actions** tab → **Deploy to GitHub Pages**

## 📊 Mock Data

The system includes realistic mock data for:
- **Appointments**: Full scheduling with status tracking
- **Medical Records**: Examination notes and diagnoses
- **Vaccinations**: Pet vaccination history and due dates
- **Customers**: Customer profiles and contact info
- **Pets**: Pet species, breeds, weight, status
- **Inventory**: Medical supplies with stock levels and expiry dates
- **Products**: Petshop items with pricing
- **Financial**: Revenue trends, transactions, expenses
- **Reports**: Pre-configured report templates

All data is stored in `js/data.js` and can be easily modified.

## 🎯 Workflow Examples

### Owner Workflow
1. Login as owner
2. View executive dashboard with multi-branch analytics
3. Check revenue trends and top services
4. Switch between clinic branches
5. Manage purchase orders in inventory
6. Preview and export reports

### Doctor Workflow
1. Login as doctor
2. View today's appointments
3. Click "Start Examination" on an appointment
4. Fill out examination form
5. Save medical record
6. View patient's vaccination status

### Staff Workflow
1. Login as staff
2. View queue board with appointments in different states
3. Move appointments through: Waiting → Confirmed → In-Consultation → Completed
4. Register new customers
5. Process POS transactions

### Customer Workflow
1. Login as customer
2. View pet profiles
3. Book appointment with available doctor/time
4. Check vaccination reminders
5. View and download invoices

## 🎓 Learning Resources

- **HTML Structure**: Check `pages/dashboard.html` for semantic layout
- **CSS System**: `css/variables.css` contains all design tokens
- **JavaScript Patterns**: `js/dashboard.js` shows role-based rendering
- **Mock Data**: `js/data.js` demonstrates data structures

## 🚀 Getting Started Locally

```bash
# Clone repository
git clone https://github.com/demopet/petcare-suite.git
cd petcare-suite

# Serve locally (using Python)
python -m http.server 8000

# Or using Node.js
npx http-server

# Open in browser
# http://localhost:8000
```

## 🔐 Security Notes

⚠️ **This is a demo only!** Do NOT use in production:
- Credentials are hardcoded for demo purposes
- Data is stored in browser memory (session storage)
- No backend authentication
- No database or encryption
- All functionality is simulated

## 📝 Customization

### Change Branding
- Edit `css/variables.css` for colors and fonts
- Update `assets/icons/logo.svg`
- Modify `index.html` hero section

### Modify Mock Data
- Edit `js/data.js` to add/change appointments, customers, etc.
- Data structures are clearly documented in comments

### Add New Features
1. Create new render function in `js/dashboard.js`
2. Add mock data to `js/data.js` if needed
3. Add menu item to `MENUS` object in `js/data.js`
4. Style in appropriate CSS file

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

Demo for educational purposes.

## 🤝 Contributing

Suggestions for improvements welcome! Feel free to fork and create a pull request.

---

**Last Updated**: June 2024  
**Status**: ✅ Live on GitHub Pages with CI/CD automation
