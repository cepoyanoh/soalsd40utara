const isFormActive = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  return now <= due;
};

const [showQuestions, setShowQuestions] = useState({});

const toggleShowQuestions = (formId) => {
  setShowQuestions(prev => ({
    ...prev,
    [formId]: !prev[formId]
  }));
};
