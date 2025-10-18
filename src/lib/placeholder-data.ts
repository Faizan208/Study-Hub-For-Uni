import placeholderImages from '@/app/lib/placeholder-images.json';

const allQuizzes = [
  {
    id: "quiz-1",
    title: "DSA Quiz 1",
    description: "Fundamentals of Data Structures and Algorithms.",
    price: 150,
    image: placeholderImages.quiz1.src,
    type: "quiz",
    semester: "3",
  },
  {
    id: "quiz-2",
    title: "COAL Quiz 2",
    description: "Advanced topics in Computer Organization.",
    price: 150,
    image: placeholderImages.quiz2.src,
    type: "quiz",
    semester: "4",
  },
  {
    id: "quiz-3",
    title: "Calculus Quiz 1",
    description: "Introduction to differential calculus.",
    price: 150,
    image: placeholderImages.quiz1.src,
    type: "quiz",
    semester: "1",
  },
];

const allAssignments = [
  {
    id: "assignment-1",
    title: "Database Systems Assignment",
    description: "Design and implement a relational database.",
    price: 150,
    image: placeholderImages.assignment1.src,
    type: "assignment",
    semester: "5",
  },
  {
    id: "assignment-2",
    title: "Operating Systems Assignment",
    description: "Implement a basic process scheduler.",
    price: 150,
    image: placeholderImages.assignment2.src,
    type: "assignment",
    semester: "4",
  },
    {
    id: "assignment-3",
    title: "Intro to Programming Assignment",
    description: "Basic C++ programming concepts.",
    price: 150,
    image: placeholderImages.assignment1.src,
    type: "assignment",
    semester: "1",
  },
];

export const practicalFilters = ["All", "DSA Lab", "COAL Lab", "OOP Lab"];

const allPracticals = [
  {
    id: "practical-1",
    title: "DSA Lab Practical 1",
    description: "Implementation of Linked List.",
    price: 200,
    category: "DSA Lab",
    image: placeholderImages.practical1.src,
    semester: "3",
  },
  {
    id: "practical-2",
    title: "COAL Lab Practical 1",
    description: "Building a simple ALU.",
    price: 200,
    category: "COAL Lab",
    image: placeholderImages.practical2.src,
    semester: "4",
  },
  {
    id: "practical-3",
    title: "OOP Lab Practical 1",
    description: "Object-oriented design principles.",
    price: 200,
    category: "OOP Lab",
    image: placeholderImages.practical3.src,
    semester: "2",
  },
  {
    id: "practical-4",
    title: "DSA Lab Practical 2",
    description: "Binary Search Tree implementation.",
    price: 200,
    category: "DSA Lab",
    image: placeholderImages.practical4.src,
    semester: "3",
  },
];


export const getQuizzes = (semester: string) => allQuizzes.filter(q => q.semester === semester);
export const getAssignments = (semester: string) => allAssignments.filter(a => a.semester === semester);
export const getPracticals = (semester: string) => allPracticals.filter(p => p.semester === semester);
