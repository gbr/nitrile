import mongoose, { Schema } from 'mongoose';

// TODO remember to create function that converts data back to jsonresume standard

const Profile = new Schema({
  network: String,
  username: String,
  url: String,
});
const Work = new Schema({
  company: String,
  position: String,
  website: String,
  startDate: Date,
  endDate: Date,
  location: String,
  summary: String,
  highlights: [String],
});
const Volunteer = new Schema({
  organization: String,
  position: String,
  website: String,
  startDate: Date,
  endDate: Date,
  location: String,
  summary: String,
  highlights: [String],
});
const Education = new Schema({
  institution: String,
  area: String,
  studyType: String,
  startDate: Date,
  endDate: Date,
  location: String,
  gpa: Number,
  courses: [String],
});
const Award = new Schema({
  title: String,
  date: Date,
  awarder: String,
  summary: String,
});
const Publication = new Schema({
  name: String,
  publisher: String,
  releaseDate: Date,
  website: String,
  summary: String,
});
const Skill = new Schema({
  name: String,
  level: String,
  keywords: [String],
});
const Language = new Schema({
  name: String,
  level: String,
});
const Interest = new Schema({
  name: String,
  keywords: [String],
});
const Reference = new Schema({
  name: String,
  reference: String,
});
const Project = new Schema({
  title: String,
  startDate: Date,
  endDate: Date,
  website: String,
  summary: String,
  keywords: [String],
});

// schema generated from jsonresume v0.0.0
const resumeSchema = new Schema({
  basics: {
    name: String,
    label: String,
    picture: String,
    email: String,
    phone: String,
    website: String,
    summary: String,
    location: {
      address: String,
      postalCode: String,
      city: String,
      countryCode: String,
      region: String,
    },
    profiles: [Profile],
    work: [Work],
    volunteer: [Volunteer],
    education: [Education],
    awards: [Award],
    publications: [Publication],
    projects: [Project],
    skills: [Skill],
    languages: [Language],
    interests: [Interest],
    references: [Reference],
  },
});
// TODO create awesomePreferences model for display preferences and defaults

export default mongoose.model('Resume', resumeSchema);
