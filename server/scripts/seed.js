const dotenv = require('dotenv')
dotenv.config()

const bcrypt = require('bcryptjs')
const { sequelize } = require('../src/config/db')
const { User, Course, Lesson, Enrollment, Progress } = require('../src/models')

const coursesData = [
  {
    title: 'Python Programming',
    description: 'Master Python programming from the ground up! This comprehensive course is designed for absolute beginners and transitions into advanced concepts. You will discover the foundational building blocks like basic syntax and control flow. We then move into intricate data structures, complex functions, and Object-Oriented Programming principles. Through hands-on exercises and real-world examples, you will learn how to write robust, efficient, and clean Python code. By the end of this journey, you will be fully capable of developing full-scale Python software and automating daily tasks with ease.',
    thumbnail: 'https://placehold.co/600x340/3b0764/ffffff.png?text=Python+Programming',
    category: 'Programming',
    instructor: 'Dr. Ankit Sharma',
    price: '₹999',
    rating: 4.8,
    students: '12,450',
    image: 'https://placehold.co/600x340/3b0764/ffffff.png?text=Python+Programming',
    lessons: [
      { title: 'Introduction to Python', video_url: 'https://www.youtube.com/embed/_uQrJ0TkZlc', duration: 15 * 60 },
      { title: 'Variables and Data Types', video_url: 'https://www.youtube.com/embed/kqtD5dpn9C8', duration: 20 * 60 },
      { title: 'Loops and Conditions', video_url: 'https://www.youtube.com/embed/6iF8Xb7Z3wQ', duration: 25 * 60 },
      { title: 'Functions', video_url: 'https://www.youtube.com/embed/NSbOtYzIQI0', duration: 18 * 60 },
      { title: 'OOP in Python', video_url: 'https://www.youtube.com/embed/JeznW_7DlB0', duration: 30 * 60 },
    ]
  },
  {
    title: 'Java Programming',
    description: 'Dive deep into Java Programming, the core language utilized in thousands of enterprise environments globally. Over this detailed curriculum, you will learn the intricacies of the Java Virtual Machine. We explore vital language constructs such as basic syntax, variables, logical operators, and loops. You will also uncover robust object-oriented methodology, polymorphism, and inheritance rules. Everything is broken down step-by-step so you seamlessly grow from writing beginner scripts to constructing scalable architectures. Prepare yourself for a professional career in JVM development today.',
    thumbnail: 'https://placehold.co/600x340/1e3a8a/ffffff.png?text=Java+Programming',
    category: 'Programming',
    instructor: 'Priya Verma',
    price: '₹1,299',
    rating: 4.6,
    students: '8,230',
    image: 'https://placehold.co/600x340/1e3a8a/ffffff.png?text=Java+Programming',
    lessons: [
      { title: 'Introduction to Java', video_url: 'https://www.youtube.com/embed/grEKMHGYyns', duration: 12 * 60 },
      { title: 'Variables and Operators', video_url: 'https://www.youtube.com/embed/eIrMbAQSU34', duration: 18 * 60 },
      { title: 'Loops and Conditionals', video_url: 'https://www.youtube.com/embed/xk4_1vDrzzo', duration: 25 * 60 },
    ]
  },
  {
    title: 'Machine Learning',
    description: 'Enter the transformative field of Artificial Intelligence and Machine Learning with practical, code-first tutorials! This course strips down complex mathematical theories and focuses heavily on practical Python implementation. We will uncover exactly how machines emulate human learning through intricate algorithmic structures. You will closely compare supervised versus unsupervised learning paradigms, deciding when to use each approach. Furthermore, you will be constructing, training, and testing your very first functional predictive model algorithms from scratch. Master the science of data right now.',
    thumbnail: 'https://placehold.co/600x340/065f46/ffffff.png?text=Machine+Learning',
    category: 'AI & ML',
    instructor: 'Rohan Gupta',
    price: '₹1,599',
    rating: 4.9,
    students: '34,100',
    image: 'https://placehold.co/600x340/065f46/ffffff.png?text=Machine+Learning',
    lessons: [
      { title: 'What is Machine Learning', video_url: 'https://www.youtube.com/embed/ukzFI9rgwfU', duration: 10 * 60 },
      { title: 'Supervised vs Unsupervised', video_url: 'https://www.youtube.com/embed/7eh4d6sabA0', duration: 22 * 60 },
      { title: 'Building First Model', video_url: 'https://www.youtube.com/embed/GwIo3gDZCVQ', duration: 35 * 60 },
    ]
  },
  {
    title: 'Web Development (HTML, CSS, JS, React)',
    description: 'Transform into a full-scale Frontend Web Developer by mastering the essential pillars of the modern internet. Our journey begins with HTML5 semantic elements to properly structure any website payload. We then style our layouts beautifully using CSS3 frameworks and advanced Flexbox positioning logic. Moving into logic, you will dive deeply into asynchronous JavaScript, mastering modern ES6+ concepts and DOM manipulation. Finally, everything clicks together as we introduce React.js, teaching you component-based architecture and state-driven interfaces. Start building reactive apps instantly.',
    thumbnail: 'https://placehold.co/600x340/9d174d/ffffff.png?text=Web+Development',
    category: 'Web Dev',
    instructor: 'Simran Kaur',
    price: '₹799',
    rating: 4.7,
    students: '21,300',
    image: 'https://placehold.co/600x340/9d174d/ffffff.png?text=Web+Development',
    lessons: [
      { title: 'HTML5 Basics', video_url: 'https://www.youtube.com/embed/pQN-pnXPaVg', duration: 20 * 60 },
      { title: 'CSS3 & Flexbox', video_url: 'https://www.youtube.com/embed/JJSoEo8JSnc', duration: 25 * 60 },
      { title: 'JavaScript Fundamentals', video_url: 'https://www.youtube.com/embed/W6NZfCO5SIk', duration: 40 * 60 },
      { title: 'React.js Introduction', video_url: 'https://www.youtube.com/embed/bMknfKXIFA8', duration: 45 * 60 },
    ]
  },
  {
    title: 'Data Science',
    description: 'Become intimately familiar with massive datasets while extracting profound actionable insights to drive business strategy. You will begin by learning the theoretical backbone behind exploratory data analysis and modern visualization methods. We then harness the immense power of NumPy, enabling you to swiftly execute complex mathematical operations over massive multi-dimensional arrays. Afterward, we conquer Pandas DataFrames to filter, transform, and map disparate data sources elegantly. You will no longer view raw data as intimidating; you will see it as raw potential.',
    thumbnail: 'https://placehold.co/600x340/ca8a04/ffffff.png?text=Data+Science',
    category: 'Data Science',
    instructor: 'Amit Desai',
    price: '₹499',
    rating: 4.5,
    students: '5,890',
    image: 'https://placehold.co/600x340/ca8a04/ffffff.png?text=Data+Science',
    lessons: [
      { title: 'Introduction to Data Science', video_url: 'https://www.youtube.com/embed/X3paOmcrTjQ', duration: 15 * 60 },
      { title: 'NumPy Arrays', video_url: 'https://www.youtube.com/embed/QUT1VHiLmmI', duration: 30 * 60 },
      { title: 'Pandas DataFrames', video_url: 'https://www.youtube.com/embed/vmEHCJofslg', duration: 45 * 60 },
    ]
  },
  {
    title: 'DevOps',
    description: 'Bridge the critical gap between software development and stable infrastructure deployment by becoming a master of DevOps paradigms. We begin by unboxing exactly what continuous integration and continuous delivery means in modern cloud workflows. You will master deploying isolated applications rapidly and reliably using Docker containerization technology. From there, we orchestrate automated build, test, and release platforms leveraging GitHub Actions directly from source control. Stop manually debugging varied hosting environments and start automating your production pipeline today.',
    thumbnail: 'https://placehold.co/600x340/3f6212/ffffff.png?text=DevOps',
    category: 'DevOps',
    instructor: 'Neha Reddy',
    price: '₹599',
    rating: 4.8,
    students: '15,600',
    image: 'https://placehold.co/600x340/3f6212/ffffff.png?text=DevOps',
    lessons: [
      { title: 'What is DevOps', video_url: 'https://www.youtube.com/embed/_I94-tJlovg', duration: 10 * 60 },
      { title: 'Docker Containers', video_url: 'https://www.youtube.com/embed/3c-iBn73dDE', duration: 25 * 60 },
      { title: 'CI/CD with GitHub Actions', video_url: 'https://www.youtube.com/embed/R8_veQiYBjI', duration: 30 * 60 },
    ]
  },
  {
    title: 'Cybersecurity',
    description: 'Arm yourself against the ever-evolving landscape of digital threats by diving head-first into foundational cybersecurity protocols. This comprehensive curriculum outlines the anatomy of hacking, giving you an ethical attackers perspective on systems vulnerabilities. We will drill into fundamental network security principles spanning port management, encryption traffic, and perimeter defense strategies. Furthermore, you will investigate common web threats like SQL injection and cross-site scripting while learning concrete mitigation techniques. Protect systems effectively and defend enterprise data securely today.',
    thumbnail: 'https://placehold.co/600x340/831843/ffffff.png?text=Cybersecurity',
    category: 'Cybersecurity',
    instructor: 'Vikram Singh',
    price: '₹999',
    rating: 5.0,
    students: '42,000',
    image: 'https://placehold.co/600x340/831843/ffffff.png?text=Cybersecurity',
    lessons: [
      { title: 'Introduction to Cybersecurity', video_url: 'https://www.youtube.com/embed/inWWhr5tnEA', duration: 12 * 60 },
      { title: 'Network Security Basics', video_url: 'https://www.youtube.com/embed/qiQR5rTSshw', duration: 24 * 60 },
      { title: 'Common Web Vulnerabilities', video_url: 'https://www.youtube.com/embed/ciNHn38EyRc', duration: 35 * 60 },
    ]
  }
]

