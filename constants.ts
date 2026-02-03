
import { Package, Lead } from './types';

export const SITE_CONFIG = {
  name: 'Meta Travels',
  tagline: 'inspiring dreams',
  contact: {
    phone: '+52 99 9743 7686',
    email: 'info@grupocaptura.com',
    address: 'Av. Reforma 222, Torre Mayor, CDMX',
    whatsapp: '529997437686'
  },
  socials: {
    instagram: '#',
    facebook: '#',
    twitter: '#'
  }
};

export const TRANSLATIONS = {
  es: {
    nav: {
      destinations: 'Colección',
      customTrip: 'Viaje a Medida',
      weather: 'Clima',
      about: 'Nosotros',
      contact: 'Contacto',
      quote: 'Cotiza tu Viaje'
    },
    hero: {
      titlePart1: "El arte de viajar",
      titlePart2: "sin límites",
      defining: "Definiendo el futuro del viaje de lujo",
      subtitle: "Diseñamos travesías exclusivas donde el único límite es tu imaginación.",
      ctaPrimary: "Diseñar mi Viaje",
      ctaSecondary: "Ver Colección",
      scroll: "Deslizar"
    },
    home: {
      exclusiveCollection: "Colección Exclusiva",
      featuredPackages: "Experiencias Curadas",
      customTripTitle: "¿No encuentras lo que buscas?",
      customTripDesc: "Nuestros expertos diseñan el itinerario perfecto para ti.",
      customTripBtn: "Diseñar a Medida",
      philosophy: {
        tag: "Nuestra Filosofía",
        titlePart1: "Más Allá del",
        titlePart2: "Horizonte Común",
        quote: "Nuestra tecnología no reemplaza el alma del viaje; la libera de lo mundano para que solo quede la maravilla.",
        author: "Meta Founders"
      },
      stats: {
        destinations: "Destinos Exclusivos",
        concierge: "Concierge Elite IA",
        privacy: "Privacidad Garantizada",
        designers: "Elite Travel Designers"
      },
      features: {
        security: { title: "Seguridad y Confianza", desc: "Trabajamos solo con proveedores verificados y ofrecemos asistencia 24/7." },
        premium: { title: "Experiencias Premium", desc: "Acceso a lugares exclusivos, guías privados y los mejores hoteles." },
        passion: { title: "Pasión por el Detalle", desc: "Cada itinerario se cura artesanalmente para superar tus expectativas." }
      },
      viewAll: "Ver Todo",
      investment: "Inversión desde",
      testimonialsTitle: "Voces de nuestros viajeros",
      newsletterTitle: "Inspírate para tu próxima aventura",
      newsletterDesc: "Recibe guías exclusivas y ofertas secretas.",
      newsletterPlaceholder: "Tu correo electrónico",
      newsletterBtn: "Suscribir"
    },
    weather: {
      title: 'Clima y Planificación',
      subtitle: 'Consulta el clima estimado para planear mejor tu equipaje y actividades.',
      destination: 'Destino del viaje',
      placeholder: 'Ej. Madrid, España / Mazunte, México',
      startDate: 'Salida',
      endDate: 'Regreso',
      btnSearch: 'Consultar Estimación',
      btnLoading: 'Calculando tendencias...',
      errorDates: 'Por favor, selecciona las fechas de tu travesía.',
      errorRange: 'Las estimaciones precisas están disponibles para los próximos 14 días.',
      errorLoc: 'Por favor, selecciona una ubicación de nuestra base de datos.',
      errorApi: 'No pudimos obtener datos para este destino. Intenta con otras fechas.',
      errorNotFound: 'Ubicación no reconocida. Intenta: Ciudad, País (Ej. Paris, Francia).',
      copy: 'Copiar Resumen',
      copied: 'Resumen listo para tu itinerario',
      max: 'Máxima prevista',
      min: 'Mínima prevista',
      water: 'Temperatura del agua',
      rain: 'Probabilidad de lluvia',
      wind: 'Viento',
      humidity: 'Humedad',
      sunrise: 'Amanecer',
      sunset: 'Atardecer',
      tipTitle: 'Sugerencia de Viaje',
      intel: 'Traveler Intel',
      projection: 'Tendencia de Temporada',
      summary: {
        title: 'Recomendación del Asesor',
        favorable: 'Condiciones muy propicias para tu travesía.',
        variable: 'Clima cambiante: sugerimos considerar flexibilidad en el itinerario.',
        unfavorable: 'Condiciones que podrían motivar ajustes en tus actividades.',
        sunnyDays: 'Predominio de días despejados y sol radiante.',
        rainyDays: 'Se prevén precipitaciones frecuentes durante la estancia.',
        mixedDays: 'Alternancia de nubes y claros a lo largo de la semana.',
        heatWarning: 'Nota: Se esperan picos de calor intenso. Manténgase hidratado.',
        windWarning: 'Nota: Brisa fuerte detectada. Considere este dato para tours marítimos.'
      },
      disclaimer: 'La información mostrada es una referencia basada en modelos climáticos para facilitar tu planificación. Los datos del mar se obtienen de las estaciones costeras certificadas más cercanas.',
      conditions: {
        Sunny: 'Soleado',
        PartlyCloudy: 'Parcialmente Nublado',
        Cloudy: 'Nublado',
        Rainy: 'Lluvia',
        Drizzle: 'Llovizna',
        Storm: 'Tormenta',
        Windy: 'Ventoso',
        Snowy: 'Nieve'
      },
      tips: {
        rain: 'Sugerimos incluir un impermeable ligero o paraguas compacto en tu equipaje.',
        hot: 'Días ideales para el sol. Recomendamos protector solar y prendas frescas de lino o algodón.',
        cold: 'Clima fresco. Te recomendamos empacar capas ligeras y un abrigo de calidad para las noches.',
        wind: 'Brisa constante. Un cortavientos ligero será tu mejor aliado durante los traslados.',
        nice: 'Condiciones inmejorables. Ropa cómoda y calzado versátil para explorar sin límites.',
        snow: 'Paisaje nevado. No olvides prendas térmicas y calzado con buen agarre.'
      }
    },
    weatherPage: {
      title: 'Planificador de Clima',
      subtitle: 'Prepara tu equipaje ideal consultando las tendencias meteorológicas de tu destino.',
      cards: {
        safari: { title: 'Tips para Safari', desc: 'Las mañanas en el bush suelen ser frescas. Viste en capas para adaptarte al sol del mediodía.' },
        beach: { title: 'Tips de Costa', desc: 'Monitorea el viento si tienes planeadas actividades náuticas o cenas frente al mar.' },
        city: { title: 'Tips Urbanos', desc: 'En ciudades con microclimas, un paraguas de bolsillo es un esencial que no ocupa espacio.' }
      }
    },
    packageDetail: {
      description: 'Descripción',
      itinerary: 'Itinerario Detallado',
      day: 'Día',
      endTrip: 'Fin del viaje',
      includes: 'Incluye',
      excludes: 'No Incluye',
      perPerson: 'Precio por persona',
      subjectToChange: '*Sujeto a disponibilidad y cambios',
      bookNow: 'Reservar Ahora',
      whatsapp: 'Consultar por WhatsApp',
      doubts: '¿Dudas?',
      contactText: 'Escríbenos para recibir la ficha técnica completa o personalizar este itinerario.',
      groupSize: 'Grupo de',
      notFound: 'Paquete no encontrado'
    },
    customTrip: {
      title: 'Diseña tu Viaje a Medida',
      subtitle: 'Cuéntanos tus sueños y nosotros los haremos realidad.',
      tag: "Tailor Made Experience",
      step1: 'Tu Modo',
      step2: '¿A dónde quieres ir?',
      step3: 'Presupuesto y Estilo',
      step4: 'Datos de Contacto',
      step5: 'Resumen',
      comingSoon: 'Coming Next: Personaliza tu viaje basado en tu perfil psicológico y emocional.',
      labelDest: 'Destino(s) Soñado(s)',
      placeDest: 'Ej. Safari en Kenia, Playas de Tailandia...',
      labelDate: 'Fechas Aproximadas',
      placeDate: 'Ej. Noviembre 2024, 15 días',
      labelTravelers: 'Número de Viajeros',
      labelBudget: 'Presupuesto por Persona (USD)',
      labelStyle: 'Intereses / Estilo de Viaje',
      labelName: 'Nombre Completo',
      labelPhone: 'Teléfono / WhatsApp',
      labelEmail: 'Email',
      labelNotes: 'Notas Adicionales (Opcional)',
      placeNotes: '¿Celebran algo especial? ¿Alguna restricción alimenticia?',
      btnNext: 'Siguiente',
      btnBack: 'Atrás',
      btnSubmit: 'Solicitar Cotización',
      successTitle: '¡Solicitud Recibida!',
      successDesc: 'Un experto de Meta Travels revisará tu solicitud y te contactará en 24 horas.',
      btnHome: 'Volver al Inicio',
      styles: {
        relax: 'Relax',
        adventure: 'Aventura',
        culture: 'Cultura',
        gastronomy: 'Gastronomía',
        romantic: 'Romántico',
        nature: 'Naturaleza',
        family: 'Familia',
        business: 'Negocios'
      }
    },
    about: {
      title: 'Nuestra Historia',
      subtitle: 'Arquitectos de sueños para viajeros exigentes.',
      mainTitle: 'Redefiniendo el Lujo con Tecnología',
      tag: 'Expertos en Diseño de Viajes',
      quote: 'Convertimos lo ordinario en extraordinario mediante la curaduría humana y la inteligencia artificial.',
      p1: 'Fundada en 2024, Meta Travels combina la calidez humana con la potencia de la inteligencia artificial. Creemos que el verdadero lujo es descubrir un destino a tu propio ritmo con acceso exclusivo.',
      p2: 'Nuestro equipo trabaja con algoritmos avanzados para curar cada hotel y experiencia, asegurando que tu viaje sea impecable de principio a fin.',
      processTitle: 'Cómo creamos tu viaje',
      processSteps: [
        { title: '1. Entendemos lo que buscas', desc: 'Comenzamos con tus intereses, fechas, estilo de viaje y expectativas. La IA nos ayuda a detectar patrones y preferencias desde el inicio.' },
        { title: '2. Exploramos las mejores opciones', desc: 'Nuestra tecnología analiza miles de rutas, destinos y experiencias para identificar las alternativas con mayor afinidad contigo.' },
        { title: '3. Curación experta', desc: 'Nuestros asesores revisan, ajustan y validan cada propuesta para asegurar calidad, coherencia y valor real.' },
        { title: '4. Afinamos contigo', desc: 'Revisamos la propuesta contigo, resolvemos dudas y hacemos los ajustes necesarios hasta que el viaje tenga sentido para ti.' },
        { title: '5. Te acompañamos antes y durante el viaje', desc: 'Recibes recomendaciones prácticas, información clave y soporte continuo con nuestro concierge con IA y respaldo humano.' }
      ],
      values: {
        v1: { title: 'Concierge IA 24/7', desc: 'Nuestro asistente inteligente está disponible en todo momento para resolver dudas o asistirte al instante.' },
        v2: { title: 'Potenciados por IA', desc: 'Personalizamos tu itinerario optimizando cada detalle mediante sistemas de inteligencia avanzada.' },
        v3: { title: 'Conexión Global', desc: 'Nuestra red nos permite abrirte puertas que permanecen cerradas para el turista promedio.' }
      }
    },
    contact: {
      title: 'Hablemos',
      subtitle: 'Estamos listos para planear tu próxima gran aventura.',
      formTitle: 'Envíanos un mensaje',
      office: 'Oficina Central',
      phone: 'Teléfono',
      email: 'Email',
      follow: 'Síguenos',
      labelName: 'Nombre',
      placeName: 'Tu nombre completo',
      labelEmail: 'Email',
      placeEmail: 'tucorreo@ejemplo.com',
      labelSubject: 'Asunto',
      placeSubject: 'Información sobre...',
      labelMessage: 'Mensaje',
      placeMessage: '¿En qué podemos ayudarte?',
      btnSend: 'Enviar Correo',
      btnWhatsapp: 'WhatsApp'
    },
    admin: {
      dashboard: 'Dashboard',
      packages: 'Paquetes',
      leads: 'Leads',
      blog: 'Blog',
      settings: 'Configuración',
      logout: 'Salir al Sitio',
      summary: 'Resumen General',
      newLeads: 'Leads Nuevos (Mes)',
      activePackages: 'Paquetes Activos',
      conversion: 'Conversión',
      seoCheck: 'SEO Checklist',
      packageMgmt: 'Gestión de Paquetes',
      newPackage: 'Nuevo Paquete',
      table: {
        title: 'Título',
        dest: 'Destino',
        price: 'Precio',
        status: 'Estado',
        actions: 'Acciones',
        edit: 'Editar',
        published: 'Publicado',
        viewDetail: 'Ver detalle'
      },
      leadsTitle: 'Leads & Cotizaciones',
      tableLeads: {
        date: 'Fecha',
        name: 'Nombre',
        dest: 'Destino',
        status: 'Status'
      }
    },
    footer: {
      desc: 'Diseñamos experiencias que trascienden el viaje convencional, fusionando el arte de explorar con la precisión de la tecnología avanzada.',
      legal: 'Legal',
      terms: 'Términos y Condiciones',
      privacy: 'Aviso de Privacidad',
      cookies: 'Política de Cookies',
      crafted: 'Diseñado con pasión.',
      inspiring: 'Inspirando Sueños',
      premium: 'Experiencias Premium'
    },
    concierge: {
      assistant: 'Elite Assistant',
      header: 'Concierge de Meta Travels',
      live: 'Modo Estratégico en Vivo',
      engine: 'Inteligencia Grounded de Meta Engine',
      place: 'Consulte sobre destinos, visas o tendencias...',
      errorKey: 'Lo siento, el servicio de IA no está configurado (falta API Key).',
      errorConn: 'Hubo un error en la conexión.',
      busy: 'Nuestras líneas inteligentes están saturadas. Por favor, intente de nuevo o contacte a un consultor humano.',
      welcome: 'Bienvenido a Meta Travels. Soy su Concierge Estratégico. ¿Cómo puedo ayudarle a diseñar su próxima travesía de lujo hoy?'
    },
    common: {
      loading: 'Cargando...',
      error: 'Ocurrió un error',
      send: 'Enviar Solicitud',
      next: 'Siguiente',
      back: 'Atrás',
      from: 'Desde',
      duration: 'Duración',
      level: 'Level',
      perPerson: 'Precio por persona',
      viewDetail: 'Ver Detalle',
      highlights: 'Puntos de Interés',
      includes: 'Incluye',
      filters: { all: 'Todos', safari: 'Safari', beach: 'Playa', culture: 'Cultura', luxury: 'Lujo', cruises: 'Cruceros' }
    }
  },
  en: {
    nav: {
      destinations: 'Collection',
      customTrip: 'Custom Trip',
      weather: 'Weather',
      about: 'About Us',
      contact: 'Contact',
      quote: 'Get a Quote'
    },
    hero: {
      titlePart1: "The art of travel",
      titlePart2: "without limits",
      defining: "Defining the future of luxury travel",
      subtitle: "We craft exclusive journeys where the only limit is your imagination.",
      ctaPrimary: "Design My Trip",
      ctaSecondary: "View Collection",
      scroll: "Scroll"
    },
    home: {
      exclusiveCollection: "Exclusive Collection",
      featuredPackages: "Curated Experiences",
      customTripTitle: "Can't find what you're looking for?",
      customTripDesc: "Our experts design the perfect itinerary just for you.",
      customTripBtn: "Design Custom Trip",
      philosophy: {
        tag: "Our Philosophy",
        titlePart1: "Beyond the",
        titlePart2: "Common Horizon",
        quote: "Our technology doesn't replace the soul of the journey; it frees it from the mundane so only the wonder remains.",
        author: "Meta Founders"
      },
      stats: {
        destinations: "Exclusive Destinations",
        concierge: "AI Elite Concierge",
        privacy: "Guaranteed Privacy",
        designers: "Elite Travel Designers"
      },
      features: {
        security: { title: "Safety & Trust", desc: "We work only with verified providers and offer 24/7 assistance." },
        premium: { title: "Premium Experiences", desc: "Access to exclusive locations, private guides, and top-tier hotels." },
        passion: { title: "Passion for Detail", desc: "Every itinerary is handcrafted to exceed your expectations." }
      },
      viewAll: "View All",
      investment: "Investment from",
      testimonialsTitle: "Voices of our travelers",
      newsletterTitle: "Get inspired for your next adventure",
      newsletterDesc: "Receive exclusive guides and secret offers.",
      newsletterPlaceholder: "Your email address",
      newsletterBtn: "Subscribe"
    },
    weather: {
      title: 'Weather & Planning',
      subtitle: 'Consult estimated weather to better plan your luggage and activities.',
      destination: 'Travel destination',
      placeholder: 'E.g. Madrid, Spain / Cancun, Mexico',
      startDate: 'Departure',
      endDate: 'Return',
      btnSearch: 'Consult Estimate',
      btnLoading: 'Calculating trends...',
      errorDates: 'Please select your travel dates.',
      errorRange: 'Accurate estimates are available for the next 14 days.',
      errorLoc: 'Please select a location from our database.',
      errorApi: 'Could not fetch data for this destination. Try other dates.',
      errorNotFound: 'Location not found. Try: City, Country (e.g. Paris, France).',
      copy: 'Copy Summary',
      copied: 'Summary ready for your itinerary',
      max: 'Predicted High',
      min: 'Predicted Low',
      water: 'Water Temperature',
      rain: 'Rain Probability',
      wind: 'Wind',
      humidity: 'Humidity',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      tipTitle: 'Travel Suggestion',
      intel: 'Traveler Intel',
      projection: 'Seasonal Trend',
      summary: {
        title: 'Advisor Recommendation',
        favorable: 'Highly promising conditions for your journey.',
        variable: 'Variable weather: we suggest considering flexibility in your plan.',
        unfavorable: 'Conditions that may suggest adjustments to your activities.',
        sunnyDays: 'Predominance of clear skies and radiant sun.',
        rainyDays: 'Frequent precipitation expected during your stay.',
        mixedDays: 'Alternating clouds and sunshine throughout the week.',
        heatWarning: 'Note: Intense heat peaks expected. Stay hydrated.',
        windWarning: 'Note: Strong breeze detected. Consider this for sea tours.'
      },
      disclaimer: 'The information shown is a reference based on climate models to facilitate your planning. Sea data is obtained from the nearest certified coastal stations.',
      conditions: {
        Sunny: 'Sunny',
        PartlyCloudy: 'Partly Cloudy',
        Cloudy: 'Cloudy',
        Rainy: 'Rain',
        Drizzle: 'Drizzle',
        Storm: 'Storm',
        Windy: 'Windy',
        Snowy: 'Snowy'
      },
      tips: {
        rain: 'We suggest including a light raincoat or compact umbrella in your luggage.',
        hot: 'Ideal days for the sun. We recommend sunscreen and fresh linen or cotton clothing.',
        cold: 'Chilly weather. We recommend packing light layers and a quality coat for the evenings.',
        wind: 'Constant breeze. A light windbreaker will be your best ally during transfers.',
        nice: 'Exceptional conditions. Comfortable clothes and versatile footwear to explore without limits.',
        snow: 'Snowy landscape. Don\'t forget thermal clothing and footwear with good grip.'
      }
    },
    weatherPage: {
      title: 'Weather Planner',
      subtitle: 'Prepare your ideal luggage by checking the weather trends of your destination.',
      cards: {
        safari: { title: 'Safari Tips', desc: 'Mornings in the bush are usually cool. Dress in layers to adapt to the midday sun.' },
        beach: { title: 'Coastal Tips', desc: 'Monitor the wind if you have nautical activities or beachfront dinners planned.' },
        city: { title: 'Urban Tips', desc: 'In cities with microclimates, a pocket umbrella is an essential that takes up no space.' }
      }
    },
    packageDetail: {
      description: 'Description',
      itinerary: 'Detailed Itinerary',
      day: 'Day',
      endTrip: 'End of trip',
      includes: 'Includes',
      excludes: 'Excludes',
      perPerson: 'Price per person',
      subjectToChange: '*Subject to availability and changes',
      bookNow: 'Book Now',
      whatsapp: 'Inquire via WhatsApp',
      doubts: 'Questions?',
      contactText: 'Write to us to receive the full technical sheet or customize this itinerary.',
      groupSize: 'Group of',
      notFound: 'Package not found'
    },
    customTrip: {
      title: 'Design Your Custom Trip',
      subtitle: 'Tell us your dreams and we will make them come true.',
      tag: "Tailor Made Experience",
      step1: 'Your Mode',
      step2: 'Where do you want to go?',
      step3: 'Budget and Style',
      step4: 'Contact Details',
      step5: 'Summary',
      comingSoon: 'Coming Next: Personalize your journey based on your psychological and emotional profile.',
      labelDest: 'Dream Destination(s)',
      placeDest: 'e.g. Safari in Kenya, Thailand Beaches...',
      labelDate: 'Approximate Dates',
      placeDate: 'e.g. November 2024, 15 days',
      labelTravelers: 'Number of Travelers',
      labelBudget: 'Budget per Person (USD)',
      labelStyle: 'Interests / Travel Style',
      labelName: 'Full Name',
      labelPhone: 'Phone / WhatsApp',
      labelEmail: 'Email',
      labelNotes: 'Additional Notes (Optional)',
      placeNotes: 'Celebrating something special? Any dietary restrictions?',
      btnNext: 'Next',
      btnBack: 'Back',
      btnSubmit: 'Request Quote',
      successTitle: 'Request Received!',
      successDesc: 'A Meta Travels expert will review your request and contact you within 24 hours.',
      btnHome: 'Back to Home',
      styles: {
        relax: 'Relax',
        adventure: 'Adventure',
        culture: 'Culture',
        gastronomy: 'Gastronomy',
        romantic: 'Romantic',
        nature: 'Nature',
        family: 'Family',
        business: 'Business'
      }
    },
    about: {
      title: 'Our Story',
      subtitle: 'Architects of dreams for demanding travelers.',
      mainTitle: 'Redefining Luxury with Technology',
      tag: 'Travel Design Experts',
      quote: 'We turn the ordinary into extraordinary through human curation and artificial intelligence.',
      p1: 'Founded in 2024, Meta Travels combines human warmth with the power of artificial intelligence. We believe true luxury is discovering a destination at your own pace.',
      p2: 'Our team works with advanced algorithms to curate every hotel and experience, ensuring your trip is flawless from start to finish.',
      processTitle: 'How we create your trip',
      processSteps: [
        { title: '1. We understand your needs', desc: 'We start with your interests, dates, travel style, and expectations. AI helps us detect patterns and preferences from the beginning.' },
        { title: '2. We explore the best options', desc: 'Our technology analyzes thousands of routes, destinations, and experiences to identify the alternatives with the highest affinity for you.' },
        { title: '3. Expert curation', desc: 'Our advisors review, adjust, and validate each proposal to ensure quality, consistency, and real value.' },
        { title: '4. We refine with you', desc: 'We review the proposal with you, resolve doubts, and make the necessary adjustments until the trip makes sense to you.' },
        { title: '5. We accompany you before and during the trip', desc: 'You receive practical recommendations, key information, and continuous support with our AI concierge and human backup.' }
      ],
      values: {
        v1: { title: '24/7 AI Concierge', desc: 'Our intelligent assistant is available at all times to answer questions or assist you instantly.' },
        v2: { title: 'Powered by AI', desc: 'We personalize your itinerary by optimizing every detail through advanced intelligence systems.' },
        v3: { title: 'Global Connection', desc: 'Our network allows us to open doors that remain closed to the average tourist.' }
      }
    },
    contact: {
      title: 'Let\'s Talk',
      subtitle: 'We are ready to plan your next great adventure.',
      formTitle: 'Send us a message',
      office: 'Headquarters',
      phone: 'Phone',
      email: 'Email',
      follow: 'Follow us',
      labelName: 'Name',
      placeName: 'Your full name',
      labelEmail: 'Email',
      placeEmail: 'youremail@example.com',
      labelSubject: 'Subject',
      placeSubject: 'Information about...',
      labelMessage: 'Message',
      placeMessage: 'How can we help you?',
      btnSend: 'Send Email',
      btnWhatsapp: 'WhatsApp'
    },
    admin: {
      dashboard: 'Dashboard',
      packages: 'Packages',
      leads: 'Leads',
      blog: 'Blog',
      settings: 'Settings',
      logout: 'Exit to Site',
      summary: 'General Summary',
      newLeads: 'New Leads (Month)',
      activePackages: 'Active Packages',
      conversion: 'Conversion',
      seoCheck: 'SEO Checklist',
      packageMgmt: 'Package Management',
      newPackage: 'New Package',
      table: {
        title: 'Title',
        dest: 'Destination',
        price: 'Price',
        status: 'Status',
        actions: 'Actions',
        edit: 'Edit',
        published: 'Published',
        viewDetail: 'View detail'
      },
      leadsTitle: 'Leads & Quotes',
      tableLeads: {
        date: 'Date',
        name: 'Name',
        dest: 'Destination',
        status: 'Status'
      }
    },
    footer: {
      desc: 'We design experiences that transcend conventional travel, blending the art of exploration with the precision of advanced technology.',
      legal: 'Legal',
      terms: 'Terms and Conditions',
      privacy: 'Privacy Notice',
      cookies: 'Cookies Policy',
      crafted: 'Crafted with passion.',
      inspiring: 'Inspiring Dreams',
      premium: 'Premium Experiences'
    },
    concierge: {
      assistant: 'Elite Assistant',
      header: 'Meta Travels Concierge',
      live: 'Live Strategy Mode',
      engine: 'Meta Engine Grounded Intelligence',
      place: 'Ask about destinations, visas or trends...',
      errorKey: 'Sorry, the AI service is not configured (missing API Key).',
      errorConn: 'Connection error occurred.',
      welcome: 'Welcome to Meta Travels. I am your Strategic Concierge. How can I help you design your next luxury journey today?',
      busy: 'Our smart lines are busy. Please try again or contact a human consultant.'
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      send: 'Send Request',
      next: 'Next',
      back: 'Back',
      from: 'From',
      duration: 'Duration',
      level: 'Level',
      perPerson: 'Price per person',
      viewDetail: 'View Detail',
      highlights: 'Highlights',
      includes: 'Includes',
      filters: { all: 'All', safari: 'Safari', beach: 'Beach', culture: 'Culture', luxury: 'Luxury', cruises: 'Cruceros' }
    }
  }
};

