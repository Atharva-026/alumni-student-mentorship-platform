exports.calculateMatchScore = (student, alumni) => {
  let score = 0;

  // Topic Match (50%)
  const studentInterests = (student.interests || []).map(i => i.toLowerCase());
  const alumniExpertise = (alumni.expertise || []).map(e => e.toLowerCase());
  
  const topicMatches = studentInterests.filter(interest =>
    alumniExpertise.some(exp => exp.includes(interest) || interest.includes(exp))
  ).length;

  const topicScore = studentInterests.length > 0 ? (topicMatches / studentInterests.length) * 50 : 0;
  score += topicScore;

  // Availability Match (25%)
  const studentAvailable = (student.availability || []).length > 0;
  const alumniAvailable = (alumni.mentorAvailability || []).length > 0;
  
  const availabilityScore = (studentAvailable && alumniAvailable) ? 25 : 0;
  score += availabilityScore;

  // Skills Match (15%)
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const alumniSkills = (alumni.skills || []).map(s => s.toLowerCase());

  const skillMatches = studentSkills.filter(skill =>
    alumniSkills.some(as => as.includes(skill))
  ).length;

  const skillScore = studentSkills.length > 0 ? (skillMatches / studentSkills.length) * 15 : 0;
  score += skillScore;

  // Experience Level Match (10%)
  const experienceScore = (alumni.yearsOfExperience || 0) >= 2 ? 10 : 5;
  score += experienceScore;

  return Math.round(score);
};

exports.getTopStudentMatches = (student, allAlumni, limit = 3) => {
  const matches = allAlumni
    .map(alumni => ({
      alumni,
      matchScore: this.calculateMatchScore(student, alumni)
    }))
    .filter(match => match.matchScore > 30)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return matches;
};

exports.getTopAlumniMatches = (alumni, allStudents, limit = 3) => {
  const matches = allStudents
    .map(student => ({
      student,
      matchScore: this.calculateMatchScore(student, alumni)
    }))
    .filter(match => match.matchScore > 30)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return matches;
};