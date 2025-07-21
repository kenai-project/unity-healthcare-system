// Unity Hospital Healthcare Management System JavaScript

// Application Data
const hospitalData = {
  hospitalInfo: {
    name: "Unity Hospital",
    email: "unityhospital@gmail.com",
    phone: "88666 00555",
    hours: {
      mondaySaturday: "24/7 Available",
      sunday: "4 AM to 11 PM"
    },
    appointmentHours: "8 AM to 10 PM",
    services: [
      "24/7 Ambulance Support",
      "Eminent and Experienced Doctors",
      "Multiple Options For Treatment"
    ]
  },
  departments: [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "Ophthalmology",
    "Dentistry"
  ],
  doctors: [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      experience: "15 years",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Neurology",
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Pediatrics",
      experience: "10 years",
      image: "https://images.unsplash.com/photo-1594824475922-29b8b2a1b5c6?w=300&h=300&fit=crop"
    }
  ],
  testimonials: [
    {
      name: "John Smith",
      text: "Excellent service and very professional staff. The doctors are highly skilled and caring.",
      rating: 5
    },
    {
      name: "Mary Johnson",
      text: "Unity Hospital provided exceptional care during my treatment. Highly recommend!",
      rating: 5
    },
    {
      name: "David Brown",
      text: "Professional, clean, and efficient. The appointment booking system is very convenient.",
      rating: 4
    }
  ],
  timeSlots: [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ]
};

// Application State
let currentUser = null;
let currentPage = 'home';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Initialize localStorage if empty
  initializeLocalStorage();
  
  // Check for existing session
  checkSession();
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Populate dynamic content
  populateContent();
  
  // Show home page
  showPage('home');
  
  // Initialize sample data for demonstration
  setTimeout(initializeSampleData, 100);
}

function initializeLocalStorage() {
  if (!localStorage.getItem('unityHospital_users')) {
    localStorage.setItem('unityHospital_users', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('unityHospital_appointments')) {
    localStorage.setItem('unityHospital_appointments', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('unityHospital_session')) {
    localStorage.setItem('unityHospital_session', JSON.stringify(null));
  }
}

function checkSession() {
  const session = JSON.parse(localStorage.getItem('unityHospital_session'));
  if (session && session.userId) {
    const users = JSON.parse(localStorage.getItem('unityHospital_users'));
    const user = users.find(u => u.id === session.userId);
    if (user) {
      currentUser = user;
      updateAuthUI();
    }
  }
}

function updateAuthUI() {
  const authButtons = document.querySelector('.auth-buttons');
  const userMenu = document.querySelector('.user-menu');
  
  if (currentUser) {
    authButtons.classList.add('hidden');
    userMenu.classList.remove('hidden');
    
    // Update dashboard user info
    const dashboardUserName = document.getElementById('dashboardUserName');
    const dashboardUserRole = document.getElementById('dashboardUserRole');
    
    if (dashboardUserName) {
      dashboardUserName.textContent = `Welcome back, ${currentUser.firstName}!`;
    }
    
    if (dashboardUserRole) {
      dashboardUserRole.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    }
  } else {
    authButtons.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
}

function initializeEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // Auth buttons
  document.getElementById('loginBtn').addEventListener('click', () => showPage('login'));
  document.getElementById('registerBtn').addEventListener('click', () => showPage('register'));
  document.getElementById('appointmentBtn').addEventListener('click', handleAppointmentAccess);
  document.getElementById('dashboardBtn').addEventListener('click', () => showPage('dashboard'));
  document.getElementById('logoutBtn').addEventListener('click', logout);
  
  // Mobile menu buttons
  document.querySelector('.mobile-login-btn').addEventListener('click', () => showPage('login'));
  document.querySelector('.mobile-register-btn').addEventListener('click', () => showPage('register'));
  
  // Hero buttons
  document.getElementById('heroBookBtn').addEventListener('click', handleAppointmentAccess);
  document.getElementById('heroLearnBtn').addEventListener('click', () => scrollToSection('about'));
  
  // Quick action buttons
  document.getElementById('quickBookBtn').addEventListener('click', handleAppointmentAccess);
  document.getElementById('viewAllAppointments').addEventListener('click', () => refreshDashboard());
  
  // Mobile menu toggle
  document.getElementById('mobileMenuToggle').addEventListener('click', toggleMobileMenu);
  
  // Form submissions
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  document.getElementById('appointmentForm').addEventListener('submit', handleAppointment);
  document.getElementById('contactForm').addEventListener('submit', handleContact);
  
  // Auth page switches
  document.getElementById('switchToRegister').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('register');
  });
  document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('login');
  });
  
  // Notification close
  document.getElementById('notificationClose').addEventListener('click', hideNotification);
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
      hideNotification();
    }
  });
}

