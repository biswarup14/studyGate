export const FAQ_DATA = [
  {
    question: "What is GATE exam?",
    answer:
      "GATE (Graduate Aptitude Test in Engineering) is a national-level examination conducted annually in India for admission to M.Tech, M.E., and Ph.D. programs at IITs, NITs, IIITs, and other top institutions. It is also used for recruitment in various Public Sector Undertakings (PSUs) like BHEL, IOCL, NTPC, and GAIL. The GATE exam tests comprehensive understanding of undergraduate subjects in Engineering, Technology, and Science. For Computer Science students, the GATE CSE exam covers subjects like DBMS, Operating Systems, Data Structures, Algorithms, Computer Networks, and more.",
  },
  {
    question: "Are GATE CSE topic-wise PYQs enough for preparation?",
    answer:
      "GATE CSE topic-wise PYQs are one of the most effective preparation resources, but they work best when combined with concept revision and mock tests. Solving topic-wise previous year questions helps you understand the exam pattern, identify frequently asked concepts, and gauge difficulty levels. However, to maximize your GATE score, supplement PYQ practice with standard textbooks, online lectures, and full-length timed mock tests. StudyGate provides over 3,200 topic-wise GATE PYQ with detailed solutions to streamline your preparation.",
  },
  {
    question: "How many years of GATE CSE PYQs should I practice?",
    answer:
      "It is recommended to practice at least 10 to 15 years of GATE CSE PYQs for comprehensive preparation. Questions from 2012 to 2026 cover the modern syllabus and reflect current exam trends. For thorough preparation, practicing 20+ years of PYQs — as available on StudyGate from 2000 to 2026 — gives you the widest exposure to question patterns, difficulty variations, and topic weightage shifts over time.",
  },
  {
    question: "Is topic-wise practice better than year-wise practice?",
    answer:
      "Both approaches serve different purposes. Topic-wise practice is ideal for learning and revision — it lets you focus on one subject at a time, identify weak areas, and build conceptual clarity. Year-wise practice is better for simulating real exam conditions and understanding how questions are distributed across topics in a single paper. The best strategy is to start with topic-wise PYQ practice during your learning phase, then switch to full-length year-wise papers closer to the exam for timed practice.",
  },
  {
    question: "Are these GATE CSE questions useful for ISRO and PSUs?",
    answer:
      "Yes, GATE CSE previous year questions are highly relevant for ISRO Scientist/Engineer recruitment exams and various PSU entrance tests. The syllabus for ISRO and many PSUs overlaps significantly with the GATE CSE syllabus, covering topics like Data Structures, Algorithms, Operating Systems, DBMS, Computer Networks, and Digital Logic. Practicing GATE PYQs on StudyGate strengthens your foundation for these competitive exams as well.",
  },
  {
    question: "GATE exam is for?",
    answer:
      "The GATE exam serves multiple purposes: (1) Admission to M.Tech, M.E., and integrated Ph.D. programs at IITs, NITs, IIITs, and CFTIs; (2) Recruitment in Public Sector Undertakings (PSUs) such as BHEL, IOCL, NTPC, GAIL, HPCL, and BEL; (3) Eligibility for junior research fellowships and fellowships at various research organizations; (4) Some foreign universities in Singapore, Germany, and other countries also accept GATE scores for postgraduate admissions.",
  },
  {
    question: "Is GATE exam tough?",
    answer:
      "The difficulty of the GATE exam varies by year and by individual preparation level. On average, GATE CSE is considered moderately tough, with some sections being more challenging than others. The key to cracking GATE is consistent preparation, thorough understanding of concepts, and regular practice of previous year questions. With structured preparation using resources like StudyGate's 3,200+ PYQ database, students can significantly improve their chances of scoring well. Most toppers emphasize that GATE rewards conceptual clarity over rote learning.",
  },
  {
    question: "How to prepare for GATE CSE?",
    answer:
      "To prepare for GATE CSE effectively: (1) Start with understanding the GATE 2027 syllabus for CSE and exam pattern; (2) Build strong fundamentals for each subject using standard textbooks; (3) Practice topic-wise GATE PYQs after completing each subject — StudyGate offers 3,200+ questions with solutions; (4) Take regular mock tests under timed conditions to build speed and accuracy; (5) Revise regularly using short notes and formula sheets; (6) Analyze your performance to identify and strengthen weak areas; (7) Focus on high-weightage subjects like OS, DBMS, DSA, and Algorithms.",
  },
  {
    question: "What are the subjects in GATE exam for CSE?",
    answer:
      "The GATE CSE exam covers 13 core subjects: (1) General Aptitude, (2) Engineering Mathematics, (3) Discrete Mathematics, (4) Digital Logic, (5) Computer Organization and Architecture (COA), (6) Programming in C, (7) Data Structures, (8) Algorithms, (9) Theory of Computation (TOC), (10) Compiler Design, (11) Operating Systems (OS), (12) Databases (DBMS), and (13) Computer Networks (CN). StudyGate provides dedicated sections and PYQs for every subject in the GATE CSE syllabus.",
  },
  {
    question: "Which book is best for PYQ GATE CSE?",
    answer:
      "For GATE CSE PYQ practice, popular resources include: (1) GATE Overflow Previous Year Questions book — comprehensive with detailed solutions; (2) Made Easy Publications GATE CSE PYQ compilations — well-organized by subject; (3) Previous 30 Years GATE CSE Questions by various publishers. However, digital platforms like StudyGate offer significant advantages over physical books — instant search, subject-wise filtering, interactive quizzes, and progress tracking across 3,200+ questions from 2000 to 2026.",
  },
];

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="sr-only" aria-label="Frequently Asked Questions">
        <h2>Frequently Asked Questions about GATE CSE and StudyGate</h2>
        {FAQ_DATA.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
    </>
  );
}
