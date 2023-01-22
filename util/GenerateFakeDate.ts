import { addDoc, collection, doc, setDoc } from "firebase/firestore/lite";
import { db } from "../firebase";

function GenerateFakeJobPostingDate() {
  for (let i = 0; i < JOB_POSTING.length ; i++) {
    const random = RandomNumber(0, JOB_POSTING.length - 1);
    setTimeout(async () => {
      await addJobPosting(JOB_POSTING[random]);
    }, 1000);
  }
}

const addJobPosting = async (value: JobPostingData) => {
  const docRef = await addDoc(collection(db, "job_postings"), {
    ...value,
  });
  setDoc(doc(db, "company", value.companyid, "job_postings", docRef.id), {
    job_postings: docRef.id,
    createdAt: value.createdAt,
  });
};

export default GenerateFakeJobPostingDate;

interface JobPostingData {
  city: string;
  country: string;
  createdAt: string;
  company: string;
  companyid: string;
  isRemote: boolean;
  jobTitle: string;
  jobDescription: string;
  jobType: "Full Time" | "Part Time" | "Contract" | "Internship" | "Temporary";
  jobExperience: "Entry Level" | "Junior Level" | "Mid Level" | "Senior Level";
  maxJobSalary: number;
  minJobSalary: number;
  skills: string[];
}