function handleNavigation(e) {
  e.preventDefault();
  const href = e.target.getAttribute('href');
  
  if (href.startsWith('#')) {
    const section = href.substring(1);
    if (section === 'home') {
      showPage('home');
    } else {
      showPage('home');
      setTimeout(() => scrollToSection(section), 100);
    }
  }
  
  // Close mobile menu
  closeMobileMenu();
}

function handleAppointmentAccess() {
  if (!currentUser) {
    showNotification('Please login to book an appointment', 'info');
    showPage('login');
    return;
  }
  showPage('appointment');
}

function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const targetPage = document.getElementById(pageId + 'Page');
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = pageId;
    
    // Update page-specific content
    if (pageId === 'dashboard') {
      updateDashboard();
    } else if (pageId === 'appointment') {
      updateAppointmentForm();
    }
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = section.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.remove('active');
}

function populateContent() {
  populateDoctors();
  populateTestimonials();
  populateDepartments();
  populateTimeSlots();
}

function populateDoctors() {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return;
  
  doctorsGrid.innerHTML = hospitalData.doctors.map(doctor => `
    <div class="doctor-card">
      <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
      <div class="doctor-info">
        <h3 class="doctor-name">${doctor.name}</h3>
        <p class="doctor-specialty">${doctor.specialization}</p>
        <p class="doctor-experience">${doctor.experience} experience</p>
      </div>
    </div>
  `).join('');
}

function populateTestimonials() {
  const testimonialsGrid = document.getElementById('testimonialsGrid');
  if (!testimonialsGrid) return;
  
  testimonialsGrid.innerHTML = hospitalData.testimonials.map(testimonial => `
    <div class="testimonial-card">
      <div class="testimonial-rating">
        ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
      </div>
      <p class="testimonial-text">"${testimonial.text}"</p>
      <p class="testimonial-author">- ${testimonial.name}</p>
    </div>
  `).join('');
}

function populateDepartments() {
  const departmentSelect = document.getElementById('appointmentDepartment');
  if (!departmentSelect) return;
  
  departmentSelect.innerHTML = '<option value="">Select Department</option>' +
    hospitalData.departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
}

function populateTimeSlots() {
  const timeSelect = document.getElementById('appointmentTime');
  if (!timeSelect) return;
  
  timeSelect.innerHTML = '<option value="">Select Time</option>' +
    hospitalData.timeSlots.map(time => `<option value="${time}">${time}</option>`).join('');
}

function updateAppointmentForm() {
  if (currentUser) {
    document.getElementById('appointmentName').value = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('appointmentEmail').value = currentUser.email;
  }
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('appointmentDate').setAttribute('min', today);
}

// Authentication Functions
function handleLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const staySignedIn = document.getElementById('staySignedIn').checked;
  
  // Clear previous errors
  clearFormErrors(form);
  
  // Validation
  if (!email) {
    showFormError('loginEmail', 'Email is required');
    return;
  }
  
  if (!validateEmail(email)) {
    showFormError('loginEmail', 'Please enter a valid email address');
    return;
  }
  
  if (!password) {
    showFormError('loginPassword', 'Password is required');
    return;
  }
  
  // Show loading state
  submitBtn.textContent = 'Logging in...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem('unityHospital_users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    if (user) {
      currentUser = user;
      
      // Create session
      const session = {
        userId: user.id,
        staySignedIn: staySignedIn,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('unityHospital_session', JSON.stringify(session));
      
      // Clear form
      form.reset();
      
      updateAuthUI();
      showNotification('Login successful! Welcome back.', 'success');
      showPage('dashboard');
    } else {
      showFormError('loginPassword', 'Invalid email or password');
      showNotification('Invalid email or password', 'error');
    }
  }, 800);
}

