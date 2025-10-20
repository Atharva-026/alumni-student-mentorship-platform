exports.validateStudentRegister = (data) => {
  const errors = {};

  if (!data.firstName || data.firstName.trim() === '') {
    errors.firstName = 'First name required';
  }

  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = 'Last name required';
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email required';
  }

  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be 6+ characters';
  }

  if (!data.collegeName || data.collegeName.trim() === '') {
    errors.collegeName = 'College name required';
  }

  if (!data.year || ![1, 2, 3, 4].includes(parseInt(data.year))) {
    errors.year = 'Valid year required (1-4)';
  }

  if (!data.branch || data.branch.trim() === '') {
    errors.branch = 'Branch required';
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: {
        details: [{ message: Object.values(errors)[0] }]
      },
      value: null
    };
  }

  return {
    error: null,
    value: data
  };
};

exports.validateStudentUpdate = (data) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'skills', 'interests', 'projectTopic', 'learningGoals', 'availability', 'preferredMentorFields', 'photo'];

  for (let field in data) {
    if (!allowedFields.includes(field)) {
      return {
        error: {
          details: [{ message: `${field} cannot be updated` }]
        },
        value: null
      };
    }
  }

  return {
    error: null,
    value: data
  };
};

exports.validateAlumniRegister = (data) => {
  const errors = {};

  if (!data.firstName || data.firstName.trim() === '') {
    errors.firstName = 'First name required';
  }

  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = 'Last name required';
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email required';
  }

  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be 6+ characters';
  }

  if (!data.company || data.company.trim() === '') {
    errors.company = 'Company required';
  }

  if (!data.designation || data.designation.trim() === '') {
    errors.designation = 'Designation required';
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: {
        details: [{ message: Object.values(errors)[0] }]
      },
      value: null
    };
  }

  return {
    error: null,
    value: data
  };
};

exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};