const JOB_POSTING: JobPostingData[] = [
  {
    city: "Seattle",
    country: "US",
    createdAt: "2022-11-15",
    company: "DEF INC",
    companyid: "zH9eybsyeLbwoC5S9WGJKqt6OWh2",
    isRemote: true,
    jobTitle: "Full Stack Engineer",
    jobDescription:
      "<b>Company:</b> DEF INC <br> <b>Location:</b> Remote <br> We are seeking a Full Stack Engineer to join our team at DEF INC. This is a senior-level position that requires at least 5 years of professional experience. <br> <b>Key Responsibilities:</b> <ul> <li>Design and develop web applications using technologies such as React, Node.js and MongoDB</li> <li>Collaborate with the team to deliver high-quality and scalable solutions</li> <li>Participate in code reviews and ensure software quality</li> </ul> <b>Qualifications:</b> <ul> <li>Bachelor's degree in Computer Science, Software Engineering or related field</li> <li>5 years of professional experience in Full Stack development</li> <li>Strong understanding of React, Node.js and MongoDB</li> <li>Excellent problem-solving and communication skills</li> </ul>",
    jobType: "Full Time",
    jobExperience: "Senior Level",
    maxJobSalary: 150000,
    minJobSalary: 120000,
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    city: "Chicago",
    country: "US",
    createdAt: "2022-10-01",
    company: "DEF INC",
    companyid: "zH9eybsyeLbwoC5S9WGJKqt6OWh2",
    isRemote: false,
    jobTitle: "Backend Developer",
    jobDescription:
      "<b>Company:</b> DEF INC <br> <b>Location:</b> Chicago, US <br> We are seeking a Backend Developer to join our team at DEF INC. This is a mid-level position that requires at least 3 years of professional experience. <br> <b>Key Responsibilities:</b> <ul> <li>Design, develop and maintain backend systems using technologies such as Node.js, Express, MongoDB and GraphQL</li> <li>Collaborate with the team to deliver high-quality and scalable solutions</li> <li>Participate in code reviews and ensure software quality</li> </ul> <b>Qualifications:</b> <ul> <li>Bachelor's degree in Computer Science, Software Engineering or related field</li> <li>3 years of professional experience in Backend development</li> <li>Strong understanding of Node.js, Express, MongoDB and GraphQL</li> <li>Excellent problem-solving and communication skills</li> </ul>",
    jobType: "Full Time",
    jobExperience: "Mid Level",
    maxJobSalary: 100000,
    minJobSalary: 80000,
    skills: ["Node.js", "Express", "MongoDB", "GraphQL"],
  },
  {
    city: "New York",
    country: "US",
    createdAt: "2022-08-12",
    company: "ABC Inc",
    companyid: "3su5H44vuqRIwwbOJcRz492Vnnm2",
    isRemote: false,
    jobTitle: "Data Engineer",
    jobType: "Full Time",
    jobExperience: "Mid Level",
    minJobSalary: 80000,
    maxJobSalary: 100000,
    skills: ["SQL", "Python", "Big Data", "Hadoop"],
    jobDescription:
      "<b>Company:</b> ABC Inc <br> <b>Location:</b> New York <br> We are seeking a Data Engineer to join our team at ABC Inc. This is a mid-level position that requires at least 3 years of professional experience. <br> <b>Key Responsibilities:</b> <ul> <li>Design, develop and maintain data pipelines using SQL, Python and Big Data technologies </li> <li>Process and analyze large data sets using Hadoop </li> <li>Participate in code reviews and ensure software quality</li> </ul> <b>Qualifications:</b> <ul> <li>Bachelor's degree in Computer Science, Software Engineering or related field</li> <li>3 years of professional experience in data engineering</li> <li>Strong understanding of SQL, Python, Big Data and Hadoop</li> <li>Excellent problem-solving and communication skills</li> </ul>",
  },
  {
    city: "San Francisco",
    country: "US",
    createdAt: "2022-07-05",
    company: "ABC Inc",
    companyid: "3su5H44vuqRIwwbOJcRz492Vnnm2",
    isRemote: true,
    jobTitle: "DevOps Engineer",
    jobType: "Full Time",
    jobExperience: "Senior Level",
    minJobSalary: 120000,
    maxJobSalary: 150000,
    skills: ["AWS", "Docker", "Kubernetes", "Ansible"],
    jobDescription:
      "<b>Company:</b> ABC Inc <br> <b>Location:</b> Remote <br> We are seeking a DevOps Engineer to join our team at ABC Inc. This is a senior-level position that requires at least 5 years of professional experience. <br> <b>Key Responsibilities:</b> <ul> <li>Design, implement and maintain CI/CD pipeline using AWS, Docker and Kubernetes </li> <li>Automate infrastructure deployment and scaling using Ansible </li> <li>Participate in code reviews and ensure software quality</li> </ul> <b>Qualifications:</b> <ul> <li>Bachelor's degree in Computer Science, Software Engineering or related field</li> <li>5 years of professional experience in DevOps</li> <li>Strong understanding of AWS, Docker, Kubernetes, and Ansible</li> <li>Excellent problem-solving and communication skills</li> </ul>",
  },

  {
    city: "NYC",
    companyid: "3su5H44vuqRIwwbOJcRz492Vnnm2",
    country: "US",
    createdAt: "2022-05-10",
    company: "ABC Inc",
    isRemote: true,
    jobTitle: "Full Stack Engineer",
    jobType: "Full Time",
    jobExperience: "Mid Level",
    minJobSalary: 80000,
    maxJobSalary: 120000,
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    jobDescription:
      "<b>Company:</b> ABC Inc <br> <b>Location:</b> Remote <br> We are seeking a Full Stack Engineer to join our team at ABC Inc. This is a mid-level position that requires at least 3 years of professional experience. <br> <b>Key Responsibilities:</b> <ul> <li>Design and develop web applications using JavaScript, React, Node.js and MongoDB</li> <li>Collaborate with the team to deliver high-quality and scalable solutions</li> <li>Participate in code reviews and ensure software quality</li> </ul> <b>Qualifications:</b> <ul> <li>Bachelor's degree in Computer Science, Software Engineering or related field</li> <li>3 years of professional experience in Full Stack development</li> <li>Strong understanding of JavaScript, React, Node.js, and MongoDB</li> <li>Excellent problem-solving and communication skills</li> </ul>",
  },
  {
    city: "London",
    companyid: "zH9eybsyeLbwoC5S9WGJKqt6OWh2",
    country: "GB",
    createdAt: "2022-06-15",
    company: "DEF INC",
    isRemote: false,
    jobTitle: "Web Developer",
    jobType: "Part Time",
    jobExperience: "Junior Level",
    minJobSalary: 35000,
    maxJobSalary: 50000,
    skills: ["HTML", "CSS", "JavaScript", "PHP"],
    jobDescription:
      "<b>Company:</b> DEF INC <br> <b>Location:</b> London, GB <br> We are seeking a Web Developer to join our team at DEF INC. This is a part-time, junior-level position that is ideal for those with at least 1 year of professional experience. <br> <b>Key Responsibilities:</b> <ul> <li>Develop and maintain websites using HTML, CSS, JavaScript and PHP</li> <li>Collaborate with the team to deliver high-quality and user-friendly solutions</li> <li>Participate in code reviews and ensure software quality</li> </ul> <b>Qualifications:</b> <ul> <li>Bachelor's degree in Computer Science, Web Development or related field</li> <li>1 year of professional experience in web development</li> <li>Strong understanding of HTML, CSS, JavaScript and PHP</li> <li>Excellent problem-solving and communication skills</li> </ul>",
  },
  {
    city: "Los Angeles",
    country: "US",
    companyid: "3su5H44vuqRIwwbOJcRz492Vnnm2",
    createdAt: "2022-09-01",
    company: "ABC Inc",
    isRemote: true,
    jobTitle: "Front-end Developer",
    jobType: "Full Time",
    jobExperience: "Junior Level",
    minJobSalary: 60000,
    maxJobSalary: 75000,
    skills: ["JavaScript", "React", "HTML", "CSS"],
    jobDescription:
      "<b>Company:</b> ABC Inc <br> <b>Location:</b> Remote <br> We are seeking a Front-end Developer to join our team at ABC Inc. This is a junior-level position that is ideal for those with at least 1 year of professional experience. <br> <b>Key Responsibilities:</b> <ul> <li>Develop and maintain user-facing features using JavaScript, React, HTML and CSS</li> <li>Collaborate with the team to deliver high-quality and user-friendly solutions</li> <li>Participate in code reviews and ensure software quality</li> </ul> <b>Qualifications:</b> <ul> <li>Bachelor's degree in Computer Science, Software Engineering or related field</li> <li>1 year of professional experience in Front-end development</li> <li>Strong understanding of JavaScript, React, HTML, and CSS</li> <li>Excellent problem-solving and communication skills</li> </ul>",
  },
  {
    city: "New York",
    country: "US",
    createdAt: "2022-08-12",
    company: "DEF Inc",
    companyid: "zH9eybsyeLbwoC5S9WGJKqt6OWh2",
    isRemote: true,
    jobTitle: "Data Scientist",
    jobType: "Full Time",
    jobExperience: "Senior Level",
    minJobSalary: 140000,
    maxJobSalary: 180000,
    skills: ["Python", "Machine Learning", "Data Analysis"],
    jobDescription:
      "<b>Company:</b> DEF Inc <br> <b>Location:</b> New York, US <br> We are seeking a Data Scientist to join our team at DEF Inc. This is a senior-level position that requires at least 5 years of professional experience. <br> <b>Key Responsibilities:</b> <ul> <li>Design, develop and maintain data pipelines using Python </li> <li>Process and analyze large data sets using Machine Learning and Data Analysis </li> <li>Participate in code reviews and ensure software quality</li> </ul> <b>Qualifications:</b> <ul> <li>Master's degree in Computer Science, Data Science or related field</li> <li>5 years of professional experience in data science</li> <li>Strong understanding of Python, Machine Learning and Data Analysis </li> <li>Excellent problem-solving and communication skills</li> </ul>",
  },
];

const RandomNumber = (() => {
  let previousNumber: number | null = null;
  let currentNumber: number | null = null;

  return (min: number, max: number): number => {
    let nextNumber: number;
    do {
      nextNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (nextNumber === previousNumber || nextNumber === currentNumber);
    previousNumber = currentNumber;
    currentNumber = nextNumber;
    return currentNumber;
  };
})();
