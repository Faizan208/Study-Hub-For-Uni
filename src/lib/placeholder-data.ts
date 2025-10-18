import placeholderImages from '@/app/lib/placeholder-images.json';

export const quizzes = [
  {
    id: "quiz-1",
    title: "DSA Quiz 1",
    description: "Fundamentals of Data Structures and Algorithms.",
    price: 150,
    image: placeholderImages.quiz1.src,
    type: "quiz",
  },
  {
    id: "quiz-2",
    title: "COAL Quiz 2",
    description: "Advanced topics in Computer Organization.",
    price: 150,
    image: placeholderImages.quiz2.src,
    type: "quiz",
  },
];

export const assignments = [
  {
    id: "assignment-1",
    title: "Database Systems Assignment",
    description: "Design and implement a relational database.",
    price: 150,
    image: placeholderImages.assignment1.src,
    type: "assignment",
  },
  {
    id: "assignment-2",
    title: "Operating Systems Assignment",
    description: "Implement a basic process scheduler.",
    price: 150,
    image: placeholderImages.assignment2.src,
    type: "assignment",
  },
];

export const practicalFilters = ["All", "DSA Lab", "COAL Lab", "OOP Lab"];

export const practicals = [
  {
    id: "practical-1",
    title: "DSA Lab Practical 1",
    description: "Implementation of Linked List.",
    price: 200,
    category: "DSA Lab",
    image: placeholderImages.practical1.src,
  },
  {
    id: "practical-2",
    title: "COAL Lab Practical 1",
    description: "Building a simple ALU.",
    price: 200,
    category: "COAL Lab",
    image: placeholderImages.practical2.src,
  },
  {
    id: "practical-3",
    title: "OOP Lab Practical 1",
    description: "Object-oriented design principles.",
    price: 200,
    category: "OOP Lab",
    image: placeholderImages.practical3.src,
  },
  {
    id: "practical-4",
    title: "DSA Lab Practical 2",
    description: "Binary Search Tree implementation.",
    price: 200,
    category: "DSA Lab",
    image: placeholderImages.practical4.src,
  },
];
