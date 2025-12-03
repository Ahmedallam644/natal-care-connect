// Internationalization utilities for Arabic/English support

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Common
    app_name: 'رعاية الحمل',
    welcome: 'مرحباً',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    full_name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'تم بنجاح',
    
    // Roles
    patient: 'مريضة',
    doctor: 'طبيب',
    admin: 'مدير',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    notifications: 'الإشعارات',
    messages: 'الرسائل',
    
    // Patient Dashboard
    fetal_movement: 'حركة الجنين',
    kick_counter: 'عداد الركلات',
    record_kick: 'تسجيل ركلة',
    kicks_today: 'ركلات اليوم',
    symptoms: 'الأعراض',
    add_symptom: 'إضافة عرض',
    lab_tests: 'التحاليل المخبرية',
    upload_results: 'رفع النتائج',
    nearby_hospitals: 'المستشفيات القريبة',
    emergency_call: 'اتصال طارئ',
    chat_with_doctor: 'محادثة الطبيب',
    link_doctor: 'ربط بالطبيب',
    doctor_code: 'كود الطبيب',
    
    // Symptoms
    headache: 'صداع',
    nausea: 'غثيان',
    fatigue: 'إرهاق',
    swelling: 'تورم',
    bleeding: 'نزيف',
    pain: 'ألم',
    dizziness: 'دوخة',
    
    // Risk Levels
    risk_level: 'مستوى الخطر',
    low_risk: 'منخفض',
    moderate_risk: 'متوسط',
    high_risk: 'مرتفع',
    critical_risk: 'حرج',
    
    // Time
    today: 'اليوم',
    yesterday: 'أمس',
    this_week: 'هذا الأسبوع',
    
    // Pregnancy
    pregnancy_week: 'أسبوع الحمل',
    due_date: 'تاريخ الولادة المتوقع',
    last_period: 'آخر دورة شهرية',
  },
  en: {
    // Common
    app_name: 'Pregnancy Care',
    welcome: 'Welcome',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    full_name: 'Full Name',
    phone: 'Phone',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Roles
    patient: 'Patient',
    doctor: 'Doctor',
    admin: 'Admin',
    
    // Navigation
    dashboard: 'Dashboard',
    settings: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    messages: 'Messages',
    
    // Patient Dashboard
    fetal_movement: 'Fetal Movement',
    kick_counter: 'Kick Counter',
    record_kick: 'Record Kick',
    kicks_today: 'Kicks Today',
    symptoms: 'Symptoms',
    add_symptom: 'Add Symptom',
    lab_tests: 'Lab Tests',
    upload_results: 'Upload Results',
    nearby_hospitals: 'Nearby Hospitals',
    emergency_call: 'Emergency Call',
    chat_with_doctor: 'Chat with Doctor',
    link_doctor: 'Link to Doctor',
    doctor_code: 'Doctor Code',
    
    // Symptoms
    headache: 'Headache',
    nausea: 'Nausea',
    fatigue: 'Fatigue',
    swelling: 'Swelling',
    bleeding: 'Bleeding',
    pain: 'Pain',
    dizziness: 'Dizziness',
    
    // Risk Levels
    risk_level: 'Risk Level',
    low_risk: 'Low',
    moderate_risk: 'Moderate',
    high_risk: 'High',
    critical_risk: 'Critical',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    this_week: 'This Week',
    
    // Pregnancy
    pregnancy_week: 'Pregnancy Week',
    due_date: 'Due Date',
    last_period: 'Last Menstrual Period',
  }
};

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || key;
}

export function t(lang: Language) {
  return (key: TranslationKey) => getTranslation(lang, key);
}