export const PACKAGES: Package[] = [
  {
    id: '1',
    slug: 'sudafrica-zimanga-lux',
    title: { es: 'ZIMANGA: Fotografía de Élite', en: 'ZIMANGA: Elite Photography' },
    subtitle: { es: 'El secreto mejor guardado de KwaZulu-Natal', en: 'KwaZulu-Natal Best Kept Secret' },
    destination: { es: 'KwaZulu-Natal, Sudáfrica', en: 'KwaZulu-Natal, South Africa' },
    duration: { es: '9 Días / 8 Noches', en: '9 Days / 8 Nights' },
    dates: { es: 'Julio 10 - 18, 2024', en: 'July 10 - 18, 2024' },
    price: 5850,
    currency: 'USD',
    level: 'Lujo',
    type: 'Safari',
    minGroupSize: 4,
    heroImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1935&auto=format&fit=crop',
    description: {
      es: 'Acceso exclusivo a la primera reserva en África diseñada específicamente para fotógrafos. Zimanga ofrece hides (escondites) subterráneos de última generación que permiten capturar leones, guepardos y elefantes a nivel del suelo. Alojamiento en el ultra-lujoso Zimanga Main Lodge.',
      en: 'Exclusive access to the first reserve in Africa designed specifically for photographers. Zimanga offers state-of-the-art underground hides allowing ground-level capture of lions, cheetahs, and elephants. Accommodation at the luxury Zimanga Main Lodge.'
    },
    highlights: [
      { es: 'Hides nocturnos climatizados', en: 'Climate-controlled overnight hides' },
      { es: 'Rastreo de Perros Salvajes', en: 'Wild Dog Tracking' },
      { es: 'Tutoría fotográfica privada', en: 'Private photography tutoring' },
    ],
    amenities: { flightsIntl: false, flightsDomestic: true, accommodation: true, tours: true, guide: true, meals: true, tips: false, taxes: true },
    includes: [
      { es: 'Vuelos internos JNB-Durban', en: 'Internal flights JNB-Durban' },
      { es: 'Uso ilimitado de Hides', en: 'Unlimited Hide usage' },
      { es: 'Pensión completa y bebidas premium', en: 'Full board and premium drinks' }
    ],
    excludes: [
      { es: 'Vuelos internacionales', en: 'International flights' },
      { es: 'Equipo fotográfico (alquiler disponible)', en: 'Camera gear (rental available)' }
    ],
    itinerary: [
      {
        day: 1,
        title: { es: 'Llegada a Johannesburgo', en: 'Arrival in Johannesburg' },
        description: { es: 'Recepción VIP en el aeropuerto O.R. Tambo. Traslado privado al Hotel Saxon (5*). Cena de bienvenida en el restaurante Qunu.', en: 'VIP meet & greet at O.R. Tambo. Private transfer to The Saxon Hotel (5*). Welcome dinner at Qunu restaurant.' },
        image: 'https://images.unsplash.com/photo-1577948000111-9c97073cb09c?q=80&w=2074&auto=format&fit=crop'
      },
      {
        day: 9,
        title: { es: 'Despedida Africana', en: 'African Farewell' },
        description: { es: 'Última sesión matutina en el Scavenger Hide (buitres y chacales). Desayuno en el bush y vuelo de regreso a Johannesburgo.', en: 'Final morning session at the Scavenger Hide (vultures and jackals). Bush breakfast and return flight to Johannesburg.' },
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2072&auto=format&fit=crop'
      }
    ]
  },
  {
    id: '2',
    slug: 'japon-eterno',
    title: { es: 'Japón: La Ruta del Shogun', en: 'Japan: The Shogun Route' },
    subtitle: { es: 'Tokio, Kioto y los Alpes Japoneses', en: 'Tokyo, Kyoto & The Japanese Alps' },
    destination: { es: 'Honshu, Japón', en: 'Honshu, Japan' },
    duration: { es: '14 Días / 13 Noches', en: '14 Days / 13 Nights' },
    dates: { es: 'Marzo 25 - Abril 07, 2025', en: 'March 25 - April 07, 2025' },
    price: 8900,
    currency: 'USD',
    level: 'Lujo',
    type: 'Cultura',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    description: {
       es: 'Un viaje en el tiempo que combina la ultra-modernidad de Tokio con la tradición feudal de Takayama y Kanazawa.',
       en: 'A journey through time combining Tokyo ultra-modernity with the feudal tradition of Takayama and Kanazawa.'
    },
    highlights: [{ es: 'Cena Privada con Geisha', en: 'Private Dinner with Geisha' }],
    amenities: { flightsIntl: false, flightsDomestic: true, accommodation: true, tours: true, guide: true, meals: true, tips: true, taxes: true },
    includes: [{ es: 'Green Pass Japan Rail', en: 'Green Pass Japan Rail' }],
    excludes: [],
    itinerary: []
  }
];

export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Roberto Gómez', email: 'roberto@email.com', phone: '5544332211', destination: 'Sudáfrica', status: 'Nuevo', date: '2023-10-25' }
];

export const TESTIMONIALS = [
  { name: 'Carlos M.', text: 'La experiencia en Zimanga superó mis expectativas.', role: 'Fotógrafo' }
];