function handleRegister(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  const firstName = document.getElementById('registerFirstName').value.trim();
  const lastName = document.getElementById('registerLastName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
  const role = document.getElementById('registerRole').value;
  const acceptTerms = document.getElementById('acceptTerms').checked;
  
  // Clear previous errors
  clearFormErrors(form);
  
  // Validation
  let hasErrors = false;
  
  if (!firstName) {
    showFormError('registerFirstName', 'First name is required');
    hasErrors = true;
  }
  
  if (!lastName) {
    showFormError('registerLastName', 'Last name is required');
    hasErrors = true;
  }
  
  if (!email) {
    showFormError('registerEmail', 'Email is required');
    hasErrors = true;
  } else if (!validateEmail(email)) {
    showFormError('registerEmail', 'Please enter a valid email address');
    hasErrors = true;
  }
  
  if (!password) {
    showFormError('registerPassword', 'Password is required');
    hasErrors = true;
  } else if (password.length < 6) {
    showFormError('registerPassword', 'Password must be at least 6 characters long');
    hasErrors = true;
  }
  
  if (!confirmPassword) {
    showFormError('registerConfirmPassword', 'Please confirm your password');
    hasErrors = true;
  } else if (password !== confirmPassword) {
    showFormError('registerConfirmPassword', 'Passwords do not match');
    hasErrors = true;
  }
  
  if (!role) {
    showFormError('registerRole', 'Please select an account type');
    hasErrors = true;
  }
  
  if (!acceptTerms) {
    showFormError('acceptTerms', 'You must accept the terms and conditions');
    hasErrors = true;
  }
  
  if (hasErrors) {
    showNotification('Please fix the errors in the form', 'error');
    return;
  }
  
  // Show loading state
  submitBtn.textContent = 'Creating Account...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem('unityHospital_users'));
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showFormError('registerEmail', 'User with this email already exists');
      showNotification('User with this email already exists', 'error');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password,
      role,
      registrationDate: new Date().toISOString(),
      appointments: []
    };
    
    users.push(newUser);
    localStorage.setItem('unityHospital_users', JSON.stringify(users));
    
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Clear form
    form.reset();
    
    showNotification('Registration successful! Please login with your credentials.', 'success');
    showPage('login');
  }, 1000);
}

function handleAppointment(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  const name = document.getElementById('appointmentName').value.trim();
  const email = document.getElementById('appointmentEmail').value.trim();
  const mobile = document.getElementById('appointmentMobile').value.trim();
  const department = document.getElementById('appointmentDepartment').value;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const purpose = document.getElementById('appointmentPurpose').value.trim();
  const notes = document.getElementById('appointmentNotes').value.trim();
  
  // Clear previous errors
  clearFormErrors(form);
  
  // Validation
  let hasErrors = false;
  
  if (!name) {
    showFormError('appointmentName', 'Name is required');
    hasErrors = true;
  }
  
  if (!email) {
    showFormError('appointmentEmail', 'Email is required');
    hasErrors = true;
  } else if (!validateEmail(email)) {
    showFormError('appointmentEmail', 'Please enter a valid email address');
    hasErrors = true;
  }
  
  if (!mobile) {
    showFormError('appointmentMobile', 'Mobile number is required');
    hasErrors = true;
  } else if (!validatePhone(mobile)) {
    showFormError('appointmentMobile', 'Please enter a valid phone number');
    hasErrors = true;
  }
  
  if (!department) {
    showFormError('appointmentDepartment', 'Please select a department');
    hasErrors = true;
  }
  
  if (!date) {
    showFormError('appointmentDate', 'Please select a date');
    hasErrors = true;
  } else {
    // Check if date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      showFormError('appointmentDate', 'Please select a future date');
      hasErrors = true;
    }
  }
  
  if (!time) {
    showFormError('appointmentTime', 'Please select a time');
    hasErrors = true;
  }
  
  if (hasErrors) {
    showNotification('Please fix the errors in the form', 'error');
    return;
  }
  
  // Show loading state
  submitBtn.textContent = 'Booking Appointment...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    const appointments = JSON.parse(localStorage.getItem('unityHospital_appointments'));
    
    // Check for conflicts
    const conflictingAppointment = appointments.find(apt => 
      apt.date === date && apt.time === time && apt.department === department
    );
    
    if (conflictingAppointment) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showFormError('appointmentTime', 'This time slot is already booked');
      showNotification('This time slot is already booked. Please choose another time.', 'error');
      return;
    }
    
    // Create new appointment
    const newAppointment = {
      id: Date.now().toString(),
      userId: currentUser ? currentUser.id : null,
      name,
      email,
      mobile,
      department,
      date,
      time,
      purpose: purpose || 'General consultation',
      notes,
      status: 'pending',
      bookingDate: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    localStorage.setItem('unityHospital_appointments', JSON.stringify(appointments));
    
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Clear form
    form.reset();
    updateAppointmentForm();
    
    // Show success notification with details
    showNotification(`Appointment booked successfully! Your appointment is scheduled for ${date} at ${time} in ${department} department.`, 'success');
    
    // Update dashboard if user is logged in
    if (currentUser) {
      setTimeout(() => {
        showPage('dashboard');
      }, 2000);
    }
  }, 1000);
}

