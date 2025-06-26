// Multilingual support for partnership applications
// Supporting English, French, Arabic, and Swahili for pan-African coverage

export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'sw';

export interface PartnershipTranslations {
  // Header and Navigation
  title: string;
  subtitle: string;
  backButton: string;
  
  // Tab Navigation
  overview: string;
  apply: string;
  developer: string;
  resources: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  startApplication: string;
  activeUsers: string;
  countries: string;
  annualVolume: string;
  
  // Partnership Types
  partnershipOpportunities: string;
  benefits: string;
  requirements: string;
  
  // Partnership Categories
  fintechIntegration: string;
  fintechDescription: string;
  ecommercePlatform: string;
  ecommerceDescription: string;
  merchantServices: string;
  merchantDescription: string;
  mobileAppDeveloper: string;
  mobileDescription: string;
  logisticsDelivery: string;
  logisticsDescription: string;
  enterpriseSolutions: string;
  enterpriseDescription: string;
  
  // Application Form
  partnershipApplication: string;
  applicationSubtitle: string;
  companyInformation: string;
  companyName: string;
  contactName: string;
  emailAddress: string;
  phoneNumber: string;
  website: string;
  businessDetails: string;
  businessType: string;
  partnershipType: string;
  businessDescription: string;
  businessDescriptionPlaceholder: string;
  integrationRequirements: string;
  expectedVolume: string;
  timeline: string;
  integrationNeeds: string;
  integrationNeedsPlaceholder: string;
  submitApplication: string;
  submitting: string;
  
  // Form Options
  startup: string;
  smallMediumBusiness: string;
  enterprise: string;
  fintechCompany: string;
  ecommercePlatformOption: string;
  marketplace: string;
  other: string;
  
  // Volume Options
  under10k: string;
  from10kTo100k: string;
  from100kTo1m: string;
  from1mTo10m: string;
  over10m: string;
  
  // Timeline Options
  immediate: string;
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
  
  // Developer Portal
  developerQuickStart: string;
  getStartedMinutes: string;
  step1Title: string;
  step1Description: string;
  createAccount: string;
  step2Title: string;
  step3Title: string;
  step3Description: string;
  accessSandbox: string;
  
  // API Features
  apiFeatures: string;
  paymentsApi: string;
  paymentsApiDesc: string;
  userManagement: string;
  userManagementDesc: string;
  kycCompliance: string;
  kycComplianceDesc: string;
  analytics: string;
  analyticsDesc: string;
  mobileSdk: string;
  mobileSdkDesc: string;
  webhooks: string;
  webhooksDesc: string;
  
  // Resources
  developmentResources: string;
  developerSupport: string;
  technicalSupport: string;
  technicalSupportDesc: string;
  developerCommunity: string;
  developerCommunityDesc: string;
  joinDeveloperProgram: string;
  
  // Success Stories
  partnerSuccessStories: string;
  
  // Common
  learnMore: string;
  comingSoon: string;
  required: string;
  
  // Toast Messages
  applicationSubmitted: string;
  applicationSubmittedDesc: string;
  submissionFailed: string;
  missingInformation: string;
  fillRequiredFields: string;
  
  // Language Selector
  selectLanguage: string;
  english: string;
  french: string;
  arabic: string;
  swahili: string;
}

