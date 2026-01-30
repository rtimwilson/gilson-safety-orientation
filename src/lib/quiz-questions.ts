// Default quiz questions based on the 8.3 Safety Orientation form
export const defaultQuizQuestions = [
  {
    id: 1,
    questionText: "Your 3 basic Rights are to Know, Refuse (unsafe work) & Participate?",
    correctAnswer: true,
    explanation: "Employees have the right to know about hazards, refuse unsafe work, and participate in safety decisions."
  },
  {
    id: 2,
    questionText: "Basic PPE is hard hat, safety glasses, safety boots & body protection?",
    correctAnswer: true,
    explanation: "Mandatory PPE includes CSA-approved hard hat, safety glasses, Grade 1 safety footwear, and high-visibility apparel."
  },
  {
    id: 3,
    questionText: "All incidents must be reported?",
    correctAnswer: true,
    explanation: "All incidents, near misses, unsafe conditions, and damage must be reported to your immediate supervisor."
  },
  {
    id: 4,
    questionText: "Accidents must be reported immediately?",
    correctAnswer: true,
    explanation: "Accidents and injuries must be reported immediately to your supervisor."
  },
  {
    id: 5,
    questionText: "Any controlled product spill must be reported?",
    correctAnswer: true,
    explanation: "All spills of controlled products must be reported immediately for proper cleanup and documentation."
  },
  {
    id: 6,
    questionText: "Tools and equipment must be inspected prior to use?",
    correctAnswer: true,
    explanation: "All tools and equipment must be inspected before use. Unsafe items should be tagged and taken out of service."
  },
  {
    id: 7,
    questionText: "I do not have to inspect my PPE prior to use?",
    correctAnswer: false,
    explanation: "You MUST inspect your PPE before each use to ensure it is in safe working condition."
  },
  {
    id: 8,
    questionText: "Reporting to work under the influence of drugs and alcohol is unacceptable?",
    correctAnswer: true,
    explanation: "Possession or consumption of alcohol, marijuana, or illegal drugs is strictly prohibited on all Gilson job sites."
  },
  {
    id: 9,
    questionText: "Violations of applicable Acts/Regs or Safety Manual will result in disciplinary action?",
    correctAnswer: true,
    explanation: "Violations will result in progressive disciplinary action, from verbal warnings to termination."
  },
  {
    id: 10,
    questionText: "I must read and follow all labels & SDS?",
    correctAnswer: true,
    explanation: "You must read and follow all Safety Data Sheets (SDS) and product labels when working with controlled products."
  }
]

// Shuffle array using Fisher-Yates algorithm
export function shuffleQuestions<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