function handleContact(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  
  // Clear previous errors
  clearFormErrors(form);
  
  // Validation
  let hasErrors = false;
  
  if (!name) {
    showFormError('contactName', 'Name is required');
    hasErrors = true;
  }
  
  if (!email) {
    showFormError('contactEmail', 'Email is required');
    hasErrors = true;
  } else if (!validateEmail(email)) {
    showFormError('contactEmail', 'Please enter a valid email address');
    hasErrors = true;
  }
  
  if (!message) {
    showFormError('contactMessage', 'Message is required');
    hasErrors = true;
  }
  
  if (hasErrors) {
    showNotification('Please fix the errors in the form', 'error');
    return;
  }
  
  // Show loading state
  submitBtn.textContent = 'Sending Message...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Clear form
    form.reset();
    
    showNotification('Message sent successfully! We will get back to you soon.', 'success');
  }, 1000);
}

function logout() {
  currentUser = null;
  localStorage.setItem('unityHospital_session', JSON.stringify(null));
  updateAuthUI();
  showNotification('Logged out successfully', 'success');
  showPage('home');
}

// Dashboard Functions
function updateDashboard() {
  if (!currentUser) {
    showNotification('Please login to access dashboard', 'info');
    showPage('login');
    return;
  }
  
  if (currentUser.role === 'patient') {
    showPatientDashboard();
  } else if (currentUser.role === 'doctor') {
    showDoctorDashboard();
  }
}

function showPatientDashboard() {
  document.getElementById('patientDashboard').classList.remove('hidden');
  document.getElementById('doctorDashboard').classList.add('hidden');
  
  const appointments = JSON.parse(localStorage.getItem('unityHospital_appointments'));
  const userAppointments = appointments.filter(apt => apt.userId === currentUser.id);
  
  // Update stats
  document.getElementById('totalAppointments').textContent = userAppointments.length;
  document.getElementById('upcomingAppointments').textContent = 
    userAppointments.filter(apt => apt.status === 'pending' || apt.status === 'confirmed').length;
  document.getElementById('completedAppointments').textContent = 
    userAppointments.filter(apt => apt.status === 'completed').length;
  
  // Update recent appointments
  const recentAppointments = userAppointments
    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
    .slice(0, 5);
  
  const appointmentsList = document.getElementById('recentAppointments');
  if (recentAppointments.length === 0) {
    appointmentsList.innerHTML = '<p>No appointments found. <a href="#" id="bookFirstAppointment">Book your first appointment</a></p>';
    const bookLink = document.getElementById('bookFirstAppointment');
    if (bookLink) {
      bookLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('appointment');
      });
    }
  } else {
    appointmentsList.innerHTML = recentAppointments.map(apt => `
      <div class="appointment-item">
        <div class="appointment-time">${apt.date} at ${apt.time}</div>
        <div class="appointment-details">${apt.department} - ${apt.purpose}</div>
        <div class="appointment-doctor">Dr. ${getDoctorByDepartment(apt.department)}</div>
        <span class="appointment-status ${apt.status}">${apt.status}</span>
      </div>
    `).join('');
  }
}