export const partnershipTranslations: Record<SupportedLanguage, PartnershipTranslations> = {
  en: {
    // Header and Navigation
    title: "Partner with AfriPay",
    subtitle: "Join Africa's leading fintech ecosystem and scale your business across the continent",
    backButton: "Back",
    
    // Tab Navigation
    overview: "Overview",
    apply: "Apply",
    developer: "Developer",
    resources: "Resources",
    
    // Hero Section
    heroTitle: "Partner with AfriPay",
    heroSubtitle: "Scale your business across Africa",
    startApplication: "Start Partnership Application",
    activeUsers: "Active Users",
    countries: "Countries",
    annualVolume: "Annual Volume",
    
    // Partnership Types
    partnershipOpportunities: "Partnership Opportunities",
    benefits: "Benefits",
    requirements: "Requirements",
    
    // Partnership Categories
    fintechIntegration: "Fintech Integration",
    fintechDescription: "Payment processing, lending, investment services",
    ecommercePlatform: "E-commerce Platform",
    ecommerceDescription: "Online marketplaces, retail integration",
    merchantServices: "Merchant Services",
    merchantDescription: "Point-of-sale, retail solutions",
    mobileAppDeveloper: "Mobile App Developer",
    mobileDescription: "In-app payments, subscription billing",
    logisticsDelivery: "Logistics & Delivery",
    logisticsDescription: "Shipping, last-mile delivery services",
    enterpriseSolutions: "Enterprise Solutions",
    enterpriseDescription: "B2B payments, payroll, expense management",
    
    // Application Form
    partnershipApplication: "Partnership Application",
    applicationSubtitle: "Tell us about your business and integration needs",
    companyInformation: "Company Information",
    companyName: "Company Name",
    contactName: "Contact Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    website: "Website URL",
    businessDetails: "Business Details",
    businessType: "Business Type",
    partnershipType: "Partnership Type",
    businessDescription: "Business Description",
    businessDescriptionPlaceholder: "Describe your business and how you plan to integrate with AfriPay...",
    integrationRequirements: "Integration Requirements",
    expectedVolume: "Expected Monthly Volume",
    timeline: "Integration Timeline",
    integrationNeeds: "Integration Needs",
    integrationNeedsPlaceholder: "Describe your specific integration requirements, APIs needed, technical constraints...",
    submitApplication: "Submit Application",
    submitting: "Submitting...",
    
    // Form Options
    startup: "Startup",
    smallMediumBusiness: "Small/Medium Business",
    enterprise: "Enterprise",
    fintechCompany: "Fintech Company",
    ecommercePlatformOption: "E-commerce Platform",
    marketplace: "Marketplace",
    other: "Other",
    
    // Volume Options
    under10k: "Under $10K",
    from10kTo100k: "$10K - $100K",
    from100kTo1m: "$100K - $1M",
    from1mTo10m: "$1M - $10M",
    over10m: "Over $10M",
    
    // Timeline Options
    immediate: "Immediate (1-2 weeks)",
    shortTerm: "Short term (1-2 months)",
    mediumTerm: "Medium term (3-6 months)",
    longTerm: "Long term (6+ months)",
    
    // Developer Portal
    developerQuickStart: "Developer Quick Start",
    getStartedMinutes: "Get started with AfriPay APIs in minutes",
    step1Title: "Get API Keys",
    step1Description: "Sign up for a developer account to receive your API credentials",
    createAccount: "Create Developer Account",
    step2Title: "Make Your First API Call",
    step3Title: "Test in Sandbox",
    step3Description: "Use our sandbox environment to test your integration",
    accessSandbox: "Access Sandbox",
    
    // API Features
    apiFeatures: "API Features",
    paymentsApi: "Payments API",
    paymentsApiDesc: "Process payments, refunds, and transfers",
    userManagement: "User Management",
    userManagementDesc: "Create and manage user accounts",
    kycCompliance: "KYC & Compliance",
    kycComplianceDesc: "Identity verification and compliance checks",
    analytics: "Analytics",
    analyticsDesc: "Transaction reporting and analytics",
    mobileSdk: "Mobile SDK",
    mobileSdkDesc: "Native mobile app integration",
    webhooks: "Webhooks",
    webhooksDesc: "Real-time event notifications",
    
    // Resources
    developmentResources: "Development Resources",
    developerSupport: "Developer Support",
    technicalSupport: "Technical Support",
    technicalSupportDesc: "24/7 developer assistance",
    developerCommunity: "Developer Community",
    developerCommunityDesc: "Connect with other developers",
    joinDeveloperProgram: "Join Developer Program",
    
    // Success Stories
    partnerSuccessStories: "Partner Success Stories",
    
    // Common
    learnMore: "Learn More",
    comingSoon: "Coming Soon",
    required: "Required",
    
    // Toast Messages
    applicationSubmitted: "Application submitted!",
    applicationSubmittedDesc: "We'll review your partnership application and get back to you within 3-5 business days.",
    submissionFailed: "Submission failed",
    missingInformation: "Missing information",
    fillRequiredFields: "Please fill in all required fields",
    
    // Language Selector
    selectLanguage: "Select Language",
    english: "English",
    french: "Français",
    arabic: "العربية",
    swahili: "Kiswahili"
  },
  
  fr: {
    // Header and Navigation
    title: "Partenaire avec AfriPay",
    subtitle: "Rejoignez l'écosystème fintech leader en Afrique et développez votre entreprise sur le continent",
    backButton: "Retour",
    
    // Tab Navigation
    overview: "Aperçu",
    apply: "Postuler",
    developer: "Développeur",
    resources: "Ressources",
    
    // Hero Section
    heroTitle: "Partenaire avec AfriPay",
    heroSubtitle: "Développez votre entreprise à travers l'Afrique",
    startApplication: "Commencer la Demande de Partenariat",
    activeUsers: "Utilisateurs Actifs",
    countries: "Pays",
    annualVolume: "Volume Annuel",
    
    // Partnership Types
    partnershipOpportunities: "Opportunités de Partenariat",
    benefits: "Avantages",
    requirements: "Exigences",
    
    // Partnership Categories
    fintechIntegration: "Intégration Fintech",
    fintechDescription: "Traitement des paiements, prêts, services d'investissement",
    ecommercePlatform: "Plateforme E-commerce",
    ecommerceDescription: "Marchés en ligne, intégration retail",
    merchantServices: "Services Marchands",
    merchantDescription: "Point de vente, solutions retail",
    mobileAppDeveloper: "Développeur d'Applications Mobiles",
    mobileDescription: "Paiements in-app, facturation d'abonnements",
    logisticsDelivery: "Logistique et Livraison",
    logisticsDescription: "Expédition, services de livraison du dernier kilomètre",
    enterpriseSolutions: "Solutions Entreprise",
    enterpriseDescription: "Paiements B2B, paie, gestion des dépenses",
    
    // Application Form
    partnershipApplication: "Demande de Partenariat",
    applicationSubtitle: "Parlez-nous de votre entreprise et de vos besoins d'intégration",
    companyInformation: "Informations sur l'Entreprise",
    companyName: "Nom de l'Entreprise",
    contactName: "Nom du Contact",
    emailAddress: "Adresse Email",
    phoneNumber: "Numéro de Téléphone",
    website: "URL du Site Web",
    businessDetails: "Détails de l'Entreprise",
    businessType: "Type d'Entreprise",
    partnershipType: "Type de Partenariat",
    businessDescription: "Description de l'Entreprise",
    businessDescriptionPlaceholder: "Décrivez votre entreprise et comment vous prévoyez d'intégrer avec AfriPay...",
    integrationRequirements: "Exigences d'Intégration",
    expectedVolume: "Volume Mensuel Attendu",
    timeline: "Calendrier d'Intégration",
    integrationNeeds: "Besoins d'Intégration",
    integrationNeedsPlaceholder: "Décrivez vos exigences d'intégration spécifiques, APIs nécessaires, contraintes techniques...",
    submitApplication: "Soumettre la Demande",
    submitting: "Soumission...",
    
    // Form Options
    startup: "Startup",
    smallMediumBusiness: "Petite/Moyenne Entreprise",
    enterprise: "Entreprise",
    fintechCompany: "Entreprise Fintech",
    ecommercePlatformOption: "Plateforme E-commerce",
    marketplace: "Marché",
    other: "Autre",
    
    // Volume Options
    under10k: "Moins de 10K$",
    from10kTo100k: "10K$ - 100K$",
    from100kTo1m: "100K$ - 1M$",
    from1mTo10m: "1M$ - 10M$",
    over10m: "Plus de 10M$",
    
    // Timeline Options
    immediate: "Immédiat (1-2 semaines)",
    shortTerm: "Court terme (1-2 mois)",
    mediumTerm: "Moyen terme (3-6 mois)",
    longTerm: "Long terme (6+ mois)",
    
    // Developer Portal
    developerQuickStart: "Démarrage Rapide Développeur",
    getStartedMinutes: "Commencez avec les APIs AfriPay en quelques minutes",
    step1Title: "Obtenir les Clés API",
    step1Description: "Inscrivez-vous pour un compte développeur pour recevoir vos identifiants API",
    createAccount: "Créer un Compte Développeur",
    step2Title: "Faire Votre Premier Appel API",
    step3Title: "Tester dans le Sandbox",
    step3Description: "Utilisez notre environnement sandbox pour tester votre intégration",
    accessSandbox: "Accéder au Sandbox",
    
    // API Features
    apiFeatures: "Fonctionnalités API",
    paymentsApi: "API Paiements",
    paymentsApiDesc: "Traiter les paiements, remboursements et transferts",
    userManagement: "Gestion des Utilisateurs",
    userManagementDesc: "Créer et gérer les comptes utilisateurs",
    kycCompliance: "KYC et Conformité",
    kycComplianceDesc: "Vérification d'identité et contrôles de conformité",
    analytics: "Analytics",
    analyticsDesc: "Rapports de transactions et analytics",
    mobileSdk: "SDK Mobile",
    mobileSdkDesc: "Intégration d'applications mobiles natives",
    webhooks: "Webhooks",
    webhooksDesc: "Notifications d'événements en temps réel",
    
    // Resources
    developmentResources: "Ressources de Développement",
    developerSupport: "Support Développeur",
    technicalSupport: "Support Technique",
    technicalSupportDesc: "Assistance développeur 24/7",
    developerCommunity: "Communauté Développeur",
    developerCommunityDesc: "Connectez-vous avec d'autres développeurs",
    joinDeveloperProgram: "Rejoindre le Programme Développeur",
    
    // Success Stories
    partnerSuccessStories: "Histoires de Succès des Partenaires",
    
    // Common
    learnMore: "En Savoir Plus",
    comingSoon: "Bientôt Disponible",
    required: "Requis",
    
    // Toast Messages
    applicationSubmitted: "Demande soumise!",
    applicationSubmittedDesc: "Nous examinerons votre demande de partenariat et vous répondrons dans 3-5 jours ouvrables.",
    submissionFailed: "Échec de la soumission",
    missingInformation: "Informations manquantes",
    fillRequiredFields: "Veuillez remplir tous les champs requis",
    
    // Language Selector
    selectLanguage: "Sélectionner la Langue",
    english: "English",
    french: "Français",
    arabic: "العربية",
    swahili: "Kiswahili"
  },
  
  ar: {
    // Header and Navigation
    title: "شراكة مع أفريباي",
    subtitle: "انضم إلى النظام البيئي المالي الرائد في أفريقيا وقم بتوسيع أعمالك عبر القارة",
    backButton: "العودة",
    
    // Tab Navigation
    overview: "نظرة عامة",
    apply: "تقديم طلب",
    developer: "المطور",
    resources: "الموارد",
    
    // Hero Section
    heroTitle: "شراكة مع أفريباي",
    heroSubtitle: "قم بتوسيع أعمالك عبر أفريقيا",
    startApplication: "بدء طلب الشراكة",
    activeUsers: "المستخدمون النشطون",
    countries: "الدول",
    annualVolume: "الحجم السنوي",
    
    // Partnership Types
    partnershipOpportunities: "فرص الشراكة",
    benefits: "الفوائد",
    requirements: "المتطلبات",
    
    // Partnership Categories
    fintechIntegration: "تكامل التكنولوجيا المالية",
    fintechDescription: "معالجة المدفوعات، الإقراض، خدمات الاستثمار",
    ecommercePlatform: "منصة التجارة الإلكترونية",
    ecommerceDescription: "الأسواق الإلكترونية، تكامل البيع بالتجزئة",
    merchantServices: "خدمات التجار",
    merchantDescription: "نقطة البيع، حلول البيع بالتجزئة",
    mobileAppDeveloper: "مطور التطبيقات المحمولة",
    mobileDescription: "المدفوعات داخل التطبيق، فوترة الاشتراكات",
    logisticsDelivery: "اللوجستيات والتوصيل",
    logisticsDescription: "الشحن، خدمات التوصيل للميل الأخير",
    enterpriseSolutions: "حلول المؤسسات",
    enterpriseDescription: "مدفوعات B2B، كشوف المرتبات، إدارة المصروفات",
    
    // Application Form
    partnershipApplication: "طلب الشراكة",
    applicationSubtitle: "أخبرنا عن عملك واحتياجات التكامل",
    companyInformation: "معلومات الشركة",
    companyName: "اسم الشركة",
    contactName: "اسم جهة الاتصال",
    emailAddress: "عنوان البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    website: "رابط الموقع الإلكتروني",
    businessDetails: "تفاصيل العمل",
    businessType: "نوع العمل",
    partnershipType: "نوع الشراكة",
    businessDescription: "وصف العمل",
    businessDescriptionPlaceholder: "صف عملك وكيف تخطط للتكامل مع أفريباي...",
    integrationRequirements: "متطلبات التكامل",
    expectedVolume: "الحجم الشهري المتوقع",
    timeline: "الجدول الزمني للتكامل",
    integrationNeeds: "احتياجات التكامل",
    integrationNeedsPlaceholder: "صف متطلبات التكامل المحددة، واجهات برمجة التطبيقات المطلوبة، القيود التقنية...",
    submitApplication: "تقديم الطلب",
    submitting: "جاري التقديم...",
    
    // Form Options
    startup: "شركة ناشئة",
    smallMediumBusiness: "شركة صغيرة/متوسطة",
    enterprise: "مؤسسة",
    fintechCompany: "شركة تكنولوجيا مالية",
    ecommercePlatformOption: "منصة تجارة إلكترونية",
    marketplace: "سوق",
    other: "أخرى",
    
    // Volume Options
    under10k: "أقل من 10 آلاف دولار",
    from10kTo100k: "10 آلاف - 100 ألف دولار",
    from100kTo1m: "100 ألف - مليون دولار",
    from1mTo10m: "مليون - 10 مليون دولار",
    over10m: "أكثر من 10 مليون دولار",
    
    // Timeline Options
    immediate: "فوري (1-2 أسبوع)",
    shortTerm: "قصير المدى (1-2 شهر)",
    mediumTerm: "متوسط المدى (3-6 أشهر)",
    longTerm: "طويل المدى (6+ أشهر)",
    
    // Developer Portal
    developerQuickStart: "البداية السريعة للمطور",
    getStartedMinutes: "ابدأ مع واجهات برمجة التطبيقات أفريباي في دقائق",
    step1Title: "احصل على مفاتيح API",
    step1Description: "سجل للحصول على حساب مطور لتلقي بيانات اعتماد API",
    createAccount: "إنشاء حساب مطور",
    step2Title: "اجعل أول استدعاء API",
    step3Title: "اختبر في Sandbox",
    step3Description: "استخدم بيئة sandbox لاختبار التكامل",
    accessSandbox: "الوصول إلى Sandbox",
    
    // API Features
    apiFeatures: "ميزات API",
    paymentsApi: "API المدفوعات",
    paymentsApiDesc: "معالجة المدفوعات والاسترداد والتحويلات",
    userManagement: "إدارة المستخدمين",
    userManagementDesc: "إنشاء وإدارة حسابات المستخدمين",
    kycCompliance: "KYC والامتثال",
    kycComplianceDesc: "التحقق من الهوية وفحوصات الامتثال",
    analytics: "التحليلات",
    analyticsDesc: "تقارير المعاملات والتحليلات",
    mobileSdk: "SDK المحمول",
    mobileSdkDesc: "تكامل التطبيق المحمول الأصلي",
    webhooks: "Webhooks",
    webhooksDesc: "إشعارات الأحداث في الوقت الفعلي",
    
    // Resources
    developmentResources: "موارد التطوير",
    developerSupport: "دعم المطورين",
    technicalSupport: "الدعم التقني",
    technicalSupportDesc: "مساعدة المطورين 24/7",
    developerCommunity: "مجتمع المطورين",
    developerCommunityDesc: "تواصل مع مطورين آخرين",
    joinDeveloperProgram: "انضم لبرنامج المطورين",
    
    // Success Stories
    partnerSuccessStories: "قصص نجاح الشركاء",
    
    // Common
    learnMore: "اعرف المزيد",
    comingSoon: "قريباً",
    required: "مطلوب",
    
    // Toast Messages
    applicationSubmitted: "تم تقديم الطلب!",
    applicationSubmittedDesc: "سنراجع طلب الشراكة ونعود إليك خلال 3-5 أيام عمل.",
    submissionFailed: "فشل في التقديم",
    missingInformation: "معلومات مفقودة",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
    
    // Language Selector
    selectLanguage: "اختر اللغة",
    english: "English",
    french: "Français",
    arabic: "العربية",
    swahili: "Kiswahili"
  },
  
  sw: {
    // Header and Navigation
    title: "Ushirikiano na AfriPay",
    subtitle: "Jiunge na mfumo mkuu wa teknolojia ya kifedha Afrika na kuongeza biashara yako barani",
    backButton: "Rudi",
    
    // Tab Navigation
    overview: "Muhtasari",
    apply: "Omba",
    developer: "Msanidi",
    resources: "Rasilimali",
    
    // Hero Section
    heroTitle: "Ushirikiano na AfriPay",
    heroSubtitle: "Ongeza biashara yako katika Afrika",
    startApplication: "Anza Ombi la Ushirikiano",
    activeUsers: "Watumiaji Hai",
    countries: "Nchi",
    annualVolume: "Kiasi cha Kila Mwaka",
    
    // Partnership Types
    partnershipOpportunities: "Fursa za Ushirikiano",
    benefits: "Faida",
    requirements: "Mahitaji",
    
    // Partnership Categories
    fintechIntegration: "Uunganishaji wa Fintech",
    fintechDescription: "Usindikaji wa malipo, ukopaji, huduma za uwekezaji",
    ecommercePlatform: "Jukwaa la Biashara ya Kielektroniki",
    ecommerceDescription: "Masoko ya mtandaoni, uunganishaji wa rejareja",
    merchantServices: "Huduma za Wafanyabiashara",
    merchantDescription: "Mahali pa mauzo, suluhisho za rejareja",
    mobileAppDeveloper: "Msanidi wa Programu za Simu",
    mobileDescription: "Malipo ndani ya programu, bili za uandikishaji",
    logisticsDelivery: "Usafirishaji na Uwasilishaji",
    logisticsDescription: "Usafirishaji, huduma za uwasilishaji wa mwisho",
    enterpriseSolutions: "Suluhisho za Makampuni",
    enterpriseDescription: "Malipo ya B2B, mishahara, usimamizi wa gharama",
    
    // Application Form
    partnershipApplication: "Ombi la Ushirikiano",
    applicationSubtitle: "Tuambie kuhusu biashara yako na mahitaji ya uunganishaji",
    companyInformation: "Taarifa za Kampuni",
    companyName: "Jina la Kampuni",
    contactName: "Jina la Anayewasiliana",
    emailAddress: "Anwani ya Barua Pepe",
    phoneNumber: "Nambari ya Simu",
    website: "URL ya Tovuti",
    businessDetails: "Maelezo ya Biashara",
    businessType: "Aina ya Biashara",
    partnershipType: "Aina ya Ushirikiano",
    businessDescription: "Maelezo ya Biashara",
    businessDescriptionPlaceholder: "Eleza biashara yako na jinsi unavyopanga kuunganisha na AfriPay...",
    integrationRequirements: "Mahitaji ya Uunganishaji",
    expectedVolume: "Kiasi Kinachotarajiwa kila Mwezi",
    timeline: "Ratiba ya Uunganishaji",
    integrationNeeds: "Mahitaji ya Uunganishaji",
    integrationNeedsPlaceholder: "Eleza mahitaji yako maalum ya uunganishaji, API zinazohitajika, vikwazo vya kiteknolojia...",
    submitApplication: "Wasilisha Ombi",
    submitting: "Inawasilisha...",
    
    // Form Options
    startup: "Kampuni Mpya",
    smallMediumBusiness: "Biashara Ndogo/Ya Kati",
    enterprise: "Shirika",
    fintechCompany: "Kampuni ya Fintech",
    ecommercePlatformOption: "Jukwaa la Biashara ya Kielektroniki",
    marketplace: "Soko",
    other: "Nyingine",
    
    // Volume Options
    under10k: "Chini ya $10K",
    from10kTo100k: "$10K - $100K",
    from100kTo1m: "$100K - $1M",
    from1mTo10m: "$1M - $10M",
    over10m: "Zaidi ya $10M",
    
    // Timeline Options
    immediate: "Mara moja (wiki 1-2)",
    shortTerm: "Muda mfupi (miezi 1-2)",
    mediumTerm: "Muda wa kati (miezi 3-6)",
    longTerm: "Muda mrefu (miezi 6+)",
    
    // Developer Portal
    developerQuickStart: "Mwanzo wa Haraka wa Msanidi",
    getStartedMinutes: "Anza na API za AfriPay kwa dakika",
    step1Title: "Pata Ufunguo wa API",
    step1Description: "Jisajili kwa akaunti ya msanidi kupokea taarifa za uthibitishaji wa API",
    createAccount: "Unda Akaunti ya Msanidi",
    step2Title: "Fanya Mwito Wako wa Kwanza wa API",
    step3Title: "Jaribu katika Sandbox",
    step3Description: "Tumia mazingira yetu ya sandbox kujaribu uunganishaji",
    accessSandbox: "Fikia Sandbox",
    
    // API Features
    apiFeatures: "Vipengele vya API",
    paymentsApi: "API ya Malipo",
    paymentsApiDesc: "Sindika malipo, marejesho, na uhamishaji",
    userManagement: "Usimamizi wa Watumiaji",
    userManagementDesc: "Unda na simamia akaunti za watumiaji",
    kycCompliance: "KYC na Ufuatiliaji",
    kycComplianceDesc: "Uthibitishaji wa utambulisho na ukaguzi wa ufuatiliaji",
    analytics: "Uchambuzi",
    analyticsDesc: "Ripoti za miamala na uchambuzi",
    mobileSdk: "SDK ya Simu",
    mobileSdkDesc: "Uunganishaji wa programu ya simu ya asili",
    webhooks: "Webhooks",
    webhooksDesc: "Arifa za matukio ya wakati halisi",
    
    // Resources
    developmentResources: "Rasilimali za Maendeleo",
    developerSupport: "Msaada wa Msanidi",
    technicalSupport: "Msaada wa Kiteknolojia",
    technicalSupportDesc: "Msaada wa msanidi siku 24",
    developerCommunity: "Jamii ya Wasanidi",
    developerCommunityDesc: "Unganisha na wasanidi wengine",
    joinDeveloperProgram: "Jiunge na Mpango wa Msanidi",
    
    // Success Stories
    partnerSuccessStories: "Hadithi za Mafanikio ya Washirika",
    
    // Common
    learnMore: "Jifunze Zaidi",
    comingSoon: "Inakuja Hivi Karibuni",
    required: "Inahitajika",
    
    // Toast Messages
    applicationSubmitted: "Ombi limewasilishwa!",
    applicationSubmittedDesc: "Tutakagua ombi lako la ushirikiano na kurudisha jibu ndani ya siku 3-5 za kazi.",
    submissionFailed: "Uwasilishaji umeshindwa",
    missingInformation: "Taarifa zinazokosekana",
    fillRequiredFields: "Tafadhali jaza sehemu zote zinazohitajika",
    
    // Language Selector
    selectLanguage: "Chagua Lugha",
    english: "English",
    french: "Français",
    arabic: "العربية",
    swahili: "Kiswahili"
  }
};

// Language detection and management
export class PartnershipI18n {
  private currentLanguage: SupportedLanguage = 'en';
  
  constructor() {
    this.detectLanguage();
  }
  
  private detectLanguage(): void {
    // Try to detect language from browser
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (this.isValidLanguage(browserLang)) {
      this.currentLanguage = browserLang;
    }
    
    // Try to get from localStorage
    const savedLang = localStorage.getItem('afripay-partnership-language') as SupportedLanguage;
    if (savedLang && this.isValidLanguage(savedLang)) {
      this.currentLanguage = savedLang;
    }
  }
  
  private isValidLanguage(lang: string): lang is SupportedLanguage {
    return ['en', 'fr', 'ar', 'sw'].includes(lang);
  }
  
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    localStorage.setItem('afripay-partnership-language', language);
    
    // Update document direction for RTL languages
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }
  
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }
  
  getTranslations(): PartnershipTranslations {
    return partnershipTranslations[this.currentLanguage];
  }
  
  t(key: keyof PartnershipTranslations): string {
    return partnershipTranslations[this.currentLanguage][key];
  }
  
  isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }
  
  getSupportedLanguages(): Array<{code: SupportedLanguage, name: string, nativeName: string}> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' }
    ];
  }
}