async function seed() {
  await sequelize.authenticate()
  await sequelize.sync({ force: true })

  console.log('[db] tables synced')

  const adminPasswordHash = await bcrypt.hash('Admin123!', 10)
  const studentPasswordHash = await bcrypt.hash('Student123!', 10)

  // We no longer strictly need an admin for UI as instructor strings are hardcoded on courses, but keeping it for auth
  await User.create({
    name: 'Admin Instructor',
    email: 'admin@example.com',
    password: adminPasswordHash,
    role: 'admin',
  })

  const student = await User.create({
    name: 'Student Learner',
    email: 'student@example.com',
    password: studentPasswordHash,
    role: 'student',
  })

  for (const cData of coursesData) {
    const totalDuration = cData.lessons.reduce((acc, curr) => acc + curr.duration, 0)
    
    const course = await Course.create({
      title: cData.title,
      description: cData.description,
      thumbnail: cData.thumbnail,
      image: cData.image,
      category: cData.category,
      instructor: cData.instructor,
      instructorName: cData.instructor, // backwards compatibility
      price: cData.price,
      rating: cData.rating,
      students: cData.students,
      duration: totalDuration,
      lessons: cData.lessons.length
    })

    let order = 1
    for (const lData of cData.lessons) {
      await Lesson.create({
        course_id: course.id,
        title: lData.title,
        video_url: lData.video_url,
        duration: lData.duration,
        order: order++
      })
    }
  }

  console.log('Seed complete!')
  console.log('Admin login:', { email: 'admin@example.com', password: 'Admin123!' })
  console.log('Student login:', { email: 'student@example.com', password: 'Student123!' })

  await sequelize.close()
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
