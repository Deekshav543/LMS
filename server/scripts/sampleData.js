const sampleCourses = [
  {
    title: 'Python Programming',
    description: 'Master Python from scratch! A comprehensive guide covering basic syntax, data structures, functions, and object-oriented programming.',
    thumbnail: 'https://placehold.co/600x340/3b0764/ffffff.png?text=Python+Programming',
    category: 'Programming',
    learningOutcomes: [
      'Write complex Python scripts',
      'Understand core data structures',
      'Master Object-Oriented Programming in Python',
    ],
    sections: [
      {
        title: 'Getting Started with Python',
        order: 1,
        lessons: [
          {
            title: '1. Introduction to Python',
            order: 1,
            youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            duration: 15 * 60,
          },
          {
            title: '2. Variables and Data Types',
            order: 2,
            youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            duration: 20 * 60,
          },
        ]
      },
      {
        title: 'Core Concepts',
        order: 2,
        lessons: [
          {
            title: '3. Loops and Conditions',
            order: 3,
            youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            duration: 25 * 60,
          },
          {
            title: '4. Functions',
            order: 4,
            youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            duration: 18 * 60,
          },
          {
            title: '5. OOP in Python',
            order: 5,
            youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            duration: 30 * 60,
          },
        ],
      },
    ],
  },
  {
    title: 'Java Programming',
    description: 'Learn Java Step-by-Step. Ideal for beginners wanting to dive into enterprise-level programming.',
    thumbnail: 'https://placehold.co/600x340/1e3a8a/ffffff.png?text=Java+Programming',
    category: 'Programming',
    learningOutcomes: [
      'Understand JVM and Java setup',
      'Master Java syntax and loops',
      'Learn OOP concepts comprehensively',
    ],
    sections: [
      {
        title: 'Java Basics',
        order: 1,
        lessons: [
          {
            title: '1. Introduction to Java',
            order: 1,
            youtube_url: 'https://www.youtube.com/watch?v=elrMbAQSU34',
            duration: 12 * 60,
          },
          {
            title: '2. Variables and Operators',
            order: 2,
            youtube_url: 'https://www.youtube.com/watch?v=elrMbAQSU34',
            duration: 18 * 60,
          },
          {
            title: '3. Loops and Conditionals',
            order: 3,
            youtube_url: 'https://www.youtube.com/watch?v=elrMbAQSU34',
            duration: 25 * 60,
          },
        ],
      },
    ],
  },
  {
    title: 'AI & Machine Learning',
    description: 'Dive into the world of Artificial Intelligence. Learn how machines learn using real Python algorithms.',
    thumbnail: 'https://placehold.co/600x340/065f46/ffffff.png?text=AI+%26+ML',
    category: 'AI & ML',
    learningOutcomes: [
      'Understand Machine Learning paradigms',
      'Train basic ML models',
      'Evaluate model accuracy',
    ],
    sections: [
      {
        title: 'Machine Learning Introduction',
        order: 1,
        lessons: [
          {
            title: '1. What is Machine Learning?',
            order: 1,
            youtube_url: 'https://www.youtube.com/watch?v=Gwlo3gDZCVQ',
            duration: 10 * 60,
          },
          {
            title: '2. Supervised vs Unsupervised Learning',
            order: 2,
            youtube_url: 'https://www.youtube.com/watch?v=Gwlo3gDZCVQ',
            duration: 22 * 60,
          },
          {
            title: '3. Building Your First Model',
            order: 3,
            youtube_url: 'https://www.youtube.com/watch?v=Gwlo3gDZCVQ',
            duration: 35 * 60,
          },
        ],
      },
    ],
  },
  {
    title: 'Web Development (HTML, CSS, JS, React)',
    description: 'Become a Full-Stack Web Developer. Build responsive websites and powerful web applications.',
    thumbnail: 'https://placehold.co/600x340/9d174d/ffffff.png?text=Web+Development',
    category: 'Web Dev',
    learningOutcomes: [
      'Build responsive UI with HTML/CSS',
      'Master JavaScript ES6+',
      'Build reactive components with React',
    ],
    sections: [
      {
        title: 'Frontend Fundamentals',
        order: 1,
        lessons: [
          {
            title: '1. HTML5 Basics',
            order: 1,
            youtube_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            duration: 20 * 60,
          },
          {
            title: '2. CSS3 Styling & Flexbox',
            order: 2,
            youtube_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            duration: 25 * 60,
          },
          {
            title: '3. JavaScript Fundamentals',
            order: 3,
            youtube_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            duration: 40 * 60,
          },
          {
            title: '4. React.js Introduction',
            order: 4,
            youtube_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            duration: 45 * 60,
          },
        ],
      },
    ],
  },
  {
    title: 'Data Science',
    description: 'Learn data analysis, visualization, and manipulation. Turn raw data into actionable insights.',
    thumbnail: 'https://placehold.co/600x340/ca8a04/ffffff.png?text=Data+Science',
    category: 'Data Science',
    learningOutcomes: [
      'Analyze data using Pandas',
      'Visualize data with Matplotlib & Seaborn',
      'Perform exploratory data analysis',
    ],
    sections: [
      {
        title: 'Data Analysis Bootcamp',
        order: 1,
        lessons: [
          {
            title: '1. Introduction to Data Science',
            order: 1,
            youtube_url: 'https://www.youtube.com/watch?v=ua-CiDNNj30',
            duration: 15 * 60,
          },
          {
            title: '2. Numpy array manipulation',
            order: 2,
            youtube_url: 'https://www.youtube.com/watch?v=ua-CiDNNj30',
            duration: 30 * 60,
          },
          {
            title: '3. Pandas DataFrames',
            order: 3,
            youtube_url: 'https://www.youtube.com/watch?v=ua-CiDNNj30',
            duration: 45 * 60,
          },
        ],
      },
    ],
  },
  {
    title: 'DevOps',
    description: 'Master continuous integration, deployment, and cloud infrastructure management.',
    thumbnail: 'https://placehold.co/600x340/3f6212/ffffff.png?text=DevOps',
    category: 'DevOps',
    learningOutcomes: [
      'Understand CI/CD pipelines',
      'Containerize apps using Docker',
      'Deploy applications to the Cloud',
    ],
    sections: [
      {
        title: 'DevOps Essentials',
        order: 1,
        lessons: [
          {
            title: '1. What is DevOps?',
            order: 1,
            youtube_url: 'https://www.youtube.com/watch?v=0yWAtQ6wYNM',
            duration: 10 * 60,
          },
          {
            title: '2. Docker Containers',
            order: 2,
            youtube_url: 'https://www.youtube.com/watch?v=0yWAtQ6wYNM',
            duration: 25 * 60,
          },
          {
            title: '3. CI/CD with GitHub Actions',
            order: 3,
            youtube_url: 'https://www.youtube.com/watch?v=0yWAtQ6wYNM',
            duration: 30 * 60,
          },
        ],
      },
    ],
  },
  {
    title: 'Cybersecurity',
    description: 'Protect systems, networks, and programs from digital attacks. Learn ethical hacking basics.',
    thumbnail: 'https://placehold.co/600x340/831843/ffffff.png?text=Cybersecurity',
    category: 'Cybersecurity',
    learningOutcomes: [
      'Understand basic network security',
      'Identify common vulnerabilities',
      'Learn mitigation strategies',
    ],
    sections: [
      {
        title: 'Security Fundamentals',
        order: 1,
        lessons: [
          {
            title: '1. Introduction to Cybersecurity',
            order: 1,
            youtube_url: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
            duration: 12 * 60,
          },
          {
            title: '2. Network Security basics',
            order: 2,
            youtube_url: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
            duration: 24 * 60,
          },
          {
            title: '3. Common Web Vulnerabilities',
            order: 3,
            youtube_url: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
            duration: 35 * 60,
          },
        ],
      },
    ],
  },
]

module.exports = { sampleCourses }