function showDoctorDashboard() {
  document.getElementById('patientDashboard').classList.add('hidden');
  document.getElementById('doctorDashboard').classList.remove('hidden');
  
  const appointments = JSON.parse(localStorage.getItem('unityHospital_appointments'));
  const today = new Date().toISOString().split('T')[0];
  
  // Find doctor's specialty
  const doctorSpecialty = hospitalData.doctors.find(doc => 
    doc.name.toLowerCase().includes(currentUser.firstName.toLowerCase()) ||
    doc.name.toLowerCase().includes(currentUser.lastName.toLowerCase())
  )?.specialization || 'General Medicine';
  
  const doctorAppointments = appointments.filter(apt => apt.department === doctorSpecialty);
  const todayAppointments = doctorAppointments.filter(apt => apt.date === today);
  const thisMonth = new Date().toISOString().substring(0, 7);
  const monthlyAppointments = doctorAppointments.filter(apt => apt.date.startsWith(thisMonth));
  
  // Update stats
  document.getElementById('todayAppointments').textContent = todayAppointments.length;
  document.getElementById('totalPatients').textContent = 
    new Set(doctorAppointments.map(apt => apt.userId)).size;
  document.getElementById('monthlyAppointments').textContent = monthlyAppointments.length;
  
  // Update today's schedule
  const scheduleList = document.getElementById('doctorSchedule');
  if (todayAppointments.length === 0) {
    scheduleList.innerHTML = '<p>No appointments scheduled for today.</p>';
  } else {
    scheduleList.innerHTML = todayAppointments
      .sort((a, b) => a.time.localeCompare(b.time))
      .map(apt => `
        <div class="appointment-item">
          <div class="appointment-time">${apt.time}</div>
          <div class="appointment-details">${apt.name} - ${apt.purpose}</div>
          <div class="appointment-doctor">Contact: ${apt.mobile}</div>
          <span class="appointment-status ${apt.status}">${apt.status}</span>
        </div>
      `).join('');
  }
  
  // Update patient records
  const patientRecords = document.getElementById('patientRecords');
  const recentPatients = doctorAppointments
    .filter(apt => apt.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  if (recentPatients.length === 0) {
    patientRecords.innerHTML = '<p>No patient records available.</p>';
  } else {
    patientRecords.innerHTML = recentPatients.map(apt => `
      <div class="appointment-item">
        <div class="appointment-details">${apt.name}</div>
        <div class="appointment-doctor">Last visit: ${apt.date}</div>
        <div class="appointment-time">${apt.purpose}</div>
      </div>
    `).join('');
  }
}

function refreshDashboard() {
  updateDashboard();
  showNotification('Dashboard updated', 'success');
}

// Form Validation Utilities
function clearFormErrors(form) {
  form.querySelectorAll('.form-control').forEach(input => {
    input.classList.remove('error');
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  });
}

function showFormError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }
}

// Utility Functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\+]?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function getDoctorByDepartment(department) {
  const doctor = hospitalData.doctors.find(doc => doc.specialization === department);
  return doctor ? doctor.name.replace('Dr. ', '') : 'Available Doctor';
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notificationToast');
  const icon = notification.querySelector('.notification-icon');
  const messageElement = notification.querySelector('.notification-message');
  
  // Set message
  messageElement.textContent = message;
  
  // Set icon and type
  notification.className = `notification-toast ${type}`;
  
  switch (type) {
    case 'success':
      icon.className = 'notification-icon fas fa-check-circle';
      break;
    case 'error':
      icon.className = 'notification-icon fas fa-exclamation-circle';
      break;
    case 'warning':
      icon.className = 'notification-icon fas fa-exclamation-triangle';
      break;
    case 'info':
      icon.className = 'notification-icon fas fa-info-circle';
      break;
  }
  
  // Show notification
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide after 5 seconds
  setTimeout(() => {
    hideNotification();
  }, 5000);
}

function hideNotification() {
  const notification = document.getElementById('notificationToast');
  notification.classList.remove('show');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 300);
}

// Initialize sample data for demonstration
function initializeSampleData() {
  const users = JSON.parse(localStorage.getItem('unityHospital_users'));
  
  if (users.length === 0) {
    // Add sample users
    const sampleUsers = [
      {
        id: 'demo-patient',
        firstName: 'John',
        lastName: 'Doe',
        email: 'demo@patient.com',
        password: 'password',
        role: 'patient',
        registrationDate: new Date().toISOString()
      },
      {
        id: 'demo-doctor',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'demo@doctor.com',
        password: 'password',
        role: 'doctor',
        registrationDate: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('unityHospital_users', JSON.stringify(sampleUsers));
    
    // Add sample appointments
    const sampleAppointments = [
      {
        id: 'demo-apt-1',
        userId: 'demo-patient',
        name: 'John Doe',
        email: 'demo@patient.com',
        mobile: '1234567890',
        department: 'Cardiology',
        date: '2025-01-25',
        time: '10:00 AM',
        purpose: 'Regular checkup',
        notes: 'Follow-up appointment',
        status: 'confirmed',
        bookingDate: new Date().toISOString()
      },
      {
        id: 'demo-apt-2',
        userId: 'demo-patient',
        name: 'John Doe',
        email: 'demo@patient.com',
        mobile: '1234567890',
        department: 'Neurology',
        date: '2025-01-20',
        time: '2:00 PM',
        purpose: 'Consultation',
        notes: 'First visit',
        status: 'completed',
        bookingDate: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    localStorage.setItem('unityHospital_appointments', JSON.stringify(sampleAppointments));
  }
}