import { state } from './state.js';

const translations = {
  en: {
    // Navbar
    home: 'Home',
    dashboard: 'Dashboard',
    properties: 'Properties',
    map: 'Map',
    profile: 'Profile',
    market: 'Market',
    logout: 'Logout',
    // General
    back: 'Back',
    cancel: 'Cancel',
    add: 'Add',
    assign: 'Assign',
    submit: 'Submit',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    title: 'Title',
    description: 'Description',
    // Admin Dashboard
    adminDashboard: 'Admin Dashboard',
    systemOverview: 'System Overview & Management',
    totalEmployees: 'Total Employees',
    activeTasks: 'Active Tasks',
    employeeManagement: 'Employee Management',
    recentTasks: 'Recent Tasks',
    recentLeads: 'Recent Client Leads',
    action: 'Action',
    addNewEmployee: 'Add New Employee',
    assignTask: 'Assign Task',
    assignTo: 'Assign To',
    // Leads
    leadsManagement: 'Client Leads Management',
    submittedBy: 'Submitted By',
    instagram: 'Instagram',
    markAsDone: 'Mark as Done',
    leadStatusDone: 'Handled',
    leadStatusPending: 'New',
    // Employee Dashboard
    employeeDashboard: 'Employee Dashboard',
    welcomeBack: 'Welcome back',
    myTasks: 'My Tasks',
    pending: 'Pending',
    inProgress: 'In Progress',
    done: 'Done',
    markDone: 'Mark as Done',
    messagesFromAdmin: 'Messages from Admin',
    submitData: 'Submit Data (To Admin)',
    clientName: 'Client Name',
    clientPhone: 'Client Phone Number',
    clientIG: 'Instagram Link',
    submitToAdmin: 'Submit to Admin',
    noTasks: 'No tasks',
    noMessages: 'No messages yet',
    // Properties
    pricePerMeter: 'Price / m²',
    area: 'Area',
    owner: 'Owner',
    totalPrice: 'Total Price',
    downloadImages: 'Download Images',
    contactOwner: 'Contact Owner',
    propertyDescription: 'Property Description',
    amenities: 'Amenities',
    locationMap: 'Location Map',
    all: 'All',
    apartments: 'Apartments',
    villas: 'Villas',
    offices: 'Offices',
    shops: 'Shops',
    flats: 'Flats',
    parentBuilding: 'Parent Building (Optional)',
    buildingFlats: 'Flats in this Building',
    deadline: 'Deadline',
    workingOnIt: 'Working on it',
    finished: 'Finished',
    sendMessage: 'Send Message',
    seen: 'Seen',
    recipient: 'Recipient',
    messages: 'Messages',
  },
  ar: {
    // Navbar
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    properties: 'العقارات',
    map: 'الخريطة',
    profile: 'الملف الشخصي',
    market: 'السوق',
    logout: 'تسجيل خروج',
    // General
    back: 'رجوع',
    cancel: 'إلغاء',
    add: 'إضافة',
    assign: 'إسناد',
    submit: 'إرسال',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    title: 'العنوان',
    description: 'الوصف',
    // Admin Dashboard
    adminDashboard: 'لوحة تحكم الإدارة',
    systemOverview: 'نظرة عامة وإدارة النظام',
    totalEmployees: 'إجمالي الموظفين',
    activeTasks: 'المهام النشطة',
    employeeManagement: 'إدارة الموظفين',
    recentTasks: 'أحدث المهام',
    recentLeads: 'أحدث بيانات العملاء',
    action: 'إجراء',
    addNewEmployee: 'إضافة موظف جديد',
    assignTask: 'إسناد مهمة',
    assignTo: 'إسناد إلى',
    // Leads
    leadsManagement: 'إدارة بيانات العملاء',
    submittedBy: 'بواسطة',
    instagram: 'انستجرام',
    markAsDone: 'تم',
    leadStatusDone: 'مكتمل',
    leadStatusPending: 'جديد',
    // Employee Dashboard
    employeeDashboard: 'لوحة تحكم الموظف',
    welcomeBack: 'مرحباً بعودتك',
    myTasks: 'مهامي',
    pending: 'قيد الانتظار',
    inProgress: 'قيد التنفيذ',
    done: 'مكتملة',
    markDone: 'تحديد كمكتمل',
    messagesFromAdmin: 'رسائل الإدارة',
    submitData: 'إرسال بيانات للإدارة',
    clientName: 'اسم العميل',
    clientPhone: 'رقم هاتف العميل',
    clientIG: 'رابط الانستجرام',
    submitToAdmin: 'إرسال للإدارة',
    noTasks: 'لا توجد مهام',
    noMessages: 'لا توجد رسائل',
    // Properties
    pricePerMeter: 'السعر / م²',
    area: 'المساحة',
    owner: 'المالك',
    totalPrice: 'السعر الإجمالي',
    downloadImages: 'تحميل الصور',
    contactOwner: 'تواصل مع المالك',
    propertyDescription: 'وصف العقار',
    amenities: 'المميزات',
    locationMap: 'الموقع على الخريطة',
    all: 'الكل',
    apartments: 'شقق سكنية',
    villas: 'فيلات',
    offices: 'مكاتب',
    shops: 'محلات',
    flats: 'شقق',
    parentBuilding: 'المبنى الأصلي (اختياري)',
    buildingFlats: 'شقق المبنى',
    deadline: 'الموعد النهائي',
    workingOnIt: 'شغال عليها',
    finished: 'خلصتها',
    sendMessage: 'إرسال رسالة',
    seen: 'تمت الرؤية',
    recipient: 'المستلم',
    messages: 'الرسائل'
  }
};

export function t(key) {
  const lang = state.get('language') || 'en';
  return translations[lang][key] || key;
}

export function setLanguage(lang) {
  state.set('language', lang);
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
  // Trigger re-render by hash change
  window.dispatchEvent(new Event('hashchange'));
}

export function initLanguage() {
  const lang = state.get('language') || 'en';
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
}
